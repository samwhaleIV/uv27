"use strict";

const noiseBlackOut = function(intensity,grainSize=30,minShade=0,maxShade=255) {

    const shadeRange = maxShade - minShade;

    let horizontalGrain = Math.ceil(fullWidth / grainSize);
    let verticalGrain = Math.ceil(fullHeight / grainSize);

    const xOffset = Math.floor(((horizontalGrain * grainSize) - fullWidth) / 2);
    const yOffset = Math.floor(((verticalGrain * grainSize) - fullHeight) / 2);

    grainSize = Math.ceil(grainSize);

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
    return {
        width: xOffset,
        height: drawHeight
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
    return {
        width: xOffset,
        height: drawHeight
    }
}

const preRenderedInverseCircle = function(diameter,color) {
    context.fillStyle = color;

    const height = (fullHeight - diameter) / 2;
    context.fillRect(0,0,fullWidth,height);
    context.fillRect(0,height + diameter,fullWidth,height);

    const width = (fullWidth - diameter) / 2;

    context.fillRect(0,height,width,diameter);
    context.fillRect(width+diameter,height,width,diameter);

    context.drawImage(imageDictionary[`big-${color}-ass-circle`],width,height,diameter,diameter);
}


const drawDefaultLoadingText = function() {
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("loading...",15,38);
}

const drawLoadingText = function() {
    context.fillStyle = "black";
    context.fillRect(0,0,textTestData.width,textTestData.height);
    drawTextWhite("loading...",15,15,4);
}
