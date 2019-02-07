function PlayerAnimator() {

    const legsImage = imageDictionary["legs"];
    const headImage = imageDictionary["heads"];
    const armsImage = imageDictionary["arms"];

    const mirroredLegsImage = imageDictionary["legs-mirrored"];
    const mirroredHeadImage = imageDictionary["heads-mirrored"];
    const mirroredArmsImage = imageDictionary["arms-mirrored"];
    
    const swordFrameTime = 1000 / 10;
    const legsFrameTime = 1000 / 6;
    const crouchFrame = 5;
    const legWalkFrames = [0,1,2,3];

    const swordsIdleFrame = 2;
    const swordActiveFrames = [0,1];

    const gunIdleFrame = 4;
    const gunActiveFrames = [5,4];
    const gunFrameTime = 100;

    let isMirrored = false;

    const legAirFrame = 0;
    const legIdleFrame = 4;
    const armIdleFrame = 6;
    const armAirFrame = 3;

    const defaultHeadFrame = 0;

    let currentHeadFrame = defaultHeadFrame;

    let inAir = false;
    let legsMoving = false;

    this.SetLegsMoving = () => {
        legsMoving = true;
    }
    this.SetLegsIdle = () => {
        legsMoving = false;
    }

    this.SetInAir = () => {
        inAir = true;
    }
    this.SetOnLand = () => {
        inAir = false;
    }

    this.SetHead = frameNumber => {
        currentHeadFrame = frameNumber;
    }
    this.SetMirrored = () => {
        isMirrored = true;
    }
    this.SetNotMirrored = () => {
        isMirrored = false;
    }

    let walkingSpeed = 1;
    this.SetWalkingSpeed = speed => {
        walkingSpeed = speed;
    }

    let armState = 0;

    this.SetArmsIdle = () => {
        armState = 0;
    }

    this.SetGunArms = () => {
        armState = 1;
    }
    let gunIsActive = false;
    this.ShowGunActive = () => {
        gunIsActive = true;
    }
    this.HideGunActive = () => {
        gunIsActive = false;
    }

    let swordArmsActive = false;
    this.SetSwordArms = () => {
        armState = 2;
    }
    this.SetSwordArmsActive = () => {
        swordArmsActive = true;
    }
    this.SetSwordArmsUnactive = () => {
        swordArmsActive = false;
    }

    let crouched = false;
    this.SetCrouched = () => {
        crouched = true;
    }
    this.SetUncrouched = () => {
        crouched = false;
    }

    let globalXOffset;
    let globalYOffset;
    this.SetOffset = (x,y) => {
        globalXOffset = x;
        globalYOffset = y;
    }
    
    const legsFrameWidth = 6;
    const armsFrameWidth = 12;
    const headFrameWidth = 6;

    const legsFrameHeight = 4;
    const armsFrameHeight = 5;
    const headFrameHeight = 9;

    const highestWidth = Math.max(legsFrameWidth,armsFrameWidth,headFrameWidth);

    this.render = (timestamp,destinationX,destinationY,scale) => {

        destinationY = fullHeight - destinationY;

        const headHeight = headFrameHeight * scale;
        const armsHeight = armsFrameHeight * scale;
        const legsHeight = legsFrameHeight * scale;

        const totalHeight = (headFrameHeight + armsFrameHeight + legsFrameHeight) * scale;

        const legsWidth = legsFrameWidth * scale;
        const armsWidth = armsFrameWidth * scale;
        const headWidth = headFrameWidth * scale;

        const armsY = destinationY + headHeight;
        const legsY = armsY + armsHeight;

        let armsFrame;
        let legsFrame;

        const xOffset = -(headWidth / 2);
        let yOffset = -totalHeight;

        if(crouched) {
            if(inAir) {
                legsFrame = legAirFrame;
            } else {
                legsFrame = crouchFrame;
                yOffset += scale * 3;
            }
        } else {
            if(legsMoving) {
                if(inAir) {
                    legsFrame = legAirFrame;
                } else {
                    legsFrame = legWalkFrames[
                        Math.floor((timestamp / legsFrameTime*walkingSpeed) % legWalkFrames.length)
                    ];
                }
            } else {
                if(inAir) {
                    legsFrame = legAirFrame;
                } else {
                    legsFrame = legIdleFrame;
                }
            }
        }

        switch(armState) {
            default:
                if(inAir) {
                    armsFrame = armAirFrame;
                } else {
                    armsFrame = armIdleFrame;
                }
                break;
            case 1:
                if(gunIsActive) {
                    armsFrame = gunActiveFrames[
                        Math.floor(timestamp / gunFrameTime % gunActiveFrames.length)
                    ];
                } else {
                    armsFrame = gunIdleFrame;
                }
                break;
            case 2:
                if(swordArmsActive) {
                    armsFrame = swordActiveFrames[
                        Math.floor(timestamp / swordFrameTime % swordActiveFrames.length)
                    ];
                } else {
                    armsFrame = swordsIdleFrame;
                }
                break;
        }

        context.drawImage(
            isMirrored?mirroredHeadImage:headImage,

            0,currentHeadFrame*headFrameHeight,
            headFrameWidth,headFrameHeight,

            destinationX+xOffset,
            destinationY+yOffset,
            headWidth,headHeight
        );
        context.drawImage(
            isMirrored?mirroredArmsImage:armsImage,

            0,armsFrame*armsFrameHeight,
            armsFrameWidth,armsFrameHeight,

            destinationX+xOffset+(armsFrame===armAirFrame?isMirrored?scale:-scale:0)+(isMirrored?scale*-6:0),
            armsY+yOffset,
            armsWidth,armsHeight
        );
        context.drawImage(
            isMirrored?mirroredLegsImage:legsImage,

            0,legsFrame*legsFrameHeight,
            legsFrameWidth,legsFrameHeight,

            destinationX+xOffset,
            legsY+yOffset,
            legsWidth,legsHeight
        );

    }
}
