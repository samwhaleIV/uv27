const audioContext = new AudioContext();

const soundGain = 1;
const musicNodeGain = 0.2;

const volumeNode = audioContext.createGain();
volumeNode.connect(audioContext.destination);
volumeNode.gain.setValueAtTime(soundGain,0);

const musicCompressor = audioContext.createDynamicsCompressor();
musicCompressor.threshold.value = -50;
musicCompressor.knee.value = 40;
musicCompressor.ratio.value = 12;
musicCompressor.attack.value = 0;
musicCompressor.release.value = 0.25;

const musicVolumeNode = audioContext.createGain();
musicVolumeNode.gain.setValueAtTime(musicNodeGain,0);

musicVolumeNode.connect(audioContext.destination);
musicCompressor.connect(musicVolumeNode);

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
        musicVolumeNode.gain.setValueAtTime(0,0);
        musicMuted = true;
        localStorage.setItem("musicMuted",true);
    } else {
        console.warn("Audio manager: Music already muted");
    }
}
const muteSound = () => {
    if(!soundMuted) {
        volumeNode.gain.setValueAtTime(0,0);
        soundMuted = true;
        localStorage.setItem("soundMuted",true);
    } else {
        console.warn("Audio manager: Sound already muted");
    }
}

const unmuteSound = () => {
    if(soundMuted) {
        volumeNode.gain.setValueAtTime(soundGain,0);
        soundMuted = false;
        localStorage.setItem("soundMuted",false);
    } else {
        console.warn("Audio manager: Sound already unmuted");
    }
}

const unmuteMusic = () => {
    if(musicMuted) {
        musicVolumeNode.gain.setValueAtTime(musicNodeGain,0);
        musicMuted = false;
        localStorage.setItem("musicMuted",false);
    } else {
        console.warn("Audio manager: Music already unmuted");
    }
}

const playMusicWithIntro = (loopName,introName,fadeTime=0,withLoop=true) => {
    if(musicNode) {
        console.error("Error: Music is already playing");
    } else {
        const introBuffer = audioBuffers[introName];
        const loopBuffer = audioBuffers[loopName];
        if(!introBuffer || !loopBuffer) {
            console.warn(`Audio manager: '${loopName}' or '${introName}' is missing from audio buffers. Did we fail to load it?`);
        } else {
            musicNode = audioContext.createBufferSource();
            musicNode.buffer = introBuffer;
            musicNode.loop = false;
            musicNode.onended = event => {
                musicNode = audioContext.createBufferSource();
                musicNode.buffer = loopBuffer;
                musicNode.loop = withLoop;
                musicNode.connect(musicCompressor);
                musicNode.start();
            }
            musicNode.connect(musicCompressor);
            musicNode.start();
            if(!musicMuted) {
                if(fadeTime > 0) {
                    musicVolumeNode.gain.linearRampToValueAtTime(musicNodeGain,audioContext.currentTime + fadeTime);
                } else {
                    musicVolumeNode.gain.setValueAtTime(musicNodeGain,0);
                }
            }
        }
    }
}

const playMusic = (name,fadeTime=0,withLoop=true) => {
    if(musicNode) {
        console.error("Error: Music is already playing");
    } else {
        const buffer = audioBuffers[name];
        if(!buffer) {
            console.warn(`Audio manager: '${name}' is missing from audio buffers. Did we fail to load it?`);
            if(!withLoop) {
                return 0;
            }
        } else {
            musicNode = audioContext.createBufferSource();
            musicNode.buffer = buffer;
            musicNode.loop = withLoop;
            musicNode.connect(musicVolumeNode);
            musicNode.start();
            if(!musicMuted) {
                if(fadeTime > 0) {
                    musicVolumeNode.gain.linearRampToValueAtTime(musicNodeGain,audioContext.currentTime + fadeTime);
                } else {
                    musicVolumeNode.gain.setValueAtTime(musicNodeGain,0);
                }
            }
            if(!withLoop) {
                return buffer.duration;
            }
        }
    }
}
const stopMusic = (fadeTime=0) => {
    if(musicNode) {
        let oldMusicNode = musicNode;
        musicNode = null;
        if(fadeTime === 0) {
            oldMusicNode.stop();
        } else {
            if(!musicMuted) {
                musicVolumeNode.gain.linearRampToValueAtTime(0,audioContext.currentTime + fadeTime);
            }
            setTimeout(()=>{
                oldMusicNode.stop();
            },(fadeTime*1000)+50);
        }
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
                let newName = fileName.split("/").pop();
                const newNameSplit = newName.split(".");
                newName = newNameSplit[newNameSplit.length-2];

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
