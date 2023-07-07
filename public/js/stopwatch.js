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
var elapsedTime;
var paused = 0;
var running = 0;

function startTimer(){
    if(!running){
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   
        paused = 0;
        running = 1;
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
    timerDisplay.innerHTML = '00:00:00';
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
    console.log("hours: ", hours);
    minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((difference % (1000 * 60)) / 1000);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    elapsedTime = hours + ':' + minutes + ':' + seconds;
    timerDisplay.innerHTML = elapsedTime;
}

async function send(){
    var title = document.getElementById('title').value;
    var options = document.getElementById('new-tags').selectedOptions;
    var tags = Array.from(options).map(({value})=> value);
    var time = (hours * 3600) + (minutes * 60) + seconds;
    var date = new Date().toISOString().slice(0, 10);
    var postData = {
        title: title,
        tags: tags,
        elapsedTime: time,
        date: date
    }
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/time/create', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
    resetTimer();
    clearInputs();    
    updateDiv();
}


function remove(deleteId){
    console.log(deleteId);
    $.ajax({
        type: 'POST',
        url: '/time/remove',
        cache: false,
        data: {
            deleteId: deleteId,
        }
    })  
    updateDiv();
}

function clearInputs(){
    $('#title').val('');
    $("#new-tags").empty();
}

//limit numeric input
function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
      object.value = object.value.slice(0, object.maxLength)
  }
    
  function isNumeric (evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode (key);
    var regex = /[0-9]|\./;
    if ( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
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

function formatTime(totSeconds){
    return new Date(totSeconds * 1000).toISOString().slice(11, 19);
}

//Select2 New Timestamp Tags
$(document).ready(function(){
    $.get('/time/loadAllTags', function(data){
        tags = data.map((data) => ({"id": data, "text": data}));
        $('#new-tags').select2( {
            data: tags,
            multiple: true,
            placeholder: $( this ).data( 'placeholder' ),
            closeOnSelect: false,
            theme: 'bootstrap-5',
            tags: true,
            tokenSeparators: [',', ' '],
            
        });
    });
});

//Load data for edit modal
function openEditModal(stampId){
    $('#edit-tags').val('');
    
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
                closeOnSelect: false,
                theme: 'bootstrap-5',
                tags: true,
                tokenSeparators: [',', ' '],
                dropdownParent: $('#editModal')
            });
            $('#edit-time').val(data.time);
            $('#edit-title').val(data.title);
            $('#edit-date').val(data.date);
            $('#edit-button').val(stampId); 
        }
    })
}

function edit(){
    var stampId = document.getElementById('edit-button').value;
    var title = document.getElementById('edit-title').value;
    var options = document.getElementById('edit-tags').selectedOptions;
    var tags = Array.from(options).map(({value})=> value);
    var date = document.getElementById('edit-date').value;
    var timeInput = document.getElementById('edit-time').value;
    var timeParts = timeInput.split(':');
    var time = (timeParts[0]) * 3600 + timeParts[1] * 60 + timeParts[2] * 1;
    console.log('time: ', time);
    var postData = {
        stampId: stampId,
        title: title,
        tags: tags,
        time: time,
        date: date
    }
    var post = JSON.stringify(postData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/time/edit', true);
    xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
    xhr.send(post);
    updateDiv();
    $('#editModal').modal('hide');
}



//INPUT MASK
var timeInput = document.getElementById("edit-time");

var im = new Inputmask("99:99:99",{numericInput: true, placeholder:'0'});
im.mask(timeInput);


