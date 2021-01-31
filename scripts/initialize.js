"use strict";


let dataobj = fetch("../data/data.json")
.then(function(resp) {
    return resp.json();
})
.then(function(data){
    return data;
})

console.log("inside initialize outside fetch" + typeof dataobj);


