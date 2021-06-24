function unpack(response){
  datasets = {};
  response.forEach(function (county){
    var name = county[0]["CountyName"];
    data={};
    county.forEach(function (row){
      var date = row.Report_Date;
      var daily_stats = {};

      daily_stats.total_doses = row.AdministeredCount;
      daily_stats.new_doses = row.AdministeredCountChange;
      daily_stats.fully_vaxxed = row.PersonsFullyVaccinated;
      

      data[date] = daily_stats;
    });
    datasets[name] = data;
  });
  return datasets;
}

var IL_counties = ["Adams", "Alexander", "Bond", "Boone", "Brown", "Bureau", "Calhoun", "Carroll",
              "Cass", "Champaign", "Chicago", "Christian", "Clark", "Clay", "Clinton", "Coles",
              "Cook", "Crawford", "Cumberland", "De Witt", "DeKalb", "Douglas", "DuPage", "Edgar",
              "Edwards", "Effingham", "Fayette", "Ford", "Franklin", "Fulton", "Gallatin","Greene",
              "Grundy", "Hamilton", "Hancock", "Hardin", "Henderson", "Henry", "Iroquois","Jackson",
              "Jasper", "Jefferson", "Jersey", "Jo Daviess", "Johnson", "Kane", "Kankakee",
              "Kendall", "Knox", "Lake", "LaSalle", "Lawrence", "Lee", "Livingston", "Logan",
              "Macon", "Macoupin", "Madison", "Marion", "Marshall", "Mason", "Massac", "McDonough",
              "McHenry", "McLean", "Menard", "Mercer", "Monroe", "Montgomery", "Morgan", "Moultrie",
              "Ogle", "Peoria", "Perry", "Piatt", "Pike", "Pope", "Pulaski", "Putnam", "Randolph",
              "Richland", "Rock Island", "Saline", "Sangamon", "Schuyler", "Scott", "Shelby",
              "St. Clair", "Stark", "Stephenson", "Tazewell", "Union", "Vermilion", "Wabash",
              "Warren", "Washington", "Wayne", "White", "Whiteside", "Will", "Williamson", 
              "Winnebago", "Woodford",];

var countyPromises = [];

IL_counties.forEach(function(county) {
  var countyURL = `https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetVaccineAdministration?countyname=${county}`
  countyPromises.push(d3.json(countyURL));
});

county_data = Promise.all(countyPromises).then(function(countyResponse) {

  var results = unpack(countyResponse);
  console.log(results);
  return results;
});

var stateURL = 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetVaccineAdministration?countyname=';


  // defining chart area goes here

  function makeResponsive() {

    var svgArea = d3.select("body").select("svg");
  
    if (!svgArea.empty()) {
    svgArea.remove();
    }
  
    // Define SVG area dimensions
    var svgWidth = window.innerWidth*.85;
    var svgHeight = window.innerHeight*.8;
  
    // Define the chart's margins as an object
    var chartMargin = {
     top: 30,
     right: 50,
      bottom: 125,
      left: 100
    };
  
    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
  
  
    // Select body, append SVG area to it, and set the dimensions
    var svg = d3
      .select("#graph")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);

    var labelsGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    
    labelsGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight})`)
      .style('text-anchor', 'middle')
      .text("Date");

    labelsGroup.append("text")
      .attr("transform",`rotate(-90) translate(-${chartHeight/2}, 0)`)
      .style('text-anchor', 'middle')
      .text("Doses");

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  

    function makeGraphs() {

      d3.json(stateURL).then(function(response){ 

        console.log(response);

        chartGroup.selectAll("*").remove();

        var totalsData = {ylabel: "% Vaccinated", lines: [{name: "One Dose", values: []}, {name: "Fully Vaccinated", values: []}]};

        var dailyData = {ylabel: "Daily Doses", lines: [{name: "First Dose", values: []}, {name: "Second Dose", values: []}]};
        
        var dates = [];

        response.forEach(function(row, index) {

          if (index == 0) {
            var secondDoses = row.PersonsFullyVaccinated;
          }else {
            var secondDoses = row.PersonsFullyVaccinated - response[index-1]["PersonsFullyVaccinated"];
          }

          var firstDoses = row.AdministeredCountChange - secondDoses;

          dailyData["lines"][0]["values"].push(firstDoses);
          dailyData["lines"][1]["values"].push(secondDoses);

          var totalSecond = row.PersonsFullyVaccinated;
          var totalFirst = dailyData["lines"][0]["values"].reduce(function (a, b) { return a + b; }, 0);

          totalsData["lines"][0]["values"].push(totalFirst);
          totalsData["lines"][1]["values"].push(totalSecond);

          dates.push(row.Report_Date);
          // use lumen to handle date format

        });

        console.log(dailyData);
        console.log(totalsData);

      });

    }
  
    makeGraphs();
  // window size event listener

  

}

makeResponsive();

d3.select(window).on("resize", makeResponsive);