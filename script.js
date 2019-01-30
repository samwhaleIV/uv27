"use strict";
const timeouts = {};
const setSkippableTimeout = (handler,timeout,...args) => {
    const handle = setTimeout((...args)=>{

        handler.apply(this,args);
        delete timeouts[handle];

    },timeout,...args);

    timeouts[handle] = {
        handler: handler,
        args: args
    }

    return handle;
}

const clearSkippableTimeout = (handle,suppress) => {
    clearTimeout(handle);

    const timeout = timeouts[handle];

    if(!suppress) {
        timeout.handler.apply(
            this,timeout.args
        );
    }
    delete timeouts[handle];
}

drawDefaultLoadingText();
let textTestData;
const loadingImage = new Image();
loadingImage.onload = () => {
    textTestData = drawTextTest("loading...",4);
    textTestData.width += 30;
    textTestData.height += 30;
    rendererState = new SidescrollRenderer(loadingImage);
    startRenderer();
    loadElves();
    loadImages(gameLoop);
    loadSounds(gameLoop);
    loadNonEssentialMusic();
}
loadingImage.src = "images/loading-animations.png";

const backgroundElement = document.getElementById("background");

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

const elfSourceWidth = 11;
const elfSourceHeight = 24;

const adjustFontPositions = () => {
    const innerSpace = 1;
    const values = " abcdefghijklmnopqrstuvwxyz0123456789*'.:-!?()+:><[]=";
    let totalWidth = 0;
    for(let i = 0;i<values.length;i++) {
        const value = values.substr(i,1);
        fontDictionary[value].x = totalWidth;
        totalWidth += fontDictionary[value].width + innerSpace;
    }
}

let soundsLoaded = false;
let imagesLoaded = false;

const loadSongOnDemand = fileName => {
    addBufferSource(`audio/music/${fileName}.ogg`);
}

const loadNonEssentialMusic  = () => {
    const music = [
        "audio/music/win.ogg",
        "audio/music/lose.ogg"
    ];
    music.forEach(value => addBufferSource(value));
}

const loadSounds = callback => {
    const sounds = [
        "audio/click.mp3",
        "audio/swish-1.mp3",
        "audio/swish-2.mp3",
        "audio/clip.mp3",
        "audio/reverse-clip.mp3",
        "audio/transform.mp3",

        "audio/music/menu/intro_a.ogg",
        "audio/music/menu/intro_b.ogg",
        "audio/music/menu/intro_base.ogg",

        "audio/music/menu/loop_a.ogg",
        "audio/music/menu/loop_b.ogg",
        "audio/music/menu/loop_base.ogg",
        
        "audio/squish.mp3"
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

const loadAnimationMetadata = () => {
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

const loadImages = callback => {
    const images = [
        "images/fontspace.png",
        "images/fontspace-black.png",

        "images/henry.png",

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
        "images/backgrounds/background-10.png",
    
        "images/elves-layer-0.png",
        "images/elves-layer-1.png",
        "images/elves-layer-2.png",
        "images/elves-layer-3.png",
        "images/elves-layer-4.png",

        "images/big-white-ass-circle.png",
        "images/big-black-ass-circle.png",

        "images/end-screen.png",

        "images/animation-effects.png"
    ];
    let loadedImages = 0;
    for(let i = 0;i<images.length;i++) {
        const image = new Image();
        (image=>{
            image.onload = () => {

                const sourcePath = image.src.split("/");
                const fileName = sourcePath[sourcePath.length-1].split(".");
                const name = fileName[fileName.length-2];

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

loadAnimationMetadata();
adjustFontPositions();

if(localStorage.getItem("soundMuted") === "true") {
    muteSound();
}
if(localStorage.getItem("musicMuted") === "true") {
    muteMusic();
}

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

const gameLoop = () => {
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
        if(rendererState.songStartAction) {
            rendererState.songStartAction();
        }
    }
    if(elfIndex === -1) {
        elfIndex = 0;
    }
    highestIndex = elfIndex;

}

const debug_cheat_everything = () => {
    localStorage.setItem("elfIndex",26);
    location.reload();
}
const debug_reset = () => {
    localStorage.clear();
    location.reload();
}
const debug_toggle_stream_mode = () => {
    backgroundStreamMode = !backgroundStreamMode;
}
const debug_scroll_speed = seconds => {
    if(rendererState && rendererState.background) {
        console.log("The default scroll speed is 20 seconds");
        console.log("The number of seconds can be non-integer, e.g. 1.2, 0.9, 69.69");
        rendererState.background.cycleTime = seconds * 1000;
    }
}

const elves = [];
const loadElves = () => {
    const start = performance.now();
    const elfConstructors = [
        WimpyRedElf,
        WimpyGreenElf,
        WimpyBlueElf,
        WizardElf,
        RedElfette,
        GoldenElfette,
        WarElf,
        BoneyElf,
        HeadlessElf,
        TwoHeadedElf,
        JesterElf,
        LeglessElf,
        PhaseShiftElf,
        OldTimeyElf,
        ScorchedElf,
        InvisibleElf,
        RogueElf,
        NotRedElfette,
        BeachElf,
        UpsideDownElf,
        TinyArmElf,
        ElfmasTree,
        CorruptElf,
        DarkElf,
        MurderElf,
        MurderedElf,
        TheBossElf,
    ];
    for(let i = 0;i<elfConstructors.length;i++) {
        elves[i] = new elfConstructors[i]();
        elves[i].x = i * elfSourceWidth;
    }
    const end = performance.now();
    console.log(`Script: Loaded elf objects in ${(end-start)/1000} seconds`);
}
