"use strict";
addMove({
    name: "them bones",
    type: "target",
    process: (sequencer,user,target) => {
        if(sequencer.globalBattleState.bonePileCount === 0) {
            sequencer.globalBattleState.bonePileCount++;
            elves[7].updateBoneCountDisplay(sequencer);
            return {
                failed: false,
                text: "bones were scattered everywhere"
            }
        } else if(sequencer.globalBattleState.bonePileCount >= 1){
            sequencer.globalBattleState.bonePileCount++;
            elves[7].updateBoneCountDisplay(sequencer);
            return {
                failed: false,
                text: "even more bones were scattered around"
            }
        } else {
            sequencer.globalBattleState.bonePileCount = 1;
            elves[7].updateBoneCountDisplay(sequencer);
            return {
                failed: false,
                text: "bones are all over the place now"
            }
        }
    }
});
addMove({
    name: "poison",
    type: "target",
    process: (sequencer,user,target) => {
        if(!target.state.isPoisoned) {
            target.state.isPoisoned = true;
            return {
                failed: false,
                text: `${target.name} ${target.isPlayer ? "were" : "was"} poisoned`
            }
        } else {
            return {
                failed: true,
                text: `but ${target.name} ${target.isPlayer ? "are" : "is"} already poisoned`
            }
        }
    }
});
addMove({
    name: "failed because bones",
    type: "self",
    process: (sequencer,user) => {
        if(user.isPlayer) {
            return {
                failed: true,
                text: "but a bone was in your way"
            }
        } else {
            return {
                failed: true,
                text: "but a bone was in their way"
            }
        }
    }
});
addMove({
    name: "drink alchohol",
    type: "self",
    process: (sequencer,user) => {
        if(!user.state.isLit) {
            user.state.isLit = true;
            if(user.isPlayer) {
                return {
                    events: [{text: `${user.name} are getting lit`}]
                }
            } else {
                return {
                    events: [{text: `${user.name} is getting lit`}]
                }
            }
        } else if(!user.state.isSuperLit) {
            user.state.isSuperLit = true;
            if(user.isPlayer) {
                return {
                    events: [{text: `${user.name} are super lit now`}]
                }
            } else {
                return {
                    events: [{text: `${user.name} got super lit`}]
                }
            }
        } else if(user.state.alchoholWarning) {
            sequencer.dropHealth(user,user.maxHealth);
            user.state.alchoholOD = true;
            if(user.isPlayer) {
                return {
                    events: [{text: "your kidneys have failed"}]
                }
            } else {
                return {
                    events: [{text: `${user.name}'${user.name.endsWith("s") ? "" : "s"} kidneys have failed`}]
                }
            }
        } else {
            user.state.alchoholWarning = true;
            return {
                events: [{text: `but can ${user.name} get any more lit?`}]
            }
        }
    }
});
addMove({
    name: "make antidote",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.hasACure) {
            return {
                failed: true,
                text: `but ${user.name} already ${user.isPlayer ? 'have' : 'has'} an antidote`
            }
        } else {
            user.state.hasACure = true;
            return {
                failed: false,
                text: `${user.name} made an antidote`
            }
        }
    }
});
addMove({
    name: "use antidote",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.hasACure) {
            user.state.hasACure = false;
            user.state.isPoisoned = false;
            const wasLit = user.state.isLit;
            if(user.state.isLit) {
                user.state.isLit = false;
                user.state.isSuperLit = false;
                user.state.alchoholWarning = false;
                user.state.drunkenCries = false;
            }
            return {
                failed: false,
                text: `${user.name} cured ${user.isPlayer ? "your" : "their"} poisoning${wasLit ? "s" : ""}`
            }
        } else {
            return {
                failed: true,
                text: `but ${user.name} do${user.isPlayer ? "n't" : "esn't"} have an antidote`
            }
        }
    }
});
addMove({
    name: "big hug",
    type: "target",
    process: (sequencer,user,target) => {
        if(user.state.ownsLove) {
            return {
                events: [
                    {
                        text: "human love is too much for an elf!"
                    },
                    {
                        text: "(especially the germs)"
                    },
                    {
                        speech: "please! spare me!"
                    },
                    {
                        text: "*here comes the hug*"
                    },
                    {
                        speech: "nooooooo!"
                    },
                    {
                        text: `${target.name}'s skin melted on contact`,
                        action: () => target.dropHealth(target.maxHealth)
                    }
                ]
            }
        }
        return {
            events: [
                {
                    text: `${user.name} gave ${target.name} a big hug`
                },
                {
                    text: "human germs are too strong for elves",
                    action: () => target.dropHealth(10)
                }
            ]
        }
    }
});
addMove({
    name: "violence",
    type: "target",
    process: (sequencer,user,target) => {
        const events = "hey guess what violence just got a little more random".split(" ").map(word => {return{text:word}});
        events.push({
            text: `${target.name} got a little hurt by the violence`,
            speech: "but really i am mostly\nconfused by what\njust happpened",
            action: () => {
                sequencer.disableTurboText();
                target.dropHealth(20);
            }
        })
        events[0].action = sequencer.enableTurboText;
        return {
            events: events
        }
    }
});
addMove({
    name: "sarcophagus",
    type: "target",
    process: (sequencer,user,target) => {
        if(sequencer.globalBattleState.bonePileCount >= 1) {
            sequencer.globalBattleState.bonePileCount--;
            elves[7].updateBoneCountDisplay(sequencer);
            return {
                failed: false,
                text: "a bone pile was stored away"
            }
        } else {
            if(sequencer.elf.name === "boney elf" && user.isPlayer) {
                return {
                    failed: true,
                    text: "but there's no bone piles anywhere"
                }
            } else {
                return {
                    failed: true,
                    text: "but boney elf won't get in"
                }
            }
        }
    }
});
addMove({
    name: "pass the whiskey",
    type: "target",
    process: (sequencer,user,target) => moves["drink alchohol"].process(sequencer,target)
});
addMove({
    name: "slurred words",
    type: "self",
    process: (sequencer,user) => {
        const responses = [
            "i am a goat",
            "i erm ahn erf",
            "sanda does der suck",
            "y is the schmo woot",
            "wert - held en!",
            "errrr",
            "*burp sounds*",
            "*blurp sounds*",
            "*hisses like a cat*"
        ];
        const text = responses[Math.floor(Math.random()*responses.length)];
        return {
            speech: text
        }
    }
});
addMove({
    name: "slrrd werrsds",
    type: "self",
    process: (sequencer,user) => {
        const responses = [
            "erm a geet",
            "erm an erf",
            "sandy erm derf",
            "gimizzle schmo woot",
            "fledal ledeel yeet",
            "yoot yoot murrr",
            "mauray chrast mast",
            "wet u thlink u r",
            "helden horp eorsfod",
            "*????????*"
        ];
        const text = responses[Math.floor(Math.random()*responses.length)];
        return {
            speech: text
        }
    }
});
addMove({
    name: "drunken punch",
    type: "target",
    process: (sequencer,user,target) => {
        const successRate = user.state.isSuperLit ? 0.8 : 0.63;
        if(Math.random() > successRate) {
            if(sequencer.globalBattleState.playedBoozeOClock) {
                return {
                    failed: true,
                    events: [{
                        text: `${target.name} got too lit`
                    }]
                }
            } else {
                sequencer.globalBattleState.playedBoozeOClock = true;
                return {
                    failed: true,
                    events: turboTextIncremental(
                        sequencer,
                        "but it failed because...",
                        "it's booooooooooooze o' clock!!!",
                    )
                }
            }
        } else {
            target.dropHealth(user.state.isSuperLit ? 20 : 15);
            return {
                text: "it was almost a miss",
                animation:target.isElf?{name:"punch"}:null
            }
        }
    }
});
addMove({
    name: "drunken rant",
    type: "self",
    process: sequencer => {
        return {
            events: turboTextWordByWord(
                sequencer,
                "okay so my wife tracy broke up with me because she didn't love me anymore and now my heart is sad and broken and shattered into a million little elf pieces except i don't have a heart because i'm a skeleton but later you might notice that my kidneys fail so why would i have kidneys if i don't have a heart",
                null,
                "okay...\ndid you get all that?"
            )
        }
    }
});
addMove({
    name: "bone toss",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            failed: true,
            text: `but it failed because ${target.name} ${target.isPlayer ? "aren't" : "isn't"} a dog`
        }
    }
});
addMove({
    name: "bone salad",
    type: "self",
    process: (sequencer,user) => {
        return {
            failed: false,
            text: `${user.name} ${user.isPlayer ? "are" : "is"} prepping for a wicked potluck`
        }
    }
});
addMove({
    name: "bone o' clock",
    type: "target",
    process: (sequencer,user) => {
        if(user.isPlayer && sequencer.elf.name === "boney elf") {
            return {
                failed: false,
                text: "boney elf laughs evilly"
            }
        } else {
            return {
                failed: true,
                text: `but the bone clock makes no sense`
            }
        }
    }
});
function BoneyElf() {
    this.name = "boney elf";
    this.background = "background-8";

    this.song = "pos_loop";
    this.songIntro = "pos_intro";

    this.backgroundColor = "white";
    this.foregroundColor = "rgb(255,66,134)";
    this.buttonColor = "rgba(30,30,30,0.95)";
    this.health = 200;
    this.playerMoves = [
        moves["wimpy punch"],
        moves["sarcophagus"],
        moves["big hug"],
        moves["violence"]
    ];
    this.getMove = sequencer => {
        if(sequencer.elfBattleObject.state.isLit) {
            const litMoves = ["drunken punch","drunken punch","them bones","drunken rant","cry","cry"];
            if(sequencer.elfBattleObject.state.isSuperLit) {
                litMoves.push("slrrd werrsds");
            } else {
                litMoves.push("slurred words");
            }
            return moves[litMoves[Math.floor(Math.random() * litMoves.length)]];
        } else {
            const userPoisonedMoves = ["them bones","bone toss","bone salad","bone o' clock"];
            if(sequencer.playerBattleObject.state.isPoisoned) {
                return moves[userPoisonedMoves[Math.floor(Math.random()*userPoisonedMoves.length)]];
            } else if(Math.random() < 0.35) {
                return moves["poison"];
            } else {
                return moves[userPoisonedMoves[Math.floor(Math.random()*userPoisonedMoves.length)]];
            }
        }
    };
    this.updateBoneCountDisplay = sequencer => {
        sequencer.elfBattleObject.subText[0] = `${
            sequencer.globalBattleState.bonePileCount
        } bone pile${
            sequencer.globalBattleState.bonePileCount !== 1 ? "s" : ""
        }`;
    };
    this.getDefaultGlobalState = () => {
        return {
            bonePileCount: 0,
            postTurnProcess: sequencer => {
                if(sequencer.playerBattleObject.state.isPoisoned) {

                    const poisonStateMoves = [
                        sequencer.playerBattleObject.state.isLit ? moves["pass the whiskey"] : moves["wimpy punch"],
                        moves["cry"],
                        null,
                        moves["drink alchohol"]
                    ];

                    if(sequencer.playerBattleObject.state.hasACure) {
                        poisonStateMoves[2] = moves["use antidote"];
                    } else {
                        poisonStateMoves[2] = moves["make antidote"];
                    }
                    sequencer.updatePlayerMoves(poisonStateMoves);
                } else {
                    sequencer.updatePlayerMoves(elves[7].playerMoves);
                }

                const eventStack = [];
                if(sequencer.playerBattleObject.state.isPoisoned) {
                    eventStack.push({
                        text: "you are hurt by poison",
                        action: () => {
                            sequencer.dropHealth(sequencer.playerBattleObject,5);
                        },
                        condition: () => sequencer.playerBattleObject.health > 0
                    });
                }
                if(sequencer.playerBattleObject.state.isLit) {
                    eventStack.push({
                        text: `you are hurt by alchohol poisoning${sequencer.playerBattleObject.state.isPoisoned?" too":""}`,
                        action: () => {
                            sequencer.dropHealth(sequencer.playerBattleObject,5);
                        },
                        condition: () => sequencer.playerBattleObject.health > 0
                    });                    
                }
                if(sequencer.elfBattleObject.state.isPoisoned) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is hurt by poison`,
                        action: () => {
                            sequencer.dropHealth(sequencer.playerBattleObject,Math.round(sequencer.elfBattleObject.health * 0.05));
                        },
                        condition: () => sequencer.elfBattleObject.health > 0
                    });
                }
                if(sequencer.elfBattleObject.state.isLit) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is hurt by alchohol poisoning${sequencer.elfBattleObject.state.isPoisoned?" too":""}`,
                        action: () => {
                            sequencer.dropHealth(sequencer.elfBattleObject,Math.round(sequencer.elfBattleObject.health * 0.05));
                        },
                        condition: () => sequencer.elfBattleObject.health > 0
                    });                    
                }
                if(sequencer.globalBattleState.bonePileCount >= 1) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is healed by the bones`,
                        action: () => {
                            sequencer.addHealth(sequencer.elfBattleObject,Math.round(sequencer.elfBattleObject.health * 0.04) * sequencer.globalBattleState.bonePileCount)
                        },
                        condition: () => sequencer.elfBattleObject.health >= 0 && sequencer.elfBattleObject.health !== sequencer.elfBattleObject.maxHealth
                    });
                }
                if(eventStack.length > 0) {
                    return {
                        events: eventStack
                    }
                }
            }
        }
    };
    this.getWinSpeech = sequencer => {
        if(sequencer.playerBattleObject.state.alchoholOD) {
            return {text:"rip\nshouldn't drink so much"};
        } else {
            return {text:"looks like you've been...\nb o n e d"};
        }
    };
    this.getLoseSpeech = sequencer => {
        if(sequencer.elfBattleObject.state.alchoholOD) {
            return {text:"errrr\nderrr...\nblurbbb..\n\n*ded*"};
        } else {
            return {text:"damn...\ni've been... boned"};
        }
    };
    this.setup = sequencer => {
        sequencer.elfBattleObject.subText = [""];
        elves[7].updateBoneCountDisplay(sequencer);
        sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
            let chance = 1 - (0.07 * sequencer.globalBattleState.bonePileCount);
            if(Math.random() > chance) {
                return moves["failed because bones"];
            } else {
                return move;
            }
        }

    }
}
