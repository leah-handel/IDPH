var url = "https://data.cdc.gov/resource/8xkx-amqh.json?fips=17031"

d3.json(url).then(function(cdcResponse){ 
    
    console.log(cdcResponse);

    // sort by date ascending

    cdcResponse.forEach(function(row, index){

    // push running totals, seven day avg, daily numbers


    });

});


// statewide totals - sum counties? separate API call?