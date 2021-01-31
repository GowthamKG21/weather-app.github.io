"use strict";

//Clock and Date
export function clock(cityobj , hr , min , sec , ampm , displayDate , place) {
    

fetch("../data/data.json")
.then(function(resp) {
    return resp.json();
})
.then(function(data){


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
    
    let h = newDate.getHours();
    let m = newDate.getMinutes();
    let s = newDate.getSeconds();
    //currentHr = h;
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
    if (place != "middle") {
    sec.innerHTML = " &colon; " + s;
    }
    
    if (h<12) {
        
        if (place != "middle") {
            ampm.src = "./assets/icons/general-icons/amState.svg";
        }
        else {
            ampm.innerHTML = ' AM';
        }
        
    }
    else {

        if (place != "middle") {
            ampm.src = "./assets/icons/general-icons/pmState.svg";
        }
        else {
            ampm.innerHTML = ' PM';
        }
    }
    
    //Date
    let dateStr = newDate.toLocaleDateString();
    let dateArr = dateStr.split("/");
    //let displayDate = document.getElementById("date");

    const months = [
        'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun',
        'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec' ];
    let mon = dateArr[0];
    displayDate.innerHTML = `${dateArr[1]}-${months[mon-1]}-${dateArr[2]}` ;

    return h;


})

}

