"use strict";

// Initialize module contains JSON fetching
import {initializeJSON} from './initialize-json.js';
let jsonData = initializeJSON();

// Clock and Date
export function clock(cityobj , hr , min , sec , ampm , displayDate , place) {
    let h;

    jsonData.then(function(data){

    let localdate = new Date();
    let newDate;
    if(cityobj == "undefined"){
        newDate = new Date();
    }
    else {
        let inputTimezone = cityobj;
        let newDateString = localdate.toLocaleString('en-US',{ timeZone: inputTimezone });
        newDate = new Date(newDateString);
    }
    
    h = newDate.getHours();
    let m = newDate.getMinutes();
    let s = newDate.getSeconds();
    m = addZeroPrefix(m);
    s = addZeroPrefix(s);
    
    function addZeroPrefix(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }
    
    // Hours
    hr.innerHTML = (function () {
        if (h > 12) { return h % 12; }
        else { return h; }
    })();

    // Minutes
    min.innerHTML = " &colon; " + m;
    
    // Seconds
    if (place != "middle" && place != "bottom") {
        sec.innerHTML = " &colon; " + s;
    }
    
    // AM_PM
    if (h<12) { 
            if (place != "middle" && place != "bottom") {
                ampm.src = "./assets/icons/general-icons/amState.svg";
            }
            else {
                ampm.innerHTML = ' AM';
            }  
    }
    else {
            if (place != "middle" && place != "bottom") {
                ampm.src = "./assets/icons/general-icons/pmState.svg";
            }
            else {
                ampm.innerHTML = ' PM';
            }
    }
    
    // Date
    if(place != "bottom") {
        let dateStr = newDate.toLocaleDateString();
        let dateArr = dateStr.split("/");
        const months = [
            'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun',
            'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec' ];
        let mon = dateArr[0];
        displayDate.innerHTML = `${dateArr[1]}-${months[mon-1]}-${dateArr[2]}` ;
    }

})
  return h;
}
