'use strict';
var clock = new Clock(),
    current_time,
    serv_time = document.getElementById("serv_time");

function timer() {
    clock.calculate();
    var current_time = clock.getTime();
    serv_time.textContent = current_time;
    setTimeout("timer()", 1000);
}

timer();