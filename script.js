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
    " ":{width:1},'a':{width:3},'b':{width:3},
    'c':{width:3},'d':{width:3},'e':{width:3},
    'f':{width:3},'g':{width:3},'h':{width:3},
    'i':{width:3},'j':{width:3},'k':{width:3},
    'l':{width:3},'m':{width:5},'n':{width:3},
    'o':{width:3},'p':{width:3},'q':{width:3},
    'r':{width:3},'s':{width:3},'t':{width:3},
    'u':{width:3},'v':{width:3},'w':{width:5},
    'x':{width:3},'y':{width:3},'z':{width:3},
    '0':{width:3},'1':{width:1},'2':{width:3},
    '3':{width:3},'4':{width:3},'5':{width:3},
    '6':{width:3},'7':{width:3},'8':{width:3},
    '9':{width:3},"*":{width:5},"'":{width:1},
    ".":{width:1},":":{width:1},"-":{width:4},
    "!":{width:1},"?":{width:3},"(":{width:2},
    ")":{width:2},"+":{width:3}
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
    const values = " abcdefghijklmnopqrstuvwxyz0123456789*'.:-!?()+";
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

        "audio/music/menu.mp3"
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

if(localStorage.getItem("soundMuted") === "true") {
    muteSound();
}
if(localStorage.getItem("musicMuted") === "true") {
    muteMusic();
}

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
            ElfSelectScreenRenderer,
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
        const lastCurrentIndex = localStorage.getItem("lastCurrentIndex");
        const parsedIndex = Number(lastCurrentIndex);
        let currentIndex = elfIndex;
        if(parsedIndex === 0 || !isNaN(parsedIndex)) {
            currentIndex = parsedIndex;
        }
        rendererState = new ElfSelectScreenRenderer(
            getBattleScreen,
            elfIndex,currentIndex
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




