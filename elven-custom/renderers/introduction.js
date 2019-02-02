"use strict";
function IntroductionRenderer(endCallback) {
    this.endCallback = endCallback;

    this.messages = [
        "hey...",
        "it's been a while.",
        "i wish this message came on a lighter note.",
        "but i'm afraid the inevitable is here.",
        "an evil crew of elves has taken the reigns.",
        "these are not ordinary elves.",
        "these elves murder - kill - maim.",
        "these elves are monsters.",
        "the world needs a hero right now...",
        "i wish there was any other way...",
        "but no one else knows elves like you do."
    ];
    
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

    const startTimeOffset = 3200;
    this.fadeIn = 3500;
    this.fadeRange = 0.5;
    this.startTime = null;

    this.fader = getFader();

    this.start = timestamp => {
        this.startTime = timestamp + startTimeOffset;
        const timeoutTime = (this.messages.length+1)*this.fadeIn + 10000;
        timeout = setTimeout(endCallback,timeoutTime);
    }

    this.render = timestamp => {

        context.clearRect(0,0,fullWidth,fullHeight);

        const timeDelta = timestamp - this.startTime;
        const progress = timeDelta / this.fadeIn;

        if(progress >= 0) {
            const step = Math.floor(progress);

            let innerProgress = (progress - step) / this.fadeRange;
            if(innerProgress > 1) {
                innerProgress = 1;
            }
    
            let runningYOffset = 100;
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
