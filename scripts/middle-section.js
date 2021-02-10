"use strict";

// Utilities  module contains createElement functions
import { createElementWithClassAppend, createImage } from './utilities.js';

// Initialize module contains JSON fetching
import { initializeJSON } from './initialize-json.js';
let jsonData = initializeJSON();

// Clock Module contains displaying time and date 
import { clock } from './clock.js';

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
	function createCard(city, wIconName) {
		// City Card
		let cityBox = createElementWithClassAppend('div', "citycard", "", middleContainer);

		// City Name
		let cardRow1 = createElementWithClassAppend('div', "card-row1", "", cityBox);
		createElementWithClassAppend('div', "city", city.cityName, cardRow1);

		Temperature();

		let { hr, min, sec, ampmSpan, cityDate } = Time();
		setInterval(function () { clock(city.timeZone, hr, min, sec, ampmSpan, cityDate, "middle"); }, 1000);

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
			createElementWithClassAppend('div', "temp", city.temperature, row1Right);
		}

		/**
		 * Current Time of the city
		 */
		function Time() {
			let cityTime = createElementWithClassAppend('div', "card-time textStrong", "", cityBox);
			let cityDate = createElementWithClassAppend('div', "card-date", "", cityBox);
			let hr = createElementWithClassAppend('span', "", "", cityTime);
			let min = createElementWithClassAppend('span', "", " &colon; ", cityTime);
			let sec;
			let ampmSpan = createElementWithClassAppend('span', "", "", cityTime);
			return { hr, min, sec, ampmSpan, cityDate };
		}

		/**
		 * Displays Humidity Icon and Value of the City
		 */
		function humidity() {
			let humIcon = createImage("./assets/icons/weather-icons/humidityIcon.svg", "HumidityIcon");
			let cityHumidity = createElementWithClassAppend('div', "card-humidity", humIcon, cityBox);
			createElementWithClassAppend('span', "", city.humidity, cityHumidity);
		}

		/**
		 * Displays Precipitation Icon and Value of the city
		 */
		function precipitation() {
			let precipIcon = createImage("./assets/icons/weather-icons/precipitationIcon.svg", "PrecipitationIcon");
			let cityPrecipitation = createElementWithClassAppend('div', "card-precipitation", precipIcon, cityBox);
			createElementWithClassAppend('span', "", city.precipitation, cityPrecipitation);
		}

		/**
		 * Displays Icon of the City
		 */
		function cityIcon() {
			let cityname = city.cityName.toLowerCase();
			let cityImg = createImage(`../assets/icons/city-icons/${cityname}.svg`, "cityIcon");
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
			// Temperature, Humidity and Precipitation Value of the city
			let temp = parseInt(data[city].temperature.slice(0, data[city].temperature.length - 2));
			let hum = parseInt(data[city].humidity.slice(0, data[city].humidity.length - 1));
			let precip = parseInt(data[city].precipitation.slice(0, data[city].precipitation.length - 1));

			switch (pref_weather) {
				case "Sunny": if (temp > 29 && hum < 50 && precip >= 50) {
					selectedCities.push({ city: data[city], wval: temp, wname: "sunny" });
				}
					break;

				case "snowy": if ((temp > 20 && temp < 28) && hum > 50 && precip < 50) {
					selectedCities.push({ city: data[city], wval: temp, wname: "snowflake" });
				}
					break;

				case "Rainy": if (temp < 20 && hum >= 50) {
					selectedCities.push({ city: data[city], wval: temp, wname: "rainy" });
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



