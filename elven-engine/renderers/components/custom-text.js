"use strict";
const fontDictionary = {
    " ":{width:1},'a':{width:3},'b':{width:3},
    'c':{width:3},'d':{width:3},'e':{width:3},
    'f':{width:3},'g':{width:3},'h':{width:3},
    'i':{width:3},'j':{width:3},'k':{width:3},
    'l':{width:3},'m':{width:5},'n':{width:3},
    'o':{width:3},'p':{width:3},'q':{width:3},
    'r':{width:3},'s':{width:3},'t':{width:3},
    'u':{width:3},'v':{width:3},'w':{width:5},
    'x':{width:3},'y':{width:3},'z':{width:3},
    '0':{width:3},'1':{width:3},'2':{width:3},
    '3':{width:3},'4':{width:3},'5':{width:3},
    '6':{width:3},'7':{width:3},'8':{width:3},
    '9':{width:3},"*":{width:3},"'":{width:1},
    ".":{width:1},":":{width:1},"-":{width:3},
    "!":{width:1},"?":{width:3},"(":{width:2},
    ")":{width:2},"+":{width:3},":":{width:1},
    ">":{width:3},"<":{width:3},"[":{width:2},
    "]":{width:2},"=":{width:3},
}
function adjustFontPositions() {
    const innerSpace = 1;
    const values = " abcdefghijklmnopqrstuvwxyz0123456789*'.:-!?()+:><[]=";
    let totalWidth = 0;
    for(let i = 0;i<values.length;i++) {
        const value = values.substr(i,1);
        fontDictionary[value].x = totalWidth;
        totalWidth += fontDictionary[value].width + innerSpace;
    }
}
adjustFontPositions();
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
function drawTextWhite(text,x,y,scale) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const lastOffsetIndex = text.length-1;
    let i = 0;
    while(i < text.length) {
        const character = fontDictionary[text[i]];
        const drawWidth = character.width * scale;
        context.drawImage(
            imageDictionary["fontspace"],
            character.x,0,character.width,5,
            x+xOffset,y,
            drawWidth,drawHeight
        );
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += scale;
        }
        i++;
    }
    return {
        width: xOffset,
        height: drawHeight
    }
}

function drawTextBlack(text,x,y,scale) {
    let xOffset = 0;
    const drawHeight = 5 * scale;
    const lastOffsetIndex = text.length-1;
    let i = 0;
    while(i < text.length) {
        const character = fontDictionary[text[i]];
        const drawWidth = character.width * scale;
        context.drawImage(
            imageDictionary["fontspace-black"],
            character.x,0,character.width,5,
            x+xOffset,y,
            drawWidth,drawHeight
        );
        xOffset += drawWidth;
        if(i < lastOffsetIndex) {
            xOffset += scale;
        }
        i++;
    }
    return {
        width: xOffset,
        height: drawHeight
    }
}

const textTestData = drawTextTest("loading...",4);
textTestData.width += 30;
textTestData.height += 30;

function drawDefaultLoadingText() {
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("loading...",15,24);
}
function drawLoadingText() {
    context.fillStyle = "black";
    context.fillRect(0,0,textTestData.width,textTestData.height);
    drawTextWhite("loading...",15,15,4);
}
