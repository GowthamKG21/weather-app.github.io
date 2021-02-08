"use strict";

/**
 * Returns JSON object 
 * 
 * @link ../data/data.json
 * @return {object} jsonData data from json file in json object format
 */
export async function initializeJSON() {
    let response = await fetch("../data/data.json")
    let jsonData = await response.json();
    return jsonData;
}