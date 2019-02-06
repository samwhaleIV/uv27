"use strict";
const FileTypes = {
    None: Symbol(),
    Sound: Symbol(),
    Music: Symbol(),
    Image: Symbol(),
    BackgroundImage: Symbol(),
    Renderer: Symbol(),
    RendererComponent: Symbol(),
}
let customSector = "elven-custom";
function SetCustomFileSector(sectorName) {
    customSector = sectorName;
}
function GetFile(path,type,isCustom=true) {
    let engineSector = isCustom ? customSector : "elven-engine";
    switch(type) {
        case FileTypes.None:
        default:
            return `${engineSector}/${path}`;
        case FileTypes.Renderer:
            return `${engineSector}/renderers/${path}`;
        case FileTypes.RendererComponent:
            return `${engineSector}/renderers/components/${path}`;
        case FileTypes.Sound:
            return `${engineSector}/audio/${path}`;
        case FileTypes.Music:
            return `${engineSector}/audio/music/${path}`;
        case FileTypes.Image:
            return `${engineSector}/images/${path}`;
        case FileTypes.BackgroundImage:
            return `${engineSector}/images/backgrounds/${path}`;
    }
}
const imageDictionary = {};
const SoundManager = {
    soundsLoaded: false,
    loadSounds: callback => {
        let loadedSounds = 0;
        const soundProcessed = () => {
            if(++loadedSounds === EssentialSounds.length) {
                console.log("Sound manager: All sounds loaded");
                SoundManager.soundsLoaded = true;
                callback();
            }
        }
        EssentialSounds.forEach(value => addBufferSource(value,soundProcessed,soundProcessed));
    },
    loadNonEssentialSounds: () => {
        NonEssentialSounds.forEach(value => addBufferSource(value));
    },
    loadOnDemand: path  => {
        addBufferSource(path);
    }
}
const ImageManager = {
    imagesLoaded: false,
    loadImages: callback => {
        let loadedImages = 0;
        for(let i = 0;i<ImagePaths.length;i++) {
            const image = new Image();
            (image=>{
                image.onload = () => {
                    const sourcePath = image.src.split("/");
                    const fileName = sourcePath[sourcePath.length-1].split(".");
                    const name = fileName[fileName.length-2];

                    imageDictionary[name] = image;
                    if(++loadedImages === ImagePaths.length) {
                        console.log("Image manager: All images loaded");
                        ImageManager.imagesLoaded = true;
                        callback();
                    }
                };
            })(image);
            image.src = ImagePaths[i];
        }
    }
}
