"use strict";

export async function initializeJSON() {
    let response = await fetch("../data/data.json")
    let jsonData = await response.json();
    return jsonData;
}