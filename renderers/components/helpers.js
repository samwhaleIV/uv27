const noiseBlackOut = function(intensity,context,width,height,grainSize=30,minShade=0,maxShade=255) {

    if(backgroundStreamMode) {
        basicFadeOut(intensity,context,width,height);
        return;
    }

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

const basicFadeOut = function(intensity,context,width,height) {
    context.fillStyle = `rgba(0,0,0,${intensity})`;
    context.fillRect(0,0,width,height);
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
