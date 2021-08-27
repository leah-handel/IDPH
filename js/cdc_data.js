function dateSort(a, b) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }



function getAvg(values, period) {
  avgValues = [];
  values.forEach(function(date, index){
    if(index < period-1){
      avg = 0;
    }else{
      sum = 0;
      for (var i = 0; i < period-1; i++) {
        sum += values[index-i]
      };
      avg = sum/period;
    }
    avgValues.push(avg);
  });
  return avgValues;
}

var chartMargin = {
  top: 30,
  right: 50,
   bottom: 50,
   left: 80
 };

 var selection = 60640;


function drawChartArea() {

    // Define SVG area dimensions
    var svgWidth = window.innerWidth*.85;
    var svgHeight = window.innerHeight*.8;
      
    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    var svgArea = d3.select("body").select("svg");
  
    if (!svgArea.empty()) {
    svgArea.remove();
    }

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
    }

//var url = `https://data.cityofchicago.org/resource/553k-3xzc.json?zip_code=${selection}`

chartData = [];

d3.json(`https://data.cityofchicago.org/resource/553k-3xzc.json?zip_code=${selection}`).then(function(response){

  data = response.sort(dateSort);

  console.log(data);

  data.forEach(function(row, index){

      // if (index == 0) {
      //   var firstDoses = parseInt(row.administered_dose1_recip);
      //   var secondDoses = parseInt(row.series_complete_yes);
      // }else {
      //   var firstDoses = parseInt(row.administered_dose1_recip - data[index-1]["administered_dose1_recip"]);
      //   var secondDoses = parseInt(row.series_complete_yes - data[index-1]["series_complete_yes"]);
      // }

      // if (isNaN(firstDoses)) {
      //   firstDoses = 0;
      // }


      if (index < 7) {
        var firstAvg = NaN;
        var secondAvg = NaN;
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


      chartData.push({date: row.date, newFirstDoses: parseInt(row._1st_dose_daily), newSecondDoses: parseInt(row.vaccine_series_completed_daily), firstAvg: firstAvg, secondAvg: secondAvg});

    });

  // push running totals, seven day avg, daily numbers

  console.log(chartData);


  drawChartArea();

});



  //makeGraphs(chartData);


d3.select(window).on("resize", drawChartArea());