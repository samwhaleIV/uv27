function SidescrollRenderer(image,endCallback) {

    const spriteWidth = 11;
    const spriteHeight = 24;

    this.frontFacing = {
        x: 0,y:24
    }
    this.backFacing = {
        x: 0,y:0
    }

    const framesPerSecond = 10;

    const frameCount = 7;

    const frameDuration = 1000 / framesPerSecond;

    const highestFrameIndex = frameCount - 1;

    this.rightSprites = [];
    this.leftSprites = [];

    for(let i = 1;i<frameCount;i++) {
        const x = i * spriteWidth;
        const index = i-1;
        this.leftSprites[index] = {
            x:x,y:0
        }
        this.rightSprites[index] = {
            x: x,y:spriteHeight
        }
    }

    this.elfScale = 20;

    this.animationStartTime = performance.now();
    this.animationState = "walking-right";

    this.fader = getFader();

    this.standingLeft = {
        x:spriteWidth,y:spriteHeight
    }
    this.standingRight = {
        x:this.rightSprites[this.rightSprites.length-1],y:0
    }

    this.renderMethod = (context,timestamp,width,height) => {
        context.clearRect(0,0,width,height);

        let position;
        switch(this.animationState) {
            case "standing-left":
                position = this.standingLeft;
                break;
            case "standing-right":
                position = this.standingRight;
                break;
            case "walking-left":
                position = this.leftSprites[
                    Math.floor((timestamp - this.animationStartTime) / frameDuration) % highestFrameIndex
                ];
                break;
            case "walking-right":
                position = this.rightSprites[
                    Math.floor((timestamp - this.animationStartTime) / frameDuration) % highestFrameIndex
                ];
                break;
            default:
            case "facing-front":
                position = this.frontFacing;
                break;
            case "facing-back":
                position = this.backFacing;
                break;
        }

        const elfWidth = this.elfScale * spriteWidth;
        const elfHeight = this.elfScale * spriteHeight;

        context.drawImage(
            image,
            position.x,position.y,spriteWidth,spriteHeight,
            (width/2)-(elfWidth/2),(height/2)-(elfHeight/2),elfWidth,elfHeight
        );


        if(imageDictionary["fontspace"]) {
            drawTextWhite("loading...",15,15,4);
        } else {
            drawDefaultLoadingText();
        }

        rendererState.fader.process(context,timestamp,width,height);
    }
}
