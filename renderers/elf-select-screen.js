function ElfSelectScreenRenderer(endCallback,highestElfIndex,loadIndex) {

    this.getSongSegmentsForIndex = index => {
        const manifest = {
            "intro_base":false,
            "loop_base":false,
            "intro_a":false,
            "loop_a":false,
            "intro_b":false,
            "loop_b":false
        };
        if(index <= 9) {
            manifest["intro_base"] = true;
            manifest["loop_base"] = true;
            manifest.index = 0;
        } else if(index <= 19) {
            manifest["intro_a"] = true;
            manifest["loop_a"] = true;
            manifest.index = 1;
        } else {
            manifest["intro_b"] = true;
            manifest["loop_b"] = true;
            manifest.index = 2;
        }
        return manifest;
    }

    this.currentSongIndex = -1;
    this.updateSong = index => {
        const updatedSongManifest = this.getSongSegmentsForIndex(index);
        if(updatedSongManifest.index !== this.currentSongIndex) {
            this.currentSongIndex = updatedSongManifest.index;
            loopMuteManifest = {
                "loop_base":{shouldPlay:updatedSongManifest["loop_base"]},
                "loop_a":{shouldPlay:updatedSongManifest["loop_a"]},
                "loop_b":{shouldPlay:updatedSongManifest["loop_b"]}
            };
            introMuteManifest = {
                "intro_base":{shouldPlay:updatedSongManifest["intro_base"]},
                "intro_a":{shouldPlay:updatedSongManifest["intro_a"]},
                "intro_b":{shouldPlay:updatedSongManifest["intro_b"]}
            }
            for(let key in updatedSongManifest) {
                if(updatedSongManifest[key]) {
                    unmuteTrack(key);
                } else {
                    muteTrack(key);
                }
            }
        }
    }

    this.songStartAction = () => {
        console.log(introMuteManifest,loopMuteManifest);
        const startTime = audioContext.currentTime;
        playMusicWithIntro("loop_base","intro_base",true,startTime);
        playMusicWithIntro("loop_a","intro_a",true,startTime);
        playMusicWithIntro("loop_b","intro_b",true,startTime);
    }
    this.fader = getFader();

    const backgroundCycleTime = 40000;

    this.halfWidth = canvas.width / 2;

    this.endCallback = endCallback;
    this.highestElfIndex = highestElfIndex || 0;

    if(loadIndex || loadIndex === 0) {
        this.currentIndex = loadIndex;
    } else {
        this.currentIndex = this.highestElfIndex;
    }

    localStorage.setItem("lastCurrentIndex",this.currentIndex);

    this.elfWidth = 160;
    this.elfHeight = Math.floor((elfSourceHeight / elfSourceWidth) * this.elfWidth);

    this.textScale = 8;
    this.elf = null;
    this.text = null;
    this.textX = null;
    this.textHeight = null;

    this.background = new Background("background-1","rgb(30,30,30)",backgroundCycleTime);

    this.leftDisabled = null;
    this.rightDisabled = null;

    this.currentIndexText = null;

    this.showReplayButton = false;

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
        if(this.currentIndex === 0) {
            this.showReplayButton = true;
        } else {
            this.showReplayButton = false;
            if(this.hoverEffectIndex === 5) {
                this.hoverEffectIndex = null;
            }
        }
        this.updateSong(this.currentIndex);
        this.currentIndexText = `elf ${this.currentIndex+1}`;
    }
    this.setElf();

    this.elfX = Math.round(this.halfWidth - (this.elfWidth / 2));
    this.buttonHeight = 40;

    const verticalSpacing = 10;

    const totalHeight =
        this.textHeight + this.elfHeight +
        this.buttonHeight + (verticalSpacing * 2);

    this.textY = Math.floor((canvas.height / 2) - (totalHeight / 2)) - 45;
    this.elfY = this.textY + verticalSpacing + this.textHeight;
    this.buttonY = this.elfY + verticalSpacing + this.elfHeight;

    this.goLeft = () => {
        if(this.transitioning) {
            return;
        }
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = 0;
        } else {
            playSound("click");
            this.setElf();
        }
        localStorage.setItem("lastCurrentIndex",this.currentIndex);
    }

    this.goRight = () => {
        if(this.transitioning) {
            return;
        }
        this.currentIndex++;
        if(this.currentIndex > this.highestElfIndex) {
            this.currentIndex = this.highestElfIndex;
        } else {
            playSound("click");
            this.setElf();
        }
        localStorage.setItem("lastCurrentIndex",this.currentIndex);
    }

    this.transitioning = false;

    this.elfClicked = () => {
        if(this.transitioning) {
            return;
        }
        if(this.currentIndex <= highestElfIndex) {
            playSound("click");
            this.endCallback(this.currentIndex);
        }
    }

    this.introductionClicked = () => {
        if(this.transitioning) {
            return;
        }
        playSound("click");
        rendererState.fader.fadeOut(
            IntroductionRenderer,
            ()=>getSelectScreen(0)
        );
    }

    this.hoverEffectIndex = null;

    const buttonSpacing = 10;
    this.buttonWidth = 200;

    const spacedWidth = this.buttonWidth + buttonSpacing;
    const totalWidth = (spacedWidth * 3) - buttonSpacing;

    this.leftButtonX = Math.round(this.halfWidth - (totalWidth / 2));
    this.centerButtonX = this.leftButtonX + spacedWidth;
    this.rightButtonX = this.centerButtonX + spacedWidth;
    
    this.hoverEffectSize = 3;
    this.doubleHoverSize = this.hoverEffectSize + this.hoverEffectSize;

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

    this.muteButtonWidth = 100;
    this.muteButtonHeight = 50;

    const muteButtonHalfWidth = this.muteButtonWidth / 2;
    const muteButtonHalfHeight = this.muteButtonHeight / 2;

    const muteButtonMargin = 15;
    const halfMuteButtonMargin = muteButtonMargin / 2;

    this.muteButtonTextScale = 2;

    this.muteButton1X = Math.ceil(this.halfWidth - this.muteButtonWidth - halfMuteButtonMargin);
    this.muteButton1Y = canvas.height - this.muteButtonHeight - muteButtonMargin;
    this.muteButton1Text = musicMuted ? "no music" : "music on";

    const muteButton1TextTest = drawTextTest(this.muteButton1Text,this.muteButtonTextScale);
    this.muteButton1TextX = this.muteButton1X + Math.floor(muteButtonHalfWidth - (muteButton1TextTest.width / 2));
    this.muteButton1TextY = this.muteButton1Y + Math.floor(muteButtonHalfHeight - (muteButton1TextTest.height / 2));


    this.muteButton2X = Math.floor(this.halfWidth + halfMuteButtonMargin);
    this.muteButton2Y = this.muteButton1Y;
    this.muteButton2Text = soundMuted ? "no sound" : "sound on";

    const muteButton2TextTest = drawTextTest(this.muteButton2Text,this.muteButtonTextScale);
    this.muteButton2TextX = this.muteButton2X + Math.floor(muteButtonHalfWidth - (muteButton2TextTest.width / 2));
    this.muteButton2TextY = this.muteButton2Y + Math.floor(muteButtonHalfHeight - (muteButton2TextTest.height / 2));

    this.replayButtonX = 15;
    this.replayButtonWidth = this.muteButtonWidth + 50;
    this.replayButtonHeight = this.muteButtonHeight;
    this.replayButtonY = this.muteButton1Y;

    const replayButtonTextWidth = drawTextTest("introduction",this.muteButtonTextScale).width;

    this.replayButtonTextX = this.replayButtonX + Math.floor((this.replayButtonWidth / 2) - (replayButtonTextWidth / 2));
    this.replayButtonTextY = this.muteButton1TextY;

    
    this.processClick = (x,y) => {
        if(this.transitioning) {
            return;
        }
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
            case 3:
                toggleMusicMute();
                playSound("click");
                break;
            case 4:
                toggleSoundMute();
                playSound("click");
                break;
            case 5:
                this.introductionClicked();
                break;
        }
    }

    this.processKey = key => {
        switch(key) {
            case "LeftBumper":
                if(!this.transitioning) {
                    this.goLeft();
                }
                break;
            case "RightBumper":
                if(!this.transitioning) {
                    this.goRight();
                }
                break;
            case "KeyW":
            case "ArrowUp":
                if(this.hoverEffectIndex === null) {
                    this.hoverEffectIndex = 1;
                } else {
                    switch(this.hoverEffectIndex) {
                        case 3:
                        case 4:
                            this.hoverEffectIndex = 1;
                            break;
                        case 5:
                            this.hoverEffectIndex = 0;
                            break;
                    }
                }
                break;
            case "KeyD":
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
                        case 3:
                            this.hoverEffectIndex = 4;
                            break;
                        case 5:
                            this.hoverEffectIndex = 3;
                            break;
                    }
                }
                break;
            case "KeyS":
            case "ArrowDown":
                if(this.hoverEffectIndex === null) {
                    this.hoverEffectIndex = 1;
                } else {
                    switch(this.hoverEffectIndex) {
                        case 0:
                            if(this.showReplayButton) {
                                this.hoverEffectIndex = 5;
                            } else {
                                this.hoverEffectIndex = 3;
                            }
                            break;
                        case 1:
                            this.hoverEffectIndex = 3;
                            break;
                        case 2:
                            this.hoverEffectIndex = 4;
                            break;
                    }
                }
                break;
            case "KeyA":
            case "ArrowLeft":
                if(this.hoverEffectIndex === null) {
                    this.hoverEffectIndex = 1;
                } else {
                    switch(this.hoverEffectIndex) {
                        case 2:
                            this.hoverEffectIndex = 1;
                            break;
                        case 1:
                            this.hoverEffectIndex = 0;
                            break;
                        case 4:
                            this.hoverEffectIndex = 3;
                            break;
                        case 3:
                            if(this.showReplayButton) {
                                this.hoverEffectIndex = 5;
                            }
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
                if(x <= this.leftButtonX + this.buttonWidth) {
                    this.hoverEffectIndex = 0;
                    return;
                }
            }
        } else if(y >= this.muteButton1Y && y <= this.muteButton1Y + this.muteButtonHeight) {
            if(x >= this.muteButton1X && x <= this.muteButton1X + this.muteButtonWidth) {
                this.hoverEffectIndex = 3;
                return;
            } else if(x >= this.muteButton2X && x <= this.muteButton2X + this.muteButtonWidth) {
                this.hoverEffectIndex = 4;
                return;
            } else if(this.showReplayButton && x >= this.replayButtonX && x <= this.replayButtonX + this.replayButtonWidth) {
                this.hoverEffectIndex = 5;
                return;
            }
        }
        this.hoverEffectIndex = null;
    }

    this.renderMethod = (context,timestamp,width,height) => {

        this.background.renderNormal(context,timestamp,width,height);

        if(this.elf.defaultRenderLayers) {
            for(let i = 0;i<this.elf.defaultRenderLayers.length;i++) {
                if(this.elf.defaultRenderLayers[i]) {
                    context.drawImage(
                        imageDictionary[`elves-layer-${i}`],
                        this.elf.x,0,elfSourceWidth,elfSourceHeight,
                        this.elfX,this.elfY,this.elfWidth,this.elfHeight
                    );
                }
            }
        } else {
            context.drawImage(
                imageDictionary["elves-layer-0"],
                this.elf.x,0,elfSourceWidth,elfSourceHeight,
                this.elfX,this.elfY,this.elfWidth,this.elfHeight
            );
        }

        drawTextWhite(this.text,this.textX,this.textY,this.textScale);
        drawTextWhite(this.currentIndexText,15,15,3);

        if(this.hoverEffectIndex !== null) {
            let hoverEffectX, hoverEffectY, hoverWidth, hoverHeight;
            switch(this.hoverEffectIndex) {
                case 0:
                    hoverEffectX = this.leftButtonX;
                    hoverEffectY = this.buttonY;

                    hoverWidth = this.buttonWidth;
                    hoverHeight = this.buttonHeight;
                    break;
                case 1:
                    hoverEffectX = this.centerButtonX;
                    hoverEffectY = this.buttonY;

                    hoverWidth = this.buttonWidth;
                    hoverHeight = this.buttonHeight;
                    break;
                case 2:
                    hoverEffectX = this.rightButtonX;
                    hoverEffectY = this.buttonY;

                    hoverWidth = this.buttonWidth;
                    hoverHeight = this.buttonHeight;
                    break;
                case 3:
                    hoverEffectX = this.muteButton1X;
                    hoverEffectY = this.muteButton1Y;

                    hoverWidth = this.muteButtonWidth;
                    hoverHeight = this.muteButtonHeight;
                    break;
                case 4:
                    hoverEffectX = this.muteButton2X
                    hoverEffectY = this.muteButton2Y;

                    hoverWidth = this.muteButtonWidth;
                    hoverHeight = this.muteButtonHeight;
                    break;
                case 5:
                    hoverEffectX = this.replayButtonX;
                    hoverEffectY = this.replayButtonY;

                    hoverWidth = this.replayButtonWidth;
                    hoverHeight = this.replayButtonHeight;
                    break;
            }
            context.fillStyle = "rgba(255,255,255,0.7)";
            context.fillRect(
                hoverEffectX - this.hoverEffectSize,hoverEffectY - this.hoverEffectSize,
                hoverWidth + this.doubleHoverSize,hoverHeight + this.doubleHoverSize
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


        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(
            this.muteButton1X,
            this.muteButton1Y,
            this.muteButtonWidth,
            this.muteButtonHeight
        );

        context.fillRect(
            this.muteButton2X,
            this.muteButton2Y,
            this.muteButtonWidth,
            this.muteButtonHeight
        );

        if(this.showReplayButton) {

            context.fillRect(
                this.replayButtonX,
                this.replayButtonY,
                this.replayButtonWidth,
                this.replayButtonHeight
            );

            drawTextBlack("introduction",this.replayButtonTextX,this.replayButtonTextY,this.muteButtonTextScale);
        }

        drawTextBlack(musicMuted ? "no music" : "music on",this.muteButton1TextX,this.muteButton1TextY,this.muteButtonTextScale);
        drawTextBlack(soundMuted ? "no sound" : "sound on",this.muteButton2TextX,this.muteButton2TextY,this.muteButtonTextScale);

        rendererState.fader.process(context,timestamp,width,height);
    }
}
