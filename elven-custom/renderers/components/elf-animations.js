"use strict";
const loadElfAnimationMetadata = () => {
    const animationDictionaryKeys = Object.keys(animationDictionary);
    for(let i = 0;i<animationDictionaryKeys.length;i++) {
        const animation = animationDictionary[animationDictionaryKeys[i]];

        if(animation.index < 0 || animation.realTime) {
            continue;
        }

        const height = animation.index * elfSourceHeight;

        const frameBounds = [];
        for(let x = 0;x<animation.frameCount;x++) {
            frameBounds.push(x*elfSourceWidth);
        }

        animation.frameDuration = 1000 / animation.frameRate;
        animation.fullDuration = animation.frameDuration * animation.frameCount;

        animation.y = height;
        animation.frameBounds = frameBounds;
    }
}
const animationDictionary = {
    crying: {
        realTime: true,
        fullDuration: 750,
        render: (timestamp,x,y,width,height) => {
            const pixelSize = width / elfSourceWidth;
            const tearOneX = pixelSize * 4;
            const tearTwoX = pixelSize * 6;

            const tearYOffset = tearTwoX + pixelSize;

            const timeNormal = (timestamp % animationDictionary.crying.fullDuration) / animationDictionary.crying.fullDuration;

            const tearOneY = ((timeNormal % 1)*16)*pixelSize;
            const tearTwoY = (((timeNormal+0.5) % 1)*16)*pixelSize;

            context.fillStyle = "rgba(0,82,255,0.32)";
            context.fillRect(x+tearOneX,y+tearOneY+tearYOffset,pixelSize,pixelSize);

            context.fillStyle = "rgba(0,82,255,0.32)";
            context.fillRect(x+tearTwoX,y+tearTwoY+tearYOffset,pixelSize,pixelSize);
        },
        playOnce: false
    },
    henry: {
        realTime: true,
        ratio: 26 / 42,
        smokeDuration: 1800,

        smokeFadeInTime: 800,
        smokeFadeOutTime: 800,

        smokeMaxSize: 60,
        smokeMinSize: 40,

        smokeRange: 20,

        smokeCount: 120,
        areaOverflow: 50,
        halfAreaOverflow: 25,
        renderSmoke: (count,x,y,width,height) => {
            for(let i = 0;i<count;i++) {
                const intensity = Math.random();
                const shade = Math.round(intensity * 255);
                const size = Math.floor((intensity * animationDictionary.henry.smokeRange) + (animationDictionary.henry.smokeMinSize * (count / animationDictionary.henry.smokeCount)));
                
                const halfSize = size / 2;
                const smokeX = Math.floor(x + ((((width+animationDictionary.henry.areaOverflow) * Math.random())-animationDictionary.henry.halfAreaOverflow) - halfSize));
                const smokeY = Math.floor((height * Math.random()) - halfSize);
                
                context.fillStyle = `rgb(${shade},${shade},${shade})`;
                context.fillRect(smokeX,smokeY,size,size);
            }
        },
        render: (timestamp,x,y,width,height,startTime) => {
            if(timestamp >= startTime + animationDictionary.henry.smokeDuration) {
                const newWidth = Math.round(height * animationDictionary.henry.ratio);
                const newX = Math.round(x + ((width / 2) - (newWidth / 2)));
                context.drawImage(imageDictionary["henry"],0,0,26,40,newX,y,newWidth,height);

                const smokeCount = animationDictionary.henry.smokeCount - Math.round(((timestamp - (startTime + animationDictionary.henry.smokeDuration)) / animationDictionary.henry.smokeFadeOutTime)*animationDictionary.henry.smokeCount);
                if(smokeCount>=1) {
                    animationDictionary.henry.renderSmoke(smokeCount,x,y,width,height);
                }

            } else {
                const smokeCount = Math.round(((timestamp - startTime) / animationDictionary.henry.smokeFadeInTime)*animationDictionary.henry.smokeCount);
                if(smokeCount > animationDictionary.henry.smokeCount) {
                    animationDictionary.henry.renderSmoke(animationDictionary.henry.smokeCount,x,y,width,height);
                } else {
                    animationDictionary.henry.renderSmoke(smokeCount,x,y,width,height);
                }
            }
        }
    },
    robeSmoke: {
        index: 1,
        frameCount: 2,
        frameRate: 30,
        playOnce: true
    },
    robeHealth: {
        index: 2,
        frameCount: 5,
        frameRate: 30,
        playOnce: true
    },
    punch: {
        fullDuration: 60,
        realTime: true,
        render: (timestamp,x,y,width,height) => {

            const size = (1 - (timestamp / animationDictionary.punch.fullDuration)) * 100;

            const halfSize = size/2;

            x += Math.round((width / 2) - halfSize);
            y += Math.round((height / 2) - halfSize);

            context.lineWidth = 8;
            context.strokeStyle = "red";
            context.strokeRect(x,y,size,size);
        },
        playOnce: true
    },
    headExplode: {
        fullDuration: 800,
        playOnce: true,
        realTime: true,
        render: (timestamp,x,y,width,height) => {

            x+=width/2;
            y+=115;

            let animationProgress = timestamp / animationDictionary.headExplode.fullDuration;
            //limit to 0-1?

            const particleCount = 100;

            const radius = Math.pow(animationProgress*150,2);

            //const particleInterval = ((radius + radius) * Math.PI) / particleCount;
            const angleStep = 360 / particleCount;

            for(let i = 0;i<particleCount;i++) {
                const particleDeviationX = Math.round(Math.random() * 20)-10;
                const particleDeviationY = Math.round(Math.random() * 20)-10;

                const angle = Math.PI * (angleStep*i) / 180;

                const particleX = (radius * Math.cos(angle)) + particleDeviationX;
                const particleY = (radius* Math.sin(angle)) + particleDeviationY;

                const bloodIntensity = 80 + Math.round(Math.random() * 40);
                context.fillStyle = `rgb(${bloodIntensity},0,0)`;
                if(i % 2 === 0) {
                    context.beginPath();
                    context.arc(x+particleX-5,y+particleY-5,10,0,PI2);
                    context.fill();
                } else {
                    context.fillRect(x+particleX-10,y+particleY-10,20,20);
                }

            }
        }
    }
}
loadElfAnimationMetadata();
