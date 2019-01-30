"use strict";
const canvas = document.getElementById("canvas");
const getRelativeEventLocation = event => {
    return {
        x: Math.floor(
            event.layerX / canvas.clientWidth * canvas.width
        ),
        y: Math.floor(
            event.layerY / canvas.clientHeight * canvas.height
        )
    }
}
const touchEnabled = event => {
    return !paused && event.isPrimary && rendererState;
}

canvas.onpointerup = event => {
    if(touchEnabled(event) && event.button === 0 && rendererState.processClick) {
        const relativeEventLocation = getRelativeEventLocation(
            event
        );
        rendererState.processClick(
            relativeEventLocation.x,
            relativeEventLocation.y
        );
    }
}

let lastRelativeX = -1, lastRelativeY = -1;
const processMouseMove = event => {
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

canvas.onpointerdown = processMouseMove;
canvas.onpointermove = processMouseMove;
window.onkeydown = event => {
    switch(event.code) {
        case "KeyP":
            cycleSizeMode();
            break;
        case "KeyO":
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
    if(rendererState.processKey) {
        rendererState.processKey(event.code);
    }
}

const pictureModeElement = document.getElementById("picture-mode-element");

const canvasHeightToWidth = canvas.height / canvas.width;
const canvasWidthToHeight = canvas.width / canvas.height;

const defaultSizeMode = "fit";

let canvasSizeMode = localStorage.getItem("canvasSizeMode") || defaultSizeMode;

const applySizeMode = () => {
    switch(canvasSizeMode) {
        default:
        case "fit":
            if(window.innerWidth / window.innerHeight > canvasWidthToHeight) {
                const newWidth = window.innerHeight * canvasWidthToHeight;

                canvas.style.height = window.innerHeight + "px";
                canvas.style.width = newWidth + "px";

                canvas.style.top = "0px";
                canvas.style.left = (window.innerWidth / 2) - (newWidth / 2) + "px";
            } else {
                const newHeight = window.innerWidth * canvasHeightToWidth;

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
window.onresize = applySizeMode;
applySizeMode();
let pictureModeElementTimeout = null;
const cycleSizeMode = () => {
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
const sizeModeDisplayNames = {
    "fit":"fill",
    "stretch":"stretch",
    "center":"1:1 scale"
}

const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;

let rendererState, animationFrame, paused = false, backgroundStreamMode = false;

if(localStorage.getItem("backgroundStreamMode") === "true") {
    backgroundStreamMode = true;
}

const gamepadDeadzone = 0.5;
const deadzoneNormalizer = 1 / (1 - gamepadDeadzone);
const applyDeadZone = value => {
    if(value < 0) {
        value = value + gamepadDeadzone;
        if(value > 0) {
            value = 0;
        } else {
            value *= deadzoneNormalizer;
        }
    } else {
        value = value - gamepadDeadzone;
        if(value < 0) {
            value = 0;
        } else {
            value *= deadzoneNormalizer;
        }
    }
    return value;
}

const fakeButtonPressEvent = {pressed:true};
const buttonStates = {}, buttonRollverTimeout = 150, axisRolloverTimeout = 325;
const processButton = (name,action,button,timestamp,isAxis) => {
    if(button.pressed) {
        if(!buttonStates[name]) {
            buttonStates[name] = {timestamp:timestamp};
            action();
        } else if(timestamp >= buttonStates[name].timestamp + (isAxis ? axisRolloverTimeout : buttonRollverTimeout)) {
            buttonStates[name].timestamp = timestamp;
            action();
        }
    } else {
        delete buttonStates[name];
    }
};

const processGamepad = gamepad => {

    processButton("LeftBumper",()=>{
        window.onkeydown({code:"LeftBumper"});
    },gamepad.buttons[4],gamepad.timestamp);

    processButton("RightBumper",()=>{
        window.onkeydown({code:"RightBumper"});
    },gamepad.buttons[5],gamepad.timestamp);

    processButton("a",()=>{
        window.onkeydown({code:"Enter"});
    },gamepad.buttons[0],gamepad.timestamp);

    processButton("y",()=>{
        window.onkeydown({code:"KeyP"});
    },gamepad.buttons[3],gamepad.timestamp);

    processButton("b",()=>{
        window.onkeydown({code:"Escape"});
    },gamepad.buttons[1],gamepad.timestamp);

    processButton("up",()=>{
        window.onkeydown({code:"KeyW"});
    },gamepad.buttons[12],gamepad.timestamp);

    processButton("down",()=>{
        window.onkeydown({code:"KeyS"});
    },gamepad.buttons[13],gamepad.timestamp);

    processButton("left",()=>{
        window.onkeydown({code:"KeyA"});
    },gamepad.buttons[14],gamepad.timestamp);

    processButton("right",()=>{
        window.onkeydown({code:"KeyD"});
    },gamepad.buttons[15],gamepad.timestamp);

    processButton("start",()=>{
        window.onkeydown({code:"Enter"});
    },gamepad.buttons[9],gamepad.timestamp);

    const leftXAxis = applyDeadZone(gamepad.axes[0]);
    const leftYAxis = applyDeadZone(gamepad.axes[1]);

    if(leftXAxis > 0) {
        processButton("leftXAxis",()=>{
            window.onkeydown({code:"KeyD"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else if(leftXAxis < 0) {
        processButton("leftXAxis",()=>{
            window.onkeydown({code:"KeyA"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else {
        delete buttonStates["leftXAxis"];
    }

    if(leftYAxis > 0) {
        processButton("leftYAxis",()=>{
            window.onkeydown({code:"KeyS"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else if(leftYAxis < 0) {
        processButton("leftYAxis",()=>{
            window.onkeydown({code:"KeyW"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else {
        delete buttonStates["leftYAxis"];
    }

    const rightXAxis = applyDeadZone(gamepad.axes[2]);
    const rightYAxis = applyDeadZone(gamepad.axes[3]);

    if(rightXAxis > 0) {
        processButton("rightXAxis",()=>{
            window.onkeydown({code:"KeyD"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else if(rightXAxis < 0) {
        processButton("rightXAxis",()=>{
            window.onkeydown({code:"KeyA"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else {
        delete buttonStates["rightXAxis"];
    }

    if(rightYAxis > 0) {
        processButton("rightYAxis",()=>{
            window.onkeydown({code:"KeyS"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else if(rightYAxis < 0) {
        processButton("rightYAxis",()=>{
            window.onkeydown({code:"KeyW"});
        },fakeButtonPressEvent,gamepad.timestamp,true);
    } else {
        delete buttonStates["rightYAxis"];
    }
}

const render = timestamp => {
    rendererState.render(timestamp);
    if(!paused) {
        animationFrame = window.requestAnimationFrame(render);
        const gamepad = navigator.getGamepads()[0];
        if(gamepad) {
            processGamepad(gamepad);
        }
    }
};

const stopRenderer = function() {
    if(!rendererState) {
        console.warn("Warning: The renderer is already stopped and cannot be stopped further.");
        return;
    }
    window.cancelAnimationFrame(animationFrame);
    rendererState = null;
    console.log("Renderer stopped");
}

const startRenderer = function() {
    paused = false;
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot start.");
        return;
    }
    animationFrame = window.requestAnimationFrame(render);
    console.log("Canvas handler: Renderer started");
}

const pauseRenderer = function() {
    paused = true;
    window.cancelAnimationFrame(animationFrame);
    console.log("Canvas handler: Paused renderer");
}

const forceRender = function() {
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot render.");
        return;
    }
    rendererState.render(
        context,performance.now()
    );
}
