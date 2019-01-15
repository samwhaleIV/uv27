function IntroductionRenderer(endCallback) {

    this.messages = [
        "i bring terrible news",
        "the christmas elves have turned",
        "an elite crew of elves has taken over",
        "they have stopped all toy production",
        "they plan mass killings",
        "you are the only hope the world has",
        "the location of the elite crew is known",
        "you know what to do",
        "good luck"
    ];

    const startTimeOffset = 2500;
    this.fadeIn = 2000;
    this.fadeRange = 0.5;
    this.startTime = null;

    this.fader = getFader();

    this.renderMethod = (context,timestamp,width,height) => {

        if(this.startTime === null) {
            this.startTime = performance.now() + startTimeOffset;
            const timeout = (this.messages.length+1)*this.fadeIn + (startTimeOffset*0.75);
            setTimeout(endCallback,timeout);

        }

        context.clearRect(0,0,width,height);



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

        rendererState.fader.process(context,timestamp,width,height);

    }
}
