"use strict";

drawLoadingText();

function loadCallback() {
    if(SoundManager.soundsLoaded && ImageManager.imagesLoaded) {
        setRendererState(new OverworldBase(
            new ParallaxBackground("levels/0/0","levels/0/1")
        ));
        startRenderer();
    }
}

SetPageTitle("One Night at Elfmart");
SetImageIndexMode(IndexModes.LoseRoot);
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

//SetFaderOutSound("swish-1");
//SetFaderInSound("swish-2");
//SetFaderEffectsRenderer(new FaderStaticEffect());
SetFaderDelay(0);
SetFaderDuration(0);


