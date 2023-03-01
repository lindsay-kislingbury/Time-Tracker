let startTime;
let stopTime;
let timer = 0;
let timerInterval;


let ms = document.getElementById('ms'); //miliseconds 
let second = document.getElementById('second');
let minute = document.getElementById('minute');

//on page load
/*
time submissions array
push each interval to the array
*/


const start = () => {
    //stop(); //clear interval
    startTime = new Date(); //store dateTime
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        timer += 1/60;
        msVal = Math.floor((timer - Math.floor(timer))*100);
        secondVal = Math.floor(timer) - Math.floor(timer/60) * 60;
        minuteVal = Math.floor(timer/60);

        ms.innerHTML = secondVal < 10 ? "0" + msVal.toString() : msVal;
        second.innerHTML = secondVal < 10 ? "0" + secondVal.toString() : secondVal;
        minute.innerHTML = minuteVal < 10 ? "0" + minuteVal.toString() : minuteVal;
    }, 1000/60);
}

const stop = () => {
    stopTime = new Date(); //Store stop time
    clearInterval(timerInterval); //Clear interval
    timerInterval = null;
}

//Send post req
const send = () =>{
    let xhr = new window.XMLHttpRequest();
    xhr.open('POST', '/time/stamp', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({"startTime": startTime, "stopTime": stopTime}));
}

document.getElementById("startButton").addEventListener("click", start);
document.getElementById("stopButton").addEventListener("click", stop);
document.getElementById("sendButton").addEventListener("click", send);
