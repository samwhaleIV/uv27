const audioContext = new AudioContext();
const volumeNode = audioContext.createGain();
volumeNode.connect(audioContext.destination);
volumeNode.gain.value = 1;

const musicNodeGain = 0.1;
const musicVolumeNode = audioContext.createGain();
musicVolumeNode.connect(audioContext.destination);
musicVolumeNode.gain.value = musicNodeGain;

const audioBuffers = {};

let musicNode = null, musicMuted = false, soundMuted = false;

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
        musicVolumeNode.disconnect(audioContext.destination);
        musicMuted = true;
    } else {
        console.warn("Audio manager: Music already muted");
    }
}
const muteSound = () => {
    if(!soundMuted) {
        volumeNode.disconnect(audioContext.destination);
        soundMuted = true;
    } else {
        console.warn("Audio manager: Sound already muted");
    }
}

const unmuteSound = () => {
    if(soundMuted) {
        volumeNode.connect(audioContext.destination);
        soundMuted = false;
    } else {
        console.warn("Audio manager: Sound already unmuted");
    }
}

const unmuteMusic = () => {
    if(musicMuted) {
        musicVolumeNode.connect(audioContext.destination);
        musicMuted = false;
    } else {
        console.warn("Audio manager: Music already unmuted");
    }
}

const playMusic = (name,fadeTime=0) => {
    if(musicNode) {
        console.error("Error: Music is already playing");
    } else {
        const buffer = audioBuffers[name];
        if(!buffer) {
            console.warn(`Audio manager: '${name}' is missing from audio buffers. Did we fail to load it?`);
        } else {
            musicNode = audioContext.createBufferSource();
            musicNode.buffer = buffer;
            musicNode.loop = true;
            musicNode.connect(musicVolumeNode);
            musicNode.start();
            musicVolumeNode.gain.linearRampToValueAtTime(musicNodeGain,audioContext.currentTime + fadeTime);
        }
    }
}
const stopMusic = (fadeTime=0) => {
    if(musicNode) {
        let oldMusicNode = musicNode;
        musicNode = null;
        musicVolumeNode.gain.linearRampToValueAtTime(0,audioContext.currentTime + fadeTime);
        setTimeout(()=>{
            oldMusicNode.stop();
        },(fadeTime*1000)+50);
    } else {
        console.warn("Warning: No music is playing and cannot be stopped again");
    }
}

const playSound = (name,duration) => {
    const buffer = audioBuffers[name];
    if(buffer) {
        const bufferSourceNode = audioContext.createBufferSource();
        bufferSourceNode.buffer = buffer;
        if(duration) {
            bufferSourceNode.playbackRate.value = buffer.duration / duration;
        }
        bufferSourceNode.connect(volumeNode);
        bufferSourceNode.start();
    } else {
        console.warn(`Audio manager: '${name}' is missing from audio buffers. Did we fail to load it?`);
    }
}

const addBufferSource = (fileName,callback,errorCallback) => {
    const decode = audioData => {
        audioContext.decodeAudioData(
            audioData,
            audioBuffer => {
                const newName = fileName.split("/").pop();
                audioBuffers[newName] = audioBuffer;
                console.log(`Audio manager: Added '${newName}' to audio buffers`);
                if(callback) {
                    callback(fileName);
                }
            },
            () => {
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
            if(errorCallback) {
                errorCallback(fileName);
            }
        }
    }
    request.send();
}
