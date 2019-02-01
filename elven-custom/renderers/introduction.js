"use strict";
function IntroductionRenderer(endCallback) {
    this.endCallback = endCallback;

    this.messages = [
        "the christmas elves have turned",
        "an elite crew of elves has taken the reigns",
        "these are not ordinary elves",
        "these elves create weapons",
        "these elves commit genocides",
        "the world needs a hero...",
        "the world needs...",
        "you...",
        "no one knows elves like you",
        "i wish there was any other way"
    ];

    this.processClick = () => {
        if(!this.transitioning) {
            playSound("click.mp3");
            if(this.endTimeout !== null) {
                clearTimeout(this.endTimeout);
            }
            this.endCallback();
        }
    }

    this.processKey = key => {
        switch(key) {
            case "Enter":
            case "Space":
                if(!this.transitioning) {
                    if(this.endTimeout !== null) {
                        clearTimeout(this.endTimeout);
                    }
                    this.endCallback();
                }
                break;
        }
    }

    const startTimeOffset = 3200;
    this.fadeIn = 3500;
    this.fadeRange = 0.5;
    this.startTime = null;

    this.fader = getFader();

    this.endTimeout = null;

    this.render = timestamp => {

        if(this.startTime === null) {
            this.startTime = performance.now() + startTimeOffset;
            const timeout = (this.messages.length+1)*this.fadeIn + 14000;
            this.endTimeout = setTimeout(endCallback,timeout);

        }

        context.clearRect(0,0,fullWidth,fullHeight);

        const timeDelta = timestamp - this.startTime;
        const progress = timeDelta / this.fadeIn;

        if(progress >= 0) {
            const step = Math.floor(progress);

            let innerProgress = (progress - step) / this.fadeRange;
            if(innerProgress > 1) {
                innerProgress = 1;
            }
    
            let runningYOffset = 150;
            for(let i = 0;i<this.messages.length;i++) {
                if(step >= i) {
                    const textArea = drawTextWhite(this.messages[i],20,runningYOffset,4);
                    if(step === i) {
                        context.fillStyle = `rgba(0,0,0,${1-innerProgress})`;
                        context.fillRect(20,runningYOffset,textArea.width,textArea.height);
                    }
                    runningYOffset += textArea.height + 10;
                }
            }
        }

        rendererState.fader.render(timestamp);

    }
}
