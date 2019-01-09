context.fillStyle = "#ffffff";
context.font = "20px Arial";
context.fillText("loading...",20,40);

const backgroundElement = document.getElementById("background");

let images = [
    "images/boss-layer-top.png",
    "images/boss-layer-background.png",
    "images/boss-layer-effect.png",

    "images/backgrounds/background-1.png",
    "images/backgrounds/background-2.png",
    "images/backgrounds/background-3.png",
    "images/backgrounds/background-4.png",
    "images/backgrounds/background-5.png",
    "images/backgrounds/background-6.png",
    "images/backgrounds/background-7.png",
    "images/backgrounds/background-8.png",
    "images/backgrounds/background-9.png",

    "images/fontspace.png",
    "images/fontspace-black.png",

    "images/elves.png",

    "images/end-screen.png"
], loadedImages = 0;
const imageDictionary = {};

const fontDictionary = {
    " ":{x:0,width:1},a:{x:0,width:3},b:{x:0,width:3},c:{x:0,width:3},
    d:{x:0,width:3},e:{x:0,width:3},f:{x:0,width:3},
    g:{x:0,width:3},h:{x:0,width:3},i:{x:0,width:3},
    j:{x:0,width:3},k:{x:0,width:3},l:{x:0,width:3},
    m:{x:0,width:5},n:{x:0,width:3},o:{x:0,width:3},
    p:{x:0,width:3},q:{x:0,width:3},r:{x:0,width:3},
    s:{x:0,width:3},t:{x:0,width:3},u:{x:0,width:3},v:{x:0,width:3},
    w:{x:0,width:5},x:{x:0,width:3},y:{x:0,width:3},
    z:{x:0,width:3},'0':{x:0,width:3},'1':{x:0,width:1},
    '2':{x:0,width:3},'3':{x:0,width:3},'4':{x:0,width:3},
    '5':{x:0,width:3},'6':{x:0,width:3},'7':{x:0,width:3},
    '8':{x:0,width:3},'9':{x:0,width:3},"*":{x:0,width:5},
    "'":{x:0,width:1},".":{x:0,width:1},":":{x:0,width:1},
    "-":{x:0,width:4}
}

const elfSourceWidth = 11;
const elfSourceHeight = 24;

const tileDictionary = [];
const tileSize = 25;

const processMetaTileset = () => {
    const rows = 5;
    const columns = 5;
    const tileCount = rows * columns;
    for(let i = 0;i<tileCount;i++) {
        let x = i % columns;
        let y = Math.floor(i / columns);
        tileDictionary[i] = {
            x: x * tileSize,
            y: y * tileSize
        }
    }
}

const processElvesMeta = () => {
    for(let i = 0;i<27;i++) {
        if(elves[i]) {
            elves[i].x = i * elfSourceWidth;
        }
    }
}

const adjustFontPositions = () => {
    const innerSpace = 1;
    let values = " abcdefghijklmnopqrstuvwxyz0123456789*'.:-";
    let totalWidth = 0;
    for(let i = 0;i<values.length;i++) {
        const value = values.substr(i,1);
        fontDictionary[value].x = totalWidth;
        totalWidth += fontDictionary[value].width + innerSpace;
    }
}

let soundsLoaded = false;
let imagesLoaded = false;

const loadSounds = callback => {
    const sounds = [
        "audio/click.mp3",

        "audio/swish-1.mp3",
        "audio/swish-2.mp3",
        
        "audio/clip.mp3",
        "audio/reverse-clip.mp3",

        //"audio/menu.mp3"
    ];
    let loadedSounds = 0;
    const soundProcessed = () => {
        if(++loadedSounds === sounds.length) {
            console.log("Runtime host: All sounds loaded");
            soundsLoaded = true;
            if(imagesLoaded) {
                callback();
            }
        }
    }
    sounds.forEach(value => addBufferSource(value,soundProcessed,soundProcessed));
}

const loadImages = callback => {
    for(let i = 0;i<images.length;i++) {
        const image = new Image();
        (image=>{
            image.onload = () => {

                let sourcePath = image.src.split("/");
                let fileName = sourcePath[sourcePath.length-1].split(".");
                let name = fileName[fileName.length-2];

                imageDictionary[name] = image;
                if(++loadedImages === images.length) {
                    console.log("Runtime host: All images loaded");
                    imagesLoaded = true;
                    if(soundsLoaded) {
                        callback();
                    }
                }
            };
        })(image);
        image.src = images[i];
    }
}

processMetaTileset();
adjustFontPositions();
processElvesMeta();

const gameLoop = () => {

    let elfIndex = 0, highestIndex;

    const getWinSelectScreen = () => {
        if(elfIndex >= highestIndex) {
            highestIndex++;
            elfIndex = highestIndex;
        }
        getSelectScreen(elfIndex);
        localStorage.setItem("elfIndex",highestIndex);
    }

    const getSelectScreen = index => {
        if(!index && index !== 0) {
            index = elfIndex;
        }
        rendererState.fader.fadeOut(
            ElfSelectScreen,
            getBattleScreen,
            highestIndex,index
        );
    }

    const getEndScreen = () => {
        rendererState.fader.fadeOut(
            EndScreenRenderer,
            getSelectScreen
        );
    }

    const getBattleScreen = battleIndex => {
        elfIndex = battleIndex;
        if(battleIndex === 26) {
            rendererState.fader.fadeOut(
                ElfScreenRenderer,
                getEndScreen,
                getSelectScreen,
                elfIndex,true
            );
        } else {
            rendererState.fader.fadeOut(
                ElfScreenRenderer,
                getWinSelectScreen,
                getSelectScreen,
                elfIndex,false
            );
        }
    }

    const localStorageResult = localStorage.getItem("elfIndex");
    if(localStorageResult !== null && localStorageResult >= 0) {
        elfIndex = Number(localStorageResult);
    } else {
        elfIndex = -1;
        localStorage.setItem("elfIndex",0);
    }

    if(elfIndex === -1) {
        rendererState = new IntroductionRenderer(
            getSelectScreen
        );
    } else {
        rendererState = new ElfSelectScreen(
            getBattleScreen,
            elfIndex,elfIndex
        );
        playMusic(rendererState.song);
    }
    startRenderer();
    if(elfIndex === -1) {
        rendererState.start();
        elfIndex = 0;
    }
    highestIndex = elfIndex;

}

const debug_reset = () => {
    localStorage.clear();
    location.reload();
}

loadImages(gameLoop);
loadSounds(gameLoop);




