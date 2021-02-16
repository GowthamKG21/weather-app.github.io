"use strict";

// Request data using HTTP Request to Web API
import { getNextHrsWeather } from './http-request.js';

// Clock Module for time and date 
import { getHourValue } from './clock.js';

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

/**
 * CityTemplate - ES6 Class for given cityObject
 * @param {object} cityObj city object
 */
export class CityTemplate {
    constructor(cityObj) {
        this.cityName = cityObj.cityName;
        this.cityIconSrc = `./assets/icons/city-icons/${this.cityName.toLowerCase()}.svg`;
        this.timeZone = cityObj.timeZone;
        this.temperature = cityObj.temperature;
        this.humidity = cityObj.humidity;
        this.precipitation = cityObj.precipitation;

        this.hour = getHourValue(this.timeZone);
    }
    /**
     * Returns Temperature Value from Temperature String of CityTemplate
     * (if celcius is undefined then current temperature of city is returned)
     * @param {String} celcius Temperature String (optional)
     * @returns {number} Temperature Value
     */
    getTemperatureValue(celcius) {
        if (celcius == undefined) { celcius = this.temperature; }
        return parseInt(celcius.slice(0, celcius.length - 2));
    }
    /**
     * Returns Fahrenheit Value of the city
     */
    getFahrenheitValue() {
        return ((parseInt(this.temperature) * 1.8) + 32).toFixed(1);
    }
    /**
     * Returns Humidity Value of the city
     */
    getHumidityValue() {
        return parseInt(this.humidity.slice(0, this.humidity.length - 1));
    }
    /**
     * Returns Precipitation Value of the city
     */
    getPrecipitationValue() {
        return parseInt(this.precipitation.slice(0, this.precipitation.length - 1));
    }
    /**
     * Creates and Display Weather Forecast Timeline
     * @param {object} container HTML Element of the container
     */
    weatherForecast(container, apiString) {

        /**
         * Creates and Displays a Hourly Box in Timeline of weather Forecast
         * @param {number} hrValue Hour Value
         * @param {number} tempValue Temperature value
         * @param {boolean} end current Box is the end of timeline or not (true/false)
         */
        function hourBox(hrValue, tempValue, end) {
            let Box = createElementWithClassAppend('div', "timeline-hr-container", "", container);
            if (hrValue != "NOW") {
                if (hrValue == 0) { hrValue = "12 AM"; }
                else if (hrValue == 12) { hrValue += " PM"; }
                else {
                    hrValue = (hrValue < 12) ? `${hrValue} AM` : `${hrValue % 12} PM`;
                }
            }
            createElementWithClassAppend('div', "w w-hr", hrValue, Box);
            createElementWithClassAppend('div', "w w-indicator", "|", Box);
            let wImg;
            if (tempValue >= 23 && tempValue <= 29) {
                wImg = createImage("./assets/icons/weather-icons/cloudyIcon.svg", "CloudyIcon");
            }
            if (tempValue <= 18) {
                wImg = createImage("./assets/icons/weather-icons/rainyIconBlack.svg", "RainyIcon");
            }
            if (tempValue >= 18 && tempValue <= 22) {
                wImg = createImage("./assets/icons/weather-icons/windyIcon.svg", "WindyIcon");
            }
            if (tempValue >= 29) {
                wImg = createImage("./assets/icons/weather-icons/sunnyIconBlack.svg", "SunnyIcon");
            }
            if (tempValue == "Nil") {
                let weather = ["cloudy", "humidity", "precipitation", "rainy", "snowflake", "sunny", "windy"];
                wImg = createImage("./assets/icons/weather-icons/" + weather[Math.floor(Math.random() * weather.length)] + "Icon.svg", "WeatherIcon");
            }
            createElementWithClassAppend('div', "w w-icon", wImg, Box);
            createElementWithClassAppend('div', "w w-value", tempValue, Box);
            if (end != true) {
                createElementWithClassAppend('div', "w w-time-separator", "|", Box);
            }
        }

        container.innerHTML = "";
        let end = false;
        let start = true;
        let hrValue = this.hour;
        let apiData = getNextHrsWeather(apiString, 5);
        apiData.then(function (data) {
            let nextFiveHrs = data.temperature;

            for (let t of nextFiveHrs) {
                hrValue = (hrValue == 24) ? 0 : hrValue;
                let tempValue = parseInt(t.slice(0, t.length - 2));

                if (start == true) {
                    hourBox("NOW", tempValue, end);
                    start = false;
                }
                else {
                    hourBox(hrValue, tempValue, end);
                }

                if (nextFiveHrs.indexOf(t) == (nextFiveHrs.length - 2)) { end = true; }
                hrValue++;
            }
        })

    }
};
