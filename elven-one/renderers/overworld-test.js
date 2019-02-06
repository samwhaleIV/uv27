function OverworldTestRenderer() {
    this.fader = getFader();

    this.playerAnimator = new PlayerAnimator();

    const tileWidth = fullWidth / 50;
    const tileHeight = fullHeight / 50;

    const tileRolloverTime = 1000;

    let playerY = 0;
    let jumpOffset = 0;

    let playerJumping = false, jumpPhase;
    const jumpMaxHeight = 200;
    const jumpStart = 5;
    const jumpChange = jumpMaxHeight * 1.5;
    const jumpChangeTime = 350;


    //this.playerAnimator.SetLegsMoving();
    this.playerAnimator.SetWalkingSpeed(0.5);

    const pressedKeys = {};
    let releasedJumpKey = true;

    const gameTick = () => {
        if(!playerJumping) {
            if(pressedKeys["Space"]) {
                if(releasedJumpKey) {
                    playerJumping = true;
                    jumpPhase = 1;
                    jumpOffset = jumpStart;
                    this.playerAnimator.SetInAir();
                }
                releasedJumpKey = false;
            } else {
                releasedJumpKey = true;
            }
        }
    }

    const setKey = (key,pressed) => {
        switch(key) {
            case "Escape":
                pressedKeys["Escape"] = pressed;
                return;
            case "KeyW":
            case "ArrowUp":
                pressedKeys["Up"] = pressed;
                return;
            case "KeyA":
            case "ArrowLeft":
                this.playerAnimator.SetMirrored();
                pressedKeys["Left"] = pressed;
                return;
            case "KeyD":
            case "ArrowRight":
                this.playerAnimator.SetNotMirrored();
                pressedKeys["Right"] = pressed;
                return;
            case "KeyS":
            case "ArrowDown":
                pressedKeys["Down"] = pressed;
                return;
            case "Space":
                pressedKeys["Space"] = pressed;
                return;
        }
    }

    this.processKey = key => setKey(key,true);
    this.processKeyUp = key => setKey(key,false);

    let gameLoop;
    this.start = timestamp => {
        console.log("Overworld test: Started game loop",timestamp);
        gameLoop = setInterval(gameTick,1000/64);
    }

    let lastFrame = 0;

    this.render = timestamp => {

        const timeDelta = timestamp - lastFrame;

        const tileOffset = 1 || (timestamp % tileRolloverTime / tileRolloverTime) * -100;
        
        for(let x = 0;x<tileWidth+2;x++) {
            for(let y = 0;y<tileHeight;y++) {
                context.fillStyle = (x + y) % 2 === 0 ? "rgb(30,30,30)" : "black";
                context.fillRect(x*50+tileOffset,y*50,50,50);
            }
        }

        if(playerJumping) {
            if(jumpPhase > 0) {
                jumpOffset += (timeDelta / jumpChangeTime) * jumpChange;
                if(jumpOffset >= jumpMaxHeight) {
                    jumpOffset = jumpMaxHeight;
                    jumpPhase = -1;
                }
            } else {
                jumpOffset -= (timeDelta / jumpChangeTime) * jumpChange;
                if(jumpOffset <= 0) {
                    jumpOffset = 0;
                    playerJumping = false;
                    this.playerAnimator.SetOnLand();
                }
            }
        }

        if(pressedKeys["Space"]) {
            drawTextWhite("space up",15,15,4);
        } else {
            drawTextWhite("space down",15,15,4);
        }

        this.playerAnimator.render(timestamp,halfWidth,playerY+jumpOffset,20);

        this.fader.render(timestamp);

        lastFrame = timestamp;
    }
}
