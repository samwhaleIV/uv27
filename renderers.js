const noiseBlackOut = function(intensity,context,width,height,grainSize=30,minShade=0,maxShade=255) {

    const shadeRange = maxShade - minShade;

    const horizontalGrain = Math.ceil(width / grainSize);
    const verticalGrain = Math.ceil(height / grainSize);

    const xOffset = ((horizontalGrain * grainSize) - width) / 2;
    const yOffset = ((verticalGrain * grainSize) - height) / 2;

    for(let x = 0;x<horizontalGrain;x++) {
        for(let y = 0;y<verticalGrain;y++) {
            const grainShade = Math.floor(Math.random() * shadeRange) + minShade;
            const color = `rgba(${grainShade},${grainShade},${grainShade},${intensity})`;
            context.fillStyle = color;
            context.fillRect(
                (x*grainSize)-xOffset,
                (y*grainSize)-yOffset,
                grainSize,
                grainSize
            );
        }
    }
}

const drawTextTest = function(text,scale,spacing=1) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const spaceOffset = spacing * scale;
    const lastOffsetIndex = text.length-1;

    for(let i = 0;i<text.length;i++) {
        const character = fontDictionary[text.substr(i,1)];
        if(!character) {
            throw `${text.substr(i,1)} is invalid for render @ ${text}`;
        }
        const drawWidth = character.width * scale;
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += spaceOffset;
        }
    }

    return {
        width: xOffset,
        height: drawHeight
    }
}

const drawTextWhite = function(text,x,y,scale,spacing=1) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const spaceOffset = spacing * scale;
    const lastOffsetIndex = text.length-1;
    for(let i = 0;i<text.length;i++) {
        const character = fontDictionary[text.substr(i,1)];
        if(!character) {
            throw `${text.substr(i,1)} is invalid for render @ ${text}`;
        }
        const drawWidth = character.width * scale;
        context.drawImage(
            imageDictionary["fontspace"],
            character.x,0,character.width,5,
            x+xOffset,y,
            drawWidth,drawHeight
        );
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += spaceOffset;
        }
    }
}

const drawTextBlack = function(text,x,y,scale,spacing=1) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const spaceOffset = spacing * scale;
    const lastOffsetIndex = text.length-1;

    for(let i = 0;i<text.length;i++) {
        const character = fontDictionary[text.substr(i,1)];
        if(!character) {
            throw `${text.substr(i,1)} is invalid for render @ ${text}`;
        }
        const drawWidth = character.width * scale;
        context.drawImage(
            imageDictionary["fontspace-black"],
            character.x,0,character.width,5,
            x+xOffset,y,
            drawWidth,drawHeight
        );
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += spaceOffset;
        }
    }
}

const getFader = function() {
    const fader = {
        delta: 0,
        time: 600,
        start: null,
        fadeInDelay: 400,
        transitionParameters: null,
        transitionRenderer: null,
        inMethod: null,
        fadeIn: exitMethod => {
            startRenderer();
            rendererState.fader.delta = -1;
            rendererState.fader.start = performance.now();
            if(exitMethod) {
                rendererState.fader.inMethod = exitMethod;
            }
            const staticTime = rendererState.fader.time / 1000;
            playSound("swish-2.mp3",staticTime);
            if(rendererState.song) {
                playMusic(rendererState.song,staticTime);
            }
        },
        fadeOut: (rendererGenerator,...parameters) => {
            rendererState.fader.delta = 1;
            rendererState.fader.start = performance.now();
            rendererState.fader.transitionRenderer = rendererGenerator;
            rendererState.fader.transitionParameters = parameters;
            const staticTime = rendererState.fader.time / 1000;
            playSound("swish-1.mp3",staticTime);
            if(musicNode) {
                stopMusic(staticTime);
            }
        },
        oninEnd: () => {
            if(rendererState.fader.inMethod) {
                rendererState.fader.inMethod();
            }
            console.log("Transition complete");
        },
        onoutEnd: () => {
            pauseRenderer();
            if(rendererState.fader.transitionRenderer) {
                rendererState = new rendererState.fader.transitionRenderer(
                    ...rendererState.fader.transitionParameters
                );
                if(rendererState.fader) {
                    setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                }
            } else {
                console.error("Error: Missing fader transition state");
            }
        },
        process: (context,timestamp,width,height) => {
            if(rendererState.fader.delta !== 0) {
                let fadeIntensity;
                if(rendererState.fader.delta > 0) {
                    fadeIntensity = (timestamp - rendererState.fader.start) / rendererState.fader.time;
                    if(fadeIntensity > 1) {
                        fadeIntensity = 1;
                    }
                } else {
                    fadeIntensity = 1 - (timestamp - rendererState.fader.start) / rendererState.fader.time;
                    if(fadeIntensity < 0) {
                        rendererState.fader.delta = 0;
                        rendererState.fader.oninEnd();
                        return;
                    }
                }

                noiseBlackOut(
                    fadeIntensity,
                    context,width,height,
                    15 + (fadeIntensity * 40),
                    255 - (fadeIntensity * 255)
                );

                if(fadeIntensity === 1 && rendererState.fader.delta === 1) {
                    rendererState.fader.delta = 0;
                    rendererState.fader.onoutEnd();
                }

            }
        }
    }
    return fader;
}

function BossBackground() {

    this.background = new Background("background-2","rgb(20,20,20)",10000);

    this.fragmentPoints = [
        {   //Left most
            originX: 138, originY: 141,
            destinationX: 138, destinationY: 141,
            width: 63, height: 179,
        },
        {   //Second-right
            originX: 138, originY: 141,
            destinationX: 207, destinationY: 276,
            width: 63, height: 179,
        },
        {   //Second-left
            originX: 138, originY: 141,
            destinationX: 485, destinationY: 274,
            width: 63, height: 179,
        },
        {   //Right most
            originX: 138, originY: 141,
            destinationX: 551, destinationY: 145,
            width: 63, height: 179,
        },

        {   //Center
            originX: 315, originY: 83,
            destinationX: 315, destinationY: 83,
            width: 119, height: 300,
        },            
    ];
    this.rotationTime = 1000;
    this.fragmentRadius = 50;

    this.globalYOffset = 29;
    this.render = (context,timestamp,width,height) => {

        this.background.renderNormal(context,timestamp,width,height);

        context.drawImage(imageDictionary["boss-layer-background"],0,this.globalYOffset);

        let angle;
        if(Math.floor(timestamp / this.rotationTime) % 2 === 0) {
            angle = (timestamp % this.rotationTime) / this.rotationTime * 180;
        } else {
            angle = 1 - (timestamp % this.rotationTime) / this.rotationTime * 180;
        }


        let inverseAngle = Math.abs(angle - 180);

        angle = Math.PI * angle / 180;
        inverseAngle = Math.PI * inverseAngle / 180;



        let xOffset = (this.fragmentRadius * Math.cos(angle));
        let yOffset = (this.fragmentRadius * Math.sin(angle)) + this.globalYOffset;
        
        let inverseXOffset = (this.fragmentRadius * Math.cos(inverseAngle));
        let inverseYOffset = (this.fragmentRadius * Math.sin(inverseAngle)) + this.globalYOffset;

        for(let i = 0;i < this.fragmentPoints.length;i++) {

            const fragment = this.fragmentPoints[i];

            context.drawImage(
                imageDictionary["boss-layer-effect"],
                fragment.originX,fragment.originY,
                fragment.width,fragment.height,
                fragment.destinationX + xOffset,
                fragment.destinationY + yOffset,
                fragment.width,fragment.height
            );

            context.drawImage(
                imageDictionary["boss-layer-effect"],
                fragment.originX,fragment.originY,
                fragment.width,fragment.height,
                fragment.destinationX + inverseXOffset,
                fragment.destinationY + inverseYOffset,
                fragment.width,fragment.height
            );

        }

        context.drawImage(imageDictionary["boss-layer-top"],0,this.globalYOffset);

    }
}

function Background(name,color,cycleTime) {
    this.name = name;
    this.color = color;
    this.cycleTime = cycleTime || 20000;

    this.staticY = 372;
    this.staticHeight = 278;
    this.staticTopHeight = canvas.height - this.staticHeight;

    this.renderNormal = (context,timestamp,width,height) => {
        const horizontalOffset = -(((timestamp % this.cycleTime) / this.cycleTime) * width);

        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0
        );


        context.drawImage(
            imageDictionary[this.name],
            (width + horizontalOffset),0
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,width,height);
        context.restore();

    }

    this.render = (context,timestamp,width,height) => {

        const horizontalOffset = -(((timestamp % this.cycleTime) / this.cycleTime) * width);

        context.drawImage(
            imageDictionary[this.name],
            0,0,width,this.staticTopHeight,
            horizontalOffset,0,width,this.staticTopHeight
        );


        context.drawImage(
            imageDictionary[this.name],
            0,0,width,this.staticTopHeight,
            (width + horizontalOffset),0,width,this.staticTopHeight
        );

        context.drawImage(
            imageDictionary[this.name],
            0,this.staticY,
            width,this.staticHeight,
            0,this.staticY,
            width,this.staticHeight
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,width,height);
        context.restore();

        context.fillStyle = "rgba(0,0,0,0.7)";
        context.fillRect(0,0,width,this.staticTopHeight);
    }
}

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

    this.processClick = () => {
        playSound("click.mp3");
        this.endCallback();
    }

    this.processKey = key => {
        switch(key) {
            case "Enter":
            case "Space":
                this.endCallback();
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

function ElfSelectScreen(endCallback,highestElfIndex,loadIndex) {

    this.song = "menu.mp3";

    this.halfWidth = canvas.width / 2;

    this.endCallback = endCallback;
    this.highestElfIndex = highestElfIndex || 0;

    if(loadIndex || loadIndex === 0) {
        this.currentIndex = loadIndex;
    } else {
        this.currentIndex = this.highestElfIndex;
    }

    this.elfWidth = 160;
    this.elfHeight = Math.floor((elfSourceHeight / elfSourceWidth) * this.elfWidth);

    this.textScale = 8;
    this.elf = null;
    this.text = null;
    this.textX = null;
    this.textHeight = null;

    this.background = new Background("background-1","rgb(30,30,30)");

    this.leftDisabled = null;
    this.rightDisabled = null;

    this.currentIndexText = null;

    this.setElf = () => {
        this.elf = elves[this.currentIndex];
        const testDrawResult = drawTextTest(this.elf.name,this.textScale);
        this.text = this.elf.name;
        this.textX = Math.round(this.halfWidth - (testDrawResult.width / 2));
        this.textHeight = testDrawResult.height;
        this.background.name = this.elf.background;
        if(this.currentIndex === this.highestElfIndex) {
            this.rightDisabled = true;
        } else {
            this.rightDisabled = false;
        }
        if(this.currentIndex === 0) {
            this.leftDisabled = true;
        } else {
            this.leftDisabled = false;
        }
        this.currentIndexText = `elf ${this.currentIndex+1}`;
    }
    this.setElf();

    this.elfX = Math.round(this.halfWidth - (this.elfWidth / 2));

    this.fader = getFader();
    this.buttonHeight = 40;

    const verticalSpacing = 10;

    const totalHeight =
        this.textHeight + this.elfHeight +
        this.buttonHeight + (verticalSpacing * 2);

    this.textY = Math.floor((canvas.height / 2) - (totalHeight / 2)) - 45;
    this.elfY = this.textY + verticalSpacing + this.textHeight;
    this.buttonY = this.elfY + verticalSpacing + this.elfHeight;

    this.goLeft = () => {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = 0;
        } else {
            playSound("click.mp3");
            this.setElf();
        }
    }

    this.goRight = () => {
        this.currentIndex++;
        if(this.currentIndex > this.highestElfIndex) {
            this.currentIndex = this.highestElfIndex;
        } else {
            playSound("click.mp3");
            this.setElf();
        }
    }

    this.transitioning = false;

    this.elfClicked = () => {
        if(this.transitioning) {
            return;
        }
        if(this.currentIndex <= highestElfIndex) {
            playSound("click.mp3");
            this.endCallback(this.currentIndex);
            this.transitioning = true;
        }
    }

    this.hoverEffectIndex = null;

    const buttonSpacing = 10;
    this.buttonWidth = 200;

    const spacedWidth = this.buttonWidth + buttonSpacing;
    const totalWidth = (spacedWidth * 3) - buttonSpacing;

    this.leftButtonX = Math.round(this.halfWidth - (totalWidth / 2));
    this.centerButtonX = this.leftButtonX + spacedWidth;
    this.rightButtonX = this.centerButtonX + spacedWidth;
    
    const hoverEffectSize = 3;
    const doubleHoverSize = hoverEffectSize * 2;
    this.hoverEffectHeight = this.buttonHeight + doubleHoverSize;
    this.hoverEffectWidth = this.buttonWidth + doubleHoverSize;
    this.hoverEffectY = this.buttonY - hoverEffectSize;

    this.leftButtonHoverX = this.leftButtonX - hoverEffectSize;
    this.centerButtonHoverX = this.centerButtonX - hoverEffectSize;
    this.rightButtonHoverX = this.rightButtonX - hoverEffectSize;

    const halfButtonWidth = this.buttonWidth / 2;

    this.leftText = "back";
    this.centerText = "battle";
    this.rightText = "next";

    this.buttonTextScale = 4;

    const firstResult = drawTextTest(this.leftText,this.buttonTextScale);
    this.leftButtonTextX = this.leftButtonX + Math.floor(
        halfButtonWidth - (firstResult.width / 2)
    );
    this.centerButtonTextX = this.centerButtonX + Math.floor(
        halfButtonWidth - (drawTextTest(this.centerText,this.buttonTextScale).width / 2)
    );
    this.rightButtonTextX = this.rightButtonX + Math.floor(
        halfButtonWidth - (drawTextTest(this.rightText,this.buttonTextScale).width / 2)
    );

    this.buttonTextY = Math.floor((this.buttonHeight / 2) - (firstResult.height / 2)) + this.buttonY;

    
    this.processClick = (x,y) => {
        if(x && y) {
            this.processMove(x,y);
        }
        switch(this.hoverEffectIndex) {
            case 0:
                this.goLeft();
                break;
            case 1:
                this.elfClicked();
                break;
            case 2:
                this.goRight();
                break;
        }
    }

    this.processKey = key => {
        switch(key) {
            case "KeyW":
            case "KeyD":
            case "ArrowUp":
            case "ArrowRight":
                if(this.hoverEffectIndex === null) {
                     this.hoverEffectIndex = 1;
                } else {
                    switch(this.hoverEffectIndex) {
                        case 0:
                            this.hoverEffectIndex = 1;
                            break;
                        case 1:
                            this.hoverEffectIndex = 2;
                            break;
                    }
                }
                break;
            case "KeyS":
            case "KeyA":
            case "ArrowLeft":
            case "ArrowDown":
                if(this.hoverEffectIndex === null) {
                    this.hoverEffectIndex = 1;
                } else {
                    switch(this.hoverEffectIndex) {
                        case 1:
                            this.hoverEffectIndex = 0;
                            break;
                        case 2:
                            this.hoverEffectIndex = 1;
                            break;

                    }
                }
                break;
            case "Space":
            case "Enter":
                this.processClick();
                break;
        }
    }

    this.processMove = (x,y) => {
        if(y >= this.buttonY && y <= this.buttonY + this.buttonHeight) {
            if(x > this.rightButtonX) {
                if(x <= this.rightButtonX + this.buttonWidth) {
                    this.hoverEffectIndex = 2;
                    return;
                }
            } else if(x > this.centerButtonX) {
                if(x <= this.centerButtonX + this.buttonWidth) {
                    this.hoverEffectIndex = 1;
                    return;
                }
            } else if(x > this.leftButtonX) {
                if(x <= this.leftButtonHoverX + this.buttonWidth) {
                    this.hoverEffectIndex = 0;
                    return;
                }
            }
        }
        this.hoverEffectIndex = null;
    }

    this.renderMethod = (context,timestamp,width,height) => {

        this.background.renderNormal(context,timestamp,width,height);

        context.drawImage(
            imageDictionary["elves"],
            this.elf.x,0,elfSourceWidth,elfSourceHeight,
            this.elfX,this.elfY,this.elfWidth,this.elfHeight
        );

        drawTextWhite(this.text,this.textX,this.textY,this.textScale);

        drawTextWhite(this.currentIndexText,15,15,3);

        if(this.hoverEffectIndex !== null) {
            let hoverEffectX;
            switch(this.hoverEffectIndex) {
                case 0:
                    hoverEffectX = this.leftButtonHoverX;
                    break;
                case 1:
                    hoverEffectX = this.centerButtonHoverX;
                    break;
                case 2:
                    hoverEffectX = this.rightButtonHoverX;
                    break;
            }
            context.fillStyle = "rgba(255,255,255,0.7)";
            context.fillRect(
                hoverEffectX,this.hoverEffectY,
                this.hoverEffectWidth,this.hoverEffectHeight
            );
        }

        if(this.leftDisabled) {
            context.fillStyle = "rgba(100,100,100,1)";
        } else {
            context.fillStyle = "rgba(255,255,255,1)";
        }
        context.fillRect(
            this.leftButtonX,this.buttonY,
            this.buttonWidth,this.buttonHeight
        );
        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(
            this.centerButtonX,this.buttonY,
            this.buttonWidth,this.buttonHeight
        );

        if(this.rightDisabled) {
            context.fillStyle = "rgba(100,100,100,1)";
        } else {
            context.fillStyle = "rgba(255,255,255,1)";
        }
        context.fillRect(
            this.rightButtonX,this.buttonY,
            this.buttonWidth,this.buttonHeight
        );

        drawTextBlack(
            this.leftText,this.leftButtonTextX,
            this.buttonTextY,this.buttonTextScale
        );
        drawTextBlack(
            this.centerText,this.centerButtonTextX,
            this.buttonTextY,this.buttonTextScale,
        );
        drawTextBlack(
            this.rightText,this.rightButtonTextX,
            this.buttonTextY,this.buttonTextScale
        );

        rendererState.fader.process(context,timestamp,width,height);
    }
}

function ElfScreenRenderer(winCallback,loseCallback,elfID,isBoss) {

    this.elf = elves[elfID];

    if(this.elf.song) {
        this.song = this.elf.song;
    }

    this.halfWidth = canvas.width / 2;

    this.elfWidth = 180;
    this.elfHeight = 372;
    this.elfCenterX = Math.floor(this.halfWidth - (this.elfWidth / 2));
    this.fader = getFader();
    this.background = !isBoss ? new Background(this.elf.background,this.elf.backgroundColor) : new BossBackground();
    this.elfX = this.elfCenterX;

    this.elfMoveStart = null;
    this.elfMoveDuration = null;
    this.elfMoveStartTime = null;
    this.elfMoveDistance = null;

    this.moveElf = (duration,newXPercent) => {
        this.elfMoveDuration = duration;
        this.elfMoveStart = this.elfX;
        let elfMoveEnd = Math.floor((newXPercent * canvas.width) - (this.elfWidth / 2));

        this.elfMoveDistance = elfMoveEnd - this.elfMoveStart;

        this.elfMoveStartTime = performance.now();
    }

    this.winCallback = winCallback;
    this.loseCallback = loseCallback;

    this.playerInputs = null;
    this.playerInputsEnabled = false;

    this.playerInputsWidth = Math.round(canvas.width * 0.5);
    this.playerInputsX = Math.round(this.halfWidth - (this.playerInputsWidth / 2));

    let runningYValue = 394;
    const textMargin = 10;
    const inputBoxMargin = 10;

    this.playerInputsTextX = this.playerInputsX + textMargin;
    this.playerInputsHeight = 50;
    this.playerInputTextScale = 4;

    this.playerInputsYValues = [];

    this.playerInputDisableStartTime = null;
    this.playerInputEnableStartTime = null;
    this.hoverEffectIndex = null;

    this.playerInputToggleAnimationTime = 200;
    this.playerInputToggleDistance = canvas.width;

    this.startInputText = null;

    this.hoverEffectSize = 3;
    this.hoverEffectX = this.playerInputsX - this.hoverEffectSize;
    const doubleHoverSize = this.hoverEffectSize * 2;
    this.hoverEffectHeight = this.playerInputsHeight + doubleHoverSize;
    this.hoverEffectWidth = this.playerInputsWidth + doubleHoverSize;

    const healthBarMargin = 15;

    this.healthBarWidth = !isBoss ? 250 : canvas.width - (healthBarMargin * 2);
    this.healthBarHeight = 24;
    const healthBarTop = 0;
    const healthBarTextMargin = 8;
    this.healthBarTextSize = 3.5;
    
    const healthBarTextY = healthBarTop + this.healthBarHeight + healthBarMargin + healthBarTextMargin;
    
    const healthBarY = healthBarTop + healthBarMargin;

    this.leftHealthBar = {
        x: healthBarMargin,
        y: !isBoss ? healthBarY : 75,
        textY: !isBoss ? healthBarTextY : 75 + this.healthBarHeight + healthBarTextMargin,
        foregroundColor: "white",
        backgroundColor: "rgb(0,0,0)"
    };

    this.rightHealthBar = {
        y: healthBarY,
        x: !isBoss ? canvas.width - healthBarMargin - this.healthBarWidth : healthBarMargin,
        textY: healthBarTextY,
        foregroundColor: this.elf.backgroundColor,
        backgroundColor: "rgb(0,0,0)"
    };

    this.bottomMessageWidth = canvas.width;
    this.bottomMessageHeight = 40;
    this.bottomMessageX = 0;
    this.bottomMessageY = 332;

    this.subTextScale = 2.5;

    const healthBarTextHeight = drawTextTest("",this.healthBarTextSize).height;

    this.subTextY = (healthBarTextY + healthBarTextHeight + healthBarTextMargin) +
        Math.floor(Math.round(healthBarTextHeight/2)-(drawTextTest("",this.subTextScale).height/2));

    this.bottomMessageTextScale = 4;

    const textDrawTestResult = drawTextTest("",this.bottomMessageTextScale);

    this.bottomMessageTextY = this.bottomMessageY + Math.floor((this.bottomMessageHeight / 2) - (textDrawTestResult.height / 2));

    this.firstInputMask = null;

    this.elfTextBubbleWidth = !isBoss ? 400 : 450;
    this.elfTextBubbleHeight = 220;
    this.elfTextBubbleX = !isBoss ? 270 : Math.round(this.halfWidth - (this.elfTextBubbleWidth / 2));
    this.elfTextBubbleY = 82;

    if(isBoss) {
        this.elfTextBubbleY += 40;
    }

    this.disablePlayerInputs = () => {
        if(this.playerInputDisableStartTime !== null) {
            console.error("Error: Player inputs are already enabled");
            return;
        }
        
        this.playerInputEnableStartTime = null;

        this.startInputText = this.playerInputs[0].name;
        this.firstInputMask = "skip";

        this.playerInputDisableStartTime = performance.now();
        this.playerInputsEnabled = false;

    }

    this.enablePlayerInputs = () => {
        if(this.playerInputDisableStartTime !== null) {
            this.playerInputDisableStartTime = null;
            this.firstInputMask = null;
            this.startInputText = null;
            this.playerInputEnableStartTime = performance.now();
        }
        this.playerInputsEnabled = true;
    }

    for(let i = 0;i<4;i++) {
        this.playerInputsYValues[i] = {
            value: runningYValue,
            textValue: runningYValue + textMargin,
            hoverValue: runningYValue - this.hoverEffectSize
        }
        runningYValue += this.playerInputsHeight + inputBoxMargin;
    }

    this.drawHealthBar = (context,timestamp,healthBar,target) => {

        let xOffset = healthBar.x,yOffset = 0;
        if(target.jitterHealthBar) {
            xOffset += Math.floor(Math.random() * 4) - 2;
            yOffset += Math.floor(Math.random() * 4) - 2;
        }
        if(target.healthBarDrop) {
            yOffset -= Math.floor(Math.random() * 2) - 1;
        }

        const healthBarEnd = Math.floor(this.healthBarWidth * (
            target.health /
            target.maxHealth
        ));

        const offsetY = healthBar.y + yOffset;

        context.fillStyle = healthBar.foregroundColor;
        context.fillRect(
            xOffset,
            offsetY,
            healthBarEnd,
            this.healthBarHeight
        );

        const healthBarEndWidth = this.healthBarWidth - healthBarEnd;
        
        if(healthBarEndWidth !== 0) {
            context.fillStyle = healthBar.backgroundColor;
            context.fillRect(
                healthBarEnd + xOffset,
                offsetY,
                healthBarEndWidth,
                this.healthBarHeight
            );
        }

        drawTextWhite(target.name,healthBar.x,healthBar.textY,this.healthBarTextSize);
    }

    this.renderMethod = (context,timestamp,width,height) => {

        rendererState.background.render(context,timestamp,width,height);

        if(!isBoss) {
            let elfX;
            if(this.elfMoveStart) {
                let animationProgress = ((timestamp - this.elfMoveStartTime) / this.elfMoveDuration);
                if(animationProgress >= 1) {
                    elfX = this.elfMoveStart + this.elfMoveDistance;
                    this.elfMoveStart = null;
                    this.elfX = elfX;
                } else {
                    elfX = this.elfMoveStart + (animationProgress * this.elfMoveDistance);
                }
            } else {
                elfX = this.elfX;
            }
    
            context.drawImage(
                imageDictionary["elves"],
                this.elf.x,0,elfSourceWidth,elfSourceHeight,
                elfX,0,this.elfWidth,this.elfHeight
            );
        }

        this.drawHealthBar(
            context,timestamp,
            this.leftHealthBar,
            this.battleSequencer.playerBattleObject
        );

        this.drawHealthBar(
            context,timestamp,
            this.rightHealthBar,
            this.battleSequencer.elfBattleObject
        );

        if(this.battleSequencer.bottomMessage !== null) {
            context.fillStyle = "white";
            context.fillRect(
                this.bottomMessageX,
                this.bottomMessageY,
                this.bottomMessageWidth,
                this.bottomMessageHeight
            );
            const textResult = drawTextTest(
                this.battleSequencer.bottomMessage,
                this.bottomMessageTextScale
            );
            drawTextBlack(
                this.battleSequencer.bottomMessage,
                Math.floor(this.halfWidth - (textResult.width / 2)),
                this.bottomMessageTextY,
                this.bottomMessageTextScale
            );
        }

        if(this.battleSequencer.elfSpeech !== null) {
            context.fillStyle = "white";
            context.fillRect(
                this.elfTextBubbleX,
                this.elfTextBubbleY,
                this.elfTextBubbleWidth,
                this.elfTextBubbleHeight
            );
            for(let i = 0;i<this.battleSequencer.elfSpeech.length;i++) {
                drawTextBlack(this.battleSequencer.elfSpeech[i],
                    this.elfTextBubbleX + 8,this.elfTextBubbleY + 8 + (i * 28),4
                );
            }
        } else if(this.battleSequencer.elfBattleObject.subText !== null) {
            for(let i = 0;i<this.battleSequencer.elfBattleObject.subText.length;i++) {
                drawTextWhite(
                    this.battleSequencer.elfBattleObject.subText[i],
                    this.rightHealthBar.x,
                    this.subTextY + (i*20),this.subTextScale
                );
            }
        }

        if(this.battleSequencer.playerBattleObject.subText !== null) {
            for(let i = 0;i<this.battleSequencer.playerBattleObject.subText.length;i++) {
                drawTextWhite(
                    this.battleSequencer.playerBattleObject.subText[i],
                    this.leftHealthBar.x,
                    this.subTextY + (i*20),this.subTextScale
                );
            }
        }

        if(this.playerInputs) {

            let evenOffset = 0;
            let oddOffset = 0;
            let animating = false;

            let progress = null;
            if(this.playerInputDisableStartTime !== null) {

                timeDifference =  timestamp - this.playerInputDisableStartTime;

                progress = timeDifference / this.playerInputToggleAnimationTime;

                animating = true;

            } else if(this.playerInputEnableStartTime !== null) {

                timeDifference =  timestamp - this.playerInputEnableStartTime;

                progress = 1 - (timeDifference / this.playerInputToggleAnimationTime);

                animating = true;

            }
            if(progress !== null) {
                if(progress < 0) {
                    progress = 0;
                    animating = false;
                } else if(progress > 1) {
                    progress = 1;
                    animating = false;
                }
                const distance = progress * this.playerInputToggleDistance;
                evenOffset = -distance;
                oddOffset = distance;
            }

            for(let i = 0;i<this.playerInputs.length;i++) {
                let xOffset = 0, inputText;
                const input = this.playerInputs[i];
                if(i !== 0) {
                    xOffset = i % 2 === 0 ? evenOffset : oddOffset;
                    inputText = input.name;
                } else {
                    inputText = this.firstInputMask || input.name;
                }

                const yValues = this.playerInputsYValues[i];


                if(i === this.hoverEffectIndex && !animating && this.playerInputsEnabled) {
                    context.fillStyle = "rgba(255,255,255,0.7)";
                    context.fillRect(
                        this.hoverEffectX,yValues.hoverValue,
                        this.hoverEffectWidth,this.hoverEffectHeight
                    );
                } else if(this.firstInputMask && this.hoverEffectIndex !== null && i === 0) {
                    context.fillStyle = "rgba(255,255,255,0.7)";
                    context.fillRect(
                        this.hoverEffectX,yValues.hoverValue,
                        this.hoverEffectWidth,this.hoverEffectHeight
                    );
                }
                

                context.fillStyle = "rgba(0,0,0,0.8)";
                context.fillRect(
                    this.playerInputsX + xOffset,yValues.value,
                    this.playerInputsWidth,this.playerInputsHeight
                );   
                if(inputText) {
                    drawTextWhite(
                        inputText,
                        this.playerInputsTextX + xOffset,
                        yValues.textValue,
                        this.playerInputTextScale
                    );
                }
            }
        }

        rendererState.fader.process(context,timestamp,width,height);
    }

    this.battleSequencer = new BattleSeqeuencer(this);

    this.processKey = key => {
        switch(key) {
            case "KeyW":
            case "KeyA":
            case "ArrowUp":
            case "ArrowLeft":
                if(!this.playerInputsEnabled) {
                    if(this.hoverEffectIndex === null) {
                        this.hoverEffectIndex = 0;
                    }
                    break;
                }
                if(this.hoverEffectIndex !== null) {
                    this.hoverEffectIndex--;
                    if(this.hoverEffectIndex < 0) {
                        this.hoverEffectIndex = 0;
                    }
                } else {
                    this.hoverEffectIndex = 0;
                }
                break;
            case "KeyD":
            case "KeyS":
            case "ArrowDown":
            case "ArrowRight":
                if(!this.playerInputsEnabled) {
                    if(this.hoverEffectIndex === null) {
                        this.hoverEffectIndex = 0;
                    }
                    break;
                }
                if(this.hoverEffectIndex !== null) {
                    this.hoverEffectIndex++;
                    const max =  this.playerInputs.length-1;
                    if(this.hoverEffectIndex > max) {
                        this.hoverEffectIndex = max;
                    }
                } else {
                    this.hoverEffectIndex = 0;
                }
                break;
            case "Enter":
            case "Space":
                this.processClick();
                return;
        }
    }

    this.getHitRegister = (x,y) => {
        if(this.playerInputs && x >= this.playerInputsX && x <= this.playerInputsX + this.playerInputsWidth) {
            for(let i = 0;i<this.playerInputs.length;i++) {
                const yValues = this.playerInputsYValues[i];
                if(y >= yValues.value && y <= yValues.value + this.playerInputsHeight) {
                    return i;
                }
            }
        }
        return null;
    }

    this.processMove = (x,y) => {
        this.hoverEffectIndex = this.getHitRegister(x,y);
    }

    this.processClick = (x,y) => {
        if(!this.playerInputsEnabled) {
            if(this.battleSequencer.skipHandles.length > 0) {
                playSound("click.mp3");
            }
            this.battleSequencer.skipEvent();
            if(x && y) {
                this.hoverEffectIndex = this.getHitRegister(x,y);
            }
            return;
        }
        if(this.playerInputEnableStartTime !== null) {
            const inputEnableEndTime =
                this.playerInputEnableStartTime
                + this.playerInputToggleAnimationTime;

            if(performance.now() < inputEnableEndTime) {
                return;
            }
        }
        let hitRegister;
        if(x && y) {
            hitRegister = this.getHitRegister(x,y);
        } else {
            hitRegister = this.hoverEffectIndex;
        }
        if(hitRegister !== null) {
            playSound("click.mp3");
            this.battleSequencer.processPlayerInput(
                hitRegister
            );
        }
    }
}

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

    this.start = () => {
        this.startTime = performance.now() + startTimeOffset;
        const timeout = (this.messages.length+1)*this.fadeIn + (startTimeOffset*0.75);
        setTimeout(endCallback,timeout);
    }

    this.renderMethod = (context,timestamp,width,height) => {

        context.clearRect(0,0,width,height);

        if(this.startTime === null) {
            return;
        }

        const timeDelta = timestamp - this.startTime;

        const progress = timeDelta / this.fadeIn;

        if(progress < 0) {
            return;
        }

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
                    context.fillRect(textArea.x,textArea.y,textArea.width,textArea.height);
                }
                runningYOffset += textArea.height + 10;
            }
        }

        rendererState.fader.process(context,timestamp,width,height);

    }
}
