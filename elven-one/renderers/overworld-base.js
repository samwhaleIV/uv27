function OverworldTestRenderer() {
    this.fader = getFader();
    const playerAnimator = new PlayerAnimator();
    this.playerAnimator = playerAnimator;
    const playerScale = 20;

    const playerCollisionWidth = 5 * playerScale;
    const playerCollisionHeight = 18 * playerScale;
    const halfPlayerCollisionWidth = playerCollisionWidth/2;
    const halfPlayerCollisionHeight = playerCollisionHeight/2;

    const playerObject = new (function(){
        this.ID = "player";
        this.type = "player";
        this.y = 50;
        this.x = 0;
        this.noCollide = false;
        this.zIndex = 100;
        this.getCollisionBounds = () => {
            const playerCrouchDifference = getCrouchDifference();
            const collisionHeight = playerCollisionHeight + playerCrouchDifference;
            return {
                top:collisionHeight+this.y,
                bottom:this.y,
                left:this.x - halfPlayerCollisionWidth,
                right:this.x + halfPlayerCollisionWidth,
                centerX:this.x,
                centerY: this.y + halfPlayerCollisionHeight
            }
        }
        this.render = timestamp => {
            playerAnimator.render(timestamp,halfWidth,this.y,playerScale);
        }
    });
    const changeTimeFactor = 1000;

    let playerJumping = false;
    const jumpMaxHeight = 200;
    let jumpStart = null;
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
    let worldObjectsList = null;

    const genericSquareRender = (timestamp,worldObject,xOffset) => {
        context.fillStyle = worldObject.isCollided ? "blue" : "red";
        context.fillRect(
            worldObject.x+xOffset,
            fullHeight-worldObject.y-worldObject.height,
            worldObject.width,
            worldObject.height
        );
    }

    const genericBoundsGenerator = worldObject => {
        const top = worldObject.y + worldObject.height;
        return {
            top: top,
            bottom: worldObject.y,
            left: worldObject.x,
            right: worldObject.x + worldObject.width,
            centerX: worldObject.x + (worldObject.width / 2),
            centerY: worldObject.y + (worldObject.height / 2)
        }
    }
    
    const getBulletCollisionBounds = bullet => {
        return {
            top: bullet.positionY,
            bottom:bullet.positionY+bulletSize,
            left:bullet.positionX,
            right:bullet.positionX+bulletSize,
            centerX:bullet.positionX+halfBulletSize,
            centerY:bullet.positionY+halfBulletSize
        }
    }

    const currentID = 0;
    const worldObjects = {
        playerObject,
        sq1: {
            ID: "sq1",
            x: 0,
            y: 0,
            width: 150,
            height: 50,
            horizontalVelocity: 0,
            verticalVelocity: 0,
            collisionMode: "push",
            render: genericSquareRender,
            getCollisionBounds: genericBoundsGenerator
        },
        sq2: {
            ID: "sq2",
            x: 200,
            y: 300,
            width: fullWidth,
            height: 50,
            horizontalVelocity: 0,
            verticalVelocity: 70,
            collisionMode: "push",
            render: genericSquareRender,
            getCollisionBounds: genericBoundsGenerator
        }
    };

    const regenerateWordObjectsList = () => {
        const newList = Object.values(worldObjects).sort((a,b)=>{
            const aZIndex = a.zIndex || 0;
            const bZIndex = b.zIndex || 0;
            return aZIndex < bZIndex ? 1 : -1;
        });

        worldObjectsList = [null,...newList];
    }

    this.addWorldObject = (object,customID) => {
        const newID = customID || `object-${currentID++}`;
        object.ID = newID;
        worldObjects[newID] = object;
        regenerateWordObjectsList();

        return newID;
    }
    this.removeWorldObject = objectID => {
        const removedObject = worldObjects[objectID];
        delete worldObjects[objectID];
        regenerateWordObjectsList();

        return removedObject;
    }

    regenerateWordObjectsList();//Put this in some initialization function

    this.updateObjectZIndex = (objectID,zIndex) => {
        worldObjects[objectID].zIndex = zIndex;
        regenerateWordObjectsList();
    }

    let swordEnabled = true;
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
                    jumpStart = playerObject.y;
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
                            positionX: playerObject.x + (playerFacingRight?xOffset:-xOffset),
                            positionY: (playerObject.y + 6.5*playerScale) - getCrouchDifference(),
                            isRight: playerFacingRight,
                            getCollisionBounds: getBulletCollisionBounds
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
                //if(!(pressedKeys["Attack"] && playerAttackMode === "gun")) {
                    playerFacingRight = false;
                    this.playerAnimator.SetMirrored();
                //}
                playerVelocity = -1;
                playerMoving = true;
                if(walkStartTime === null) {
                    walkStartTime = performance.now();
                }
            } else if(pressedKeys["Right"]) {
                //Start travel right
                //if(!(pressedKeys["Attack"] && playerAttackMode === "gun")) {
                    playerFacingRight = true;
                    this.playerAnimator.SetNotMirrored();
                //}
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

        if(worldObjects.sq2.y > fullHeight || worldObjects.sq2.y < -10) {
            worldObjects.sq2.verticalVelocity = -worldObjects.sq2.verticalVelocity;
        }

    }

    const applyCornerClipping = collisionResult => {
        if(collisionResult.right && collisionResult.down) {
            collisionResult.right = false;
        }
        if(collisionResult.left && collisionResult.down) {
            collisionResult.left = false;
        }
        if(collisionResult.right && collisionResult.up) {
            collisionResult.right = false;
        }
        if(collisionResult.left && collisionResult.up) {
            collisionResult.left = false;
        }
    }

    const getCrouchDifference = () => playerCrouched && !playerJumping ? playerScale * 3 : 0;

    const getCollisionState = (worldObject,targetObject=null,collisionFilter=null) => {
        const collision = {
            up:null,
            down:null,
            left:null,
            right:null,
            all:null
        }
        if(worldObject.noCollide) {
            return collision;
        }
        if(!worldObject.getCollisionBounds) {
            return collision;
        }

        const worldObjectBounds = worldObject.getCollisionBounds(worldObject);
        worldObjectBounds.width = worldObjectBounds.right-worldObjectBounds.left;
        worldObjectBounds.height = worldObjectBounds.top-worldObjectBounds.bottom;
        collision.bounds = worldObjectBounds;

        let collisionIndex = targetObject ? 2 : worldObjectsList.length;
        while(--collisionIndex) {
            const collisionItem = targetObject || worldObjectsList[collisionIndex];
            if(worldObject.ID === collisionItem.ID) {
                continue;
            }
            if(collisionItem.noCollide) {
                continue;
            }
            if(collisionFilter && !collisionFilter(collisionItem)) {
                continue;
            }

            if(!collisionItem.getCollisionBounds) {
                continue;
            }
            const collisionItemBounds = collisionItem.getCollisionBounds(collisionItem);
            collisionItemBounds.width = collisionItemBounds.right-collisionItemBounds.left;
            collisionItemBounds.height = collisionItemBounds.top-collisionItemBounds.bottom;

            const w = 0.5 * (worldObjectBounds.width + collisionItemBounds.width);
            const h = 0.5 * (worldObjectBounds.height + collisionItemBounds.height);

            const dx = worldObjectBounds.centerX - collisionItemBounds.centerX;
            const dy = worldObjectBounds.centerY - collisionItemBounds.centerY;

            if(Math.abs(dx) <= w && Math.abs(dy) <= h) {
                const collisionResult = {
                    worldObject: collisionItem,
                    bounds: collisionItemBounds
                };
                let shouldAdd = false;
                if(worldObjectBounds.top >= collisionItemBounds.bottom && worldObjectBounds.bottom < collisionItemBounds.bottom) {
                    collisionResult.up = true;
                    if(collision.up) {
                        collision.up.push(collisionResult);
                    } else {
                        collision.up = [collisionResult];
                    }
                    shouldAdd = true;
                }
                if(worldObjectBounds.bottom <= collisionItemBounds.top && worldObjectBounds.bottom > collisionItemBounds.bottom) {
                    collisionResult.down = true;
                    if(collision.down) {
                        collision.down.push(collisionResult);
                    } else {
                        collision.down = [collisionResult];
                    }
                    shouldAdd = true;
                }
                if(worldObjectBounds.left < collisionItemBounds.centerX) {
                //if(worldObjectBounds.right >= collisionItemBounds.left && worldObjectBounds.right <= collisionItemBounds.centerX) {
                    collisionResult.right = true;
                    if(collision.right) {
                        collision.right.push(collisionResult);
                    } else {
                        collision.right = [collisionResult];
                    }
                    shouldAdd = true;
                }
                if(worldObjectBounds.right > collisionItemBounds.centerX) {
                //if(worldObjectBounds.left <= collisionItemBounds.right && worldObjectBounds.left >= collisionItemBounds.centerX) {
                    collisionResult.left = true;
                    if(collision.left) {
                        collision.left.push(collisionResult);
                    } else {
                        collision.left = [collisionResult];
                    }
                    shouldAdd = true;
                }
                if(shouldAdd) {
                    if(collision.all) {
                        collision.all.push(collisionResult);
                    } else {
                        collision.all = [collisionResult];
                    }
                }
            }
        }

        return collision;
    }

    const setKey = (key,pressed) => {
        switch(key) {
            case "KeyX":
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
        console.log("Overworld: Started game loop",gameLoop);
    }

    let lastFrame = 0;

    this.showHitBox = false;
    this.toggleHitBoxVisible = () => {
        this.showHitBox = !this.showHitBox;
    }

    const updatePlayerPositionX = delta => {
        const newPos = playerObject.x + delta;
        const collisionStateResult = getCollisionState(playerObject);
        const playerBounds = collisionStateResult.bounds;
        const collisionStates = collisionStateResult.all;
        if(!collisionStates) {
            playerObject.x = newPos;
            return;
        }
        let noCollision = true
        if(delta > 0) {
            for(let i = 0; i<collisionStates.length;i++) {
                const collisionState = collisionStates[i];
                if(playerObject.y >= collisionState.worldObject.y) {
                    applyCornerClipping(collisionState);
                }
                if(collisionState.right && !playerBounds.top >= collisionState.bounds.bottom) {
                    if(playerBounds.right > collisionState.bounds.left) {
                        playerObject.x = collisionState.bounds.left - halfPlayerCollisionWidth;
                    }
                    noCollision = false;
                }
            }
        } else if(delta < 0) {
            for(let i = 0;i<collisionStates.length;i++) {
                const collisionState = collisionStates[i];
                if(playerObject.y >= collisionState.worldObject.y) {
                    applyCornerClipping(collisionState);
                }
                if(collisionState.left && !playerBounds.top >= collisionState.bounds.bottom) {
                    if(playerBounds.left < collisionState.bounds.right) {
                        playerObject.x = collisionState.bounds.right + halfPlayerCollisionWidth;
                    }
                    noCollision = false;
                }
            }
        }
        if(noCollision) {
            playerObject.x = newPos;
            this.playerAnimator.SetLegsMoving();
        } else {
            this.playerAnimator.SetLegsIdle();
        }
    }
    const updatePlayerPositionY = delta => {
        const newPos = playerObject.y + delta;
        const collisionStateResult = getCollisionState(playerObject);
        const playerBounds = collisionStateResult.bounds;
        const collisionStates = collisionStateResult.all;
        if(!collisionStates) {
            playerObject.y = newPos;
            return true;
        }
        let noCollision = true;
        if(delta > 0) {
            for(let i = 0;i<collisionStates.length;i++) {
                const collisionState = collisionStates[i];
                applyCornerClipping(collisionState);
                if(collisionState.up) {
                    if(playerBounds.top > collisionState.bounds.bottom) {
                        playerObject.y = collisionState.bounds.bottom - playerBounds.height;
                    }
                    noCollision = false;
                }
            }
        } else if(delta < 0) {
            for(let i = 0;i<collisionStates.length;i++) {
                const collisionState = collisionStates[i];
                applyCornerClipping(collisionState);
                if(collisionState.down) {
                    if(playerBounds.bottom < collisionState.bounds.top) {
                        playerObject.y = collisionState.bounds.top;
                    }
                    noCollision = false;
                }
            }
        }

        if(noCollision) {
            playerObject.y = newPos;
        }
        return noCollision;
    }
    const updateBulletPositionX = (bullet,delta) => {
        const newPos = bullet.positionX + delta;
        const collisionState = getCollisionState(bullet);
        if(collisionState.all || Math.abs(newPos) > 1000) {
            return false;
        }
        bullet.positionX = newPos;
        return true;
    }
    const updateObjectPositionX = (worldObject,delta) => {
        const newPos = worldObject.x + delta;
        if(worldObject.collisionMode === "push") {
            worldObject.x = newPos;
            const collisionState = getCollisionState(worldObject,null,worldObject.pushFilter);

            if(collisionState.left) {
                for(let i = 0; i < collisionState.left.length;i++) {
                    const collidedWithObject = collisionState.left[i];
                    if(collidedWithObject.up || delta < 0) {
                        updateObjectPositionX(collidedWithObject.worldObject,delta);
                    }
                }
            }
            if(collisionState.right) {
                for(let i = 0; i < collisionState.right.length;i++) {
                    const collidedWithObject = collisionState.right[i];
                    if(!collidedWithObject.left && (collidedWithObject.up || delta > 0)) {
                        updateObjectPositionX(collidedWithObject.worldObject,delta);
                    }
                }
            }
        } else {
            worldObject.x = newPos;
        }
    }
    const updateObjectPositionY = (worldObject,delta) => {
        let newPos = worldObject.y + delta;
        if(worldObject.collisionMode === "push") {
            worldObject.y = newPos;
            const collisionState = getCollisionState(worldObject,null,worldObject.pushFilter);

            if(collisionState.up) {
                const collidedWithObject = collisionState.up.sort((a,b)=>{
                    a.worldObject.y > b.worldObject.y ? -1 : 1;
                })[0];
                if(collidedWithObject.worldObject.type === "player") {
                    collidedWithObject.worldObject.y = collisionState.bounds.top;
                } else {
                    updateObjectPositionY(collidedWithObject.worldObject,delta);
                }
            }/*
            if(collisionState.down) {
                for(let i = 0; i < collisionState.down.length;i++) {
                    const collidedWithObject = collisionState.down[i];
                    updateObjectPositionY(collidedWithObject.worldObject,delta);
                }
            }*/
        } else {
            worldObject.y = newPos;
        }
    }

    let jumpEnd = false;
    this.render = timestamp => {
        const timeDelta = timestamp - lastFrame;
        const timeDeltaFactor = timeDelta / changeTimeFactor;
        lastFrame = timestamp;
        if(timeDeltaFactor > 0.1) {
            console.info("Dropped a renderer frame");
            return;
        }
        if(playerJumping && !jumpEnd) {
            if(updatePlayerPositionY(timeDeltaFactor * jumpChange)) {
                if(playerObject.y >= jumpStart + jumpMaxHeight) {
                    jumpEnd = true;
                }
            } else {
                jumpEnd = true;
            }
        } else if(playerObject.y > 0) {
            if(!updatePlayerPositionY(-(timeDeltaFactor * jumpChange))) {
                if(jumpEnd) {
                    this.playerAnimator.SetOnLand();
                    jumpEnd = false;
                    playerJumping = false;
                }
            }
        }
        if(playerObject.y < 0) {
            if(jumpEnd) {
                jumpEnd = false;
                playerJumping = false;
            }
            this.playerAnimator.SetOnLand();
            playerObject.y = 0;
        }
        if(playerMoving && timestamp >= walkStartDelay + walkStartTime) {
            this.playerAnimator.SetLegsMoving();
            if(playerVelocity > 0) {
                updatePlayerPositionX(timeDeltaFactor * playerVelocityChange);
            } else {
                updatePlayerPositionX(-(timeDeltaFactor * playerVelocityChange));
            }
        }
        let bulletIndex = bullets.length;
        let bulletChange = timeDeltaFactor * bulletVelocityChange;

        context.clearRect(0,0,fullWidth,fullHeight);

        while(--bulletIndex) {
            const bullet = bullets[bulletIndex];
            if(updateBulletPositionX(bullet,bullet.isRight ? bulletChange : - bulletChange)) {
                context.fillStyle = "white";
                context.fillRect(
                    bullet.positionX-halfBulletSize,
                    fullHeight-bullet.positionY-halfBulletSize,
                    bulletSize,bulletSize
                );
            } else {
                bullets.splice(bulletIndex,1);
            }
        }

        let worldObjectIndex = worldObjectsList.length;
        while(--worldObjectIndex) {
            const worldObject = worldObjectsList[worldObjectIndex];

            if(worldObject.horizontalVelocity) {
                updateObjectPositionX(worldObject,timeDeltaFactor * worldObject.horizontalVelocity);
            }
            if(worldObject.verticalVelocity) {
                updateObjectPositionY(worldObject,timeDeltaFactor * worldObject.verticalVelocity);
            }

            if(worldObject.render) {
                worldObject.render(timestamp,worldObject,halfWidth-playerObject.x);
            }
        }

        if(this.showHitBox) {
            const playerCrouchDifference = getCrouchDifference();
            context.fillStyle = "rgba(0,0,255,0.5)";
            context.fillRect(
                playerObject.x-playerCollisionWidth/2,
                fullHeight-playerCollisionHeight-playerObject.y+playerCrouchDifference,
                playerCollisionWidth,
                playerCollisionHeight-playerCrouchDifference
            );
        }

        this.fader.render(timestamp);
    }
}
