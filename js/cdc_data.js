function date_sort( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }


// filter by state and get all counties at once instead?

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
      bottom: 50,
      left: 50
    };
  
    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
  
  
    // Select div, append SVG area to it, and set the dimensions
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

        var url = "https://data.cdc.gov/resource/8xkx-amqh.json?fips=17031"

        d3.json(url).then(function(cdcResponse){ 

            data = cdcResponse.sort(date_sort);

            console.log(data);

            chartData = [];

            data.forEach(function(row, index){

                if (index == 0) {
                    var firstDoses = parseInt(row.administered_dose1_recip);
                    var secondDoses = parseInt(row.series_complete_yes);
                }else {
                    var firstDoses = row.administered_dose1_recip - data[index-1]["administered_dose1_recip"];
                    var secondDoses = row.series_complete_yes - data[index-1]["series_complete_yes"];
                }

                chartData.push({date: row.date, newFirstDoses: firstDoses, newSecondDoses: secondDoses});

            // push running totals, seven day avg, daily numbers

            });

            console.log(chartData);

        });


    // statewide totals - sum counties? separate API call?

    }
  
    makeGraphs();
    // window size event listener



}

makeResponsive();

d3.select(window).on("resize", makeResponsive);