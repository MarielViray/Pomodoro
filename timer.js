"use strict";

// DEFAULT TIMES
var initWorkTime = 25 * 60;         // 25 mins
var initShortBreakTime = 5 * 60;    // 5 mins
var initLongBreakTime = 15 * 60;    // 15 mins

// TRACKING
var working = true;
var longbreak = false;
var sessions = 0;
var currTime = initWorkTime;

// START BUTTON FUNCTIONALITY
function startTimer() {
    const start = document.getElementById('start');
    const reset = document.getElementById('reset');
    const pause = document.getElementById('pause');
    const edit = document.getElementById('edit');

    pause.style.display = "block";  // display pause
    start.style.display = "none";   // hide start
    reset.disabled = false;
    edit.disabled = true;

    var startTime = Date.now(), 
        diff;

    function timer() {
        diff = currTime - (((Date.now() - startTime) / 1000) | 0);

        secondsToHoursMinutesSeconds(diff, timerInterval);

        if (diff < 0) {
            // add one second so that the count down starts at the full duration
            startTime = Date.now() + 1000;
        }
    };

    // don't wait a full second before the timer starts
    timer();
    var timerInterval = setInterval(timer, 1000);


    // PAUSE BUTTON is displayed while clock is counting down
    pause.addEventListener('click', () => {
        pause.style.display = "none"; 
        start.style.display = "block"; 
        clearInterval(timerInterval);  // this stops/clears the timer
        currTime = diff;
    });

    // RESET BUTTON is only enabled once timer starts
    reset.addEventListener('click', () => {
        pause.style.display = "none"; 
        start.style.display = "block"; 
        reset.disabled = true; 
        edit.disabled = false;
        currTime = initWorkTime;
        clearInterval(timerInterval);  // this stops/clears the timer
        secondsToHoursMinutesSeconds(initWorkTime, timerInterval); // reset display to init 
    });
}




// FORMATS COUNTDOWN DISPLAY
function secondsToHoursMinutesSeconds(time, timerInterval) {
    const start = document.getElementById('start');
    const reset = document.getElementById('reset');
    const pause = document.getElementById('pause');
    const edit = document.getElementById('edit');
    var display = document.getElementById('time');

    // reached zero
    if (time < 0) {
        var display2 = document.querySelector('#workOrBreak');
        clearInterval(timerInterval);  // this stops/clears the timer

        // break time
        if (working) {
            if (sessions == 3) {
                alert("Stop Working! Take a Long Break!");
                currTime = initLongBreakTime;
                secondsToHoursMinutesSeconds(initLongBreakTime); // reset display to init 
                sessions = -1;
                longbreak = true;
                display2.textContent = "Long Break Time!"
            } else {
                alert("Stop Working! Take a Short Break!");        
                currTime = initShortBreakTime;
                secondsToHoursMinutesSeconds(initShortBreakTime); // reset display to init 
                longbreak = false;
                display2.textContent = "Break Time!"
            }
        
            // work time
        } else {
            alert("Break's Over! Time to Work!");        
            currTime = initWorkTime;
            secondsToHoursMinutesSeconds(initWorkTime); // reset display to init 
            sessions++;
            display2.textContent = "Work Time!"
        }
        
        // reset buttons
        pause.style.display = "none"; 
        start.style.display = "block"; 
        reset.disabled = true; 
        edit.disabled = false;
        working = !working; // swap between work and break

        // continue countdown
    } else {
        var hours, minutes, seconds;
        
        // truncates float
        hours = (time / 3600) | 0;
        minutes = ((time % 3600) / 60) | 0;
        seconds = ((time % 3600) % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (hours == "0") {
            display.textContent = minutes + ":" + seconds;
        } else {
            display.textContent = hours + ":" + minutes + ":" + seconds;
        }
    }

    
}

// UPDATE INITIAL TIMES
function chooseTime() {
    const newTime = prompt('Enter new time in minutes:');

    // valid time
    if (!isNaN(newTime) && newTime > 0) {
        // update working init
        if (working) {
            initWorkTime = newTime * 60;
            currTime = initWorkTime;
            secondsToHoursMinutesSeconds(initWorkTime); // init display

        // update short break init
        } else if (!working && !longbreak) {
            initShortBreakTime = newTime * 60;
            currTime = initShortBreakTime;
            secondsToHoursMinutesSeconds(initShortBreakTime); // init display

        // update long break init
        } else {
            initLongBreakTime = newTime * 60;
            currTime = initLongBreakTime;
            secondsToHoursMinutesSeconds(initLongBreakTime); // init display
        }

        // invalid time
    } else {
        alert('Invalid input. Please enter'+
              ' a valid number greater than 0.');
    }
}