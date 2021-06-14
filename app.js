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
              "Winnebago", "Woodford",""];

var promises = [];

IL_counties.forEach(function(county) {
  var url = `https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetVaccineAdministration?countyname=${county}`
  promises.push(d3.json(url));
});

Promise.all(promises).then(function(response) {
  console.log(response[103])

  var county_data = unpack(response);
  console.log(county_data);

});

// everything to do with the graph goes in here:

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
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
}

makeResponsive();

// window size event listener

d3.select(window).on("resize", makeResponsive);