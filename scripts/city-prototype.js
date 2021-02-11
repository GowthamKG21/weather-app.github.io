"use strict";

// Clock Module for time and date 
import { getHourValue } from './clock.js';

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

/**
 * Returns Instance of CityTemplate for given cityObject
 * @param {object} cityObj city object 
 */
export function CityTemplate(cityObj) {
    this.cityName = cityObj.cityName;
    this.cityIconSrc = `../assets/icons/city-icons/${this.cityName.toLowerCase()}.svg`;
    this.timeZone = cityObj.timeZone;
    this.temperature = cityObj.temperature;
    this.humidity = cityObj.humidity;
    this.precipitation = cityObj.precipitation;
    this.nextFiveHrs = cityObj.nextFiveHrs;
    this.hour = getHourValue(this.timeZone);
};

/**
 * Returns Temperature Value from Temperature String of CityTemplate 
 * (if celcius is undefined then current temperature of city is returned)
 * @param {String} celcius Temperature String (optional)
 * @returns {number} Temperature Value 
 */
CityTemplate.prototype.getTemperatureValue = function (celcius) {
    if (celcius == undefined) { celcius = this.temperature; }
    return parseInt(celcius.slice(0, celcius.length - 1));
};

/**
 * Returns Fahrenheit Value of the city
 */
CityTemplate.prototype.getFahrenheitValue = function () {
    return ((parseInt(this.temperature) * 1.8) + 32).toFixed(2);
};

/**
 * Returns Humidity Value of the city
 */
CityTemplate.prototype.getHumidityValue = function () {
    return parseInt(this.humidity.slice(0, this.humidity.length - 1));
};

/**
 * Returns Precipitation Value of the city
 */
CityTemplate.prototype.getPrecipitationValue = function () {
    return parseInt(this.precipitation.slice(0, this.precipitation.length - 1));
};

/**
 * Creates and Display Weather Forecast Timeline
 * @param {object} container HTML Element of the container
 */
CityTemplate.prototype.weatherForecast = function (container) {
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
    hourBox("NOW", this.getTemperatureValue(), end);
    let hrValue = this.hour;
    hrValue++;
    for (let t of this.nextFiveHrs) {
        hrValue = (hrValue == 24) ? 0 : hrValue;
        let tempValue = this.getTemperatureValue(t);

        if (this.nextFiveHrs.indexOf(t) == (this.nextFiveHrs.length - 1)) { end = true }

        hourBox(hrValue, tempValue, end);
        hrValue++;
    }
}

