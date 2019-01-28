const noiseBlackOut = function(intensity,context,width,height,grainSize=30,minShade=0,maxShade=255) {

    const shadeRange = maxShade - minShade;

    let horizontalGrain = Math.ceil(width / grainSize);
    let verticalGrain = Math.ceil(height / grainSize);

    const xOffset = Math.floor(((horizontalGrain * grainSize) - width) / 2);
    const yOffset = Math.floor(((verticalGrain * grainSize) - height) / 2);

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

const preRenderedInverseCircleBlack = function(width,height,radius) {
    context.fillStyle = "black";

    const diameter = radius * 2;
    height -= diameter;
    height = height / 2;
    context.fillRect(0,0,width,height);
    context.fillRect(0,height + diameter,width,height);

    width -= diameter;
    width = width / 2;
    context.fillRect(0,height,width,diameter);
    context.fillRect(width+diameter,height,width,diameter);

    context.drawImage(imageDictionary["big-black-ass-circle"],width,height,diameter,diameter);
}

const preRenderedInverseCircleWhite = function(width,height,radius) {
    context.fillStyle = "white";

    const diameter = radius * 2;
    height -= diameter;
    height = height / 2;
    context.fillRect(0,0,width,height);
    context.fillRect(0,height + diameter,width,height);

    width -= diameter;
    width = width / 2;
    context.fillRect(0,height,width,diameter);
    context.fillRect(width+diameter,height,width,diameter);

    context.drawImage(imageDictionary["big-white-ass-circle"],width,height,diameter,diameter);
}

const drawInverseCircleWithOffset = function(
    x,y,width,height,radius=100,xOffset=0,yOffset=0,color="black"
) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(
        Math.floor((x+xOffset) + (width / 2)),
        Math.floor((y+yOffset) + (height / 2)),
        radius,0,Math.PI * 2
    );
    context.rect(width,0,-width,height);
    context.fill();
}

const drawInverseCircleCenter = function(
    x,y,width,height,radius=100,color="black"
) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(
        Math.floor(x + (width / 2)),
        Math.floor(y + (height / 2)),
        radius,0,Math.PI * 2
    );
    context.rect(width,0,-width,height);
    context.fill();
}
