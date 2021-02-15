"use strict";

let requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

let reloadFlagInitialize = 0;
let reloadFlagNextWeather = 0;
/**
 * Fetches the City, TimeZone and Weather details from web API
 */
export async function initializeData() {
    let response = await fetch("https://soliton.glitch.me/all-timezone-cities", requestOptions)
    .catch((error) => { 
        if (reloadFlagInitialize == 0) {
            alert("Sorry ! Error in fetching City Details 😞\nPlease reload the site Or Try after sometime\n\n" + error)
            reloadFlagInitialize++;
        }
    });
    let jsonData = await response.json();
    reloadFlagInitialize = (typeof jsonData == undefined) ? reloadFlagInitialize : 1;
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

    let response = await fetch("https://soliton.glitch.me/hourly-forecast", requestOptionsPost)
    .catch((error) => { 
        if (reloadFlagNextWeather == 0) {
            alert("Sorry ! Could not fetch Houlry Forecast Details 😞\nPlease reload the site Or Try after sometime\n\n" + error)
            reloadFlagNextWeather++;
        }
    });
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
