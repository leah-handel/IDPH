d3.csv("IL_counties.csv").then(function(data) {
    console.log(data);
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