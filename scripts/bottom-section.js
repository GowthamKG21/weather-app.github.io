"use strict";
// clock Module contains display functions for time and date 
import { clock } from './clock.js';

// initializeJSON module contains function that return JSON Object
import { initializeJSON } from './initialize-json.js';

let jsonData = initializeJSON();
jsonData.then(function (data) {
  // DOM elements for Sort Arrow Icons
  let sortByContinent = document.getElementById("sortContinent");
  sortByContinent.addEventListener("click", () => { sortCity("Cont"); });

  let SortByContinentArrow = document.getElementById("sortContinentImg");
  SortByContinentArrow.src = "/./assets/icons/general-icons/arrowDown.svg";
  SortByContinentArrow.alt = "Down Arrow Icon";

  let sortByTemperature = document.getElementById("sortTemperature");
  sortByTemperature.addEventListener("click", () => { sortCity("Temp"); });

  let SortByTemperatureArrow = document.getElementById("sortTemperatureImg");
  SortByTemperatureArrow.src = "/./assets/icons/general-icons/arrowDown.svg";
  SortByTemperatureArrow.alt = "Down Arrow Icon";

  // Bottom City Card Container
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
        SortByContinentArrow.src = "/./assets/icons/general-icons/arrowDown.svg";
        SortByContinentArrow.alt = "Down Arrow Icon";
      }
      if (contImgName == "Down Arrow Icon") {
        cityObjArray.sort(function (a, b) { return b.timeZone.localeCompare(a.timeZone) });
        sortByContinent.title = "Click to View Ascending order of Continent Names";
        SortByContinentArrow.src = "/./assets/icons/general-icons/arrowUp.svg";
        SortByContinentArrow.alt = "Up Arrow Icon";
      }
    }

    // If Sort By Temperature is clicked
    if (sortType == "Temp") {
      if (tempImgName == "Up Arrow Icon") {
        cityObjArray.forEach(checkSameContinent);
        sortByTemperature.title = "Click to View Descending order of City Temperatures";
        SortByTemperatureArrow.src = "/./assets/icons/general-icons/arrowDown.svg";
        SortByTemperatureArrow.alt = "Down Arrow Icon";
      }
      if (tempImgName == "Down Arrow Icon") {
        cityObjArray.forEach(checkSameContinent);
        sortByTemperature.title = "Click to View Ascending order of City Temperatures";
        SortByTemperatureArrow.src = "/./assets/icons/general-icons/arrowUp.svg";
        SortByTemperatureArrow.alt = "Up Arrow Icon";
      }
    }

    // Loop for sending city Objects to displayCard
    for (let i = 0; i < 12; i++) {
      if (sortType == "Cont") { displayCard(cityObjArray[i]); }
      if (sortType == "Temp") { displayCard(newCityArray[i]); }
    }
  }
})