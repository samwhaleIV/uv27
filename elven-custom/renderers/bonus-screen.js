"use strict";
function BonusScreenRenderer(endCallback) {
    this.endCallback = endCallback;
    this.fader = getFader();
    this.processClick = () => {
        if(!this.transitioning) {
            playSound("click.mp3");
            this.endCallback();
        }
    }

    this.processKey = key => {
        switch(key) {
            case "Enter":
            case "Space":
                if(!this.transitioning) {
                    this.endCallback();
                }
                break;
        }
    }
    this.render = timestamp => {
        context.clearRect(0,0,fullWidth,fullHeight);
        drawTextWhite("you aren't supposed to be here yet",15,15,3);
        this.fader.render(timestamp);
    }
}
