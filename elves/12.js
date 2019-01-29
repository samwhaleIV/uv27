"use strict";
const noComboChainText = "no combo chain";

addMove({
    name: "dodgy dodge",
    type: "self",
    process: (sequencer,user) => {
        user.state.dodging = true;
        if(user.state.comboState.length === 0) {
            user.state.comboState.push(0);
            user.subText = ["combo chain active","[stage 1 of 3]","1. dodgy dodge"];
            return {
                events: [{
                    text: "a combo has started! >:)"
                },{
                    text: "you might dodge what's next"
                }]
            }
        } else {
            user.state.comboState = [];
            user.subText = [noComboChainText];
            return {
                events: [{
                    text: "you broke your combo :("
                },{
                    text: "but you still prepare to dodge",
                }]
            }
        }
    }
});
addMove({
    name: "elfmart brand band aid",
    type: "self",

    process: (sequencer,user) => {
        if(user.state.comboState.length !== 0) {
            user.state.comboState = [];
            user.subText = [noComboChainText];
            user.addHealth(30);
            return {
                text: "the healing broke your combo"
            }
        }
        const responses = [
            "*you thank elfmart for their low low prices*",
            "elfmart has the best deals",
            "you should shop at elfmart more often",
            "you must really <3 elfmart"
        ];
        user.addHealth(30);
        return {
            text: responses[Math.floor(Math.random()*responses.length)]
        }
    }
});
addMove({
    name: "krazy kick",
    type: "target",
    process: (sequencer,user,target) => {
        const breakComboKick = () => {
            target.dropHealth(35);
            return {
                events: [
                    {
                        text: "what a great kick!"
                    },
                    {
                        text: "it broke your combo though..."
                    }
                ]
            }
        }
        if(user.state.comboState.length === 2) {
            if(user.state.comboState[0] === 0 && user.state.comboState[1] === 1) {
                user.state.comboState = [];
                user.subText = [noComboChainText];
                target.dropHealth(250);
                return {
                    events: [
                        {
                            text: "you completed your combo!"
                        },
                        {
                            text: "it is super effective!"
                        },
                    ]
                }
            } else {
                user.state.comboState = [];
                user.subText = [noComboChainText];
                return breakComboKick();
            }
        } else if(user.state.comboState.length !== 0) {
            user.state.comboState = [];
            user.subText = [noComboChainText];
            return breakComboKick();
        }
        target.dropHealth(35);
        return {
            events: [{
                text: "kicking someone without legs - a new low"
            },{
                text: "(even for you)"
            }]
        }
    }
});
addMove({
    name: "uppercut",
    type: "target",
    process: (sequencer,user,target) => {
        const breakHealCycle = () => {
            if(target.state.healState >= 1) {
                target.state.healState = 0;
                target.state.healStateJustBroke = true;
                return true;
            } else {
                return false;
            }
        }
        const breakComboPunch = () => {
            target.dropHealth(15);
            const events = [
                {
                    text: "you landed your punch"
                }
            ];
            if(breakHealCycle()) {
                events.push({
                    text: "and you broke their meditative state!"
                });
            }
            events.push({
                text: "but this broke your combo :("
            });
            return {
                events: events
            }
        }
        if(user.state.comboState.length === 1) {
            if(user.state.comboState[0] === 0) {
                user.state.comboState.push(1);
                target.dropHealth(20);
                user.subText = ["combo chain active","[stage 2 of 3]","1. dodgy dodge","2. uppercut"];
                const events = [
                    {
                        text: "this continues your combo"
                    },
                    {
                        text: "you're almost there!"
                    }
                ];
                if(breakHealCycle()) {
                    events.push({
                        text: "you also broke their meditative state!"
                    });
                }
                return {
                    events: events
                }
            } else {
                user.state.comboState = [];
                user.subText = [noComboChainText];
                return breakComboPunch();
            }
        } else if(user.state.comboState.length !== 0) {
            user.state.comboState = [];
            user.subText = [noComboChainText];
            return breakComboPunch();
        }
        target.dropHealth(15);
        if(breakHealCycle()) {
            return {
                text: "you broke their focus!"
            }
        } else {
            return {
                text: "but it barely made a dent"
            }
        }

    }
});

addMove({
    name: "lightweight champion",
    type: "target",
    process: (sequencer,user,target) => {
        const events = [];
        const hitCount = Math.floor(Math.random() * 5) + 2;
        const responses = ["oof!","ow!","erf!","ack!"];
        for(let i = 0;i<hitCount;i++) {
            events.push({
                text: responses[i%responses.length],
                action: () => target.dropHealth(6)
            });
        }
        events.push({
            text: `ouch! hit ${hitCount} time${hitCount !== 1 ? "s":""}`
        });
        return {
            events: events
        }
    }
});
addMove({
    name: "big punch",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            text: "that's gonna leave a bruise",
            action: () => target.dropHealth(36)
        }
    }
})
addMove({
    name: "deep meditation",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: `${user.name} ${overb(user)} channeling inwards`,
            action: () => user.addHealth(95)
        }
    }
});
addMove({
    name: "napoleon complex",
    type: "self",
    process: (sequencer,user) => {
        const hadComplex = user.state.hasNapoleonComplex;
        user.state.hasNapoleonComplex = true;
        const events = [{text:`${user.name} got very frustrated`}];
        if(!hadComplex) {
            events.push({text:`${user.name} will be hastier now`});
        }
        return {
            events: events
        }
    }
});

elves[11] = {
    name: "legless elf",
    background: "background-1",
    backgroundColor: "pink",
    health: 500,

    startSpeech: {
        text: "i might not have legs\nbut i can throw stronger\npunches than any you've\nseen yet.\n\nbring it human swine."
    },

    getMove: sequencer => {
        const skipNewHeal = sequencer.elfBattleObject.state.healStateJustBroke;
        if(skipNewHeal) {
            sequencer.elfBattleObject.state.healStateJustBroke = false;
        }
        if(sequencer.elfBattleObject.state.healState > 0) {
            sequencer.elfBattleObject.state.healState--;
            return moves["deep meditation"];
        } else if(sequencer.elfBattleObject.health <= 240) {
            if(!skipNewHeal) {
                const pass = true;
                if(sequencer.elfBattleObject.state.hasNaphasNapoleonComplex) {
                    pass = Math.random() > 0.5 ? true : false;
                }
                if(pass) {
                    sequencer.elfBattleObject.state.healState = Math.ceil((sequencer.elfBattleObject.maxHealth - sequencer.elfBattleObject.health) / 95);
                    return moves["deep meditation"];
                }
            }
        }
        if(skipNewHeal) {
            if(sequencer.elfBattleObject.state.hasNapoleonComplex) {
                return Math.random() > 0.5 ? moves["napoleon complex"] : moves["lightweight champion"];
            } else {
                return moves["napoleon complex"];
            }
        }
        if(Math.random() < 0.25 || (sequencer.playerBattleObject.lastMove === "elfmart brand band aid" && Math.random() < 0.33)) {
            return moves["big punch"];
        } else {
            return moves["lightweight champion"]
        }
    },

    getLoseSpeech: sequencer => {
        return {text:"looks like i'm bested\n\ni feel like i was\ndesigned with a\ndisadvantage *cough*\ni don't even have legs"};
    },
    getWinSpeech: sequencer => {
        return {text:"i did this for red elfette\nher blood is\non your hands...\n\nnow yours is on mine."};
    },

    getSpeech: sequencer => {
        const speeches = [
            "wanna go for a run\n\nha.. ha.. ha",
            "how's the weather\nup there?",
            "have you learned \nabout combos?",
            "combos are broken if\nyou don't use\nmoves in the right order",
            "dodge...\nuppercut...\nkick.\nn\nalways an effective combo",
            "i trained red elfette\n\nthis is for her",
            "you know - you are\njust another monster",
            "uppercuts can prevent\ntranquility\n(aka - healing)",
            "elves did nothing wrong\n\nwe simply\nrestore balance\nto this ill\ndivided world",
            "i could keep going\nall day",
            "get your hands and\nlegs off me",
            "elfmart has some\ngreat deals.\n\ndid you get those\nband aids on sale?"
        ];  
        sequencer.globalBattleState.speechIndex++;
        sequencer.globalBattleState.speechIndex = sequencer.globalBattleState.speechIndex % speeches.length;
        return {
            text: speeches[sequencer.globalBattleState.speechIndex]
        }
    },

    getDefaultGlobalState: () => {
        return {
            speechIndex: -1,
            postTurnProcess: sequencer => {
                sequencer.playerBattleObject.state.dodging = false;
            }
        }
    },

    setup: sequencer => {

        sequencer.playerBattleObject.subText = [noComboChainText];

        sequencer.playerBattleObject.state.comboState = [];
        sequencer.elfBattleObject.movePreProcess = (sequencer,move) => {
            if(sequencer.playerBattleObject.state.dodging) {
                if(move.type === "target") {
                    if(Math.random() > 0.6) {
                        const originalProcessor = move.process;
                        const newMove = {
                            name: "dodge preprocessor elf variant failure",
                            type: "target",
                            process: () => {
                                const originalProcessorResult = originalProcessor(
                                    sequencer,
                                    sequencer.elfBattleObject,
                                    sequencer.playerBattleObject
                                );
                                let endEvents = [{
                                    text: "your dodge failed"
                                }];
                                if(originalProcessorResult.events) {
                                    endEvents = [...endEvents,...originalProcessorResult.events]
                                } else {
                                    endEvents.push({
                                        text: originalProcessorResult.text,
                                        action: originalProcessorResult.action,
                                        speech: originalProcessorResult.speech
                                    });
                                }
                                return {
                                    failed: originalProcessor.failed || false,
                                    events: endEvents
                                }
                            }
                        }
                        return newMove;
                    } else {
                        const newMove = {
                            name: "dodge preprocessor elf variant success",
                            process: () => {
                                return {
                                    failed: true,
                                    text: "but you dodged it"
                                }
                            }
                        }
                        return newMove;
                    }
                }
            }
            return move;
        }
    },

    playerMoves: [
        moves["krazy kick"],
        moves["dodgy dodge"],
        moves["uppercut"],
        moves["elfmart brand band aid"]
    ]
}
