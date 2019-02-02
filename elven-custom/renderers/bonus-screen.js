"use strict";
function BonusScreenRenderer(endCallback) {
    this.endCallback = endCallback;
    this.fader = getFader();

    let timeout = null;

    this.processClick = () => {
        if(!this.transitioning) {
            playSound("click.mp3");
            if(timeout !== null) {
                clearTimeout(timeout);
            }
            this.endCallback();
        }
    }

    this.processKey = key => {
        switch(key) {
            case "Enter":
            case "Space":
                if(!this.transitioning) {
                    if(timeout !== null) {
                        clearTimeout(timeout);
                    }
                    this.endCallback();
                }
                break;
        }
    }

    this.start = () => {
        timeout = setTimeout(endCallback,10000);
    }

    this.render = timestamp => {

        context.clearRect(0,0,fullWidth,fullHeight);
        drawTextWhite("death is only the beginning of something new.",15,15,3);

        drawTextWhite("see you around.",15,45,3);
        this.fader.render(timestamp);
    }
}
