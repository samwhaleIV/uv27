"use strict";
function BonusScreenRenderer(endCallback) {
    this.endCallback = endCallback;
    this.fader = getFader();
    let timeout = null;
    this.render = timestamp => {
        if(!timeout) {
            timeout = setTimeout(endCallback,15000);
        }
        context.clearRect(0,0,fullWidth,fullHeight);
        drawTextWhite("death is only the beginning of something new.",15,15,3);

        drawTextWhite("see you around.",15,45,3);
        this.fader.render(timestamp);
    }
}
