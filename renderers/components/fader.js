const getFader = function() {
    const fader = {
        delta: 0,
        time: 600,
        start: null,
        fadeInDelay: 400,
        transitionParameters: null,
        transitionRenderer: null,
        inMethod: null,
        fadeIn: exitMethod => {
            startRenderer();
            rendererState.fader.delta = -1;
            rendererState.fader.start = performance.now();
            if(exitMethod) {
                rendererState.fader.inMethod = exitMethod;
            }
            const staticTime = rendererState.fader.time / 1000;
            playSound("swish-2",staticTime);
            if(rendererState.song) {
                if(rendererState.songIntro) {
                    playMusicWithIntro(rendererState.song,rendererState.songIntro);
                } else {
                    playMusic(rendererState.song);
                }
            } else if(rendererState.songStartAction) {
                rendererState.songStartAction();
            }
        },
        fadeOut: (rendererGenerator,...parameters) => {
            rendererState.transitioning = true;
            rendererState.fader.delta = 1;
            rendererState.fader.start = performance.now();
            rendererState.fader.transitionRenderer = rendererGenerator;
            rendererState.fader.transitionParameters = parameters;
            const staticTime = rendererState.fader.time / 1000;
            playSound("swish-1",staticTime);
            stopMusic();
        },
        oninEnd: () => {
            if(rendererState.fader) {
                if(rendererState.fader.inMethod) {
                    rendererState.fader.inMethod();
                }
                rendererState.transitioning = false;
            }
            console.log("Transition complete");
        },
        onoutEnd: () => {
            pauseRenderer();
            if(rendererState.fader.transitionRenderer) {
                drawLoadingText();
                rendererState = new rendererState.fader.transitionRenderer(
                    ...rendererState.fader.transitionParameters
                );
                if(rendererState.fader) {
                    rendererState.transitioning = true;
                    if(musicMuted) {
                        setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                        return;
                    }
                    if(rendererState.song) {
                        const songLoaded = audioBuffers[rendererState.song] || failedBuffers[rendererState.song];
                        if(songLoaded) {
                            setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                        } else {
                            audioBufferAddedCallback = name => {
                                if(name === rendererState.song) {
                                    setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                                    audioBufferAddedCallback = null;
                                }
                            }
                            loadSongOnDemand(rendererState.song);
                        }
                    } else if(rendererState.song && rendererState.songIntro) {
                        const songLoaded = audioBuffers[rendererState.song] || failedBuffers[rendererState.song];
                        const introLoaded = audioBuffers[rendererState.song] || failedBuffers[rendererState.song];
                        if(songLoaded && introLoaded) {
                            setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                        } else if(introLoaded) {
                            audioBufferAddedCallback = name => {
                                if(name === rendererState.song) {
                                    setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                                    audioBufferAddedCallback = null;
                                }
                            }
                            loadSongOnDemand(rendererState.song);                          
                        } else if(songLoaded) {
                            audioBufferAddedCallback = name => {
                                if(name === rendererState.songIntro) {
                                    setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                                    audioBufferAddedCallback = null;
                                }
                            }
                            loadSongOnDemand(rendererState.songIntro);
                        } else {
                            let hasSong = false;
                            let hasIntro = false;
                            audioBufferAddedCallback = name => {
                                switch(name) {
                                    case rendererState.song:
                                        hasSong = true;
                                        break;
                                    case rendererState.songIntro:
                                        hasIntro = true;
                                        break;
                                }
                                if(hasSong && hasIntro) {
                                    setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                                    audioBufferAddedCallback = null;
                                }
                            }
                            loadSongOnDemand(rendererState.song);
                            loadSongOnDemand(rendererState.songIntro);
                        }
                    } else {
                        setTimeout(rendererState.fader.fadeIn,rendererState.fader.fadeInDelay);
                    }
                }
            } else {
                console.error("Error: Missing fader transition state");
            }
        },
        process: (context,timestamp,width,height) => {
            if(rendererState.fader.delta !== 0) {
                let fadeIntensity;
                if(rendererState.fader.delta > 0) {
                    fadeIntensity = (timestamp - rendererState.fader.start) / rendererState.fader.time;
                    if(fadeIntensity > 1) {
                        fadeIntensity = 1;
                    }
                } else {
                    fadeIntensity = 1 - (timestamp - rendererState.fader.start) / rendererState.fader.time;
                    if(fadeIntensity < 0) {
                        rendererState.fader.delta = 0;
                        rendererState.fader.oninEnd();
                        return;
                    }
                }

                let radius = Math.floor(500 - (fadeIntensity * 500));
                if(radius < 0) {
                    radius = 0;
                }
                if(backgroundStreamMode) {
                    preRenderedInverseCircleBlack(width,height,radius);
                } else {
                    preRenderedInverseCircleWhite(width,height,radius);
                    noiseBlackOut(
                        fadeIntensity,
                        context,width,height,
                        15 + (fadeIntensity * 40),
                        255 - (fadeIntensity * 255)
                    );
                }


                if(fadeIntensity === 1 && rendererState.fader.delta === 1) {
                    rendererState.fader.delta = 0;
                    rendererState.fader.onoutEnd();
                }

            }
        }
    }
    return fader;
}
