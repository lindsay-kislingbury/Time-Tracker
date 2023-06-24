
var startTimerButton = document.querySelector('.startTimer');
var pauseTimerButton = document.querySelector('.pauseTimer');
var timerDisplay = document.querySelector('.timer');

var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var hours;
var minutes;
var seconds;
var milliseconds;
var elapsedTime;
var paused = 0;
var running = 0;

function startTimer(){
    if(!running){
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1);// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   
        paused = 0;
        running = 1;
        timerDisplay.style.background = "rgb(116,235,213)";
        timerDisplay.style.background = "radial-gradient(circle, rgba(131,72,109,0.3), rgba(0,0,0,0))";
        startTimerButton.classList.add('lighter');
        pauseTimerButton.classList.remove('lighter');
        startTimerButton.style.cursor = "auto";
        pauseTimerButton.style.cursor = "pointer";
    }
}

function pauseTimer(){
    if (!difference){
    // if timer never started, don't allow pause button to do anything
    } else if (!paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = 1;
        running = 0;
        timerDisplay.style.cursor = "pointer";
        startTimerButton.style.cursor = "pointer";
        pauseTimerButton.style.cursor = "auto";
    } else {// if the timer was already paused, when they click pause again, start the timer againstartTimer();
}


}function resetTimer(){
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    timerDisplay.innerHTML = '00:00:00:00';
    timerDisplay.style.background = "transparent";
    timerDisplay.style.cursor = "pointer";
    startTimerButton.style.cursor = "pointer";
    pauseTimerButton.style.cursor = "auto";
}

function getShowTime(){
    updatedTime = new Date().getTime();
    if (savedTime){
        difference = (updatedTime - startTime) + savedTime;
    } else {
        difference =  updatedTime - startTime;
    }
    hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((difference % (1000 * 60)) / 1000);
    milliseconds = Math.floor((difference % (1000 * 60)) / 100);hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
    elapsedTime = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    timerDisplay.innerHTML = elapsedTime;
}

async function send(){
    var title = document.getElementById('title').value;
    var options = document.getElementById('new-tags').selectedOptions;
    var tags = Array.from(options).map(({value})=> value);
    var time = elapsedTime.substr(0,elapsedTime.lastIndexOf(":"));
    var date = new Date().toISOString().slice(0, 10);
    
    console.log(date);
    var postData = {
        title: title,
        tags: tags,
        elapsedTime: time,
        date: date
    }
    var post = JSON.stringify(postData);
    console.log(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/time/create', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
    clearInputs();    
    updateDiv();
}

//REMOVE STAMP
function remove(){
    var xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/time/remove', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({"deleteId": deleteButton.value}));
    updateDiv();
}

function edit(){
    console.log("inside edit client side");
    
    //var xhr = new window.XMLHttpRequest();
    //xhr.open('POST', '/time/edit', true);
    //xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    //xhr.send(JSON.stringify({"editValue": editValue,"editId": editButton.value}));
}


function clearInputs(){
    $('#title').val('');
    $("#tags").empty();
}

function updateDiv(){
    $.ajax({
        type: 'GET',
        dataType: 'json', 
        url: '/time/update',
        success: function(data){
            $("#stamps").load(location.href+" #stamps>*","");
        }
    });
}


//Select2 New Timestamp Tags
$(document).ready(function(){
    $.get('/time/loadAllTags', function(data){
        tags = data.map((data) => ({"id": data, "text": data}));
        $('#new-tags').select2( {
            data: tags,
            multiple: true,
            width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
            placeholder: $( this ).data( 'placeholder' ),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
        });
    });
});



//Get tags for a single timestamp to edit
function openEditModal(){
    const stampId = document.getElementById('editButton').value;
    console.log("stampId: ", stampId);
    $.ajax({
        type: 'POST',
        dataType:'json',
        url: '/time/getOneStampTags',
        data: {stampId: stampId},
        success: function(data){
            tags = data.tags.map((data) => ({"id": data, "text": data, "selected": true}));
            $('#edit-tags').select2( {
                data: tags,
                multiple: true,
                width: $( this ).data( 'width' ) ? $( this ).data( 'width' ) : $( this ).hasClass( 'w-100' ) ? '100%' : 'style',
                closeOnSelect: false,
                theme: 'bootstrap-5',
                tags: true,
                tokenSeparators: [',', ' '],
                dropdownParent: $('#editModal')
            });
            $('#edit-title').val(data.title);
        }
    })
    updateDiv();
}


  
