var chart;
var ctx = document.getElementById("chart-canvas").getContext('2d');

$(document).ready(function(){
    $('#range-selector').val("all");
    $('#projects-container').hide();
});

$('#donut-tab').on('click', function() {
    $('#projects-container').hide();
    reDrawChart();
});

$('#bar-tab').on('click', function() {
    $('#projects-container').show();
    reDrawChart();
});

$('#chart-reset-btn').on('click', function(){
    var tab = getActiveTab();
    resetChart(tab);
});

$('#options-header').on('click', function(){
    if($(this).hasClass('rounded-bottom-0')){
        $(this).removeClass('rounded-bottom-0')
    }else{
        $(this).addClass('rounded-bottom-0');
    }
});

$('#project-choices').on('click', ':checkbox', function(){
    reDrawChart();
});

$('#range-selector').on('change', function() {
    if($('#range-selector').find(":selected").val() != 'range'){
        $('#rangeOption').hide();
        reDrawChart();
    }else{
        $('#rangeOption').show();
    }
});

$('#submit-range-btn').on('click', function() {
    reDrawChart();
});


function reDrawChart(){
    range = getRange(rangeOptionCheck());
    destroyExistingChart();
    loadChart(range);
}

function getActiveTab(){
    if($('#bar-tab').hasClass('active')){
        return 'bar';
    }else{
        return 'donut';
    }
}

function toggleHide(elem){
    if(elem.hasClass('hide')){
        elem.removeClass('hide');
    }else{
        elem.addClass('hide');
    }
}

function resetChart(tab){
    $('#range-start').val('');
    $('#range-end').val('');
    $('#range-selector').val('all');
    $('#rangeOption').hide();
    $('#project-choices input[type="checkbox"').prop('checked', true);
    reDrawChart();
}

function getSelectedProjects(){
    var choices = $('input.project-checkbox:checked').not(":disabled").map(function(){
       return $(this).val();
    }).get();
    if(!choices) return null
    else return choices;
}

function getRange(type){
    var range = {};
    if(type == 'all'){
        range = null;
    }else if(type == 'range'){
        range.start = dayjs($('#range-start').val());
        range.end = dayjs($('#range-end').val());
    }else{
        range.end = dayjs().set('hour', 23);
        if(type == 'today'){
            range.start = dayjs().set('hour', 0);
        } else if(type == 'week'){
            range.start = dayjs().subtract(1, 'week');
        } else if(type == 'month'){
            range.start = dayjs().subtract(1, 'month');
        }else if(type == 'year'){
            range.start = dayjs().subtract(1, 'year');
        }
    }   
    return range;
}

function rangeOptionCheck(){
    const option = $('#range-selector').find(":selected").val();
    return option;
}

function loadProjects(data){
    $('input.project-checkbox').each(function(){
        $(this).attr('disabled','disabled');
    });
    data.forEach(project => {
        var checkbox = $('input.project-checkbox[value='+project+']');
        if(checkbox.length){
            checkbox.removeAttr('disabled');
        }else{
            var newCheckbox = $('<div class="form-check form-check-inline">'+
            '<input class="form-check-input project-checkbox" type="checkbox" checked value="'+project+'">'+
            '<label class="form-check-label" for="'+project+'">'+project+'</label></div>');
            $('#project-choices').append(newCheckbox);
        }
    });
}

function destroyExistingChart(){
    const chartStatus = Chart.getChart("chart-canvas");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
}

function generateColorsArr(data){
    var colors = [
        'rgba(255, 99, 132, 0.75)',
        'rgba(255, 159, 64, 0.75)',
        'rgba(255, 193, 49, 0.75)',
        'rgba(75, 192, 192, 0.75)',
        'rgba(54, 162, 235, 0.75)',
        'rgba(153, 102, 255, 0.75)',
        'rgba(255, 167, 186, 0.75)',
        'rgba(255, 182, 108, 0.75)',
        'rgba(255, 227, 162, 0.75)',
        'rgba(154, 220, 220, 0.75)',
        'rgba(144, 204, 244, 0.75)',
        'rgba(198, 170, 255, 0.75)'
    ];
    var colorsArr = [];
    for(let i=0; i<data.length; i++){
        colorsArr.push(colors[i % colors.length]);
    }
    return colorsArr;
}

function renderBarChart(data, labels){
    barOptions = dynamicBarOptions(Math.max(data));
    var colors = generateColorsArr(data);
    Chart.defaults.font.family = "'Rubik', sans-serif";
    chart = new Chart(ctx, {
        type: 'bar',
        options: barOptions,
        data: {
            labels: labels,
            datasets: [
            {
                borderColor: 'rgba(248, 249, 250, 0.7)',
                backgroundColor: colors,
                label: "Total Time",
                data: data,
                borderWidth: [1, 1, 1, 1, 1],
            }
            ]  
        }
    })
}

function renderDonutChart(data, labels) {
    var colors = generateColorsArr(data);
    Chart.defaults.font.family = "'Rubik', sans-serif";
    chart = new Chart(ctx, {
    type: "doughnut",
    options: donutOptions,
    data: {
        labels: labels,
        datasets: [
        {
            borderColor: 'rgba(248, 249, 250, 0.7)',
            backgroundColor: colors,
            label: "Total Time",
            data: data,
            borderWidth: [1, 1, 1, 1, 1]
        }
        ]
    },
    })
}

function renderEmptyBarChart(){
    chart = new Chart(ctx, {
        type: 'bar',
        options: emptyBarOptions,
        data: {
            labels: [' ', ' ', ' ', ' '],
            datasets: [
            {
                borderColor: 'rgba(108, 117, 125, 0)',
                data: [40000, 50000, 60000, 70000],
                borderWidth: 0,
                backgroundColor: ['rgba(108, 117, 125, 0.2)']
            }
            ]  
        }
    })
}

function renderEmptyDonutChart(){
    var ctx = document.getElementById("chart-canvas").getContext('2d');
    chart = new Chart(ctx, {
    type: "doughnut",
    options: emptyDonutOptions,
    backgroundColor: 'rgba(108, 117, 125, 0.45)',
    data: {
        labels: [" "],
        datasets: [
        {
            data: [100],
            borderWidth: 0,
            backgroundColor: ['rgba(134, 140, 150, 0.44)']
        }
        ]
    },
    })
}

function parseChartData(d, range){
    const output = {};
    d.timestamps.forEach(entry => {
        if(range){
            entryDate = dayjs(entry.date);
            if(entryDate.isAfter(range.start) && entryDate.isBefore(range.end)){
                if(output[entry.project] != null){
                    output[entry.project] += entry.elapsedTime;
                } else {
                    output[entry.project] = entry.elapsedTime;
                }
            }
        }else{
            if(output[entry.project] != null){
                output[entry.project] += entry.elapsedTime;
            } else {
                output[entry.project] = entry.elapsedTime;
            }
        }
    });
    loadProjects(Object.keys(output));
    choices = getSelectedProjects();
    for(var project in output){
        if(!choices.includes(project)){
            delete output[project];
        }
    }
    return output;
}

function loadChart(range){
    tab = getActiveTab();
    $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/time/getAllEntries',
        success: function(d){  
            chartData = parseChartData(d, range);
            var labels = [], data = [];
            labels = Object.keys(chartData);
            data = Object.values(chartData);
            if(labels.length == 0){
                if(tab == 'donut'){
                    renderEmptyDonutChart(); 
                }else{
                    renderEmptyBarChart();
                }
            }else{
                if(tab == 'donut'){
                    renderDonutChart(data, labels);
                }else{
                    renderBarChart(data, labels);
                }
            }
        }
    });
}

var donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: "top",
            labels:{
                font:{
                    family:"'Rubik', sans-serif",
                }
            }
        },
        tooltip: {
            bodyFont:{
                family:"'Rubik', sans-serif",
            },
            titleFont:{
                family:"'Rubik', sans-serif",
            },
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ' ';
                    }
                    if (context.parsed.y !== null) {
                        label += cnvToTimeString(context.parsed);
                    }
                    return label;
                }
            },
        },
    }
}


function dynamicBarOptions(max){
    var stepSize;
    if(max < 3600){
        stepSize = 900;
    }
    else if(max > 3600 && max < 10800){
        stepSize = 1800;
    }
    else{
        stepSize = 3600;
    }
    var barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: stepSize,
                    callback: (val) => {
                        return cnvToTimeString(val)
                    }
                },
            }
        },
        plugins: {
            tooltip: {
                bodyFont:{
                    family:"'Rubik', sans-serif",
                },
                titleFont:{
                    family:"'Rubik', sans-serif",
                },
                callbacks:{
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ' ';
                        }
                        if (context.parsed.y !== null) {
                            label += cnvToTimeString(context.raw);
                        }
                        return label;
                    }
                }
            },
            legend: {
                display: false,
            }  
        },
    }
    return barOptions;
}
    



var emptyBarOptions = {
    scales: {
        y: {
            ticks:{
                display: false,
                beginAtZero: true,
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins:{
        legend: {
            display: false
          },
          tooltip: {enabled: false},
          hover: {enabled: false},
          title: {
            display: true, 
            text: "No Entries",
            font:{
                size: 20,
                family:"'Rubik', sans-serif",
            }
        }
    }
}


var emptyDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins:{
        legend: {
            display: false
          },
          tooltip: {enabled: false},
          hover: {enabled: false},
          title: {
            display: true, 
            text: "No Entries",
            font:{
                size: 20,
                family:"'Rubik', sans-serif",
            }
        }
    }
}






