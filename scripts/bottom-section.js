"use strict";

// City Prototype Module for city objects
import { CityTemplate } from './city-prototype.js';

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

// Clock Module for time and date 
import { displayTime } from './clock.js';

// Request data using HTTP Request to Web API
import { initializeData } from './http-request.js';

let jsonData = initializeData();
jsonData.then(function (data) {
  // DOM elements for Sort Arrow Icons
  let sortByContinent = document.getElementById("sortContinent");
  sortByContinent.addEventListener("click", () => { sortCity("Cont"); });

  let SortByContinentArrow = document.getElementById("sortContinentImg");
  SortByContinentArrow.src = "./assets/icons/general-icons/arrowDown.svg";
  SortByContinentArrow.alt = "Down Arrow Icon";

  let sortByTemperature = document.getElementById("sortTemperature");
  sortByTemperature.addEventListener("click", () => { sortCity("Temp"); });

  let SortByTemperatureArrow = document.getElementById("sortTemperatureImg");
  SortByTemperatureArrow.src = "./assets/icons/general-icons/arrowDown.svg";
  SortByTemperatureArrow.alt = "Down Arrow Icon";

  // Container for Bottom City Cards
  let bContainer = document.getElementById("bottomContainer");

  // Array to store all city objects from JSON Object
  let cityObjArray = Object.values(data);

  /**
   * To Sort the cities based on Continent name and Temperature,
   * Invoked on clicking sort arrows
   * @param {String} sortType - sort by "Cont"(Continent) or "Temp"(Temperature)
   */
  function sortCity(sortType) {
    bContainer.innerHTML = "";
    let contImgName = SortByContinentArrow.alt;
    let tempImgName = SortByTemperatureArrow.alt;

    /**
     * Returns temperature of the City
     * @param {object} cityObj  City Object from JSON
     * @return {number}         Temperature value 
     */
    function tempValue(cityObj) {
      return parseInt(cityObj.temperature.slice(0, cityObj.temperature.length - 2));
    }

    /**
     * Returns Continent Name of the City
     * @param {object} cityObject element of CityObjArray
     * @return {string}           Continent Name
     */
    function contValue(cityObject) {
      let contCity = cityObject.timeZone.split("/");
      return contCity[0];
    }

    let continent = contValue(cityObjArray[0]);
    let newCityArray = [];
    let contArray = [];

    /**
     * Sort Cities of same Continent based on Temperature 
     * @param {object} city element of CityObjArray 
     */
    function checkSameContinent(city) {
      if (contValue(city) == continent) {
        contArray.push(city);
      }
      else {
        continent = contValue(city);
        if (tempImgName == "Up Arrow Icon") {
          contArray.sort(function (a, b) { return tempValue(a) - tempValue(b) });
        }
        if (tempImgName == "Down Arrow Icon") {
          contArray.sort(function (a, b) { return tempValue(b) - tempValue(a) });
        }

        newCityArray.push.apply(newCityArray, contArray);
        contArray.length = 0;
        contArray.push(city);
      }
    }

    // If Sort By Continent is clicked
    if (sortType == "Cont") {
      if (contImgName == "Up Arrow Icon") {
        cityObjArray.sort(function (a, b) { return a.timeZone.localeCompare(b.timeZone) });
        sortByContinent.title = "Click to View Descending order of Continent Names";
        SortByContinentArrow.src = "./assets/icons/general-icons/arrowDown.svg";
        SortByContinentArrow.alt = "Down Arrow Icon";
      }
      if (contImgName == "Down Arrow Icon") {
        cityObjArray.sort(function (a, b) { return b.timeZone.localeCompare(a.timeZone) });
        sortByContinent.title = "Click to View Ascending order of Continent Names";
        SortByContinentArrow.src = "./assets/icons/general-icons/arrowUp.svg";
        SortByContinentArrow.alt = "Up Arrow Icon";
      }
    }

    // If Sort By Temperature is clicked
    if (sortType == "Temp") {
      if (tempImgName == "Up Arrow Icon") {
        cityObjArray.forEach(checkSameContinent);
        sortByTemperature.title = "Click to View Descending order of City Temperatures";
        SortByTemperatureArrow.src = "./assets/icons/general-icons/arrowDown.svg";
        SortByTemperatureArrow.alt = "Down Arrow Icon";
      }
      if (tempImgName == "Down Arrow Icon") {
        cityObjArray.forEach(checkSameContinent);
        sortByTemperature.title = "Click to View Ascending order of City Temperatures";
        SortByTemperatureArrow.src = "./assets/icons/general-icons/arrowUp.svg";
        SortByTemperatureArrow.alt = "Up Arrow Icon";
      }
    }

    // Loop for sending city Objects to displayCard
    for (let i = 0; i < 12; i++) {
      if (sortType == "Cont") { displayCard(cityObjArray[i]); }
      if (sortType == "Temp") { displayCard(newCityArray[i]); }
    }
  }

  /**
   * Returns a City Card with values of passed City Obj
   * @param {object} cityObj City Object  
   */
  function displayCard(cityObj) {
    let City = new CityTemplate(cityObj);

    // Continent Name
    let contCity = City.timeZone.split("/");
    let bCard = createElementWithClassAppend("div", "bottom-card", "", bContainer);
    createElementWithClassAppend("div", "b-continent", contCity[0], bCard);

    // Temperature
    createElementWithClassAppend("div", "b-temp", City.temperature, bCard);

    // City Time and City Name
    let bCityTime = createElementWithClassAppend("div", "b-citytime", "", bCard);
    createElementWithClassAppend("div", "b-city", `${City.cityName},&nbsp;`, bCityTime);

    time();
    humidity();

    /**
     * Updates Current Time of the city
     */
    function time() {
      let bTime = createElementWithClassAppend("div", "b-time", "", bCityTime);
      let hr = createElementWithClassAppend('span', "", "", bTime);
      let min = createElementWithClassAppend('span', "", " &colon; ", bTime);
      let sec;
      let ampmSpan = createElementWithClassAppend('span', "", "", bTime);

      setInterval(() => { displayTime(City.timeZone, hr, min, sec, ampmSpan, "Text"); }, 1000);
    }

    /**
     * Updates Humidity Value of the city
     */
    function humidity() {
      let bHumidity = createElementWithClassAppend("div", "b-humidity", "", bCard);
      let humidityImage = createImage("./assets/icons/weather-icons/humidityIcon.svg", "Humidity Icon");
      createElementWithClassAppend("span", "", humidityImage, bHumidity);
      createElementWithClassAppend("span", "", ` ${City.humidity}`, bHumidity);
    }
  }

  // Triggers Event Programatically for initial display while loading
  var event = new Event('click');
  sortByContinent.dispatchEvent(event);
})