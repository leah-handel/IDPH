function dateSort(a, b) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

  var chartMargin = {
    top: 30,
    right: 50,
     bottom: 50,
     left: 80
   };
  

var zips = [60601, 60603, 60605, 60604, 60607, 60608, 60609, 60610, 60611, 60614, 60616, 60617, 60618, 60613, 60619, 60615, 60620, 60621, 60622, 60623, 60624, 60625, 60626, 60628, 60629, 60630, 60631, 60632, 60633, 60634, 60637, 60638, 60639, 60636, 60640, 60641, 60642, 60643, 60644, 60645, 60646, 60647, 60649, 60651, 60652, 60653, 60654, 60602, 60606, 60655, 60666, 60612, 60827, 60656, 60657, 60659, 60660, 60661, 60707];

var zipInput = d3.select("#zip-input");

zipInput.selectAll("option")
   .data(zips)
   .enter()
   .append("option")
   .attr("value", d => d)
   .text(d => d);



function makeResponsive() {



    // Define SVG area dimensions
    var svgWidth = window.innerWidth*.85;
    var svgHeight = window.innerHeight*.8;
      
    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

  function drawChartArea() {

    var svgArea = d3.select("body").selectAll("svg");
  
    if (!svgArea.empty()) {
    svgArea.remove();
      }

// draw daily chart

    var daily = d3.select("#daily")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth)
      .attr("id", "dailySVG");

    var dailyLabelsGroup = daily.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
    
    dailyLabelsGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight+40})`)
      .style('text-anchor', 'middle')
      .text("Date");

    dailyLabelsGroup.append("text")
      .attr("transform",`rotate(-90) translate(-${chartHeight/2}, -60)`)
      .style('text-anchor', 'middle')
      .text("Doses");

    var dailyChartGroup = daily.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)

      var xScale = d3.scaleTime()
      .domain([d3.min(chartData.map(d=>luxon.DateTime.fromISO(d.date))), d3.max(chartData.map(d=>luxon.DateTime.fromISO(d.date)))]).nice()
      .range([0, chartWidth]);
    
    var yData = ["newFirstDoses", "newSecondDoses", "firstAvg", "secondAvg"]
    
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(yData.map(d=>d3.max(chartData.map(e=>e[d]))))]).nice()
      .range([chartHeight, 0]);
    
    var yAxis = d3.axisLeft(yScale).ticks(chartHeight/60);
    var xAxis = d3.axisBottom(xScale).ticks();
    
    dailyChartGroup.append("g")
      .call(yAxis);
    
    dailyChartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);
    
    bandWidth = .7*chartWidth/chartData.length;
    
    dailyChartGroup.selectAll("bars")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(luxon.DateTime.fromISO(d.date)))
      .attr("y", d => yScale(d.newFirstDoses))
      .attr("width", bandWidth/2)
      .attr("height", d => chartHeight - yScale(d.newFirstDoses))
      .attr("fill", "#5CB0FF");
    
    
    dailyChartGroup.selectAll("bars")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(luxon.DateTime.fromISO(d.date))+bandWidth/2)
      .attr("y", d => yScale(d.newSecondDoses))
      .attr("width", bandWidth/2)
      .attr("height", d => chartHeight - yScale(d.newSecondDoses))
      .attr("fill", "#1F93FF");


    var firstAvgFunc = d3.line()
    .curve(d3.curveBasis)
    .x(d => xScale(luxon.DateTime.fromISO(d.date)))
    .y(d=> yScale(d.firstAvg))

    var secondAvgFunc = d3.line()
    .curve(d3.curveBasis)
    .x(d => xScale(luxon.DateTime.fromISO(d.date)))
    .y(d=> yScale(d.secondAvg))

    dailyChartGroup.append("path")
      .attr('d', firstAvgFunc(chartData))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5);
  

    dailyChartGroup.append("path")
      .attr('d', secondAvgFunc(chartData))
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-width", 1.5);

//  draw total chart

var pct = d3.select("#total")
.append("svg")
.attr("height", svgHeight)
.attr("width", svgWidth)
.attr("id", "totalSVG");

var pctLabelsGroup = pct.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

pctLabelsGroup.append("text")
.attr("transform", `translate(${chartWidth / 2}, ${chartHeight+40})`)
.style('text-anchor', 'middle')
.text("Date");

pctLabelsGroup.append("text")
.attr("transform",`rotate(-90) translate(-${chartHeight/2}, -60)`)
.style('text-anchor', 'middle')
.text("% Vaccinated");

var pctChartGroup = pct.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`)

var pctYScale = d3.scaleLinear()
.domain([0, d3.max(chartData.map(d=>d.pctFirst))]).nice()
.range([chartHeight, 0]);

var pctYAxis = d3.axisLeft(pctYScale).ticks(chartHeight/60);

pctChartGroup.append("g")
.call(pctYAxis);

pctChartGroup.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.call(xAxis);

}

  drawChartArea();
}
//var url = `https://data.cityofchicago.org/resource/553k-3xzc.json?zip_code=${selection}`
function getData(selection) {
chartData = [];

d3.json(`https://data.cityofchicago.org/resource/553k-3xzc.json?zip_code=${selection}`).then(function(response){

  data = response.sort(dateSort);

  console.log(data);

  data.forEach(function(row, index){
    
      if (index < 7) {
        var firstAvg = 0;
        var secondAvg = 0;
      }else {
        firstSum = 0
        secondSum = 0;
        for (var i = 0; i < 7; i++) {
          firstSum += parseInt(data[index-i]["_1st_dose_daily"]);
          secondSum += parseInt(data[index-i]["vaccine_series_completed_daily"]);
        };
        var firstAvg = firstSum/7;
        var secondAvg = secondSum/7;
        }

      var pctFirst = parseFloat(row._1st_dose_percent_population)*100;
      var pctSecond = parseFloat(row.vaccine_series_completed_percent_population)*100;


      chartData.push({date: row.date, newFirstDoses: parseInt(row._1st_dose_daily), newSecondDoses: parseInt(row.vaccine_series_completed_daily), firstAvg: firstAvg, secondAvg: secondAvg, pctSecond: pctSecond, pctFirst: pctFirst});

    });

  // push running totals, seven day avg, daily numbers

  console.log(chartData);

  makeResponsive();
  

});

}

getData(60640);

zipInput.on("change", function(d) {
  var selection = d3.select(this).property("value");
  console.log(selection);
  getData(selection);
})

d3.select(window).on("resize", makeResponsive);

