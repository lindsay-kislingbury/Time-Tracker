function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'This week',
                data: data,
            }]
        },
    });
}


function loadDefaultChart(){
    $.get('/time/getAllEntries', function(data){
        const output = {};
        console.log('all timestamps: ', data.timestamps)
        data.timestamps.forEach(entry => {
            entry.tags.forEach(tag => {
                if(output[tag] != null){
                    output[tag] += entry.elapsedTime
                } else {
                    output[tag] = entry.elapsedTime
                }
            })
        });
        let chartData = [];
        for([key, value] of Object.entries(output)){
            result.push({tag: key, totalTime: value})
        }
        console.log('result: ', chartData)
        return chartData;
    });
}

$("#renderBtn").click(function(){
    chartData = loadDefaultChart();

    
});


/*
function () {
        console.log('entered render btn')
        data = [20000, 14000, 12000, 15000, 18000, 19000, 22000];
        labels =  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        renderChart(data, labels);
    }
*/
