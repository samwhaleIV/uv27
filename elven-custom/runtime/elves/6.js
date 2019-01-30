"use strict";
addMove({
    name: "take gold",
    type: "target",
    process: (sequencer,user,target) => {
        if(target.state.gold <= 0) {
            target.state.gold = 0;
            return {
                text: `but ${target.name} ${target.isPlayer ? "have" : "has"} no gold`
            }
        }

        let difference = 1;
        if(user.state.squirrels) {
            difference += user.state.squirrels;
        }

        if(target.state.gold - difference < 0) {
            difference = target.state.gold;
        }

        target.state.gold-=difference;
        user.state.gold+=difference;


        user.subText[0] = `${user.state.gold} gold`;
        target.subText[0] = `${target.state.gold} gold`;
        if(target.state.gold <= 0) {
            sequencer.dropHealth(target,target.maxHealth);
        }
        if(user.state.squirrels >= 1) {
            return {
                text: `${user.name} and ${user.state.squirrels === 1?"a squirrel" : "squirrels"} took ${difference} gold`
            }
        } else {
            return {
                text: `${user.name} took ${difference} gold from ${target.name}`
            }
        }

    },
});
addMove({
    name: "give gold",
    type: "target",
    process: (sequencer,user,target) => {
        user.state.gold--;
        if(user.state.gold < 0) {
            user.state.gold = 0;
            return {
                failed: true,
                text: `but ${user.name} ${user.isPlayer ? "have" : "has"} no gold`
            }
        }
        target.state.gold++;
        user.subText[0] = `${user.state.gold} gold`;
        target.subText[0] = `${target.state.gold} gold`;

        return {
            failed: false,
            text: `${user.name} gave 1 gold to ${target.name}`
        }
    }
});
addMove({
    name: "buy squirrel - 3 gold",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.gold >= 3) {
            user.state.gold-=3;
            user.subText[0] = `${user.state.gold} gold`;
            if(user.state.squirrels >= 0) {
                user.state.squirrels++;
            } else {
                user.state.squirrels = 1;
            }
            if(!user.state.totalSquirrels) {
                user.state.totalSquirrels = 0;
            }
            user.state.totalSquirrels++;
            user.subText[1] = `${user.state.squirrels} squirrel${user.state.squirrels !== 1 ? "s" : ""} helping you`;
            user.subText[2] = `[+${user.state.squirrels} gold grab boost]`;
            return {
                text: `${user.name} purchased 1 squirrel`
            }
        } else {
            return {
                failed: true,
                text: `but ${user.isPlayer ? "you" : "they"} don't have enough gold`
            }
        }
    }
});
addMove({
    name: "unfiscal punch",
    type: "target",
    process: (sequencer,user,target) => {
        let difference = 10;
        if(user.state.gold < difference) {
            difference = user.state.gold;
        }
        user.state.gold-=difference;
        sequencer.dropHealth(target,6);
        user.subText[0] = `${user.state.gold} gold`;
        if(user.isElf && user.state.gold === 0 && user.name === "golden elfette") {
            sequencer.dropHealth(user,user.maxHealth);
            return {
                text: "this was essentially suicide"
            }
        }
        if(target.isPlayer) {
            return {
                text: `she punched too hard and dropped ${difference} gold`
            }
        } else {
            return {
                events: [
                    {
                        text: `she is really angry about squirrel rights`
                    },
                    {
                        text: `she punched too hard and dropped ${difference} gold`
                    }
                ]
            }
        }
    }
});
addMove({
    name: "worship gold",
    type: "self",
    process: (sequencer,user) => {
        const goldIncrease = 3;
        user.state.gold+=goldIncrease;
        user.subText[0] = `${user.state.gold} gold`;
        if(user.isPlayer) {
            return {
                text: `you worship your gold (+${goldIncrease} gold)`
            }
        } else {
            return {
                text: `${user.name} worships their gold (+${goldIncrease} gold)`
            }
        }
    }
});
addMove({
    name: "gold bath",
    type: "self",
    process: (sequencer,user) => {
        const goldIncrease = 4;
        user.state.gold+=goldIncrease;
        user.subText[0] = `${user.state.gold} gold`;
        return {
            text: `${user.name} bathe${user.isElf ? "s" : ""} in gold (+${goldIncrease} gold)`
        }
    }
});
addMove({
    name: "free squirrel",
    type: "target",
    process: (sequencer,user,target) => {
        if(target.state.squirrels >= 1) {
            target.state.squirrels--;
            target.subText[1] = `${target.state.squirrels} squirrel${target.state.squirrels !== 1 ? "s" : ""} helping you`;
            target.subText[2] = `[+${target.state.squirrels} gold grab boost]`;
            return {
                text: `${user.name} freed 1 squirrel from ${target.name}`
            }
        } else {
            return {
                failed: true,
                text: `but ${user.isPlayer ? "your" : "their"} is out of squirrels`
            }
        }
    }
});
addMove({
    name: "complain",
    type: "self",
    process: (sequencer,user,target) => {
        return {
            events: [
                {
                    text: `${user.name} is angry about animal rights`
                },
                {
                    text: `her message isn't getting across to you`
                },
                {
                    text: "maybe you just need more squirrels"
                }
            ]
        }
    }
});
function GoldenElfette() {
    this.name = "golden elfette";
    this.background = "background-3";
    this.backgroundColor = "yellow";
    this.song = "greed_loop";
    this.songIntro = "greed_intro";
    this.health = 200;
    this.getLoseSpeech = () => {
        return {text:"a golden elf\nwithout gold\nis not an elf at all\n\nit's not worth living\n*ded*"}
    };
    this.getWinSpeech = sequencer => {
        if(sequencer.elfBattleObject.lastMove === "nutcracker" && sequencer.playerBattleObject.lastMove === "take gold") {
            return {text:"don't say i didn't\nwarn you that this\nwould happen"};
        }
        return {text:"next time stay away\nfrom my lucky charms"};
    };
    this.playerMoves = [
        moves["take gold"],
        moves["give gold"],
        moves["band aid 2.0"],
        moves["buy squirrel - 3 gold"]
    ];
    this.getMove = sequencer => {
        if(sequencer.elfBattleObject.state.puttingAnEndToThis) {
            return Math.random() < 0.5 ? moves["unfiscal punch"] : Math.random() > 0.5 ? moves["cry"] : moves["complain"];
        }
        if(sequencer.playerBattleObject.lastMove === "take gold" && !sequencer.playerBattleObject.state.protectedTheirNuts) {
            if(sequencer.playerBattleObject.state.squirrels >= 1) {
                sequencer.playerBattleObject.state.protectedTheirNuts = true;
            }
            return moves["nutcracker"];
        } else {
            const elfMoves = [
                moves["worship gold"],
                moves["gold bath"],
                moves["decent punch"]
            ];
            if(sequencer.playerBattleObject.state.squirrels >= 1) {
                if(Math.random() > 0.5) {
                    elfMoves.push(moves["free squirrel"]);
                }
            }
            return elfMoves[Math.floor(Math.random() * elfMoves.length)];
        }
    };
    this.getSpeech = sequencer => {
        if(sequencer.elfBattleObject.health === 0) {
            return {
                text: null
            };
        }
        if(sequencer.playerBattleObject.lastMove === "take gold" ||
           sequencer.playerBattleObject.lastMove === "buy squirrel") {

            if(sequencer.playerBattleObject.state.squirrels >= 1) {
                if(sequencer.playerBattleObject.state.justBoughtSquirrel) {
                    switch(sequencer.playerBattleObject.state.totalSquirrels) {
                        case 1:
                            return {
                                text: "what!\na squirrel?\nhow dare u"
                            };
                        case 2:
                            return {
                                text: "what are these\nsquirrels for?"
                            };
                        case 3:
                            return {
                                text: "seriously\nplz stop\nthis is concerning"
                            };
                        case 4:
                            return {
                                text: "who is even selling\nthese squirrels to you?!"
                            };
                        case 5:
                            return {
                                text: "it's about time that\ni call peta"
                            };
                        case 6:
                            sequencer.elfBattleObject.state.puttingAnEndToThis = true;
                            return {
                                text: "okay you know what?\ni'm putting an end to this"
                            };
                        default:
                            return {
                                text: "please. stop. buying.\n\squirrels."
                            };
                    }
                } else {
                    const responses = [
                        ()=>`i'll free your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s" : ""}`,
                        ()=>`i'll take your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s" : ""} away`,
                        ()=>sequencer.playerBattleObject.state.squirrels !== 1 ? "those squirrels\ndon't belong to you" : "that squirrel\ndoesn't belong to you",
                        ()=>sequencer.playerBattleObject.state.squirrels !== 1 ? "those squirrels\nhave families" : "that squirrel\nhas a family",
                        ()=>`maybe i could get\n${sequencer.playerBattleObject.state.squirrels === 1 ? "a squirrel" : "squirrels"} too`,
                        ()=>"what sound\ndoes a squirrel make?",
                        ()=>"*makes nut sounds*",
                        ()=>"*makes squirrel noises*",
                        ()=>`*tries to steal your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s":""}*`
                    ];
                    return {
                        text: responses[Math.floor(Math.random() * responses.length)]()
                    };
                }
            } else {
                if(sequencer.turnNumber === 0) {
                    return {
                        text: "yikes\ni wouldn't do that\nif i were you"
                    };
                } else {
                    const responses = [
                        "i am a huge animal\nrights advocate",
                        "i really love squirrels",
                        "squirrels are friends\nnot food",
                        "good thing\nyou don't have any\nsquirrels to\nprotect you",
                        "squirrels are good at\nprotecting nuts\n\nwell jock straps are\ntoo but elves don't\nneed those",
                        "i am a gold belt\nin nutcracking\n\nbut a black belt in racism",
                        "some people think i'm\ntoo quirky\nto be an elf",
                        "i love gold - stay away!"
                    ];
                    return {
                        text: responses[Math.floor(Math.random() * responses.length)]
                    };
                }

            }
        } else if(sequencer.playerBattleObject.lastMove === "give gold") {
            if(sequencer.playerBattleObject.lastMoveFailed) {
                return {
                    text: "well - it's the thought\nthat counts"
                };
            } else {
                return {
                    text: "gold? for me?\ndo you know how\nthis works?"
                };
            }
        }
    };
    this.setup = sequencer => {
        sequencer.playerBattleObject.subText = ["0 gold"];
        sequencer.elfBattleObject.subText = ["100 gold"];

        sequencer.playerBattleObject.state.gold = 0;
        sequencer.elfBattleObject.state.gold = 100;

        sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
            const moveDisplayName = move.name.split("-")[0].trimEnd();
            if(moveDisplayName === "buy squirrel" && sequencer.playerBattleObject.state.gold >= 3) {
                sequencer.playerBattleObject.state.justBoughtSquirrel = true;
            } else {
                sequencer.playerBattleObject.state.justBoughtSquirrel = false;
            }
            return move;
        }
    };
    this.startSpeech = {
        text: "the only way to\nkill a golden\nelf is to obtain\nall their gold"
    };
}
