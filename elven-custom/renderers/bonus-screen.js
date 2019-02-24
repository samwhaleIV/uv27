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

    const creditLines = [
        "special thanks to all the following people...",
        "(in no particular order)",
        "",
        "kyndrajauna - the goddess of patience",
        "jim - the music god",
        "the gods who made chromium",
        "the gods who made electron",
        "you - for playing the game :)",
    ];

    this.render = timestamp => {

        context.clearRect(0,0,fullWidth,fullHeight);
        for(let i = 0;i<creditLines.length;i++) {
            drawTextWhite(creditLines[i],15,15+(i*50),4);
        }

        this.fader.render(timestamp);
    }
}
