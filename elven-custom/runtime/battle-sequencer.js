"use strict";
function BattleSequencer(renderer) {

    this.renderer = renderer;

    this.sequencerPersisting = true;
    this.murderSequencerGracefully = () => {
        this.sequencerPersisting = false;
        while(this.skipHandles.length > 0) {
            this.skipEvent(true);
        }
    }

    this.skipHandles = [];
    this.skipEvent = suppress => {
        if(this.skipHandles.length > 0) {
            if(this.skipHandles.length > 100) {
                console.warn("Warning: The skip handle count is very high");
            }
            let skipHandle;
            do {
                skipHandle = this.skipHandles.shift();
            } while (
                !timeouts[skipHandle] && //If we have a timeout the still exists, we break the loop
                this.skipHandles.length > 0);//If we run out of handles, we break the loop

            if(timeouts[skipHandle]) {
                clearSkippableTimeout(skipHandle,suppress);
            }
        }
    }

    this.turboTextEnabled = false;
    this.turboTextVelocity = 125;

    this.enableTurboText = velocity => {
        this.turboTextEnabled = true;
        if(velocity >= 0) {
            this.turboTextVelocity = velocity;
        }
    }
    this.disableTurboText = () => this.turboTextEnabled = false;

    this.debugInfinity = false;

    this.getTextDuration = text => {
        if(this.turboTextEnabled) {
            return this.turboTextVelocity;
        } else if(this.debugInfinity) {
            return Infinity;
        } else {
            return 15000;
        }
    }

    this.elf = renderer.elf;

    const endScreenLength = 15000;
    const postSongDelay = 1000;

    this.battleOver = false;

    this.everybodyDiedMethod = () => {
        if(!this.sequencerPersisting) {
            return;
        }

        this.battleOver = true;

        this.bottomMessage = "everyone is dead";
        renderer.firstInputMask = "game over";
        let duration = endScreenLength;
        if(this.showingPersistentSpeech) {
            duration += this.persistentSpeechDuration;
        }
        if(!musicMuted) {
            stopMusic();
            let songDuration = playMusic("lose",0,false) * 1000;
            if(songDuration > duration) {
                duration = songDuration + postSongDelay;
            } else if (duration < songDuration + postSongDelay) {
                duration += (postSongDelay + songDuration) - duration;
            }
        }

        this.skipHandles.push(setSkippableTimeout(renderer.loseCallback,duration));
    }

    this.playerDiedMethod = () => {
        if(!this.sequencerPersisting) {
            return;
        }

        this.battleOver = true;

        this.bottomMessage =  this.elf.playerDeadText || "you are dead";
        renderer.firstInputMask = "game over";

        let duration = endScreenLength;
        if(this.elf.getWinSpeech || this.elf.winSpeech) {
            const speech = this.elf.winSpeech ? {text:this.elf.winSpeech} : this.elf.getWinSpeech(this);
            if(speech.text) {
                this.showElfSpeech(speech.text,0,Infinity);
                duration += this.getTextDuration(speech.text);
            }
            if(speech.action) {
                speech.action(this);//This is really only useful for setting elfRenderLayers
            }
            if(speech.animation) {
                this.showAnimation(speech.animation);
            }
        } else if(this.showingPersistentSpeech) {
            duration += this.persistentSpeechDuration;
        }
        if(!musicMuted) {
            stopMusic();
            let songDuration = playMusic("lose",0,false) * 1000;
            if(songDuration > duration) {
                duration = songDuration + postSongDelay;
            } else if (duration < songDuration + postSongDelay) {
                duration += (postSongDelay + songDuration) - duration;
            }
        }

        this.skipHandles.push(setSkippableTimeout(renderer.loseCallback,duration));

    }
    this.elfDiedMethod = () => {
        if(!this.sequencerPersisting) {
            return;
        }

        this.battleOver = true;

        this.bottomMessage = this.elf.elfDeadText || `${this.elf.name} is dead`;
        renderer.firstInputMask = "a job well done";

        let duration = endScreenLength;
        if(this.elf.getLoseSpeech || this.elf.loseSpeech) {
            const speech = this.elf.loseSpeech ? {text:this.elf.loseSpeech} : this.elf.getLoseSpeech(this);
            if(speech.text) {
                this.showElfSpeech(speech.text,0,Infinity);
                duration += this.getTextDuration(speech.text);
            }
            if(speech.action) {
                speech.action(this);
            }
            if(speech.animation) {
                this.showAnimation(speech.animation);
            }
        } else if(this.showingPersistentSpeech) {
            duration += this.persistentSpeechDuration;
        }
        if(!musicMuted) {
            stopMusic();
            let songDuration = playMusic("win.ogg",0,false) * 1000;
            if(songDuration > duration) {
                duration = songDuration + postSongDelay;
            } else if (duration < songDuration + postSongDelay) {
                duration += (postSongDelay + songDuration) - duration;
            }
        }
        rendererState.atWinState = true;
        this.skipHandles.push(setSkippableTimeout(renderer.winCallback,duration));
    }

    if(this.elf.getDefaultBattleState) {
        console.warn("Battle sequencer: Did you mean getDefaultGlobalState? You typed getDefaultBattleState");
    }

    this.globalBattleState = this.elf.getDefaultGlobalState ?
        this.elf.getDefaultGlobalState():{}

    if(!this.globalBattleState.movePreProcess) {
        this.globalBattleState.movePreProcess = null;
    }
    if(!this.globalBattleState.postTurnProcess) {
        this.globalBattleState.postTurnProcess = null;
    }

    this.elfRenderLayers = this.elf.defaultRenderLayers?
        [...this.elf.defaultRenderLayers] : [true];

    this.setRenderLayer = (index,shown) => {
        this.elfRenderLayers[index] = shown;
    }

    this.toggleRenderLayer = index => {
        this.elfRenderLayers[index] = !this.elfRenderLayers[index];
    }

    this.playerHasDied = false;
    this.elfHasDied = false;

    this.playerBattleObject = {
        isPlayer: true,
        isElf: false,
        isDead: false,
        isAlive: true,
        health: this.elf.playerHealth ? this.elf.playerHealth : 100,
        maxHealth: this.elf.playerHealth ? this.elf.playerHealth : 100,
        jitterHealthBar: false,
        healthBarDrop: false,
        name: "you",
        disabledMoves: {},
        lastMove: null,
        lastMoveFailed: null,
        movePreProcess: null,
        subText: null,
        dropHealth: amount => this.dropHealth(this.playerBattleObject,amount),
        addHealth: amount => this.addHealth(this.playerBattleObject,amount),
    };
    this.elfBattleObject = {
        isPlayer: false,
        isElf: true,
        isDead: false,
        isAlive: true,
        health: this.elf.health,
        maxHealth: this.elf.health,
        jitterHealthBar: false,
        healthBarDrop: false,
        name: this.elf.name,
        disabledMoves: {},
        lastMove: null,
        lastMoveFailed: null,
        movePreProcess: null,
        subText: null,
        dropHealth: amount => this.dropHealth(this.elfBattleObject,amount),
        addHealth: amount => this.addHealth(this.elfBattleObject,amount)
    };
    this.dropHealth = (target,amount) => {
        if(!this.sequencerPersisting) {
            return;
        }
        playSound("clip");
        target.health -= amount;
        target.jitterHealthBar = true;
        if(target.health <= 0) {
            target.health = 0;
            if(target.isPlayer) {
                this.playerHasDied = true;
                this.playerBattleObject.isDead = true;
                this.playerBattleObject.isAlive = false;
            } else {
                this.elfHasDied = true;
                this.elfBattleObject.isDead = true;
                this.elfBattleObject.isAlive = false;
            }
        }
        setTimeout(()=>{
            target.jitterHealthBar = false;
        },100); 
    },
    this.addHealth = (target,amount) => {
        if(!this.sequencerPersisting) {
            return;
        }
        playSound("reverse-clip");
        target.health += amount;
        target.healthBarDrop = true;
        if(target.health > target.maxHealth) {
            target.health = target.maxHealth;
        }
        setTimeout(()=>{
            target.healthBarDrop = false;
        },80);
    }

    if(this.elf.getDefaultPlayerState) {
        this.playerBattleObject.state = this.elf.getDefaultPlayerState();
    } else {
        this.playerBattleObject.state = {};
    }
    if(this.elf.getDefaultElfState) {
        this.elfBattleObject.state = this.elf.getDefaultElfState();
    } else {
        this.elfBattleObject.state = {};
    }

    this.processPlayerInput = moveIndex => {
        if(!this.sequencerPersisting) {
            return;
        }
        this.playerMove(
            this.playerMoves[moveIndex]
        );
    }

    this.showText = (text,delay,duration,callback) => {
        if(!duration) {
            duration = 1000;
        }
        const innerMethod = () => {
            if(this.sequencerPersisting) {
                this.bottomMessage = text;
                if(duration !== Infinity ) {
                    this.skipHandles.push(setSkippableTimeout(()=>{
                        this.bottomMessage = null;
                        if(callback) {
                            callback();
                        }
                    },duration));
                }
            }
        }
        if(delay) {
            if(this.sequencerPersisting) {
                this.skipHandles.push(setSkippableTimeout(innerMethod,delay));
            }
        } else {
            innerMethod();
        }
    }

    this.processTheMoveAndStuff = (move,user,target,callback,moveDisplayName) => {
        let moveResult;
        if(!move) {
            moveResult = {
                failed: true,
                text: "but the developer made a mistake"
            }
            console.error("Error: Hey idiot, you probably have a move key wrong");
        } else if(user.disabledMoves[move.name]) {
            moveResult = {
                failed: true,
                text: "but it has been disabled"
            }
        } else if(target.isDead && move.type === "target") {
            moveResult = {
                failed: true,
                text: "but their target is already dead"
            }
        } else {
            let skip = false;
            let processedMove = move;
            if(this.globalBattleState.movePreProcess !== null) {
                processedMove = this.globalBattleState.movePreProcess(this,processedMove);
                if(!move) {
                    moveResult = {
                        failed: true,
                        text: "but the developer made a mistake"
                    }
                    skip = true;
                    console.error("Error: The global preprocessor didn't return an acceptable value");
                }
            }
            if(!skip && user.movePreProcess !== null) {
                processedMove = user.movePreProcess(this,processedMove);
                if(!processedMove) {
                    moveResult = {
                        failed: true,
                        text: "but the developer made a mistake"
                    }
                    skip = true;
                    console.error("Error: The move user's move preprocessor didn't return an acceptabe value");
                }
            }
            if(!skip) {
                if(processedMove.process) {
                    moveResult = processedMove.process(
                        this,
                        user,
                        target
                    );
                } else {
                    moveResult = {
                        failed: true,
                        text: "but the developer made a mistake"
                    }
                    console.error(`Error: Move '${processedMove.name ? processedMove.name : "<Missing name>"}' is missing a process method`);
                }
            }
            if(moveResult && moveResult.failed === true) {
                if(!moveResult.text && !moveResult.events) {
                    moveResult = {
                        failed: true,
                        text: "but it failed"
                    }
                } else if(moveResult.events) {
                    moveResult.events = [{text:"but it failed"},...moveResult.events];
                }
            }
        }
        if(!moveResult) {
            if(moveResult === null) {
                moveResult = {};
            } else {
                moveResult = {
                    failed: true,
                    text: "but the developer made a mistake"
                };
            }
        }
        user.lastMove = moveDisplayName || null;
        if(!moveResult.failed) {
            if(moveResult.failed !== false) {
                moveResult.failed = false; 
            }
        } else if(moveResult.failed !== true) {
            moveResult.failed = true;
        }
        if(moveResult.text || moveResult.speech || moveResult.action) {
            moveResult.events = [{
                text:moveResult.text,
                speech:moveResult.speech,
                persist:moveResult.persist,
                action:moveResult.action,
                animation:moveResult.animation
            }];
        }
        if(moveResult.events && moveResult.events.length >= 1) {
            let eventIndex = 0;
            const processNextEvent = () => {
                const event = moveResult.events[
                    eventIndex
                ];
                const callingIndex = eventIndex;
                eventIndex++;
                this.processEvent(event,moveResult.events,processNextEvent,callback,callingIndex);
            }
            processNextEvent();
        } else if(callback) {
            callback();
        } else {
            this.returnInput();
            console.error("Error: Missing callback state");
        }
    }

    this.genericMove = (move,user,target,callback) => {
        if(!move || !move.name) {
            callback();
            if(move !== null) {
                console.error("Error: Missing move");
            }
            return;
        }
        if(move.type !== "interface") {
            const moveDisplayName = move.name.split("-")[0].trimEnd();
            const text = `${user.name} ${move.type === "option" ? "chose" : "used"} ${moveDisplayName}`;
                this.showText(
                    text,0,this.getTextDuration(text)
                    ,()=>this.processTheMoveAndStuff(move,user,target,callback,moveDisplayName)
            );
        } else {
            this.processTheMoveAndStuff(move,user,target,callback,move.name);
        }
    }

    this.playerMove = move => {
        if(this.showingPersistentSpeech) {
            this.clearPersistentSpeech();
        }
        if(this.sequencerPersisting) {
            renderer.disablePlayerInputs();
        }
        this.genericMove(move,
            this.playerBattleObject,
            this.elfBattleObject,
            ()=>{
                if(!this.elfHasDied) {
                    this.elfMove();
                } else {
                    this.returnInput();
                }
            }
        );
    }

    this.elfMove = () => {
        let move = null;
        if(this.elf.getMove) {
            move = this.elf.getMove(this);
            if(!move && move !== null) {
                console.warn("Battle sequencer: elf.getMove() returned no valid move. Was this intentional?");
            }
        }
        const callback = () => {
            if(!this.playerHasDied) {
                let elfSpeech = null;
                let speechPersistence = false;
                let speechAnimation = null;
                if(this.elf.getSpeech) {
                    let elfSpeechResult = this.elf.getSpeech(this);
                    if(elfSpeechResult) {
                        if(elfSpeechResult.text) {
                            elfSpeech = elfSpeechResult.text;
                            if(elfSpeechResult.persist === true) {
                                speechPersistence = true;
                            }
                            if(elfSpeechResult.animation) {
                                if(speechPersistence) {
                                    console.warn("Battle sequencer: animations are incompatible with persistent speeches");
                                } else {
                                    speechAnimation = elfSpeechResult.animation;
                                    this.showAnimation(speechAnimation);
                                }
                            }
                        } else if(elfSpeechResult) {
                            console.warn("Battle sequencer: animations must have a speech to go with them when sent from a speech event");
                        }
                    } else if(elfSpeechResult !== null) {
                        console.error("Battle sequencer: elf.getSpeech did not return a proper value");
                    }
                    if(!elfSpeech) {
                        elfSpeech = null;
                    }
                }
                if(elfSpeech !== null) {
                    this.showElfSpeech(
                        elfSpeech,0,
                        speechPersistence ? Infinity : this.getTextDuration(elfSpeech) * 1.33,
                        speechAnimation?()=>{
                            this.clearAnimation(speechAnimation.name);
                            this.returnInput();
                        }:this.returnInput
                    );
                } else {
                    this.returnInput();
                }
            } else {
                this.returnInput();
            }
        }
        if(move !== null) {
            this.genericMove(
                move,
                this.elfBattleObject,
                this.playerBattleObject,
                callback
            );
        } else {
            callback();
        }
    }

    this.processEvent = (event,eventsList,recursiveCallback,endCallback,index) => {
        if(!this.sequencerPersisting) {
            return;
        }
        let callback;
        if(event.condition) {
            if(!event.condition(this)) {
                callback = index >= eventsList.length-1 ? endCallback : recursiveCallback;
                callback();
                return;
            }
        }
        if(event.action) {
            const actionResult = event.action(this);
            if(actionResult) {
                if(actionResult.text || actionResult.speech || actionResult.action) {
                    eventsList.push({
                        text:actionResult.text,
                        speech:actionResult.speech,
                        action:actionResult.action,
                        persist:actionResult.persist,
                        animation:actionResult.animation
                    });
                } else if(actionResult.events) {
                    for(let i = 0;i<actionResult.events.length;i++) {
                        const actionResultEvent = actionResult.events[i];
                        eventsList.push({
                            text:actionResultEvent.text,
                            speech:actionResultEvent.speech,
                            action:actionResultEvent.action,
                            persist:actionResult.persist,
                            animation:actionResult.animation
                        });
                    }
                }
            }
        }
        const shouldEndCallback = index >= eventsList.length-1;
        callback = shouldEndCallback ? endCallback : recursiveCallback;
        if(event.text) {
            let hasAnimation = false;
            if(event.animation) {
                this.showAnimation(event.animation);
                hasAnimation = true;
            }
            this.showText(event.text,0,this.getTextDuration(event.text),
            ()=>{
                if(event.speech) {
                    this.showElfSpeech(
                        event.speech,0,
                        this.getTextDuration(event.speech),
                        hasAnimation?()=>{
                            if(!this.activeAnimations[this.activeAnimationLookup[event.animation.name]].persist || shouldEndCallback) {
                                this.clearAnimation(event.animation.name);
                            }
                            callback();
                        }:callback
                    );
                } else {
                    if(hasAnimation) {
                        if(!this.activeAnimations[this.activeAnimationLookup[event.animation.name]].persist || shouldEndCallback) {
                            this.clearAnimation(event.animation.name);
                        }
                    }
                    callback();
                }
            });
        } else if(event.speech) {
            let hasAnimation = false;
            if(event.animation) {
                if(!event.persist) {
                    this.showAnimation(event.animation);
                    hasAnimation = true;
                } else {
                    console.warn("Battle sequencer: animations must have a speech to go with them when sent from a speech only event");      
                }
            }
            this.showElfSpeech(
                event.speech,0,
                event.persist?Infinity:this.getTextDuration(event.speech),
                hasAnimation?()=>{
                    this.clearAnimation(event.animation.name);
                    callback();
                }:callback
            );
        } else {
            if(event.animation) {
                console.warn("Battle sequencer: Animations cannot be shown if they are not supplied with a text or speech event");
            }
            callback();
        }
    }

    this.activeAnimations = [];
    this.activeAnimationLookup = {};
    this.showAnimation = animation => {
        console.log("Battle sequencer: Showing animation",animation);
        if(animationDictionary[animation.name].playOnce) {
            animation.complete = false;
        }
        animation.startTime = performance.now();
        this.activeAnimationLookup[animation.name] = this.activeAnimations.length;
        this.activeAnimations.push(animation);
    }
    this.hasAnimation = name => this.activeAnimationLookup[name] >= 0;
    this.clearAnimation = name => {
        const lookupIndex = this.activeAnimationLookup[name];
        if(lookupIndex >= 0) {
            const removedAnimation = this.activeAnimations.splice(lookupIndex,1);
            console.log("Battle sequencer: Clearing animation",removedAnimation);
            delete this.activeAnimationLookup[name];
        } else {
            console.log("Battle sequencer: Active animation not found",name);
        }
    }

    this.showingPersistentSpeech;
    this.persistentSpeechDuration;

    this.clearSpeech = () => {
        if(this.sequencerPersisting) {
            this.elfSpeech = null;
            renderer.moveElf(80,0.5);
        }
    }

    this.clearPersistentSpeech = () => {
        if(!this.showingPersistentSpeech) {
            console.error("Battle sequencer internal error: We cannot clear a persistent speech because there isn't one");
            return;
        }

        this.clearSpeech();

        this.showingPersistentSpeech = false;
    }

    this.elfSpeech = null;
    this.showElfSpeech = (text,delay,duration,callback) => {
        if(!duration) {
            duration = 1000;
        }
        const innerMethod = () => {
            if(this.sequencerPersisting) {
                this.elfSpeech = text.split("\n");
                renderer.moveElf(80,0.25);
                if(duration !== Infinity) {
                    this.skipHandles.push(setSkippableTimeout(()=>{
                        this.clearSpeech();
                        if(callback) {
                            callback();
                        }
                    },duration));
                } else {
                    this.persistentSpeechDuration = this.getTextDuration(text);
                    this.showingPersistentSpeech = true;
                    if(callback) {
                        callback();
                    }
                }
            }
        }
        if(delay) {
            if(this.sequencerPersisting) {
                this.skipHandles.push(setSkippableTimeout(innerMethod,delay));
            }
        } else {
            innerMethod();
        }
    }

    this.turnNumber = 0;

    this.returnInput = () => {
        this.skipHandles = [];
        this.turnNumber++;
        if(this.elfHasDied && this.playerHasDied) {
            this.everybodyDiedMethod();
        } else if(this.elfHasDied) {
            this.elfDiedMethod();
        } else if(this.playerHasDied) {
            this.playerDiedMethod();
        } else {
            const endCallback = () => {
                if(this.elfHasDied && this.playerHasDied) {
                    this.everybodyDiedMethod();
                } else if(this.elfHasDied) {
                    this.elfDiedMethod();
                } else if(this.playerHasDied) {
                    this.playerDiedMethod();
                } else {
                    if(this.sequencerPersisting) {
                        renderer.enablePlayerInputs();
                    }
                }
            }
            if(this.globalBattleState.postTurnProcess !== null) {
                const turnProcessResult = this.globalBattleState.postTurnProcess(this);
                if(turnProcessResult) {
                    if(turnProcessResult.text || turnProcessResult.speech || turnProcessResult.action) {
                        turnProcessResult.events = [{
                            text:turnProcessResult.text,
                            speech:turnProcessResult.speech,
                            action:turnProcessResult.action}
                        ];
                    }
                    if(turnProcessResult.events && turnProcessResult.events.length >= 1) {
                        let eventIndex = 0;
                        const processNextEvent = () => {
                            const event = turnProcessResult.events[
                                eventIndex
                            ];
                            const callingIndex = eventIndex;
                            eventIndex++;
                            this.processEvent(event,turnProcessResult.events,processNextEvent,endCallback,callingIndex);
                        }
                        processNextEvent();
                    } else {
                        endCallback();
                    }

                } else {
                    endCallback();
                }
            } else {
                endCallback();
            }
        }
    }

    this.updatePlayerMoves = moves => {
        if(this.sequencerPersisting) {
            renderer.playerInputs = moves;
        }
        this.playerMoves = moves;
    }

    this.bottomMessage = null;

    if(this.elf.setup) {
        this.elf.setup(this);
    }

    if(!this.elf.playerMoves) {
        if(this.elf.getPlayerMoves) {
            this.updatePlayerMoves(this.elf.getPlayerMoves(this));
        } else {
            this.elf.playerMoves = [moves["honorable suicide"]];
            this.elf.winSpeech = "developer used lazy\n\ndeveloper laziness\nis super effective\n\nsomething something\nvv meta owo";
            this.updatePlayerMoves(this.elf.playerMoves);
        }
    } else {
        this.updatePlayerMoves(this.elf.playerMoves);
    }

    if(this.elf.startText) {
        if(this.sequencerPersisting) {
            renderer.disablePlayerInputs();
        }
        let endMethod;
        if(this.elf.startSpeech && this.elf.startSpeech.text) {
            endMethod = () => {
                this.showElfSpeech(
                    this.elf.startSpeech.text,
                    0,this.elf.startSpeech.persist ? Infinity : this.getTextDuration(this.elf.startSpeech.text),
                    renderer.enablePlayerInputs
                );
            }
        } else {
            endMethod = () => {
                if(this.sequencerPersisting) {
                    renderer.enablePlayerInputs();
                }
            }
        }        
        this.showText(
            this.elf.startText,0,
            500+this.getTextDuration(this.elf.startText),
            endMethod
        );
    } else {
        const startEnd = () => {
            if(this.sequencerPersisting) {
                renderer.enablePlayerInputs();
            }
        };
        if(this.elf.startSpeech && this.elf.startSpeech.text) {
            if(this.sequencerPersisting) {
                renderer.disablePlayerInputs();
            }
            this.showElfSpeech(
                this.elf.startSpeech.text,0,
                this.elf.startSpeech.persist ? Infinity : 500+this.getTextDuration(this.elf.startSpeech.text),
                startEnd
            );
        } else {
            startEnd();
        }
    }
}
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
