'use strict';
function Clock() {
    this.times = [0, 0, 0];
}

Clock.prototype.calculate = function () {
    this.times[2]++;
    if (this.times[2] > 60) {
        this.times[2] = 0;
        this.times[1]++;
        if (this.times[1] > 60) {
            this.times[1] = 0
            this.times[0]++;
        }
    }
}

Clock.prototype.getTime = function () {
    var curr_clock_time = "Active for - " + this.times[0] + " : " +
        this.times[1] + " : " +
        this.times[2];
    return curr_clock_time;
}