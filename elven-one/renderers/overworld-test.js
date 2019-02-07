function OverworldTestRenderer() {
    this.fader = getFader();

    this.playerAnimator = new PlayerAnimator();

    let playerY = 50, playerX = halfWidth;
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

    let lastBulletTime = 0;
    const bulletDelay = 1;
    const bulletVelocityChange = 1000;
    const bulletSize = 25;
    const halfBulletSize = bulletSize / 2;

    let playerCrouched = false;

    const playerScale = 20;

    const playerCollisionWidth = 5 * playerScale;
    const playerCollisionHeight = 18 * playerScale;
    const halfPlayerCollisionWidth = playerCollisionWidth/2;
    const halfPlayerCollisionHeight = playerCollisionHeight/2;

    const collisionObjects = [
        null,{
            name: "sq1",
            x: halfWidth,
            y: fullHeight - 500,
            width: 200,
            height: 50,
        },
        {
            name: "sq2",
            x: halfWidth,
            y: fullHeight - 50,
            width: 50,
            height: 50,
        }
    ];

    let swordEnabled = false;
    let gunEnabled = true;

    this.enableSwordMode = () => {
        swordEnabled = true;
    }
    this.disableSwordMode = () => {
        swordEnabled = false;
        if(playerAttackMode === "sword") {
            playerAttackMode = "none";
            this.playerAnimator.SetArmsIdle();
        }
    }
    this.enableGunMode = () => {
        gunEnabled = true;
    }
    this.disableGunMode = () => {
        gunEnabled = false;
        if(playerAttackMode === "gun") {
            this.playerAnimator.HideGunActive();
            this.playerAnimator.SetArmsIdle();
            playerAttackMode = "none";
        }
    }

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
                        if(swordEnabled) {
                            this.playerAnimator.SetSwordArms();
                            playerAttackMode = "sword";
                        } else if(gunEnabled) {
                            this.playerAnimator.SetGunArms();
                            playerAttackMode = "gun";                            
                        }
                        break;
                    case "sword":
                        this.playerAnimator.SetSwordArmsUnactive();
                        if(gunEnabled) {
                            this.playerAnimator.SetGunArms();
                            playerAttackMode = "gun";
                        } else {
                            this.playerAnimator.SetArmsIdle();
                            playerAttackMode = "none";        
                        }
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
                    //Todo: Implement sword attack/collision
                    break;
                case "gun":
                    this.playerAnimator.ShowGunActive();
                    if(performance.now() > lastBulletTime + bulletDelay) {
                        const xOffset = 4.75*playerScale;
                        bullets.push({
                            positionX: playerX + (playerFacingRight?xOffset:-xOffset),
                            positionY: fullHeight - (playerY + jumpOffset + 6.5*playerScale) + getCrouchDifference(),
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

    const getCrouchDifference = () => playerCrouched && !playerJumping ? playerScale * 3 : 0;

    const getPlayerCollisionState = () => {
        const collision = {
            up:false,
            down:false,
            left:false,
            right:false,

            upPos: null,
            downPos: null,
            leftPos:null,
            rightPos:null,
        }

        const playerCrouchDifference = getCrouchDifference();
        const collisionHeight = playerCollisionHeight - playerCrouchDifference;
        const playerCollisionYStart = fullHeight-playerCollisionHeight-(playerY+jumpOffset)+playerCrouchDifference;
        const playerCollisionYCenter = playerCollisionYStart + (collisionHeight / 2);
        const playerCollisionYEnd = playerCollisionYStart + collisionHeight;

        let collisionIndex = collisionObjects.length;

        while(--collisionIndex) {
            const collisionItem = collisionObjects[collisionIndex];
            const collisionItemXCenter = collisionItem.x + (collisionItem.width/2);
            const collisionItemYCenter = collisionItem.y + (collisionItem.height/2);

            const w = 0.5 * (playerCollisionWidth + collisionItem.width);
            const h = 0.5 * (collisionHeight + collisionItem.height);

            const dx = playerX - collisionItemXCenter;
            const dy = playerCollisionYCenter - collisionItemYCenter;

            if(Math.abs(dx) <= w && Math.abs(dy) <= h) {
                if(playerCollisionYStart <= collisionItem.y + collisionItem.height && playerCollisionYStart >= collisionItemYCenter) {
                    collision.up = true;
                    collision.upPos = collisionItem.y + collisionItem.height;
                } else if(playerCollisionYEnd >= collisionItem.y && playerCollisionYEnd <= collisionItemYCenter) {
                    collision.down = true;
                    collision.downPos = collisionItem.y;
                }

                if(playerX + halfPlayerCollisionWidth >= collisionItem.x && playerX + halfPlayerCollisionWidth <= collisionItemXCenter) {
                    collision.right = true;
                    collision.rightPos = collisionItem.x;
                } else if(playerX - halfPlayerCollisionWidth <= collisionItem.x + collisionItem.width && playerX - halfPlayerCollisionWidth >= collisionItemXCenter) {
                    collision.left = true;
                    collision.leftPos = collisionItem.x + collisionItem.width;
                }
            }

        }
        if(collision.right && collision.down) {
            collision.right = false;
        }
        if(collision.left && collision.down) {
            collision.left = false;
        }
        if(collision.right && collision.up) {
            collision.right = false;
        }
        if(collision.left && collision.up) {
            collision.left = false;
        }
        return collision;
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

    this.showHitBox = false;
    this.toggleHitBoxVisible = () => {
        this.showHitBox = !this.showHitBox;
    }

    const updateJumpPosition = delta => {
        const newPos = jumpOffset + delta;
        const collisionState = getPlayerCollisionState();
        if(jumpPhase > 0) {
            if(!collisionState.up) {
                jumpOffset = newPos;
                return true;
            } else {
                const upPosDifference = fullHeight - collisionState.upPos
                if(jumpOffset + playerY + playerCollisionHeight > upPosDifference) {
                    jumpOffset = (upPosDifference - playerCollisionHeight) - playerY;
                }
                return false;
            }
        } else if(jumpPhase < 0) {
            if(!collisionState.down) {
                jumpOffset = newPos;
                return true;
            } else {
                const downPosDifference = fullHeight - collisionState.downPos;
                if(jumpOffset + playerY < downPosDifference) {
                    jumpOffset = downPosDifference - playerY;
                }
                return false;
            }
        }
        return false;
    }
    const updatePlayerPositionX = delta => {
        const newPos = playerX + delta;
        const collisionState = getPlayerCollisionState();
        if(delta > 0) {
            if(!collisionState.right) {
                playerX = newPos;
                this.playerAnimator.SetLegsMoving();
            } else {
                if(playerX + halfPlayerCollisionWidth > collisionState.rightPos) {
                    playerX = collisionState.rightPos - halfPlayerCollisionWidth;
                }
                this.playerAnimator.SetLegsIdle();
            }
        } else if(delta < 0) {
            if(!collisionState.left) {
                playerX = newPos;
                this.playerAnimator.SetLegsMoving();
            } else {
                if(playerX - halfPlayerCollisionWidth < collisionState.leftPos) {
                    playerX = collisionState.leftPos +  halfPlayerCollisionWidth;
                }
                this.playerAnimator.SetLegsIdle();
            }
        }
    }
    const updatePlayerPositionY = delta => {
        const newPos = playerY + delta;
        const collisionState = getPlayerCollisionState();
        if(delta > 0) {
            if(!collisionState.up) {
                playerY = newPos;
            } else {
                const upPosDifference = fullHeight - collisionState.upPos
                if(jumpOffset + playerY + playerCollisionHeight > upPosDifference) {
                    playerY = (upPosDifference - playerCollisionHeight) - jumpOffset;
                }
            }
        } else if(delta < 0) {
            if(!collisionState.down) {
                playerY = newPos;
            } else {
                const downPosDifference = fullHeight - collisionState.downPos;
                if(jumpOffset + playerY < downPosDifference) {
                    playerY = downPosDifference - jumpOffset;
                }
            }
        }
    }
    const updateBulletPositionX = (bullet,delta) => {
        bullet.positionX += delta;
        //Todo: Bullet collision
    }

    this.render = timestamp => {
        
        const timeDelta = timestamp - lastFrame;
        context.clearRect(0,0,fullWidth,fullHeight);



        if(playerJumping) {
            if(jumpPhase > 0) {
                if(!updateJumpPosition((timeDelta / changeTimeFactor) * jumpChange)) {
                    jumpPhase = -1;
                } else if(jumpOffset >= jumpMaxHeight) {
                    jumpOffset = jumpMaxHeight;
                    jumpPhase = -1;
                }
            } else {
                if(!updateJumpPosition(-(timeDelta / changeTimeFactor) * jumpChange)) {
                    playerY = jumpOffset;
                    jumpOffset = 0;
                    playerJumping = false;
                    this.playerAnimator.SetOnLand();
                } else if(jumpOffset <= 0) {
                    jumpOffset = 0;
                    playerJumping = false;
                    this.playerAnimator.SetOnLand();
                }
            }
        } else if(playerY > 0) {
            updatePlayerPositionY(-((timeDelta / changeTimeFactor) * jumpChange));
            if(playerY < 0) {
                playerY = 0;
            }
        }
        if(playerMoving && timestamp >= walkStartDelay + walkStartTime) {
            this.playerAnimator.SetLegsMoving();
            if(playerVelocity > 0) {
                updatePlayerPositionX((timeDelta / changeTimeFactor) * playerVelocityChange);
            } else {
                updatePlayerPositionX(-((timeDelta / changeTimeFactor) * playerVelocityChange));
            }
        }
        let bulletIndex = bullets.length;
        let bulletChange = (timeDelta / changeTimeFactor) * bulletVelocityChange;

        while(--bulletIndex) {
            updateBulletPositionX(bullets[bulletIndex],bullets[bulletIndex].isRight ? bulletChange : - bulletChange);

            context.fillStyle = "white";

            context.fillRect(bullets[bulletIndex].positionX-halfBulletSize,bullets[bulletIndex].positionY-halfBulletSize,bulletSize,bulletSize);

            if(Math.abs(bullets[bulletIndex].positionX) > 2000) {
                bullets.splice(bulletIndex,1);
            }
        }

        context.fillStyle = "rgba(255,0,0,0.5)";
        context.fillRect(collisionObjects[1].x,collisionObjects[1].y,collisionObjects[1].width,collisionObjects[1].height);
        context.fillRect(collisionObjects[2].x,collisionObjects[2].y,collisionObjects[2].width,collisionObjects[2].height);

        if(this.showHitBox) {
            const playerCrouchDifference = getCrouchDifference();
            context.fillStyle = "rgba(0,0,255,0.5)";
            context.fillRect(
                playerX-playerCollisionWidth/2,
                fullHeight-playerCollisionHeight-(playerY+jumpOffset)+playerCrouchDifference,
                playerCollisionWidth,
                playerCollisionHeight-playerCrouchDifference
            );
        }

        this.playerAnimator.render(timestamp,playerX,playerY+jumpOffset,playerScale);

        this.fader.render(timestamp);

        lastFrame = timestamp;
    }
}
