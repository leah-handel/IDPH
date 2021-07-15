function dateSort(a, b) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

// fix this so it can be called within the for loop over the cdc data aka takes one value and the index

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
      left: 80
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
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight+40})`)
      .style('text-anchor', 'middle')
      .text("Date");

    labelsGroup.append("text")
      .attr("transform",`rotate(-90) translate(-${chartHeight/2}, -60)`)
      .style('text-anchor', 'middle')
      .text("Doses");

    var chartGroup = svg.append("g")
      .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  

    function makeGraphs() {

        var url = "https://data.cdc.gov/resource/8xkx-amqh.json?fips=17031"

        d3.json(url).then(function(cdcResponse){ 

            data = cdcResponse.sort(dateSort);

            console.log(data);

            chartData = [];

            data.forEach(function(row, index){

                if (index == 0) {
                  var firstDoses = parseInt(row.administered_dose1_recip);
                  var secondDoses = parseInt(row.series_complete_yes);
                }else {
                  var firstDoses = parseInt(row.administered_dose1_recip - data[index-1]["administered_dose1_recip"]);
                  var secondDoses = parseInt(row.series_complete_yes - data[index-1]["series_complete_yes"]);
                }

                if (isNaN(firstDoses)) {
                  firstDoses = 0;
                }

                chartData.push({date: row.date, newFirstDoses: firstDoses, newSecondDoses: secondDoses});

            // push running totals, seven day avg, daily numbers

            });

            console.log(chartData);

            chartData.forEach(function (row, index) {

              if (index < 7) {
                var firstAvg = NaN;
                var secondAvg = NaN;
              }else {
                firstSum = 0;
                secondSum = 0;
                for (var i = 0; i < 7; i++) {
                  firstSum += chartData[index-i]["newFirstDoses"];
                  secondSum += chartData[index-i]["newSecondDoses"];
                };
                var firstAvg = firstSum/7;
                var secondAvg = secondSum/7;
              }

              row.firstAvg = firstAvg;
              row.secondAvg = secondAvg;

            });

            console.log(chartData);

            // domain and range


          var xScale = d3.scaleTime()
            .domain([d3.min(chartData.map(d=>luxon.DateTime.fromISO(d.date))), d3.max(chartData.map(d=>luxon.DateTime.fromISO(d.date)))]).nice()
            .range([0, chartWidth]);

          var yData = ["newFirstDoses", "newSecondDoses", "firstAvg", "secondAvg"]

          var yScale = d3.scaleLinear()
            .domain([0, d3.max(yData.map(d=>d3.max(chartData.map(e=>e[d]))))]).nice()
            .range([chartHeight, 0]);

          var yAxis = d3.axisLeft(yScale).ticks(chartHeight/60);
          var xAxis = d3.axisBottom(xScale).ticks();
      
          chartGroup.append("g")
            .call(yAxis);
      
          chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

          // adding simple bars

          chartGroup.selectAll("bars")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("x", d => xScale(luxon.DateTime.fromISO(d.date)))
            .attr("y", d => yScale(d.newFirstDoses))
            .attr("width", 2)
            .attr("height", function(d) { return chartHeight - yScale(d.newFirstDoses); })
            .attr("fill", "#69b3a2")

          
        });


    // statewide totals - sum counties? separate API call?

    }
  
    makeGraphs();
    // window size event listener



}

makeResponsive();

d3.select(window).on("resize", makeResponsive);