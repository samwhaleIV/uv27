"use strict";
function ElfmasTree() {

    this.song = "tree_loop";
    this.songIntro = "tree_intro";

    const showHenry = sequencer => {
        sequencer.showAnimation({name:"henry"});
        sequencer.setRenderLayer(0,true);
        playSound("transform",2.7);
        setTimeout(()=>{
            sequencer.setRenderLayer(0,false);
        },Math.round(animationDictionary.henry.smokeDuration/2));
    }

    const bakeATreat = {
        name: "bake a treat",
        type: "interface",
        process: (sequencer,user,target) => {
            sequencer.globalBattleState.moveState = "bake a treat";
            return {
                speech: "interesting way to go\nabout assisted suicide...\nbut okay."
            }
        }

    };
    const charades = {
        name: "let's play charade!",
        type: "target",
        process: () => {
            return {
                events: [
                    {
                        speech: "how about we don't!"
                    },
                    {
                        speech: "hey guess what i am!"
                    },
                    {
                        speech: "i'm a f**king tree!"
                    },
                    {
                        speech: "game over"
                    }
                ]
            }
        }
    };

    const kickDown = {
        name: "kick down",
        type: "target",
        process: (sequencer,user,target) => {
            if(sequencer.globalBattleState.moveState === "turned into a tree") {
                return {
                    text: "the wood is still too strong to kick down"
                }
            } else {
                return {
                    events: [
                        {
                            text: "you hurt your foot a little",
                            action: () => user.dropHealth(15)
                        },
                        {
                            text: "elf tree wood is too strong for common means"
                        }
                    ]
                }
            }
        }
    };
    const chopDown = {
        name: "chop down",
        type: "target",
        process: (sequencer,user,target) => {
            if(sequencer.globalBattleState.moveState === "turned into a tree") {
                return {
                    events: [
                        {
                            text: "the wood is now weak enough for an axe!"
                        },
                        {
                            speech: "praise be!"
                        },
                        {
                            text: "chop!",
                            action: () => target.dropHealth(25)
                        },
                        {
                            text: "chop!",
                            action: () => target.dropHealth(25)
                        },
                        {
                            text: "chop!",
                            action: () => target.dropHealth(25)
                        },
                        {
                            text: "chop!",
                            action: () => target.dropHealth(25)
                        },
                        {
                            speech: "thank you.\n\nyou're my hero."
                        },
                        {
                            speech: "*ded*"
                        }
                    ]
                }
            } else {
                return {
                    events: [
                        {
                            text: "your wrists are hurt by recoil",
                            action: () => user.dropHealth(25)
                        },
                        {
                            text: "elf tree wood is too strong for an axe"
                        }
                    ]
                }
            }          
        }     
    };
    const burnDown = {
        name: "burn down",
        type: "target",
        process: (sequencer,user,target) => {
            if(sequencer.globalBattleState.moveState === "turned into a tree") {
                return {
                    text: "the wood is still too strong to burn down"
                }
            } else {
                return {
                    events: [
                        {
                            speech: "i've tried that\n\nit's no use"
                        },
                        {
                            speech: "elf tree wood can't burn"
                        }
                    ]
                }
            }          
        }
    };
    const offerTreeBiscuits = {
        name: "offer tree biscuits",
        type: "target",
        process: (sequencer,user,target) => {
            if(sequencer.globalBattleState.ovenOn) {
                return {
                    events: [
                        {
                            text: "you forgot to turn the oven off"
                        },
                        {
                            text: "it exploded and you died",
                            action: () => user.dropHealth(user.maxHealth)
                        },
                        {
                            speech: "and yet...\ni still didn't die!\n\nyou are the worst\nassassin!"
                        }
                    ]
                }
            }
            sequencer.globalBattleState.moveState = "turned into a tree";
            return {
                events: [
                    {
                        text: "you offer elfmas tree some cookies"
                    },
                    {
                        text: "he takes them"
                    },
                    {
                        speech: "mmmm...\nthese are delicious!"
                    },
                    {
                        speech: "what's the secret\ningredi-"
                    },
                    {
                        speech: "??????",
                        action: sequencer => showHenry(sequencer)
                    },
                    {
                        speech: "ahhhhhh!\n\nwhat have you\ndone to me!?"
                    }
                ]
            }
        }
    };
    const discardTreeBiscuits = {
        name: "discard the biscuits",
        type: "interface",
        process: (sequencer,user) => {
            if(sequencer.globalBattleState.ovenOn) {
                return {
                    events: [
                        {
                            text: "you forgot to turn the oven off"
                        },
                        {
                            text: "it exploded and you died",
                            action: () => user.dropHealth(user.maxHealth)
                        },
                        {
                            speech: "and yet...\ni still didn't die!\n\nyou are the worst\nassassin!"
                        }
                    ]
                }
            }
            sequencer.globalBattleState.moveState = "default";
            return {
                text: "you disposed of the suspicious biscuits"
            }
        }
    };
    const gatherIngredients = {
        name: "gather ingredients",
        type: "interface",
        process: (sequencer,user) => {
            if(sequencer.globalBattleState.assembledIngredients) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "you already assembled the ingredients"
                        },
                        {
                            text: "what kind of idiot baker are you?"
                        }
                    ]
                }
            } else {
                sequencer.globalBattleState.assembledIngredients = true;
                return {
                    events: [
                        {
                            text: "you assembled the ingredients"
                        },
                        {
                            text: "it had some weird ingredients..."
                        },
                        {
                            text: "like - tree bark?"
                        },
                        {
                            text: "weird past mistakes?"
                        },
                        {
                            text: "gluten free flour?"
                        },
                        {
                            text: "a big leter h?"
                        }
                    ]
                }
            }
        }
    };
    const putStuffInOven = {
        name: "put stuff in the oven",
        type: "interface",
        process: (sequencer,user) => {
            if(sequencer.globalBattleState.assembledIngredients) {
                if(!sequencer.globalBattleState.ovenOn) { 
                    return {
                        failed: true,
                        events: [
                            {
                                text: "you didn't pre-heat the oven"
                            }
                        ]
                    }
                } else {
                    sequencer.globalBattleState.moveState = "baked tree biscuits";
                    return {
                        events: [
                            {
                                text: "you put a weird concoction in the oven"
                            },
                            {
                                text: "please wait."
                            },
                            {
                                text: "please wait.."
                            },
                            {
                                text: "please wait..."
                            },
                            {
                                text: "done!"
                            },
                            {
                                text: "they turned out perfect"
                            },
                            {
                                text: "you received tree biscuits!"
                            },
                            {
                                text: "(what the hell are these??)"
                            }
                        ]
                    }
                }
            } else {
                return {
                   failed: true,
                   events: [
                        {
                            text: "you didn't assemble your stuff first"
                        },
                        {
                            text: "you aren't a very good baker - are you?"
                        }
                   ]
                }
            }
        }
    };
    
    const turnOvenOn = {
        name: "turn the oven on",
        type: "interface",
        process: sequencer => {
            sequencer.globalBattleState.ovenOn = true;
            return {
                text: "you turned the oven on"
            }
        }
    };
    const turnOvenOff = {
        name: "turn the oven off",
        type: "interface",
        process: sequencer => {
            sequencer.globalBattleState.ovenOn = false;
            return {
                text: "you turned the oven off"
            }
        }
    };

    const runAwayScreaming = {
        name: "run away screaming",
        type: "self",
        process: (sequencer,user) => {
            return {
                events: [
                    {
                        text: "the horror was too much"
                    },
                    {
                        text: "you had to get away"
                    },
                    {
                        text: "you tripped and died",
                        action: () => user.dropHealth(user.maxHealth)
                    },
                    {
                        text: "maybe this was for the best"
                    },
                    {
                        speech: "you made me a monster!"
                    },
                    {
                        speech: "*cries*",
                        action: sequencer => sequencer.showAnimation({name:"crying"})
                    }
                ]
            }
        }
    };

    const eatTreeBerries = {
        name: "eat the tree berries",
        type: "self",
        process: (sequencer,user) => {
            return {
                events: [
                    {
                        text: "wow - those did not taste good"
                    },
                    {
                        text: "they really aren't sitting well with you"
                    },
                    {
                        text: "uh oh",
                        action: () => user.dropHealth(50)
                    },
                    {
                        text: "this isn't good"
                    },
                    {
                        text: "you puked every way till sunday"
                    },
                    {
                        text: "you ultimately died from renal failure",
                        action: () => user.dropHealth(user.maxHealth)
                    },
                    {
                        speech: "man.\ni want what\nthey're having."
                    }
                ]
            }
        }
    }
    
    this.getPlayerMoves = sequencer => {
        switch(sequencer.globalBattleState.moveState) {
            default:
            case "default":
                return [
                    charades,kickDown,chopDown,bakeATreat
                ]
            case "bake a treat":
                return [
                    sequencer.globalBattleState.ovenOn ? turnOvenOff : turnOvenOn,gatherIngredients,putStuffInOven
                ]
            case "baked tree biscuits":
                return [
                    offerTreeBiscuits,
                    discardTreeBiscuits,
                    sequencer.globalBattleState.ovenOn ? turnOvenOff : turnOvenOn,
                    eatTreeBerries
                ]
            case "turned into a tree":
                return [
                    burnDown,kickDown,chopDown,runAwayScreaming
                ]

        }
    }

    this.setup = sequencer => {
        sequencer.globalBattleState.moveState = "default";
        sequencer.globalBattleState.ovenOn = false;
        sequencer.globalBattleState.postTurnProcess = sequencer => {
            sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
        }
    }

    this.name = "elfmas tree";
    this.background = "background-4";
    this.backgroundColor = "rgb(95,158,58)";
    this.health = 100;


    this.startText = "you received an axe";

    this.startSpeech = {
        text: "please...\njust end my suffering\n\nyou have no idea\nwhat it's like\nto be a tree"
    }
}
