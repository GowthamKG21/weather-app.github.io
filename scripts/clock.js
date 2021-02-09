"use strict";

/**
 * To Display Time and Date based on City's TimeZone
 * @param {Object} cityobj city Object of JSON
 * @param {Object} hr HTML element for Hours  
 * @param {Object} min HTML element for Minutes 
 * @param {object} sec HTML element for Seconds 
 * @param {Object} ampm HTML element for AM/PM 
 * @param {Object} displayDate HTML element for Date
 * @param {String} place Section(Location) of these elements in HTML  
 * @return {number} hours - Current Hour in 24HRS format
 */
export function clock(cityobj, hr, min, sec, ampm, displayDate, place) {
    let localdate = new Date();
    let newDate;
    // If undefined object then Local Timezone is taken
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

    /**
     * Add Zero as prefix to single digit minutes and seconds
     * @param {number} i Minutes or Seconds 
     */
    function addZeroPrefix(i) {
        if (i < 10) { i = "0" + i };
        return i;
    }

    // Hours
    hr.innerHTML = (function () {
        if (hours > 12) { return hours % 12; }
        else { return h; }
    })();

    // Minutes
    min.innerHTML = " &colon; " + minutes;

    // Seconds
    if (place != "middle" && place != "bottom") {
        sec.innerHTML = " &colon; " + seconds;
    }

    // AM_PM
    if (hours < 12) {
        // To display image for AM/PM for Top Section only
        if (place != "middle" && place != "bottom") {
            ampm.src = "./assets/icons/general-icons/amState.svg";
        }
        else {
            ampm.innerHTML = ' AM';
        }
    }
    else {
        // To display image for AM/PM for Top Section only
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
        let dateArr = dateStr.split("/");
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let mon = dateArr[0];
        displayDate.innerHTML = `${dateArr[1]}-${months[mon - 1]}-${dateArr[2]}`;
    }

    return hours;
}