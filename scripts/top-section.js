"use strict";

// City Prototype Module for city objects
import { CityTemplate } from './city-prototype.js';

// Clock Module for time and date 
import { displayDate, displayTime, getHourValue } from './clock.js';

// Initialize module contains JSON fetching
import { initializeJSON } from './initialize-json.js';
let jsonData = initializeJSON();
jsonData.then(function (data) {

  // DOM elements
  let cityInput = document.getElementById("cityInput");
  let cityOptionsDataList = document.getElementById("cityOptionsDataList");
  let cityIcon = document.getElementById("cityIcon");

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
  let previousCity;

  // Displays city options in DataList Input 
  let citylistArray = Object.keys(data);
  for (let cityObject of citylistArray) {
    let option = document.createElement('option');
    option.value = data[cityObject]['cityName'];
    cityOptionsDataList.appendChild(option);
    // console.log(cityOptionsDataList);
  }

  // When user gives a valid City name
  cityInput.addEventListener("input", display);
  /**
   * Updates the Top Section with Input City Values
   */
  function display() {
    let cityObj = data[cityInput.value.toLowerCase()];
    // if it is not present in data,Then value = undefined

    if (typeof cityObj != "undefined") {
      previousCity = cityObj;
      let City = new CityTemplate(cityObj);
      cityIcon.src = City.cityIconSrc;

      cityInput.style.border = "none";
      cityInput.style.textDecoration = "none";
      document.getElementById("errorMessage").style.display = "none";

      if (intervalID) {
        clearInterval(intervalID);
      }
      let currentHr = getHourValue(City.timeZone);
      function clockRun() {
        displayTime(City.timeZone, hr, min, sec, ampm, "Image");
        displayDate(City.timeZone, cityDate);
        let newHr = getHourValue(City.timeZone);
        if (newHr != currentHr) {
          currentHr = newHr;
          City.weatherForecast(timeline);
        }
      }
      intervalID = setInterval(clockRun, 1000);
      // Main Weather Report
      cel.innerHTML = "<strong>" + City.temperature + "</strong>";
      hum.innerHTML = "<strong>" + City.getHumidityValue() + "</strong>" + "&nbsp; %";
      fah.innerHTML = "<strong>" + City.getFahrenheitValue() + "&nbsp; F" + "</strong>";
      precip.innerHTML = "<strong>" + City.getPrecipitationValue() + "</strong>" + "&nbsp; %";

      // Weather Forecast
      City.weatherForecast(timeline);
    }
    else {
      // when input City name is invalid
      cityInput.style.border = "2px solid red";
      document.getElementById("errorMessage").style.display = "block";

      // City Icon
      cityIcon.src = `../assets/icons/city-icons/alt-city-icon.png`;

      // Local Time and Date
      let timeZone;
      displayTime(timeZone, hr, min, sec, ampm, "Image");
      displayDate(timeZone, cityDate);

      // Main Weather Report
      cel.innerHTML = "<strong>&UnderBar;&UnderBar;  &deg; </strong>";
      hum.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";
      fah.innerHTML = "<strong>&UnderBar;&UnderBar;  F</strong>";
      precip.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";

    }
  }

  cityInput.addEventListener("focusout", displayPrevious);
  /**
   * switch back to previous selected city 
   */
  function displayPrevious() {
    cityInput.value = previousCity.cityName;
    display();
  }

  cityInput.addEventListener("click", displayAll);
  /**
   * Displays all city names
   */
  function displayAll() {
    this.value = "";
  }

  // Default value on loading
  cityInput.value = "Nome";
  display();
})
