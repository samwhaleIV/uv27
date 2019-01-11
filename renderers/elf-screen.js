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
        this.elfTextBubbleY += 23;
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

            if(this.playerInputDisableStartTime !== null) {

                const timeDifference =  timestamp - this.playerInputDisableStartTime;

                let progress = timeDifference / this.playerInputToggleAnimationTime;

                animating = true;

                if(progress >= 1) {
                    progress = 1;
                    animating = false;
                    //this.playerInputDisableStartTime = null;
                }

                const distance = progress * this.playerInputToggleDistance;
                evenOffset = -distance;
                oddOffset = distance;

            } else if(this.playerInputEnableStartTime !== null) {

                const timeDifference =  timestamp - this.playerInputEnableStartTime;

                let progress = 1 - (timeDifference / this.playerInputToggleAnimationTime);

                animating = true;

                if(progress <= 0) {
                    progress = 0;
                    animating = false;
                    //this.playerInputEnableStartTime = null;
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
                } else if(this.firstInputMask && this.hoverEffectIndex !== null && i === 0 && (this.lastEventWasKeyBased || this.hoverEffectIndex === 0)) {
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

    this.lastEventWasKeyBased = false;

    this.processKey = key => {
        switch(key) {
            case "KeyW":
            case "KeyA":
            case "ArrowUp":
            case "ArrowLeft":
                this.lastEventWasKeyBased = true;
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
                this.lastEventWasKeyBased = true;
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
                this.lastEventWasKeyBased = true;
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
        this.lastEventWasKeyBased = false;
        this.hoverEffectIndex = this.getHitRegister(x,y);
    }

    this.processClick = (x,y) => {
        if(!this.playerInputsEnabled) {
            if(this.battleSequencer.skipHandles.length > 0) {
                playSound("click.mp3");
            }
            this.battleSequencer.skipEvent();
            if(x > -1 && y > -1) {
                this.hoverEffectIndex = this.getHitRegister(x,y);
                this.lastEventWasKeyBased = false;
            } else {
                this.lastEventWasKeyBased = true;
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
        if(x > -1&& y > -1) {
            hitRegister = this.getHitRegister(x,y);
            this.lastEventWasKeyBased = false;
        } else {
            hitRegister = this.hoverEffectIndex;
            this.lastEventWasKeyBased = true;
        }
        if(hitRegister !== null) {
            playSound("click.mp3");
            this.battleSequencer.processPlayerInput(
                hitRegister
            );
        }
    }
}
