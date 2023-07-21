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
    $.get('/time/update', function(data){
        chartData = {
            
        }
    });
}

$("#renderBtn").click(function(){
    loadDefaultChart();
});


/*
function () {
        console.log('entered render btn')
        data = [20000, 14000, 12000, 15000, 18000, 19000, 22000];
        labels =  ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        renderChart(data, labels);
    }
*/
