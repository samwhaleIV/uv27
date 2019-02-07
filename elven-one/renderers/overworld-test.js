function OverworldTestRenderer() {
    this.fader = getFader();

    this.playerAnimator = new PlayerAnimator();

    const tileWidth = fullWidth / 50;
    const tileHeight = fullHeight / 50;

    const tileRolloverTime = 1000;

    let playerY = 0, playerX = halfWidth;
    let jumpOffset = 0;

    const changeTimeFactor = 1000;

    let playerJumping = false, jumpPhase;
    const jumpMaxHeight = 200;
    const jumpStart = 5;
    const jumpChange = jumpMaxHeight * 4.5;

    const walkStartDelay = 0;
    let walkStartTime = null;


    this.playerAnimator.SetLegsMoving();
    this.playerAnimator.SetWalkingSpeed(1);

    const pressedKeys = {};
    let releasedJumpKey = true;

    let playerVelocity = 0;
    let playerMoving = false;
    const playerVelocityChange = 400;

    const bullets = [null];

    let playerFacingRight = true;
    let playerAttackMode = "none";
    let releasedAttackToggleKey = true;

    let leftMovementBlocked = false;
    let rightMovementBlocked = false;

    let lastBulletTime = 0;
    const bulletDelay = 1;
    const bulletVelocityChange = 1000;
    const bulletSize = 25;
    const halfBulletSize = bulletSize / 2;

    let playerCrouched = false;

    const playerScale = 20;

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
        if(pressedKeys["CycleAttack"]) {
            if(releasedAttackToggleKey) {
                switch(playerAttackMode) {
                    case "none":
                        this.playerAnimator.SetSwordArms();
                        playerAttackMode = "sword";
                        break;
                    case "sword":
                        this.playerAnimator.SetGunArms();
                        playerAttackMode = "gun";
                        break;
                    case "gun":
                        this.playerAnimator.HideGunActive();
                        this.playerAnimator.SetArmsIdle();
                        playerAttackMode = "none";
                        break;
                    }
                releasedAttackToggleKey = false;
            }
        } else {
            releasedAttackToggleKey = true;
        }
        if(pressedKeys["Down"]) {
            this.playerAnimator.SetCrouched();
            playerCrouched = true;
        } else {
            this.playerAnimator.SetUncrouched();
            playerCrouched = false;
        }
        if(pressedKeys["Attack"]) {
            switch(playerAttackMode) {
                case "sword":
                    this.playerAnimator.SetSwordArmsActive();
                    break;
                case "gun":
                    this.playerAnimator.ShowGunActive();
                    if(performance.now() > lastBulletTime + bulletDelay) {
                        const xOffset = 4.75*playerScale;
                        bullets.push({
                            positionX: playerX + (playerFacingRight?xOffset:-xOffset),
                            positionY: fullHeight - (playerY + jumpOffset + 6.5*playerScale) + (playerCrouched&&!playerJumping?3*playerScale:0),
                            isRight: playerFacingRight
                        });
                        lastBulletTime = performance.now();
                    }
                    break;
            }
        } else {
            switch(playerAttackMode) {
                case "sword":
                    this.playerAnimator.SetSwordArmsUnactive();
                    break;
                case "gun":
                    this.playerAnimator.HideGunActive();
                    break;
            }
        }
        if(!(pressedKeys["Left"] && pressedKeys["Right"]) && !playerCrouched) {
            if(pressedKeys["Left"]) {
                //Start travel left
                if(!(pressedKeys["Attack"] && playerAttackMode === "gun")) {
                    playerFacingRight = false;
                    this.playerAnimator.SetMirrored();
                }
                playerVelocity = -1;
                playerMoving = true;
                if(walkStartTime === null) {
                    walkStartTime = performance.now();
                }
            } else if(pressedKeys["Right"]) {
                //Start travel right
                if(!(pressedKeys["Attack"] && playerAttackMode === "gun")) {
                    playerFacingRight = true;
                    this.playerAnimator.SetNotMirrored();
                }
                playerVelocity = 1;
                playerMoving = true;
                if(walkStartTime === null) {
                    walkStartTime = performance.now();
                }
            } else {
                //No movements keys pressed
                playerVelocity = 0;
                playerMoving = false;
                this.playerAnimator.SetLegsIdle();
                walkStartTime = null;
            }
        } else {
            //Both movement keys pressed - suspend right to left walking
            playerVelocity = 0;
            playerMoving = false;
            this.playerAnimator.SetLegsIdle();
        }
    }

    const setKey = (key,pressed) => {
        switch(key) {
            case "RightBumper":
                pressedKeys["CycleAttack"] = pressed;
                break;
            case "KeyZ":
                pressedKeys["Attack"] = pressed;
                break;
            case "Escape":
                pressedKeys["Escape"] = pressed;
                return;
            case "KeyW":
            case "ArrowUp":
                pressedKeys["Space"] = pressed;
                return;
            case "KeyA":
            case "ArrowLeft":
                pressedKeys["Left"] = pressed;
                return;
            case "KeyD":
            case "ArrowRight":
                pressedKeys["Right"] = pressed;
                return;
            case "KeyS":
            case "ArrowDown":
                pressedKeys["Down"] = pressed;
                return;
            case "Enter":
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

        context.clearRect(0,0,fullWidth,fullHeight);

        const timeDelta = timestamp - lastFrame;

        const tileOffset = (timestamp % tileRolloverTime / tileRolloverTime) * -100;
        
        for(let x = 0;x<tileWidth+2;x++) {
            for(let y = 0;y<tileHeight;y++) {
                context.fillStyle = (x + y) % 2 === 0 ? "rgb(30,30,30)" : "black";
                context.fillRect(x*50+tileOffset,y*50,50,50);
            }
        }

        if(playerJumping) {
            if(jumpPhase > 0 && !rightMovementBlocked) {
                jumpOffset += (timeDelta / changeTimeFactor) * jumpChange;
                if(jumpOffset >= jumpMaxHeight) {
                    jumpOffset = jumpMaxHeight;
                    jumpPhase = -1;
                }
            } else {
                jumpOffset -= (timeDelta / changeTimeFactor) * jumpChange;
                if(jumpOffset <= 0 && !leftMovementBlocked) {
                    jumpOffset = 0;
                    playerJumping = false;
                    this.playerAnimator.SetOnLand();
                }
            }
        }
        if(playerMoving && timestamp >= walkStartDelay + walkStartTime) {
            this.playerAnimator.SetLegsMoving();
            if(playerVelocity > 0) {
                playerX += (timeDelta / changeTimeFactor) * playerVelocityChange;
            } else {
                playerX -= (timeDelta / changeTimeFactor) * playerVelocityChange;
            }
        }
        let bulletIndex = bullets.length;
        let bulletChange = (timeDelta / changeTimeFactor) * bulletVelocityChange;

        while(--bulletIndex) {
            bullets[bulletIndex].positionX += bullets[bulletIndex].isRight ? bulletChange : - bulletChange;

            context.fillStyle = "white";

            context.fillRect(bullets[bulletIndex].positionX-halfBulletSize,bullets[bulletIndex].positionY-halfBulletSize,bulletSize,bulletSize);

            if(Math.abs(bullets[bulletIndex].positionX) > 2000) {
                bullets.splice(bulletIndex,1);
            }
        }

        this.playerAnimator.render(timestamp,playerX,playerY+jumpOffset,playerScale);

        this.fader.render(timestamp);

        lastFrame = timestamp;
    }
}
