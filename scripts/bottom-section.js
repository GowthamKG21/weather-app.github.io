"use strict";

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
})