"use strict";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
const heightByWidth = canvas.height / canvas.width;
const widthByHeight = canvas.width / canvas.height;

let electron = null;
let electronWindow = null;
if(typeof(require) !== "undefined") {
    electron = require("electron");
    electronWindow = electron.remote.getCurrentWindow();
}
steamSetup();

let lastRelativeX = -1;
let lastRelativeY = -1;
const keyEventModes = {
    downOnly: Symbol("downOnly"),
    none: Symbol("none"),
    upAndDown: Symbol("upAndDown")
}
const pointerEventModes = {
    upOnly: Symbol("upOnly"),
    none: Symbol("none"),
    upAndDown: Symbol("upAndDown")
}
const keyEventTypes = {
    keyDown: Symbol("keyDown"),
    keyUp: Symbol("keyUp"),
}
const pointerEventTypes = {
    pointerUp: Symbol("pointerUp"),
    pointerDown: Symbol("pointerDown")
}
let pointerEventMode = keyEventModes.none;
let keyEventMode = pointerEventModes.none;

const pictureModeElement = document.getElementById("picture-mode-element");

const defaultSizeMode = "fit";

let canvasSizeMode = localStorage.getItem("canvasSizeMode") || defaultSizeMode;

let pictureModeElementTimeout = null;


let rendererState = null;
let animationFrame = null;
let paused = false;
let backgroundStreamMode = false;

if(localStorage.getItem("backgroundStreamMode") === "true") {
    backgroundStreamMode = true;
}
if(electron) {
    if(localStorage.getItem("windowIsFullScreen") === "true") {
        electronWindow.setFullScreen(true);
    }
}

const sizeModeDisplayNames = {
    "fit":"fill",
    "stretch":"stretch",
    "center":"1:1 scale"
}

function getRelativeEventLocation(event) {
    return {
        x: Math.floor(
            event.layerX / canvas.clientWidth * canvas.width
        ),
        y: Math.floor(
            event.layerY / canvas.clientHeight * canvas.height
        )
    }
}
function touchEnabled(event) {
    return !paused && event.isPrimary && rendererState;
}
function SetPageTitle(title) {
    document.title = title;
}
function routeKeyEvent(event,type) {
    switch(keyEventMode) {
        case keyEventModes.none:
            break;
        case keyEventModes.downOnly:
            if(type === keyEventTypes.keyDown) {
                rendererState.processKey(event.code);
            }
            break;
        case keyEventModes.upAndDown:
            switch(type) {
                case keyEventTypes.keyDown:
                    rendererState.processKey(event.code);
                    break;
                case keyEventTypes.keyUp:
                    rendererState.processKeyUp(event.code);
                    break;
            }
            break;
    }
}
function routePointerEvent(event,type) {
    const relativeEventLocation = getRelativeEventLocation(
        event
    );
    lastRelativeX = relativeEventLocation.x;
    lastRelativeY = relativeEventLocation.y;
    switch(pointerEventMode) {
        case pointerEventModes.none:
            break;
        case pointerEventModes.upOnly:
            if(type === pointerEventTypes.pointerUp) {
                rendererState.processClick(
                    relativeEventLocation.x,
                    relativeEventLocation.y
                );
            }
            break;
        case pointerEventModes.upAndDown:
            switch(type) {
                case pointerEventTypes.pointerUp:
                    rendererState.processClickEnd(
                        relativeEventLocation.x,
                        relativeEventLocation.y
                    );
                    break;
                case pointerEventTypes.pointerDown:
                    rendererState.processClick(
                        relativeEventLocation.x,
                        relativeEventLocation.y
                    );
                    break;
            }
            break;
    }
}
canvas.onpointerup = event => {
    if(touchEnabled(event) && event.button === 0) {
        routePointerEvent(event,pointerEventTypes.pointerUp);
    }
}
canvas.onpointerdown = event => {
    if(touchEnabled(event) && event.button === 0) {
        routePointerEvent(event,pointerEventTypes.pointerDown);
    }
}
canvas.onpointermove = processMouseMove;
function processMouseMove(event) {
    if(touchEnabled(event)) {
        const relativeEventLocation = getRelativeEventLocation(
            event
        );
        lastRelativeX = relativeEventLocation.x;
        lastRelativeY = relativeEventLocation.y;
        if(rendererState.processMove) {
            rendererState.processMove(
                relativeEventLocation.x,
                relativeEventLocation.y
            );  
        }
    }
}
window.onkeydown = event => {
    switch(event.code) {
        case "F11":
            if(!electron) {
                break;
            }
            const isFullScreen = !electronWindow.isFullScreen();
            electronWindow.setFullScreen(isFullScreen);
            if(pictureModeElementTimeout) {
                clearTimeout(pictureModeElementTimeout);
            }
            pictureModeElement.textContent = isFullScreen ? "fullscreen" : "not fullscreen";
            pictureModeElementTimeout = setTimeout(()=>{
                pictureModeElement.textContent = "";
                pictureModeElementTimeout = null;
            },600);
            localStorage.setItem("windowIsFullScreen",isFullScreen);
            break;
        case "KeyP":
        case "F10":
            cycleSizeMode();
            break;
        case "KeyO":
        case "F9":
            backgroundStreamMode = !backgroundStreamMode;
            if(pictureModeElementTimeout) {
                clearTimeout(pictureModeElementTimeout);
            }
            pictureModeElement.textContent = `stream mode ${backgroundStreamMode ? "on" : "off"}`
            pictureModeElementTimeout = setTimeout(()=>{
                pictureModeElement.textContent = "";
                pictureModeElementTimeout = null;
            },600);
            localStorage.setItem("backgroundStreamMode",backgroundStreamMode) 
            break;
    }
    if(paused || !rendererState) {
        return;
    }
    routeKeyEvent(event,keyEventTypes.keyDown);
}
window.onkeyup = event => {
    if(paused || !rendererState) {
        return;
    }
    routeKeyEvent(event,keyEventTypes.keyUp);
}
function applySizeMode() {
    switch(canvasSizeMode) {
        default:
        case "fit":
            if(window.innerWidth / window.innerHeight > widthByHeight) {
                const newWidth = window.innerHeight * widthByHeight;

                canvas.style.height = window.innerHeight + "px";
                canvas.style.width = newWidth + "px";

                canvas.style.top = "0px";
                canvas.style.left = (window.innerWidth / 2) - (newWidth / 2) + "px";
            } else {
                const newHeight = window.innerWidth * heightByWidth;

                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = newHeight + "px";

                canvas.style.top = ((window.innerHeight / 2) - (newHeight / 2)) + "px";
                canvas.style.left = "0px";
            }
            break;
        case "stretch":
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            canvas.style.left = "0px";
            canvas.style.top = "0px";
            break;
        case "center":
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.style.left = ((window.innerWidth / 2) - (canvas.width / 2)) + "px";
            canvas.style.top = "4vh";
            break;
    }
}
function cycleSizeMode() {
    let newMode = defaultSizeMode;
    switch(canvasSizeMode) {
        default:
        case "fit":
            newMode = "center";
            break;
        case "stretch":
            newMode = "fit";
            break;
        case "center":
            newMode = "stretch";
            break;
    }
    if(pictureModeElementTimeout) {
        clearTimeout(pictureModeElementTimeout);
    }
    pictureModeElement.textContent = sizeModeDisplayNames[newMode];
    pictureModeElementTimeout = setTimeout(()=>{
        pictureModeElement.textContent = "";
        pictureModeElementTimeout = null;
    },600);
    canvasSizeMode = newMode;
    applySizeMode();
    localStorage.setItem("canvasSizeMode",newMode);
    console.log(`Canvas handler: Set size mode to '${newMode}'`);
}
function render(timestamp) {
    if(!paused) {
        animationFrame = window.requestAnimationFrame(render); 

        const gamepads = navigator.getGamepads();
        for(let i = 0;i<gamepads.length;i++) {
            if(gamepads[i] && gamepads[i].mapping === "standard") {
                processGamepad(gamepads[i]);
                break;
            }
        }

        rendererState.render(timestamp);
    }
}

function stopRenderer() {
    if(!rendererState) {
        console.warn("Warning: The renderer is already stopped and cannot be stopped further.");
        return;
    }
    window.cancelAnimationFrame(animationFrame);
    rendererState = null;
    console.log("Renderer stopped");
}

function startRenderer() {
    paused = false;
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot start.");
        return;
    }
    animationFrame = window.requestAnimationFrame(render);
    if(rendererState.start) {
        rendererState.start(performance.now());
    }
    console.log("Canvas handler: Renderer started");
}

function setRendererState(newRendererState) {
    rendererState = newRendererState;
    if(rendererState.processKey) {
        if(rendererState.processKeyUp) {
            keyEventMode = keyEventModes.upAndDown;
        } else {
            keyEventMode = keyEventModes.downOnly;
        }
    } else {
        console.warn("Canvas handler: This renderer state is possibly misconfigured for key events");
        keyEventMode = keyEventModes.none;
    }
    if(rendererState.processClick) {
        if(rendererState.processClickEnd) {
            pointerEventMode = pointerEventModes.upAndDown;
        } else {
            pointerEventMode = pointerEventModes.upOnly;
        }
    } else {
        console.warn("Canvas handler: This renderer state is possibly misconfigured for pointer events");
        pointerEventMode = pointerEventModes.none;
    }
}

function pauseRenderer() {
    paused = true;
    window.cancelAnimationFrame(animationFrame);
    console.log("Canvas handler: Paused renderer");
}

function forceRender() {
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot render.");
        return;
    }
    rendererState.render(
        context,performance.now()
    );
}

window.onresize = applySizeMode;
applySizeMode();
