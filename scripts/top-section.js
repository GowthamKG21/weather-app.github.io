"use strict";

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

// Clock Module for time and date 
import { clock } from './clock.js';

// Initialize module contains JSON fetching
import { initializeJSON } from './initialize-json.js';
let jsonData = initializeJSON();
jsonData.then(function (data) {

  // DOM elements
  let cityinput = document.getElementById("cityinput");
  let cityoptions = document.getElementById("cityoptions");
  let cityicon = document.getElementById("cityicon");

  let hr = document.getElementById("hr");
  let min = document.getElementById("min");
  let sec = document.getElementById("seconds");
  let ampm = document.getElementById("ampm");
  let cityDate = document.getElementById("date");

  let cel = document.getElementById("celcius");
  let hum = document.getElementById("humidity");
  let fah = document.getElementById("farenheit");
  let precip = document.getElementById("precipitation");

  let timeline = document.getElementById("timeline");

  let intervalID;
  let whrVal;
  let previousCity;
  cityinput.setAttribute("previous", "");

  // Hourly weather - Timeline  
  function hourlyWeather(whrVal, wtempVal, index, length) {
    let tBox = createElementWithClassAppend('div', "timeline-hr-container", "", timeline);
    if (whrVal != "NOW") {
      if (whrVal == 0) { whrVal = "12 AM"; }
      else if (whrVal == 12) { whrVal += " PM"; }
      else {
        whrVal = (whrVal < 12) ? `${whrVal} AM` : `${whrVal % 12} PM`;
      }
    }
    createElementWithClassAppend('div', "w w-hr", whrVal, tBox);
    createElementWithClassAppend('div', "w w-indicator", "|", tBox);
    let wImg;
    if (wtempVal >= 23 && wtempVal <= 29) {
      wImg = createImage("./assets/icons/weather-icons/cloudyIcon.svg", "CloudyIcon");
    }
    if (wtempVal <= 18) {
      wImg = createImage("./assets/icons/weather-icons/rainyIconBlack.svg", "RainyIcon");
    }
    if (wtempVal >= 18 && wtempVal <= 22) {
      wImg = createImage("./assets/icons/weather-icons/windyIcon.svg", "WindyIcon");
    }
    if (wtempVal >= 29) {
      wImg = createImage("./assets/icons/weather-icons/sunnyIconBlack.svg", "SunnyIcon");
    }
    if (wtempVal == "Nil") {
      let weather = ["cloudy", "humidity", "precipitation", "rainy", "snowflake", "sunny", "windy"];
      wImg = createImage("./assets/icons/weather-icons/" + weather[Math.floor(Math.random() * weather.length)] + "Icon.svg", "WeatherIcon");
    }
    createElementWithClassAppend('div', "w w-icon", wImg, tBox);
    createElementWithClassAppend('div', "w w-value", wtempVal, tBox);
    if (index != length - 1) {
      createElementWithClassAppend('div', "w w-time-separator", "|", tBox);
    }
  }

  // For displaying city options in DataList Input 
  let citylistArray = Object.keys(data);
  for (let city of citylistArray) {
    let option = document.createElement('option');
    option.value = data[city]['cityName'];
    cityoptions.appendChild(option);
  }

  // If correct city name is given
  cityinput.addEventListener("input", display);
  function display() {
    let cityObj = data[cityinput.value.toLowerCase()];
    // if it is not present in data,Then value = undefined

    if (typeof cityObj != "undefined") {
      previousCity = cityObj;
      cityinput.style.border = "none";
      cityinput.style.textDecoration = "none";
      document.getElementById("errorMessage").style.display = "none";

      // City Icon
      let cityname = cityObj.cityName.toLowerCase();
      cityicon.src = `../assets/icons/city-icons/${cityname}.svg`;

      // Time 
      let inputTimeZone = cityObj.timeZone;

      if (intervalID) {
        clearInterval(intervalID);
      }

      function clockRun() {
        whrVal = clock(inputTimeZone, hr, min, sec, ampm, cityDate, "top");
        // Main Weather Report
        let humVal = cityObj.humidity;
        let precipVal = cityObj.precipitation;
        cel.innerHTML = "<strong>" + cityObj.temperature + "</strong>";
        hum.innerHTML = "<strong>" + humVal.slice(0, humVal.length - 1) + "</strong>" + humVal[humVal.length - 1];
        fah.innerHTML = "<strong>" + ((parseInt(cityObj.temperature) * 1.8) + 32).toFixed(2) + "</strong>";
        precip.innerHTML = "<strong>" + precipVal.slice(0, precipVal.length - 1) + "</strong>" + precipVal[precipVal.length - 1];
        // Hourly Weather Timeline 
        timeline.innerHTML = "";
        for (let i = 0; i < whrVal; i++) {
          hourlyWeather(i, "Nil", i, 4);
        }
        hourlyWeather("NOW", parseInt(cityObj.temperature.slice(0, cityObj.temperature.length - 1)));
        whrVal++;
        for (let temp of cityObj.nextFiveHrs) {
          // whrVal = (whrVal == 24) ? 0 : whrVal;
          let wtempVal = parseInt(temp.slice(0, temp.length - 1));
          hourlyWeather(whrVal, wtempVal, cityObj.nextFiveHrs.indexOf(temp), cityObj.nextFiveHrs.length);
          whrVal++;
        }
        for (let i = whrVal; i < 24; i++) {
          hourlyWeather(whrVal++, "Nil", i, 24);
        }
      }
      intervalID = setInterval(clockRun, 1000);
    }
    else {
      cityinput.style.border = "2px solid red";
      document.getElementById("errorMessage").style.display = "block";
      if (intervalID) {
        clearInterval(intervalID);
      }
      (() => {

        // City Options Input
        cityicon.src = `../assets/icons/city-icons/alt-city-icon.png`;
        ampm.src = "./assets/icons/general-icons/amState.svg";
        let d = new Date();
        let inputTimeZone = d.timeZone;
        whrVal = clock(inputTimeZone, hr, min, sec, ampm, cityDate, "top");

        // Main Weather Report
        cel.innerHTML = "<strong>&UnderBar;&UnderBar;  &deg; </strong>";
        hum.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";
        fah.innerHTML = "<strong>&UnderBar;&UnderBar;  F</strong>";
        precip.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";

        // Hourly Weather Timeline 
        timeline.innerHTML = "";
        hourlyWeather("NOW", "Nil");
        let hrVal = d.getHours();
        for (let i = 0; i < 4; i++) {
          if (hrVal == 24) { hrVal = 0; }
          hourlyWeather(hrVal++, "Nil", i, 4);
        }

      })();
    }

  }

  // To switch back to previous selected city
  cityinput.addEventListener("focusout", displayPrevious);
  function displayPrevious() {
    cityinput.value = previousCity.cityName;
    display();
  }

  // To display all city names
  cityinput.addEventListener("click", displayAll);
  function displayAll() {
    this.previous = this.value;
    this.value = "";
  }

  // Default value on loading
  cityinput.value = "Nome";
  display();

})
