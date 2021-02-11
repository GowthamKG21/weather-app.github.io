"use strict";

// City Prototype Module for city objects
import { CityTemplate } from './city-prototype.js';

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

// Initialize module contains JSON fetching
import { initializeJSON } from './initialize-json.js';
let jsonData = initializeJSON();

// Clock Module for time and date 
import { displayDate, displayTime } from './clock.js';

// DOM elements for Scroll arrows(Back,Next) of middle section city card container
let middleContainer = document.getElementById("middleContainer");
middleContainer.style.scrollBehavior = "smooth";
let scrollBtn = document.getElementsByClassName("arrow-button");

let scrollBack = document.getElementById("scrollBack");
scrollBack.addEventListener('click', () => {
	middleContainer.scrollLeft -= 250;
});
let scrollNext = document.getElementById("scrollNext");
scrollNext.addEventListener('click', () => {
	middleContainer.scrollLeft += 250;
});

/**
 * To Display Scroll Buttons if City Container overflows
 */
function checkScroll() {
	let ele = middleContainer;
	let isOverflowing = ele.scrollWidth == ele.clientWidth;
	if (isOverflowing) {
		scrollBtn[0].style.display = "none";
		scrollBtn[1].style.display = "none";
	}
	else {
		scrollBtn[0].style.display = "block";
		scrollBtn[1].style.display = "block";
	}
}

jsonData.then(function (data) {
	// Adding Event Listeners to User Preference Selectors 
	let sunnyBtn = document.getElementById("sunnyBtn");
	sunnyBtn.addEventListener("click", () => { toggleBtn("Sunny"); });
	let snowyBtn = document.getElementById("snowyBtn");
	snowyBtn.addEventListener("click", () => { toggleBtn("snowy"); });
	let rainyBtn = document.getElementById("rainyBtn");
	rainyBtn.addEventListener("click", () => { toggleBtn("Rainy"); });
	let displayCount = document.getElementById("displayCount");
	displayCount.addEventListener("input", function () { displayTopCities(this.value); });

	/**
	 * Creates and Displays City Card
	 * @param {object} city City Object 
	 * @param {string} wIconName current weather of the city
	 */
	function createCard(City, wIconName) {
		// City Card
		let cityBox = createElementWithClassAppend('div', "citycard", "", middleContainer);

		// City Name
		let cardRow1 = createElementWithClassAppend('div', "card-row1", "", cityBox);
		createElementWithClassAppend('div', "city", City.cityName, cardRow1);

		Temperature();

		/**
		 * Current Time of the city
		 */
		let cityTime = createElementWithClassAppend('div', "card-time textStrong", "", cityBox);
		let cityDate = createElementWithClassAppend('div', "card-date", "", cityBox);
		let hr = createElementWithClassAppend('span', "", "", cityTime);
		let min = createElementWithClassAppend('span', "", " &colon; ", cityTime);
		let sec;
		let ampmSpan = createElementWithClassAppend('span', "", "", cityTime);

		function clockRun() {
			displayTime(City.timeZone, hr, min, sec, ampmSpan, "text");
			displayDate(City.timeZone, cityDate);
		}
		setInterval(clockRun(), 1000);

		humidity();
		precipitation();
		cityIcon();

		/**
		 * Displays Weather Icon and Temperature Value of the city
		 */
		function Temperature() {
			let row1Right = createElementWithClassAppend('div', "row1-right", "", cardRow1);
			let wImg = createImage(`./assets/icons/weather-icons/${wIconName}Icon.svg`, "CloudyIcon");
			createElementWithClassAppend('div', "weather-icon", wImg, row1Right);
			createElementWithClassAppend('div', "temp", City.temperature, row1Right);
		}

		/**
		 * Displays Humidity Icon and Value of the City
		 */
		function humidity() {
			let humIcon = createImage("./assets/icons/weather-icons/humidityIcon.svg", "HumidityIcon");
			let cityHumidity = createElementWithClassAppend('div', "card-humidity", humIcon, cityBox);
			createElementWithClassAppend('span', "", City.humidity, cityHumidity);
		}

		/**
		 * Displays Precipitation Icon and Value of the city
		 */
		function precipitation() {
			let precipIcon = createImage("./assets/icons/weather-icons/precipitationIcon.svg", "PrecipitationIcon");
			let cityPrecipitation = createElementWithClassAppend('div', "card-precipitation", precipIcon, cityBox);
			createElementWithClassAppend('span', "", City.precipitation, cityPrecipitation);
		}

		/**
		 * Displays Icon of the City
		 */
		function cityIcon() {
			let cityImg = createImage(City.cityIconSrc, City.cityName);
			createElementWithClassAppend('div', "card-city-icon", cityImg, cityBox);
		}
	}

	let selectedCities = [];

	/**
	 * Chooses which cities need to displayed in city Container
	 * @param {string} pref_weather User Selected Weather name 
	 */
	function cityContainer(pref_weather) {
		middleContainer.innerHTML = "";
		let citylistArray = Object.keys(data);
		selectedCities = [];

		// Selects cities based on user selected weather
		for (let city of citylistArray) {
			let City = new CityTemplate(data[city]);

			// Temperature, Humidity and Precipitation Value of the city
			let temp = City.getTemperatureValue();
			let hum = City.getHumidityValue();
			let precip = City.getPrecipitationValue();

			switch (pref_weather) {
				case "Sunny": if (temp > 29 && hum < 50 && precip >= 50) {
					selectedCities.push({ city: City, wval: temp, wname: "sunny" });
				}
					break;

				case "snowy": if ((temp > 20 && temp < 28) && hum > 50 && precip < 50) {
					selectedCities.push({ city: City, wval: temp, wname: "snowflake" });
				}
					break;

				case "Rainy": if (temp < 20 && hum >= 50) {
					selectedCities.push({ city: City, wval: temp, wname: "rainy" });
				}
					break;
			}
		}
		selectedCities.sort(function (a, b) { return b.wval - a.wval });
		displayCount.value = 3;
		displayTopCities(3);
	}

	/**
	 * Limits count of the cities to be Displayed by User Input
	 * @param {number} count Number of cities to be displayed
	 */
	function displayTopCities(count) {
		middleContainer.innerHTML = "";
		if (count > 10) {
			count = 10;
			displayCount.value = 10;
		}
		if (count < 3) {
			count = 3;
		}
		let displayCities = selectedCities.filter((_selectedCities, id) => {
			return id < count;
		});
		displayCities.forEach(function (item) {
			createCard(item.city, item.wname);
		});
		checkScroll();
	}

	/**
	 * Selects Weather for Displaying cities
	 * @param {string} btn Weather name(sunny / Snowy / Rainy) 
	 */
	function toggleBtn(btn) {
		switch (btn) {
			case "Sunny": sunnyBtn.style.borderBottom = "2px solid var(--light-blue-border)";
				snowyBtn.style.borderBottom = "none";
				rainyBtn.style.borderBottom = "none";
				cityContainer("Sunny");
				break;

			case "snowy": sunnyBtn.style.borderBottom = "none";
				snowyBtn.style.borderBottom = "2px solid var(--light-blue-border)";
				rainyBtn.style.borderBottom = "none";
				cityContainer("snowy");
				break;

			case "Rainy": sunnyBtn.style.borderBottom = "none";
				snowyBtn.style.borderBottom = "none";
				rainyBtn.style.borderBottom = "2px solid var(--light-blue-border)";
				cityContainer("Rainy");
				break;
		}
	}

	// Sunny Weather by default while loading(Triggers Event)
	var event = new Event('click');
	sunnyBtn.dispatchEvent(event);
})
