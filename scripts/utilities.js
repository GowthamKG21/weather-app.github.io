"use strict";
export function createElementWithClassAppend(type, className,content,parentElement) {
    let element = document.createElement(type);
    element.className = className;
    if(typeof content == "object"){
        element.appendChild(content);
    }
    else{
        element.innerHTML = content;
    }
    parentElement.appendChild(element);
    return element;
}

export function createImage(srclink,altname){
    let img = document.createElement('img');
    img.src = srclink;
    img.alt = altname;
    return img;
}