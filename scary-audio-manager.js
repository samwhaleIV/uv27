const audioContext = new AudioContext();
const volumeNode = audioContext.createGain();
volumeNode.connect(audioContext.destination);
volumeNode.gain.value = 0.6;

const musicVolumeNode = audioContext.createGain();
musicVolumeNode.connect(audioContext.destination);
musicVolumeNode.gain.value = 0.1;

const audioBuffers = {};

const playSoundLooping = (name,isMusic,duration) => {
    console.error("Audio manager: Function not yet implemented");
}

const playSound = (name,isMusic,duration) => {
    const buffer = audioBuffers[name];
    if(buffer) {
        const bufferSourceNode = audioContext.createBufferSource();
        bufferSourceNode.buffer = audioBuffers[name];
        bufferSourceNode.connect(
            isMusic ? musicVolumeNode : volumeNode
        );
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
                audioBuffers[fileName] = audioBuffer;
                console.log(`Audio manager: Added '${fileName}' to audio buffers`);
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
