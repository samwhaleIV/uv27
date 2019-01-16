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
    if(event.code === "KeyP") {
        cycleSizeMode();
        return;
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

let rendererState, animationFrame, paused = false;

const render = timestamp => {
    rendererState.renderMethod(
        context,timestamp,canvas.width,canvas.height
    );
    if(!paused) {
        animationFrame = window.requestAnimationFrame(render);
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
    rendererState.renderMethod(
        context,performance.now()
    );
}
