"use strict";

/**
 * Returns Date based on TimeZone
 * @param {string} timeZoneValue timeZone Name
 * @returns {object} date object
 */
export function getDateByTimeZone(timeZoneValue) {
    let date = new Date();
    // If timeZoneValue is undefined then Local Timezone is taken
    if (timeZoneValue != "undefined") {
        let dateString = date.toLocaleString('en-US', { timeZone: timeZoneValue });
        date = new Date(dateString);
    }
    return date;
}

/**
 * Returns Hour value based on TimeZone
 * @param {string} timeZoneValue timeZone Name
 * @returns {number} Hours Value
 */
export function getHourValue(timeZoneValue) {
    let date = getDateByTimeZone(timeZoneValue);
    return date.getHours();
}

/**
 * Displays Time based on timeZone of the city on given HTML Elements
 * @param {string} timeZoneValue timeZone Name
 * @param {Object} hrElement HTML element for Hours  
 * @param {Object} minElement HTML element for Minutes 
 * @param {object} secElement HTML element for Seconds 
 * @param {Object} ampmElement HTML element for AM/PM 
 * @param {String} ampmType how to display AM/PM (Image or Text)
 */
export function displayTime(timeZoneValue, hrElement, minElement, secElement, ampmElement, ampmType) {
    let date = getDateByTimeZone(timeZoneValue);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
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
    hrElement.innerHTML = (function () { 
        if (hours == 0) { return 12; }
        else if (hours > 12) { return hours % 12; }
        else { return hours; }
    })();

    // Minutes
    minElement.innerHTML = " &colon; " + minutes;

    // Seconds
    if (secElement != undefined) {
        secElement.innerHTML = " &colon; " + seconds;
    }

    // AM_PM
    if (hours < 12) {
        if (ampmType == "Image") {
            ampmElement.src = "./assets/icons/general-icons/amState.svg";
            ampmElement.title = "AM Icon";
        }
        else { ampmElement.innerHTML = ' AM'; }
    }
    else {
        if (ampmType == "Image") {
            ampmElement.src = "./assets/icons/general-icons/pmState.svg";
            ampmElement.title = "PM Icon";
        }
        else { ampmElement.innerHTML = ' PM'; }
    }
}

/**
 * Displays date based on timeZone in given HTML Element
 * @param {string} timeZoneValue timeZone Name
 * @param {object} dateElement HTML Element where date need to be displayed
 */
export function displayDate(timeZoneValue, dateElement) {
    let date = getDateByTimeZone(timeZoneValue);
    let dateString = date.toLocaleDateString();
    let dateArray = dateString.split("/");
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let mon = dateArray[0];
    dateElement.innerHTML = `${dateArray[1]}-${months[mon - 1]}-${dateArray[2]}`;
}