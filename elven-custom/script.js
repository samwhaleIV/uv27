"use strict";
const elves = [];
const loadingImage = new Image();
loadingImage.onload = () => {
    setRendererState(new SidescrollRenderer(loadingImage));
    startRenderer();
    SetFaderOutSound("swish-1");
    SetFaderInSound("swish-2");
    SetFaderDelay(400);
    SetFaderDuration(600);
    SetFaderEffectsRenderer(new FaderStaticEffect());
    loadElves();
    loadElfAnimationMetadata();
    const loadCallback = () => {
        if(SoundManager.soundsLoaded && ImageManager.imagesLoaded) {
            gameLoop();
        }
    }
    ImageManager.loadImages(loadCallback);
    SoundManager.loadSounds(loadCallback);
    SoundManager.loadNonEssentialSounds();
}
loadingImage.src = "elven-custom/images/loading-animations.png";

drawDefaultLoadingText();
SetPageTitle("You Versus 27 Elves");

function loadSongOnDemand(fileName) {
    SoundManager.loadOnDemand(`elven-custom/audio/music/${fileName}.ogg`);
}

let elfIndex = 0, highestIndex;

function getWinSelectScreen() {
    if(elfIndex >= highestIndex) {
        highestIndex++;
        elfIndex = highestIndex;
    }
    getSelectScreen(elfIndex);
    localStorage.setItem("elfIndex",highestIndex);
}

function getSelectScreen(index) {
    if(!index && index !== 0) {
        index = elfIndex;
    }
    rendererState.fader.fadeOut(
        ElfSelectScreenRenderer,
        getBattleScreen,
        highestIndex,index
    );
}

function getBonusScreen() {
    rendererState.fader.fadeOut(
        BonusScreenRenderer,
        getSelectScreen
    );
}

function getEndScreen() {
    rendererState.fader.fadeOut(
        EndScreenRenderer,
        getBonusScreen
    );
}

function getBattleScreen(battleIndex) {
    elfIndex = battleIndex;
    if(battleIndex === highestElfIndex) {
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

function gameLoop() {
    const localStorageResult = localStorage.getItem("elfIndex");
    if(localStorageResult !== null && localStorageResult >= 0) {
        elfIndex = Number(localStorageResult);
    } else {
        elfIndex = -1;
        localStorage.setItem("elfIndex",0);
    }

    if(elfIndex === -1) {
        setRendererState(new IntroductionRenderer(
            getSelectScreen
        ));
        rendererState.start(performance.now());
        if(rendererState.song) {
            playMusic(rendererState.song);
        }
    } else {
        const lastCurrentIndex = localStorage.getItem("lastCurrentIndex");
        const parsedIndex = Number(lastCurrentIndex);
        let currentIndex = elfIndex;
        if(parsedIndex === 0 || !isNaN(parsedIndex)) {
            currentIndex = parsedIndex;
        }
        setRendererState(new ElfSelectScreenRenderer(
            getBattleScreen,
            elfIndex,currentIndex
        ));
        if(rendererState.songStartAction) {
            rendererState.songStartAction();
        }
    }
    if(elfIndex === -1) {
        elfIndex = 0;
    }
    highestIndex = elfIndex;

}
function loadElves() {
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
