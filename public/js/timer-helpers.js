var startTimerButton = document.querySelector('.startTimer');
var pauseTimerButton = document.querySelector('.pauseTimer');
var resetTimerButton = document.querySelector('.resetTimer');
var timerDisplay = document.querySelector('.timer');
timerDisplay.style.cursor = "pointer";
timerDisplay.style.fontSize = "2rem";
startTimerButton.style.cursor = "pointer";
resetTimerButton.style.cursor = "auto";
pauseTimerButton.style.cursor = "auto";

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
    timerDisplay.style.color="#343a40";
    startTimerButton.style.cursor = "auto";
    pauseTimerButton.style.cursor = "pointer";
    resetTimerButton.style.cursor = "pointer";
    if(!running){
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);// change 1 to 1000 above to run script every second instead of every millisecond. one other change will be needed in the getShowTime() function below for this to work. see comment there.   
        paused = 0;
        running = 1;
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
        startTimerButton.style.cursor = "pointer";
        pauseTimerButton.style.cursor = "auto";
    } else {
        startTimer();
    }   
}

function resetTimer(){
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    timerDisplay.innerHTML = '00:00:00';
    timerDisplay.style.color="#6c757d";
    startTimerButton.style.cursor = "pointer";
    resetTimerButton.style.cursor = "auto";
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

function checkValidInput(element){
    var titleInputField = document.getElementById(element);
    console.log("value: ", titleInputField.value);
    if(titleInputField.value != ''){
        titleInputField.classList.remove('is-invalid');
    }
}



    











