"use strict";
function NotRedElfette() {

    const setElfLayers = sequencer => {
        sequencer.setRenderLayer(1,sequencer.elfBattleObject.state.layerCount>=1);
        sequencer.setRenderLayer(2,sequencer.elfBattleObject.state.layerCount>=2);
        sequencer.setRenderLayer(3,sequencer.elfBattleObject.state.layerCount>=3);
        sequencer.setRenderLayer(4,sequencer.elfBattleObject.state.layerCount>=4);
    }

    const addElfLayer = sequencer => {
        sequencer.elfBattleObject.state.layerCount++;
        setElfLayers(sequencer);
        if(!sequencer.playerBattleObject.state.distracted) {
            sequencer.updatePlayerMoves(getNormalStateMoveset(sequencer));
        }
    }
    const removeElfLayer = sequencer => {
        sequencer.elfBattleObject.state.layerCount--;
        setElfLayers(sequencer);
        if(!sequencer.playerBattleObject.state.distracted) {
            sequencer.updatePlayerMoves(getNormalStateMoveset(sequencer));
        }
    }

    const setRainSubtext = sequencer => {
        if(sequencer.globalBattleState.isRaining) {
            sequencer.elfBattleObject.subText[0] = "it is raining";
        } else {
            sequencer.elfBattleObject.subText[0] = "it is not raining";
        }
    }

    addMove({
        name: "make it rain",
        type: "self",
        process: (sequencer,user) => {
            if(sequencer.globalBattleState.isRaining) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "it's already raining"
                        }
                    ]
                }
            } else {
                sequencer.globalBattleState.rainTurns = 3;
                sequencer.globalBattleState.isRaining = true;
                setRainSubtext(sequencer);
                return {
                    text: "somehow the rain was summoned? magic?"
                }
            }
        }
    });

    addMove({
        name: "climate change",
        type: "target",
        process: (sequencer,user,target) => {
            if(target.state.layerCount <= 0) {
                return {
                    text: "but it had no effect on the elfette"
                }
            }
            target.state.forcedGoneWild = true;
            return {
                text: "hmmm... it's getting hot in here"
            }

        }
    });

    addMove({
        name: "clear mind",
        type: "self",
        process: (sequencer,user) => {
            user.state.distracted = false;
            sequencer.updatePlayerMoves(getNormalStateMoveset(sequencer));
            return {
                events: [
                    {
                        text: "the elfette's body has left your mind"
                    },
                    {
                        text: "(but the mental scars will remain forever)"
                    }
                ]
            }
        }
    });
    addMove({
        name: "[censored]",
        type: "self",
        process: (sequencer,user) => {
            return {
                text: "ew ew ew! ewww! she's an elf. sicko!"
            }
        }
    });
    addMove({
        name: "modesty",
        type: "self",
        process: (sequencer,user) => {
            const speeches = [
                "it was getting wet",
                "it was getting chilly",
                "you looking made\nme uncomfortable",
                "i don't like the rain",
                "the water here is\nfreeeezing",
                "water is for drinking\n\nand drowning humans"
            ];
            addElfLayer(sequencer);
            if(!user.state.distracted) {
                sequencer.updatePlayerMoves(getNormalStateMoveset(sequencer)); 
            }
            return {
                speech: speeches[Math.floor(Math.random()*speeches.length)]
            }
        }
    });
    addMove({
        name: "gone wild",
        type: "self",
        process: (sequencer,user) => {
            const speeches = [
                "[f]irst time - sorry",
                "i'm an el[f]ette\n*wink*",
                "some say i'm [f]ine",
                "i'm a little nervous",
                "don't make this weird",
                "don't look at me!",
                "stop looking!",
                "this is wrong on so\nmany different levels",
                "i am more than this",
                "blame climate change",
                "pay it forward",
                "i am not red elfette",
                "red elfette is my sister\n\n(i got the better genes)",
                "now - [f]**k off",
            ];
            const speech = speeches[sequencer.globalBattleState.speechIndex];
            sequencer.globalBattleState.speechIndex++;
            sequencer.globalBattleState.speechIndex = sequencer.globalBattleState.speechIndex % speeches.length;
            removeElfLayer(sequencer);
            if(!user.state.distracted) {
                sequencer.updatePlayerMoves(getNormalStateMoveset(sequencer));
            }
            return {
                speech: speech
            }
        }
    });
    addMove({
        name: "[double censored]",
        type: "self",
        process: (sequencer,user) => {
            return {
                text: "...this is bordering on illegal..."
            }
        }
    });
    addMove({
        name: "public citation",
        type: "target",
        process: (sequencer,user,target) => {
            target.dropHealth(50);
            return {
                text: "the elfette got fined with public indecency"
            }
        }
    });
    addMove({
        name: "eye bleach death",
        type: "self",
        process: (sequencer,user) => {
            return {
                events: [
                    {
                        text: "you have seem horrible things",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "just wash the pain away",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "one..",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "step..",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "at..",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "a..",
                        action: () => user.dropHealth(10)
                    },
                    {
                        text: "t i m e",
                        action: () => user.dropHealth(user.maxHealth)
                    }
                ]
            }
        }
    });

    const distractionStateMoveset = [
        moves["clear mind"],
        moves["[censored]"],
        moves["[double censored]"],
        moves["public citation"]
    ];
    const getNormalStateMoveset = sequencer => [
        moves["elfmart sword"],
        moves["make it rain"],
        moves["decent punch"],
        moves[sequencer.elfBattleObject.state.layerCount===0?"eye bleach death":"climate change"]
    ];

    addMove({
        name: "flash",
        type: "target",
        process: (sequencer,user,target) => {
            sequencer.updatePlayerMoves(distractionStateMoveset);
            target.state.distracted = true;
            return {
                events: [
                    {
                        text: "<insert narrator shame>",
                        action: () => removeElfLayer(sequencer)
                    },
                    {
                        text: "the flash hurt your eyes",
                        action: () => target.dropHealth(10)
                    },
                    {
                        text: "you are now distracted"
                    },
                    {
                        speech: "you disgust me",
                        action: () => addElfLayer(sequencer)
                    }
                ]
            }
        }
    });
    addMove({
        name: "reverse flash",
        type: "target",
        process: (sequencer,user,target) => {
            return {
                events: [
                    {
                        text: "oh - this is interesting",
                        action: () => addElfLayer(sequencer)
                    },
                    {
                        text: "it's a flash... but backwards?"
                    },
                    {
                        speech: "ah - breezy",
                        action: () => removeElfLayer(sequencer)
                    }
                ]
            }
        }
    });

    addMove({
        name: "exposed punch",
        type: "target",
        process: (sequencer,user,target) => {
            target.dropHealth(25);
            return {
                text: "this seemed unsanitary"
            }
        }
    });

    addMove({
        name: "modest punch",
        type: "target",
        process: (sequencer,user,target) => {
            target.dropHealth(25);
            return null;
        }
    });
    addMove({
        name: "elfmart band aid",
        type: "self",
        process: (sequencer,user) => {
            user.addHealth(160);
            return {
                text: "elfmart makes some good s**t"
            }
        }
    });

    this.name = "not red elfette";
    this.background = "background-1";
    this.backgroundColor = "rgb(255,215,181)";
    this.health = 400;
    this.defaultRenderLayers = [true,true,true,true,true];
    this.setup = sequencer => {
        sequencer.globalBattleState.isRaining = false;
        sequencer.elfBattleObject.subText = [];
        sequencer.elfBattleObject.state.layerCount = 4;
        setRainSubtext(sequencer);
    };
    this.getMove = sequencer => {
        if(sequencer.elfBattleObject.state.layerCount === 0) {
            if(sequencer.elfBattleObject.health <= 160 && !sequencer.globalBattleState.isRaining) {
                return moves["elfmart band aid"];
            }
            if(!sequencer.globalBattleState.isRaining) {
                if(Math.random() < 0.5) {
                    return moves["exposed punch"];
                }
            }
        }
        if(sequencer.elfBattleObject.state.forcedGoneWild && sequencer.elfBattleObject.state.layerCount >= 0) {
            return moves["gone wild"];
        }
        if(sequencer.globalBattleState.isRaining && sequencer.elfBattleObject.state.layerCount <= 3) {
            return moves["modesty"];
        }
        const possibleMoves = [
            sequencer.elfBattleObject.state.layerCount === 4 ? "modest punch" : "exposed punch",
            sequencer.elfBattleObject.state.layerCount >= 1 ? "flash" : "reverse flash",
            "elfmart band aid"
        ];
        return moves[possibleMoves[sequencer.turnNumber%possibleMoves.length]];
    }
    this.getPlayerMoves = sequencer => getNormalStateMoveset(sequencer);
    this.getDefaultGlobalState = () => {
        return {
            isRaining: false,
            rainTurns: 0,
            speechIndex: 0,
            postTurnProcess: sequencer => {
                sequencer.elfBattleObject.state.forcedGoneWild = false;
                if(sequencer.globalBattleState.isRaining) {
                    sequencer.globalBattleState.rainTurns--;
                    if(sequencer.globalBattleState.rainTurns === 0) {
                        sequencer.globalBattleState.isRaining = false;
                        return {
                            events: [
                                {
                                    text: "it stopped raining",
                                    action: () => setRainSubtext(sequencer)
                                }
                            ]
                        }
                    }
                }
                return null;
            }
        }
    }
}
