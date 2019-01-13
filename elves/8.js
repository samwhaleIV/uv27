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
                    text: `${user.name} are getting lit`
                }
            } else {
                return {
                    text: `${user.name} is getting lit`
                }
            }
        } else if(!user.state.isSuperLit) {
            user.state.isSuperLit = true;
            if(user.isPlayer) {
                return {
                    text: `${user.name} are super lit now`
                }
            } else {
                return {
                    text: `${user.name} got super lit`
                }
            }
        } else if(user.state.alchoholWarning) {
            sequencer.dropHealth(user,user.maxHealth);
            if(user.isPlayer) {
                return {
                    text: "your kidneys have failed"
                }
            } else {
                return {
                    text: `${user.name}'${user.name.endsWith("s") ? "" : "s"} kidneys have failed`
                }
            }
        } else {
            user.state.alchoholWarning = true;
            return {
                text: `but ${user.name} can't get any more lit`
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
        return {
            events: [
                {
                    text: `${user.name} gave ${target.name} a big hug`
                },
                {
                    text: `${target.name} looks uncomfortable`
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
            return {
                failed: true,
                text: "but there's no bone piles anywhere"
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
        return {
            speech: slurText(elves[7].drunkResponses[Math.floor(Math.random() * elves[7].drunkResponses.length)])
        }
    }
});
addMove({
    name: "slrrd werrsds",
    type: "self",
    process: (sequencer,user) => {
        return {
            speech: superSlurText(elves[7].drunkResponses[Math.floor(Math.random() * elves[7].drunkResponses.length)])
        }
    }
});
addMove({
    name: "drunken punch",
    type: "target",
    process: (sequencer,user,target) => {
        if(Math.random() > 0.63) {
            const events = [{
                text: "but it failed because..."
            },..."it's booooooooooooze o' clock!!!".split("").map((item,index,arr)=>{
                let text;
                if(index !== 0) {
                    text = arr[index-1] + item;
                } else {
                    text = arr[0];
                }
                arr[index] = text;
                return {text:text}
            })];
            events[1].action = () => sequencer.enableTurboText(40);
            events[events.length-1].action = sequencer.disableTurboText;
            return {
                failed: true,
                events: events
            }
        } else {
            target.dropHealth(10);
            return {
                failed: false,
                text: "it was almost a miss"
            }
        }
    }
});
addMove({
    name: "drunken rant",
    type: "self",
    process: sequencer => {
        const events =
"okay so my wife tracy broke up with me because she didn't love me anymore and now my heart is sad and broken and shattered into a million little elf pieces except i don't have a heart because i'm a skeleton but later you might notice that my kidneys fail so why would i have kidneys if i don't have a heart".split(" ").map(word => {return{text:word}});
        events.push({
            speech: "okay...\ndid you get all that?",
            action: () => {
                sequencer.disableTurboText();
            }
        })
        events[0].action = () => sequencer.enableTurboText(60);
        return {
            events: events
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

const slurText = text => {
    const vowelReplacements = "aeiou";
    return text.replace(vowelReplacements[Math.floor(vowelReplacements.length*Math.random())],"");
}
const superSlurText = text => {
    [
        ["am","em"],
        ["an","am"],
        ["ck","cc"],
        ["o","e"],
        ["i","e"],
    ].forEach(item => {
        text = text.replace(item[0],item[1])
    });
    return slurText(text);;
}

elves[7] = {
    name: "boney elf",
    background: "background-8",
    backgroundColor: "white",
    darkHover: true,
    health: 200,
    playerMoves: [
        moves["wimpy punch"],
        moves["sarcophagus"],
        moves["big hug"],
        moves["violence"]
    ],
    drunkResponses: [
        "i am a god",
        "i am an elf",
        "santa does the suck",
        "why is snow white",
        "wait - hold on",
        "errrr",
        "*burp sounds*",
        "*hisses like a cat*"
    ],
    getMove: sequencer => {
        if(sequencer.elfBattleObject.state.isLit) {
            const litMoves = ["drunken punch","drunken punch","them bones","drunken rant","cry"];
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
            } else if(Math.random() < 0.27) {
                return moves["poison"];
            } else {
                return moves[userPoisonedMoves[Math.floor(Math.random()*userPoisonedMoves.length)]];
            }
        }
    },
    updateBoneCountDisplay: sequencer => {
        sequencer.elfBattleObject.subText[0] = `${
            sequencer.globalBattleState.bonePileCount
        } bone pile${
            sequencer.globalBattleState.bonePileCount !== 1 ? "s" : ""
        }`;
    },
    getDefaultGlobalState: () => {
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
                        condition: () => sequencer.playerBattleObject.health >= 1
                    });
                }
                if(sequencer.playerBattleObject.state.isLit) {
                    eventStack.push({
                        text: `you are hurt by alchohol poisoning${sequencer.playerBattleObject.state.isPoisoned?" too":""}`,
                        action: () => {
                            sequencer.dropHealth(sequencer.playerBattleObject,5);
                        },
                        condition: () => sequencer.playerBattleObject.health >= 1
                    });                    
                }
                if(sequencer.elfBattleObject.state.isPoisoned) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is hurt by poison`,
                        action: () => {
                            sequencer.dropHealth(sequencer.playerBattleObject,Math.round(sequencer.elfBattleObject.health * 0.05));
                        },
                        condition: () => sequencer.elfBattleObject.health >= 1
                    });
                }
                if(sequencer.elfBattleObject.state.isLit) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is hurt by alchohol poisoning${sequencer.elfBattleObject.state.isPoisoned?" too":""}`,
                        action: () => {
                            sequencer.dropHealth(sequencer.elfBattleObject,Math.round(sequencer.elfBattleObject.health * 0.05));
                        },
                        condition: () => sequencer.elfBattleObject.health >= 1
                    });                    
                }
                if(sequencer.globalBattleState.bonePileCount >= 1) {
                    eventStack.push({
                        text: `${sequencer.elfBattleObject.name} is healed by the bones`,
                        action: () => {
                            sequencer.addHealth(sequencer.elfBattleObject,Math.round(sequencer.elfBattleObject.health * 0.04) * sequencer.globalBattleState.bonePileCount)
                        },
                        condition: () => sequencer.elfBattleObject.health >= 1 && sequencer.elfBattleObject.health !== sequencer.elfBattleObject.maxHealth
                    });
                }
                if(eventStack.length > 0) {
                    return {
                        events: eventStack
                    }
                }
            }
        }
    },
    setup: sequencer => {
        sequencer.elfBattleObject.subText = [""];
        elves[7].updateBoneCountDisplay(sequencer);
        sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
            let chance = 1 - (0.05 * sequencer.globalBattleState.bonePileCount);
            if(Math.random() > chance) {
                return moves["failed because bones"];
            } else {
                return move;
            }
        }

    }
}

