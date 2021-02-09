"use strict";

/**
 * creates HTML Element Dynamically
 * @param {string} type HTML element - div/span/...
 * @param {string} className class name for that element 
 * @param {string} content content inside that element
 * @param {object} parentElement where this element need to be appended
 * @return {object} element - Created HTML element 
 */
export function createElementWithClassAppend(type, className, content, parentElement) {
    let element = document.createElement(type);
    element.className = className;
    if (typeof content == "object") {
        element.appendChild(content);
    }
    else {
        element.innerHTML = content;
    }
    parentElement.appendChild(element);
    return element;
}

/**
 * Create an Image HTML element
 * @param {string} srclink Link of the Image file for src attribute
 * @param {string} altname Alternate name for Image for alt attribute
 * @return {object} img - created Image Element
 */
export function createImage(srclink, altname) {
    let img = document.createElement('img');
    img.src = srclink;
    img.alt = altname;
    return img;
}