"use strict";
addMove({
    type: "self",
    name: "buy bullet - 5 coins",
    process: (sequencer,user) => {
        if(user.state.money && user.state.money >= 5) {
            user.state.money -= 5;
            user.subText[0] = `${user.state.money} coin${user.state.money === 1 ? "" : "s"}`;
            if(!user.state.bullets) {
                user.state.bullets = 0;
            }
            user.state.bullets++;
            user.subText[1] = `${user.state.bullets} bullet${user.state.bullets === 1 ? "" : "s"}`;
            return {
                text: "you bought one bullet for 5 coins"
            }
        } else {
            return {
                text: "but you have don't have 5 coins"
            }
        }
    }
});
addMove({
    type: "self",
    name: "load chamber",
    process: (sequencer,user) => {
        if(user.state.bullets && user.state.bullets > 0) {
            if(!user.state.loadedBullets) {
                user.state.loadedBullets = 0;
            } else if(user.state.loadedBullets === 6) {
                return {
                    text: "but you can't jam more bullets in"
                }
            }
            if(user.state.freshSpin) {
                user.subText[3] = "not spun";
            }
            user.state.freshSpin = false;
            let newBullets = 0;
            while(user.state.loadedBullets < 6 && user.state.bullets > 0) {
                newBullets++;
                user.state.bullets--;
                user.state.loadedBullets++;
            }
            user.subText[1] = `${user.state.bullets} bullet${user.state.bullets === 1 ? "" : "s"}`;
            user.subText[2] = `${user.state.loadedBullets} loaded`;
            return {
                text: `you loaded the chamber with ${newBullets} bullet${newBullets !== 1 ? "s":""}`
            }
        } else {
            return {
                text: "but you have no bullets"
            }
        }
    }
});
addMove({
    type: "self",
    name: "spin chamber",
    process: (sequencer,user) => {
        if(user.state.loadedBullets && user.state.loadedBullets > 0) {
            user.state.freshSpin = true;
            user.subText[3] = "spun";
            return {
                text: "you spun your chamber"
            }
        } else {
            return {
                text: "you spun an empty chamber"
            }
        }
    }
});
addMove({
    type: "target",
    name: "boom",
    process: (sequencer,user,target) => {
        if(user.state.loadedBullets && user.state.loadedBullets > 0) {
            if(user.state.freshSpin) {
                user.state.freshSpin = false;
                user.subText[3] = "not spun";
                if(Math.random() <= user.state.loadedBullets / 6) {
                    user.state.loadedBullets--;
                    user.subText[2] = `${user.state.loadedBullets} loaded`;
                    if(Math.random() > 0.5) {
                        sequencer.dropHealth(target,target.maxHealth);
                        return {
                            text: "you landed your shot"
                        }
                    } else {
                        return {
                            text: "but you missed your shot"
                        }
                    }
                } else {
                    return {
                        text: "but the odds weren't in your favor"
                    }
                }
            } else {
                return {
                    text: "but you need spin and pray first"
                }
            }
        } else {
            return {
                text: "but there's no loaded bullets in the chamber"
            }
        }
    }
});
addMove({
    type: "self",
    name: "panhandle",
    process: (sequencer,user) => {
        return {
            text: `${user.name} ${user.isPlayer ? "are" : "is"} like a filthy hobo`
        }
    }
});
addMove({
    type: "target",
    name: "charity",
    process: (sequencer,user,target) => {
        if(!target.state.money) {
            target.state.money = 0;
        }
        target.state.money += 4;
        target.subText[0] = `${target.state.money} coin${target.state.money === 1 ? "" : "s"}`;
        const responses = [
            "awe - your poor thing",
            "what even are you?",
            "are humans wimps too?",
            "you're so cute",
            "you're my hobo",
            "don't touch me plz",
            "just take my money",
            "stay away from my\nlucky charms!",
            "a hobo with a gun?",
            "why do you need coins?"
        ];
        return {
            events: [
                {
                    speech: responses[Math.floor(responses.length*Math.random())]
                },
                {
                    text: `${user.name} gave you 4 coins for your pain`
                }
            ]
        }
    }
});
addMove({
    type: "target",
    name: "chit chat",
    process: (sequencer,user,target) => {
        sequencer.dropHealth(target,4);
        return {
            text: `${user.name}'${user.name.endsWith("s") ? "" : "s"} voice grates ${target.isPlayer ? "your" : `${user.name}'${user.name.endsWith("s") ? "" : "s"}`} ears`
        }
    }
});
elves[2] = {
    name: "wimpy blue elf",
    
    song: "wimpy_loop",
    songIntro: "wimpy_intro",

    backgroundCycleTime: 35000,
    background: "background-1",
    backgroundColor: "blue",
    health: 100,
    startText: "you received an empty revolver",
    startSpeech: {
        failed: false,
        text: "here is a revolver\nlet's see if you know\nhow to use it\n\ninformation can be\nseen at the top left\n(in many battles)"
    },
    setup: sequencer => {
        sequencer.playerBattleObject.state.money = 5;
        sequencer.playerBattleObject.subText = ["5 coins"];
    },
    getLoseSpeech: () => {
        return {text:"took you long enough\n*ded*"}
    },
    getWinSpeech: () => {
        return {text:"well that's the\nlast time i give\nsomeone a gun"}
    },
    getSpeech: sequencer => {
        if(sequencer.elfBattleObject.lastMove !== "chit chat") {
            return null;
        }
        const responses = [
            "hi\ni love talking",
            "do you like talking",
            "you don't look well",
            "are you nervous",
            "who sent you here",
            "i had a cat once",
            "idk what color i am\ni am color blind",
            "the other elves are cool",
            "have you ever used\na gun before",
            "why did i give you\na gun anyways",
            "this is seeming\nlike a bad idea in\nhindsight",
            (()=>{
                if(sequencer.playerBattleObject.state.loadedBullets && sequencer.playerBattleObject.state.loadedBullets > 0) {
                    return "oh jeez\nquick and painless\nplz"
                } else {
                    return "good thing you haven't\nloaded your revolver"
                }
            })(),
            "i really like spinning",
            "here is my new single\n*spinning*\nby me",
            "just keep spinning\n",
            "spinning spinning\nspinning spinning",
            "baby you spin me\nright round\nbaby right round",
            "spin spin spin",
            "come on already",
            "i didn't think\nyou would be\nthis useless",
            "i am getting impatient",
            "don't make me talk\nabout my neighbor",
            "okay\nmy neighbor's\nname is dave",
            "my neighbor dave\nis a cool dude",
            "i bet you'd like to\nmeet dave",
            "did you give up on\nshooting me",
            "i give up too",
            "*yawn*",
            "i talked about\everything",
            "there's nothing left\nto say",
            "just kill me",
            "*more yawning*"
        ];
        let responseIndex;
        if(sequencer.turnNumber >= responses.length) {
            responseIndex = responses.length - 1;
        } else {
            responseIndex = sequencer.turnNumber;
        }
        return {
            text: responses[responseIndex]
        };
    },
    getMove: sequencer => {
        if(sequencer.playerBattleObject.lastMove === "panhandle") {
            return sequencer.turnNumber % 2 === 1 ? moves["charity"] : moves["chit chat"];
        } else {
            return moves["chit chat"];
        }
    },
    getDefaultGlobalState: () => {
        return {
            postTurnProcess: sequencer => {
                if(sequencer.playerBattleObject.state.money < 5) {
                    sequencer.updatePlayerMoves([
                        elves[2].playerMoves[1],
                        moves["panhandle"],
                        elves[2].playerMoves[2],
                        elves[2].playerMoves[3]
                    ]);
                } else {
                    sequencer.updatePlayerMoves(elves[2].playerMoves);
                }
            }
        }
    },
    playerMoves: [
        moves["buy bullet - 5 coins"],
        moves["load chamber"],
        moves["spin chamber"],
        moves["boom"]
    ],
}
