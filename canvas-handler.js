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
    if(touchEnabled(event) && rendererState.processClick) {
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
window.onkeypress = event => {
    if(paused || !rendererState) {
        return;
    }
    if(rendererState.processKey) {
        rendererState.processKey(event.key);
    }
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
    console.log("Canvas handler: Pasued renderer");
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
