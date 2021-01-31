"use strict";

// Utilities  module contains createElement functions
import {createElementWithClassAppend , createImage} from './utilities.js';

// Initialize module contains JSON fetching
//import {initializeJSON} from './initialize.js';
// let data = initializeJSON();

//Clock Module for time and date 
import {clock} from './clock.js';


let scrollBtn = document.getElementsByClassName("arrow-button");
middleContainer.style.scrollBehavior = "smooth";

let scrollBack = document.getElementById("scrollBack");
scrollBack.addEventListener('click' , function(event) {
    console.log("leftscroll");
    middleContainer.scrollLeft -= 250;
} );
let scrollNext = document.getElementById("scrollNext");
scrollNext.addEventListener('click' , function(event) {
    console.log("rightscroll");
    middleContainer.scrollLeft += 250;
} );

function checkScroll() { 
    let ele = middleContainer;
    let isOverflowing = ele.scrollWidth == ele.clientWidth; 
    if (isOverflowing) {
        scrollBtn[0].style.display = "none"; 
        scrollBtn[1].style.display = "none"; 
        
    }
    else{
        scrollBtn[0].style.display = "block"; 
        scrollBtn[1].style.display = "block"; 
    }
        
} 
setInterval(checkScroll,1000);


fetch("../data/data.json")
.then(function(resp) {
    return resp.json();
})
.then(function(data){
   
// Adding Event Listeners to User Preference Selectors 
let middleContainer = document.getElementById("middleContainer");
let intervalID;

let sunnyBtn = document.getElementById("sunnyBtn");
sunnyBtn.addEventListener("click" , function(){ toggleBtn("Sunny") } );
let snowflakeBtn = document.getElementById("snowflakeBtn");
snowflakeBtn.addEventListener("click" , function(){ toggleBtn("Snowflake") } );
let rainyBtn = document.getElementById("rainyBtn");
rainyBtn.addEventListener("click" , function(){ toggleBtn("Rainy") } );
let displayCount = document.getElementById("displayCount");
displayCount.addEventListener("input" , function(){ displayTopCities(this.value) } );



//Method for creating Card for City
function createCard(city,wIconName) {
   
    let cityBox = createElementWithClassAppend('div' , "citycard" , "" , middleContainer);
    let cardRow1 = createElementWithClassAppend('div' , "card-row1" , "" , cityBox);
    let cityName = createElementWithClassAppend('div' , "city" , city.cityName , cardRow1);
    let row1Right = createElementWithClassAppend('div' , "row1-right" , "" , cardRow1);
    
    let wImg = createImage("./assets/icons/weather-icons/" + wIconName + "Icon.svg" , "CloudyIcon");
    let weatherIcon = createElementWithClassAppend('div' , "weather-icon" , wImg , row1Right);

    let temp = createElementWithClassAppend('div' , "temp" , city.temperature , row1Right);
    
    let cityTime = createElementWithClassAppend('div' , "card-time textStrong" , "" , cityBox);
    let cityDate = createElementWithClassAppend('div' , "card-date" , "" , cityBox);
    
    let hr = createElementWithClassAppend('span' , "" , "" , cityTime);
    let min = createElementWithClassAppend('span' , "" , " &colon; " , cityTime);
    let sec;
    //let sec = createElementWithClassAppend('span' , "" , " : " , cityTime);
    /*let ampm = createImage("" , "am/pm Icon");
    ampm.style.width = "2em";
    ampm.style.paddingLeft = "5px";*/
    
    let ampmSpan = createElementWithClassAppend('span' , "" , "" , cityTime);
    //ampmSpan.style.boxSizing = "border-box";

    
    // if(intervalID) {
    //     console.log("id= " + intervalID);
    //     clearInterval(intervalID); 

    // }
    intervalID = setInterval(function() {clock(city.timeZone , hr, min , sec ,  ampmSpan , cityDate , "middle"); }, 1000);
    
    
    let humIcon = createImage("./assets/icons/weather-icons/humidityIcon.svg" , "HumidityIcon");
    let cityHumidity = createElementWithClassAppend('div' , "card-humidity" , humIcon , cityBox);
    let humValue = createElementWithClassAppend('span' , "" , city.humidity , cityHumidity);

    let precipIcon = createImage("./assets/icons/weather-icons/precipitationIcon.svg" , "PrecipitationIcon");
    let cityPrecipitation = createElementWithClassAppend('div' , "card-precipitation" , precipIcon , cityBox);
    let precipValue = createElementWithClassAppend('span' , "" , city.precipitation , cityPrecipitation);

    let cityname = city.cityName.toLowerCase();
    let cityImg =  createImage(`../assets/icons/city-icons/${cityname}.svg` , "cityIcon"); 
    let cityImgDiv = createElementWithClassAppend('div' , "card-city-icon" , cityImg , cityBox);
    
}

let selectedCities = [];
//Function for choosing which cities need to displayed in city Container
function cityContainer(pref_weather) {
    middleContainer.innerHTML = "";
    let citylistArray = Object.keys(data);
    selectedCities = [];
    for (let city of citylistArray){
        
        let temp = parseInt( data[city].temperature.slice(0 , data[city].temperature.length - 2) );
        let hum = parseInt( data[city].humidity.slice(0 , data[city].humidity.length - 1) );
        let precip = parseInt( data[city].precipitation.slice(0 , data[city].precipitation.length - 1) );
        
        switch(pref_weather) {
            case "Sunny" :  if (temp > 29 && hum < 50 && precip >= 50){
                               //createCard(data[city] , "sunny");
                                selectedCities.push({ city : data[city] , wval : temp , wname : "sunny" });
                            }
                            break;
            
            case "Snowflake" :  if ((temp > 20 && temp < 28) && hum > 50 && precip < 50){
                                //createCard(data[city] , "snowflake");
                                selectedCities.push({ city : data[city] , wval : temp , wname : "snowflake" });
                            }
                            break;

            case "Rainy" :  if (temp < 20 && hum >= 50 ){
                                //createCard(data[city] , "rainy");
                                selectedCities.push({ city : data[city] , wval : temp , wname : "rainy" });
                            }
                            break;
        }
        
    } 
    
    selectedCities.sort(function(a,b){ return b.wval - a.wval});
    displayCount.value = 3;
    displayTopCities(3);
}



function displayTopCities(count) {
    middleContainer.innerHTML = "";
    let displayCities = selectedCities.filter( (selectedCities,id) => id < count) ;
    displayCities.forEach( function (item,index) {
        createCard(item.city , item.wname);
    } );
    
    //console.log(displayCities[].city);
    //displayCities.every(createCard(this.city , this. weather));
}

//Toggle Button Mode for user preference selector weather
function toggleBtn(btn) {
    switch(btn) {
        case "Sunny" :  sunnyBtn.style.borderBottom = "2px solid var(--light-blue-border)" ;
                        snowflakeBtn.style.borderBottom = "none";
                        rainyBtn.style.borderBottom = "none";
                        cityContainer("Sunny");
                        break;
        
        case "Snowflake" :  sunnyBtn.style.borderBottom = "none" ;
                        snowflakeBtn.style.borderBottom = "2px solid var(--light-blue-border)";
                        rainyBtn.style.borderBottom = "none";
                        cityContainer("Snowflake");
                        break;
              
        case "Rainy" :  sunnyBtn.style.borderBottom = "none" ;
                        snowflakeBtn.style.borderBottom = "none";
                        rainyBtn.style.borderBottom = "2px solid var(--light-blue-border)";
                        cityContainer("Rainy");
                        break;

    }
    
}
  
//Triggering Event Programatically
var event = new Event('click');
sunnyBtn.dispatchEvent(event);


})



