"use strict";
const fontDictionary = {
    " ":{width:1,glyph:[
        0,
        0,
        0,
        0,
        0
    ]},
    'a':{width:3,glyph:[
       1,1,1,
       1,0,1,
       1,1,1,
       1,0,1,
       1,0,1
    ]},
    'b':{width:3,glyph:[
        1,1,0,
        1,0,1,
        1,1,0,
        1,0,1,
        1,1,0
    ]},
    'c':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,0,0,
        1,0,0,
        1,1,1
    ]},
    'd':{width:3,glyph:[
        1,1,0,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,0
    ]},
    'e':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        1,0,0,
        1,1,1
    ]},
    'f':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        1,0,0,
        1,0,0
    ]},
    'g':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'h':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,1,
        1,0,1,
        1,0,1
    ]},
    'i':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,1
    ]},
    'j':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,0   
    ]},
    'k':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,0,
        1,0,1,
        1,0,1
    ]},
    'l':{width:3,glyph:[
        1,0,0,
        1,0,0,
        1,0,0,
        1,0,0,
        1,1,1
    ]},
    'm':{width:5,glyph:[
        1,1,1,1,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1
    ]},
    'n':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1
    ]},
    'o':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'p':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        1,0,0,
        1,0,0
    ]},
    'q':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    'r':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,0,
        1,0,1,
        1,0,1
    ]},
    's':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    't':{width:3,glyph:[
        1,1,1,
        0,1,0,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    'u':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1
    ]},
    'v':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,0,1,
        1,0,1,
        0,1,0
    ]},
    'w':{width:5,glyph:[
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        1,0,1,0,1,
        0,1,0,1,0
    ]},
    'x':{width:3,glyph:[
        1,0,1,
        1,0,1,
        0,1,0,
        1,0,1,
        1,0,1
    ]},
    'y':{width:3,glyph:[
        1,0,1,
        1,0,1,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    'z':{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,0,
        1,0,0,
        1,1,1
    ]},
    '0':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,0,1,
        1,0,1,
        1,1,1    
    ]},
    '1':{width:3,glyph:[
        1,1,0,
        0,1,0,
        0,1,0,
        0,1,0,
        1,1,1
    ]},
    '2':{width:3,glyph:[
        1,1,1,
        0,0,1,
        1,1,1,
        1,0,0,
        1,1,1
    ]},
    '3':{width:3,glyph:[
        1,1,1,
        0,0,1,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    '4':{width:3,glyph:[
        1,0,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    '5':{width:3,glyph:[
        1,1,1,
        1,0,0,
        1,1,1,
        0,0,1,
        1,1,1
    ]},
    '6':{width:3,glyph:[
        1,0,0,
        1,0,0,
        1,1,1,
        1,0,1,
        1,1,1
    ]},
    '7':{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,0,
        0,1,0,
        0,1,0
    ]},
    '8':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        1,0,1,
        1,1,1
    ]},
    '9':{width:3,glyph:[
        1,1,1,
        1,0,1,
        1,1,1,
        0,0,1,
        0,0,1
    ]},
    "*":{width:3,glyph:[
        0,0,0,
        1,0,1,
        0,1,0,
        1,0,1,
        0,0,0
    ]},
    "'":{width:1,glyph:[
        1,
        1,
        0,
        0,
        0
    ]},
    ".":{width:1,glyph:[
        0,
        0,
        0,
        0,
        1
    ]},
    ":":{width:1,glyph:[
        0,
        1,
        0,
        1,
        0
    ]},
    "-":{width:3,glyph:[
        0,0,0,
        0,0,0,
        1,1,1,
        0,0,0,
        0,0,0
    ]},
    "!":{width:1,glyph:[
        1,
        1,
        1,
        0,
        1
    ]},
    "?":{width:3,glyph:[
        1,1,1,
        0,0,1,
        0,1,1,
        0,0,0,
        0,1,0
    ]},
    "(":{width:2,glyph:[
        0,1,
        1,0,
        1,0,
        1,0,
        0,1
    ]},
    ")":{width:2,glyph:[
        1,0,
        0,1,
        0,1,
        0,1,
        1,0
    ]},
    "+":{width:3,glyph:[
        0,0,0,
        0,1,0,
        1,1,1,
        0,1,0,
        0,0,0
    ]},
    ">":{width:3,glyph:[
        1,0,0,
        0,1,0,
        0,0,1,
        0,1,0,
        1,0,0
    ]},
    "<":{width:3,glyph:[
        0,0,1,
        0,1,0,
        1,0,0,
        0,1,0,
        0,0,1
    ]},
    "[":{width:2,glyph:[
        1,1,
        1,0,
        1,0,
        1,0,
        1,1
    ]},
    "]":{width:2,glyph:[
        1,1,
        0,1,
        0,1,
        0,1,
        1,1
    ]},
    "=":{width:3,glyph:[
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0
    ]},
}
function drawTextTest(text,scale) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const lastOffsetIndex = text.length-1;
    for(let i = 0;i<text.length;i++) {
        const character = fontDictionary[text[i]];
        const drawWidth = character.width * scale;
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += scale;
        }
    }
    return {
        width: xOffset,
        height: drawHeight
    }
}
const ScaleMatrices = {
    2.5: {
        1: {width:[3],height:[2,3,2,3,2]},
        2: {width:[3,2],height:[2,3,2,3,2]},
        3: {width:[3,2,2],height:[2,3,2,3,2]},
        5: {width:[3,2,2,2,3],height:[2,3,2,3,2]}
    },
    3.5: {
        1: {width:[4],height:[3,4,3,4,3]},
        2: {width:[4,3],height:[3,4,3,4,3]},
        3: {width:[3,4,3],height:[3,4,3,4,3]},
        5: {width:[4,3,3,3,4],height:[3,4,3,4,3]}
    }
}
function generateBasicScaleMatrices() {
    const widths = [1,2,3,5];
    [2,3,4,5,8].forEach(scaleFactor => {
        const characterMatrices = {};
        widths.forEach(widthValue => {
            const characterMatrix = [];
            for(let y = 0;y<5;y++) {
                for(let x = 0;x<widthValue;x++) {
                    characterMatrix.push({
                        x: x * scaleFactor,
                        y: y * scaleFactor,
                        w:scaleFactor,
                        h:scaleFactor
                    });
                }
            }
            characterMatrices[widthValue] = characterMatrix;
        });
        ScaleMatrices[scaleFactor] = characterMatrices;
    });
}
generateBasicScaleMatrices();
function compileComplexScaleMatrices() {
    const widths = [1,2,3,5];
    [2.5,3.5].forEach(scaleFactor => {
        const characterMatrices = {};

        widths.forEach(widthValue => {

            const rawCharacterMatrix = ScaleMatrices[scaleFactor][widthValue];

            const characterMatrix = [];
            let runningHeight = 0;
            for(let y = 0;y<5;y++) {
                const currentHeight = rawCharacterMatrix.height[y];
                let runningWidth = 0;
                for(let x = 0;x<widthValue;x++) {
                    const currentWidth = rawCharacterMatrix.width[x];
                    characterMatrix.push({
                        x: runningWidth,
                        y: runningHeight,
                        w:currentWidth,
                        h:currentHeight
                    });
                    runningWidth += currentWidth;
                }
                runningHeight += currentHeight;
            }
            characterMatrices[widthValue] = characterMatrix;
        });

        ScaleMatrices[scaleFactor] = characterMatrices;
    })
}
compileComplexScaleMatrices();
function drawLetter(character,x,y,scale) {
    let i = 0;

    const characterMatrices = ScaleMatrices[scale][character.width];

    while(i < character.glyph.length) {
        if(character.glyph[i]) {

            const characterRegion = characterMatrices[i];

            context.rect(
                x + characterRegion.x,
                y + characterRegion.y,
                characterRegion.w,
                characterRegion.h
            );
        }
        i++;
    }
}
const allScales = {};
function drawTextColor(color,text,x,y,scale) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const lastOffsetIndex = text.length-1;
    let i = 0;
    context.beginPath();
    context.fillStyle = color;
    while(i < text.length) {
        const character = fontDictionary[text[i]];
        const drawWidth = character.width * scale;
        drawLetter(
            character,
            x+xOffset,y,
            scale,drawHeight
        );
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += scale;
        }
        i++;
    }
    context.fill();
    return {
        width: xOffset,
        height: drawHeight
    }
}
function drawTextWhite(text,x,y,scale) {
    return drawTextColor("white",text,x,y,scale);
}
function drawTextBlack(text,x,y,scale) {
    return drawTextColor("black",text,x,y,scale);
}

const textTestData = drawTextTest("loading...",4);
textTestData.width += 30;
textTestData.height += 30;

function drawLoadingText() {
    context.fillStyle = "black";
    context.fillRect(0,0,textTestData.width,textTestData.height);
    drawTextWhite("loading...",15,15,4);
}
