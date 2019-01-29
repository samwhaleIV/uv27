"use strict";
function EndScreenRenderer(endCallback) {

    this.endCallback = endCallback;

    this.fader = getFader();

    this.textScale = 5;

    this.topText = "thanks for playing";
    this.bottomText = "merry christmas";

    this.textMargin = 15;


    const topTextTestResult = drawTextTest(
        this.topText,this.textScale
    );
    const bottomTextTestResult = drawTextTest(
        this.bottomText,this.textScale
    );

    const halfWidth = canvas.width / 2;

    this.bottomTextX = Math.round(halfWidth - (bottomTextTestResult.width / 2));
    this.topTextX = Math.round(halfWidth - (topTextTestResult.width / 2));

    this.bottomTextY = canvas.height - this.textMargin - bottomTextTestResult.height;
    this.topTextY = this.textMargin;

    this.transitioning = false;

    this.processClick = () => {
        if(!transitioning) {
            playSound("click.mp3");
            this.endCallback();
        }
    }

    this.processKey = key => {
        switch(key) {
            case "Enter":
            case "Space":
                if(!transitioning) {
                    this.endCallback();
                }
                break;
        }
    }

    this.renderMethod = (context,timestamp,width,height) => {


        context.drawImage(
            imageDictionary["end-screen"],
            0,0,width,height
        );

        drawTextWhite(
            this.topText,
            this.topTextX,this.topTextY,
            this.textScale,1
        );
        drawTextWhite(
            this.bottomText,
            this.bottomTextX,this.bottomTextY,
            this.textScale,1
        );


        rendererState.fader.process(context,timestamp,width,height);

    }


}
