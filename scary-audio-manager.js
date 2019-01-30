"use strict";
const audioContext = new AudioContext();

const soundGain = 3 / 4;
const musicNodeGain = 0.2;

const volumeNode = audioContext.createGain();
volumeNode.gain.setValueAtTime(soundGain,audioContext.currentTime);
volumeNode.connect(audioContext.destination);

const musicVolumeNode = audioContext.createGain();
musicVolumeNode.gain.setValueAtTime(musicNodeGain,audioContext.currentTime);
musicVolumeNode.connect(audioContext.destination);

const musicOutputNode = musicVolumeNode;
const soundOutputNode = volumeNode;

const audioBuffers = {};
const failedBuffers = {};

let audioBufferAddedCallback = null;
const sendAudioBufferAddedCallback = name => {
    if(audioBufferAddedCallback) {
        audioBufferAddedCallback(name);
    }
}

let musicNodes = {}, musicMuted = false, soundMuted = false;
const toggleMusicMute = () => {
    if(musicMuted) {
        unmuteMusic();
    } else {
        muteMusic();
    }
}

const toggleSoundMute = () => {
    if(soundMuted) {
        unmuteSound();
    } else {
        muteSound();
    }
}

const muteMusic = () => {
    if(!musicMuted) {
        musicVolumeNode.gain.setValueAtTime(0,audioContext.currentTime);
        musicMuted = true;
        localStorage.setItem("musicMuted",true);
    } else {
        console.warn("Audio manager: Music already muted");
    }
}
const muteSound = () => {
    if(!soundMuted) {
        volumeNode.gain.setValueAtTime(0,audioContext.currentTime);
        soundMuted = true;
        localStorage.setItem("soundMuted",true);
    } else {
        console.warn("Audio manager: Sound already muted");
    }
}

const unmuteSound = () => {
    if(soundMuted) {
        volumeNode.gain.setValueAtTime(soundGain,audioContext.currentTime);
        soundMuted = false;
        localStorage.setItem("soundMuted",false);
    } else {
        console.warn("Audio manager: Sound already unmuted");
    }
}

const unmuteMusic = () => {
    if(musicMuted) {
        musicVolumeNode.gain.setValueAtTime(musicNodeGain,audioContext.currentTime);
        musicMuted = false;
        localStorage.setItem("musicMuted",false);
    } else {
        console.warn("Audio manager: Music already unmuted");
    }
}

const muteTrack = name => {
    if(musicNodes[name]) {
        musicNodes[name].volumeControl.gain.setValueAtTime(0,audioContext.currentTime);
    }
}
const unmuteTrack = name => {
    if(musicNodes[name]) {
        musicNodes[name].volumeControl.gain.setValueAtTime(1,audioContext.currentTime);
    }
}

let startSyncTime = null;

let introMuteManifest = {};
let loopMuteManifest = {};
const playMusicWithIntro = (loopName,introName,withLoop=true) => {
    const introBuffer = audioBuffers[introName];
    const loopBuffer = audioBuffers[loopName];
    if(!introBuffer || !loopBuffer) {
        console.warn(`Audio manager: '${loopName}' or '${introName}' is missing from audio buffers. Did we fail to load it?`);
    } else {
        const musicNode = audioContext.createBufferSource();
        musicNode.buffer = introBuffer;
        musicNode.loop = false;

        musicNode.volumeControl = audioContext.createGain();
        if(introMuteManifest[introName] && !introMuteManifest[introName].shouldPlay) {
            musicNode.volumeControl.gain.setValueAtTime(0,audioContext.currentTime);
        }
        musicNode.volumeControl.connect(musicOutputNode);
        musicNode.connect(musicNode.volumeControl);

        if(startSyncTime === null) {
            startSyncTime = audioContext.currentTime + 0.01;
        }

        musicNode.start(startSyncTime);
        musicNodes[introName] = musicNode;

        const loopMusicNode = audioContext.createBufferSource();
        loopMusicNode.buffer = loopBuffer;
        loopMusicNode.loop = withLoop;

        loopMusicNode.volumeControl = audioContext.createGain();
        if(loopMuteManifest[loopName] && !loopMuteManifest[loopName].shouldPlay) {
            console.log("loop muted");
            loopMusicNode.volumeControl.gain.setValueAtTime(0,audioContext.currentTime);
        }
        loopMusicNode.volumeControl.connect(musicOutputNode);
        loopMusicNode.connect(loopMusicNode.volumeControl);

        const loopStartTime = startSyncTime+introBuffer.duration;
        console.log("loop start time",loopStartTime);

        loopMusicNode.start(loopStartTime);

        musicNodes[loopName] = loopMusicNode;
    }
}

const playMusic = (name,withLoop=true) => {
    const buffer = audioBuffers[name];
    if(!buffer) {
        console.warn(`Audio manager: '${name}' is missing from audio buffers. Did we fail to load it?`);
        if(!withLoop) {
            return 0;
        }
    } else {
        const musicNode = audioContext.createBufferSource();
        musicNode.buffer = buffer;
        musicNode.loop = withLoop;

        musicNode.volumeControl = audioContext.createGain();
        musicNode.volumeControl.connect(musicOutputNode);
        musicNode.connect(musicNode.volumeControl);

        musicNode.start();
        musicNodes[name] = musicNode;
        if(!withLoop) {
            return buffer.duration;
        }
    }
}

const deleteTrack = name => {
    const node = musicNodes[name];
    node.stop();
    node.volumeControl.disconnect(musicOutputNode);
    delete musicNodes[name];
}

const stopMusic = () => {
    for(let key in musicNodes) {
        deleteTrack(key);
    }
    startSyncTime = null;
}

const playSound = (name,duration) => {
    const buffer = audioBuffers[name];
    if(buffer) {
        const bufferSourceNode = audioContext.createBufferSource();
        bufferSourceNode.buffer = buffer;
        if(duration) {
            bufferSourceNode.playbackRate.setValueAtTime(buffer.duration / duration,audioContext.currentTime);
        }
        bufferSourceNode.connect(soundOutputNode);
        bufferSourceNode.start();
    } else {
        console.warn(`Audio manager: '${name}' is missing from audio buffers. Did we fail to load it?`);
    }
}

const addBufferSource = (fileName,callback,errorCallback) => {
    let newName = fileName.split("/").pop();
    const newNameSplit = newName.split(".");
    newName = newNameSplit[newNameSplit.length-2];

    const decode = audioData => {

        audioContext.decodeAudioData(
            audioData,
            audioBuffer => {
                audioBuffers[newName] = audioBuffer;
                sendAudioBufferAddedCallback(newName);
                console.log(`Audio manager: Added '${newName}' to audio buffers`);
                if(callback) {
                    callback(fileName);
                }
            },
            () => {
                failedBuffers[newName] = true;
                sendAudioBufferAddedCallback(newName);
                console.error(`Audio manager: Failure to decode '${fileName}' as an audio file`);
                if(errorCallback) {
                    errorCallback(fileName);
                }
            }
        );
    }
    const reader = new FileReader();
    reader.onload = event => {
        decode(event.target.result);
    }

    const request = new XMLHttpRequest();

    let path = location.href.split("/");
    path.pop();

    path = path.join("/");

    request.open("GET",`${path}/${fileName}`);
    request.responseType = "blob";
    request.onload = function() {
        if(this.status === 200 || this.status === 0) {
            reader.readAsArrayBuffer(this.response);
        } else {
            console.log(`Audio manager: Failure to fetch '${fileName}' (Status code: ${this.status})`);
            failedBuffers[newName] = true;
            sendAudioBufferAddedCallback(newName);
            if(errorCallback) {
                errorCallback(fileName);
            }
        }
    }
    request.send();
}
