"use strict";

// Utilities  module contains createElement functions
import {createElementWithClassAppend,createImage} from './utilities.js';


// Initialize module contains JSON fetching
//import {data} from './initialize.js';


//variables used between functions
let intervalID; 
let cityobj;
let inputTimezone;
let currentHr;

//DOM elements
let cityinput = document.getElementById("cityinput");
let cityoptions = document.getElementById("cityoptions");
let cityicon = document.getElementById("cityicon");
let hr = document.getElementById("hr");
let min = document.getElementById("min");
let sec = document.getElementById("seconds");
let ampm = document.getElementById("ampm");
let cel = document.getElementById("celcius");
let hum = document.getElementById("humidity");
let fah = document.getElementById("farenheit");
let precip = document.getElementById("precipitation");
let timeline = document.getElementById("timeline");

//Hourly weather Timeline 

function hourlyWeather (whrVal,wtempVal) {
    console.log("hw: "+ whrVal + "," + wtempVal);
    let tBox = createElementWithClassAppend('div' , "timeline-hr-container" , "" , timeline);
    if (whrVal == "NOW") {
    }
    else if (whrVal >= 0 && whrVal < 12) {
        whrVal = whrVal + " AM";
    }
    else if (whrVal == 12) {
        whrVal = whrVal + " PM";
    }
    else if (whrVal > 12 && whrVal < 24){
        whrVal = (whrVal % 12) + " PM";
    }
    

    let whr = createElementWithClassAppend('div' , "w w-hr" , whrVal , tBox);
    let wIndicator = createElementWithClassAppend('div' , "w w-indicator" , "|" , tBox);
    let wImg;
    
    switch (true) {
        case (wtempVal >= 23 && wtempVal <=29):
            wImg = createImage("./assets/icons/weather-icons/cloudyIcon.svg" , "CloudyIcon");
            break;
        case (wtempVal <=18):
            wImg = createImage("./assets/icons/weather-icons/rainyIcon.svg" , "RainyIcon");
            break;
        case (wtempVal >= 18 && wtempVal <=22):
            wImg = createImage("./assets/icons/weather-icons/windyIcon.svg" , "WindyIcon");
            break;
        case (wtempVal >=29):
            wImg = createImage("./assets/icons/weather-icons/sunnyIcon.svg" , "SunnyIcon");
            break;
        default:
            let weather = ["cloudy" , "humidity" , "precipitation" , "rainy" , "snowflake" , "sunny" , "windy"];
            wImg = createImage("./assets/icons/weather-icons/"+ weather[Math.floor(Math.random() * weather.length )] + "Icon.svg" , "WeatherIcon");
    }
    let wIcon = createElementWithClassAppend('div' , "w w-icon" , wImg , tBox);
    let wValue = createElementWithClassAppend('div' , "w w-value" , wtempVal , tBox);
    let wSeparator = createElementWithClassAppend('div' , "w w-time-separator" , "|" , tBox);
}

////////////////////////////// iife
//function initialize(){
(function () {

    cityicon.src = `../assets/icons/city-icons/alt-city-icon.png`;
    ampm.src = "./assets/icons/general-icons/amState.svg";
    let d = new Date();

    hourlyWeather("NOW" , "Nil");
    for (let i=0; i < 24; i++) {
        hourlyWeather(d.getHours() + i + 1,"Nil");
    }

    cel.innerHTML = "<strong>&UnderBar;&UnderBar;  &deg; </strong>";
    hum.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";
    fah.innerHTML = "<strong>&UnderBar;&UnderBar;  F</strong>";
    precip.innerHTML = "<strong>&UnderBar;&UnderBar; </strong> %";

}
)();
//initialize();

//Clock and Date
function clock() {
    
    let localdate = new Date();
    let newDate;
    if(cityobj == "undefined"){
        newDate = new Date();
    }
    else {
        let newDateString = localdate.toLocaleString('en-US',{ timeZone: inputTimezone });
        newDate = new Date(newDateString);
    }
    
    let h = newDate.getHours();
    let m = newDate.getMinutes();
    let s = newDate.getSeconds();
    currentHr = h;
    m = checkTime(m);
    s = checkTime(s);
    
    function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
    }
    
    hr.innerHTML = (function () {
        if (h > 12) {
            return h % 12;
        }
        else {
            return h;
        }
    })();
    min.innerHTML = " &colon; " + m;
    sec.innerHTML = " &colon; " + s;

    
    if (h<12) {
        ampm.src = "./assets/icons/general-icons/amState.svg";
    }
    else {
        ampm.src = "./assets/icons/general-icons/pmState.svg";
    }
    
    //Date
    let dateStr = newDate.toLocaleDateString();
    let dateArr = dateStr.split("/");
    let displayDate = document.getElementById("date");

    const months = [
        'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun',
        'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec' ];
    let mon = dateArr[0];
    displayDate.innerHTML = `${dateArr[1]}-${months[mon-1]}-${dateArr[2]}` ;

    return h;
}

if(intervalID) {
    clearInterval(intervalID);   
}
intervalID = setInterval(clock, 1000);


//JSON fetching

fetch("../data/data.json")
.then(function(resp) {
    return resp.json();
})
.then(function(data) {

/*For displaying city options*/
let citylistArray = Object.keys(data);
for (let city of citylistArray){
    let option = document.createElement('option'); 
    option.value = data[city]['cityName'];
    cityoptions.appendChild(option);
}


// If correct city name is given
cityinput.addEventListener("input",display);

function display(){
    
  cityobj = data[cityinput.value.toLowerCase()];  //if it is not present in data,Then value - undefined

  if (typeof cityobj != "undefined") {
    
    cityinput.style.border = "none";
    cityinput.style.textDecoration = "none";
    document.getElementById("validateMsg").style.display = "none";

    //City Icon
    let cityname = cityobj.cityName.toLowerCase();
    cityicon.src = `../assets/icons/city-icons/${cityname}.svg`;

    //Time 
    inputTimezone = data[cityname]['timeZone'];
    
    //Main Weather Report
    
    let humVal = cityobj.humidity;
    let precipVal = cityobj.precipitation;
    cel.innerHTML = "<strong>" + cityobj.temperature + "</strong>";
    hum.innerHTML = "<strong>" + humVal.slice(0 , humVal.length - 1) + "</strong>" + humVal[humVal.length - 1];
    fah.innerHTML = "<strong>" + ((parseInt(cityobj.temperature) * 1.8 ) + 32 ) + "</strong>";
    precip.innerHTML = "<strong>" + precipVal.slice(0 , precipVal.length - 1) + "</strong>" + precipVal[precipVal.length - 1];

   
    timeline.innerHTML="";
    // while(timeline.firstElementChild) {
    //     alert("hi");
    //     timeline.removeChild(timeline.firstElementchild);
    // }

    // timeline.parentNode.removeChild(timeline);

    hourlyWeather("NOW" , parseInt( cityobj.temperature.slice(0 , cityobj.temperature.length - 1) ));
    let whrVal =  clock() + 1;
    for (let temp of cityobj.nextFiveHrs) {
        //currentHr (current hour) is not working properly
        console.log("index:"+ cityobj.nextFiveHrs.indexOf(temp));
        let wtempVal = parseInt( temp.slice(0 , temp.length - 1) );
        hourlyWeather( whrVal , wtempVal);
        whrVal++;
    }


  }
  else {
      //alert("entered");
      cityinput.style.border = "2px solid red";
      document.getElementById("validateMsg").style.display = "block";
    //If needed Validation for incomplete city name can be added
  } 

} //close brace for display function
   
})


