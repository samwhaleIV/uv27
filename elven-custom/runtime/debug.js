"use strict";
function debug_cheat_everything() {
    localStorage.setItem("elfIndex",26);
    location.reload();
}
function debug_reset() {
    localStorage.clear();
    location.reload();
}
function debug_scroll_speed(seconds) {
    if(rendererState && rendererState.background) {
        console.log("The default scroll speed is 20 seconds");
        console.log("The number of seconds can be non-integer, e.g. 1.2, 0.9, 69.69");
        rendererState.background.cycleTime = seconds * 1000;
    }
}
