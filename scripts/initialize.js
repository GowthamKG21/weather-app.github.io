"use strict";

export var data;
fetch("../data/data.json")
.then(function(resp) {
    return resp.json();
})
.then(function(data) {
    data = data;
})

