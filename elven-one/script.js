"use strict";

drawDefaultLoadingText();

function loadCallback() {
    if(SoundManager.soundsLoaded && ImageManager.imagesLoaded) {
        setRendererState(new OverworldTestRenderer());
        startRenderer();
    }
}

SetPageTitle("One Night at Elfmart");
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

//SetFaderOutSound("swish-1");
//SetFaderInSound("swish-2");
//SetFaderEffectsRenderer(new FaderStaticEffect());
SetFaderDelay(0);
SetFaderDuration(0);

