"use strict";
function BonusScreenRenderer() {
    this.fader = getFader();
    this.render = timestamp => {
        drawTextWhite("you aren't supposed to be here yet",15,15,3);
        fader.render(timestamp);
    }
}
