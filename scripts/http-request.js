"use strict";

let requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

/**
 * Fetches the City, TimeZone and Weather details from web API
 */
export async function initializeData() {
    let response = await fetch("https://soliton.glitch.me/all-timezone-cities", requestOptions);
    let jsonData = await response.json();
    return jsonData;
}

/**
 * Fetches Weather for next N hours from web API
 * @param {string} apiString city_Date_Time_Name
 * @param {number} numberOfHrs Number of hours
 * @returns {Array} temperature of next N hours
 */
export async function getNextHrsWeather(apiString, numberOfHrs) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({ "city_Date_Time_Name": apiString, "hours": numberOfHrs });

    var requestOptionsPost = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let response = await fetch("https://soliton.glitch.me/hourly-forecast", requestOptionsPost);
    let nextWeather = await response.json();
    return nextWeather;
}

/**
 * This code might be needed in future
 * Fetches time for the city
 */
/*
fetch("https://soliton.glitch.me?city=London", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
*/
