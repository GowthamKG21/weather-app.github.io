"use strict";

// Clock and Date
export function clock(cityobj, hr, min, sec, ampm, displayDate, place) {
    let localdate = new Date();
    let newDate;
    if (cityobj == "undefined") {
        newDate = new Date();
    }
    else {
        let inputTimezone = cityobj;
        let newDateString = localdate.toLocaleString('en-US', { timeZone: inputTimezone });
        newDate = new Date(newDateString);
    }

    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    let seconds = newDate.getSeconds();
    minutes = addZeroPrefix(minutes);
    seconds = addZeroPrefix(seconds);

    function addZeroPrefix(i) {
        if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
        return i;
    }

    // Hours
    hr.innerHTML = (function () {
        if (hours > 12) { return hours % 12; }
        else { return hours; }
    })();

    // Minutes
    min.innerHTML = " &colon; " + minutes;

    // Seconds
    if (place != "middle" && place != "bottom") {
        sec.innerHTML = " &colon; " + seconds;
    }

    // AM_PM
    if (hours < 12) {
        if (place != "middle" && place != "bottom") {
            ampm.src = "./assets/icons/general-icons/amState.svg";
        }
        else {
            ampm.innerHTML = ' AM';
        }
    }
    else {
        if (place != "middle" && place != "bottom") {
            ampm.src = "./assets/icons/general-icons/pmState.svg";
        }
        else {
            ampm.innerHTML = ' PM';
        }
    }

    // Date
    if (place != "bottom") {
        let dateStr = newDate.toLocaleDateString();
        let dateArray = dateStr.split("/");
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let mon = dateArray[0];
        displayDate.innerHTML = `${dateArray[1]}-${months[mon - 1]}-${dateArray[2]}`;
    }
    return hours;
}
