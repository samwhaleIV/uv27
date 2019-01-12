addMove({
    name: "them bones",
    type: "target",
    process: (sequencer,user,target) => {
        const updateBoneCountDisplay = () => {
            sequencer.elfBattleObject.subText[0] = `${
                sequencer.globalBattleState.bonePileCount
            } bone pile${
                sequencer.globalBattleState.bonePileCount !== 1 ? "s" : ""
            }`;
        }

        if(sequencer.globalBattleState.bonePileCount === 0) {
            sequencer.globalBattleState.bonePileCount++;
            updateBoneCountDisplay();
            return {
                failed: false,
                text: "bones were scattered everywhere"
            }
        } else if(sequencer.globalBattleState.bonePileCount >= 1){
            sequencer.globalBattleState.bonePileCount++;
            updateBoneCountDisplay();
            return {
                failed: false,
                text: "even more bones were scattered around"
            }
        } else {
            sequencer.globalBattleState.bonePileCount = 1;
            updateBoneCountDisplay();
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
    type: "target"
});
addMove({
    name: "violence",
    type: "target"
});
addMove({
    name: "sarcophagus",
    type: "target"
});
addMove({
    name: "pass the whiskey",
    type: "target",
    process: (sequencer,user,target) => moves["drink alchohol"].process(sequencer,target)
});
addMove({
    name: "slurred words"
});
addMove({
    name: "slrrd werrsds"
});
addMove({
    name: "drunken punch"
});
addMove({
    name: "drunken rant"
});
addMove({
    name: "bone toss"
});
addMove({
    name: "bone salad"
});
addMove({
    name: "bone o' clock"
});

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
    getMove: sequencer => {
        if(sequencer.elfBattleObject.isLit) {
            const litMoves = ["drunken punch","them bones","drunken rant"];
            if(sequencer.elfBattleObject.isSuperLit) {
                litMoves.push(moves["slrrd werrsds"]);
            } else {
                litMoves.push(moves["slurred words"]);
            }
            return litMoves[Math.floor(Math.random() * litMoves.length)];
        } else {
            const userPoisonedMoves = ["them bones","bone toss","bone salad","bone o' clock"];
            if(sequencer.playerBattleObject.state.isPoisoned) {
                return moves[userPoisonedMoves[Math.floor(Math.random()*userPoisonedMoves.length)]];
            } else if(Math.random() < 0.25) {
                return moves["poison"];
            } else {
                return moves[userPoisonedMoves[Math.floor(Math.random()*userPoisonedMoves.length)]];
            }
        }
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

