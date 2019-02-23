"use strict";
function BeachElf() {

    this.song = "beach_loop";
    this.songIntro = "beach_intro";

    const updateHeldItemSubtext = sequencer => {
        sequencer.playerBattleObject.subText[0] = `held item: ${sequencer.playerBattleObject.state.heldItem}`
    }

    const keepSurfingMove = {
        name: "keep surfing",
        type: "self",
        process: (sequencer,user) => {
            if(user.state.beingSharkChased) {
                user.dropHealth(user.maxHealth);
                return {
                    text: "a shark ate you in one big bite"
                }
            }
            return {
                text: "you continue to ride the waves"
            }
        }
    }
    const returnToShoreMove = {
        name: "return to shore",
        type: "self",
        process: (sequencer,user) => {
            user.state.isSurfing = false;
            user.state.returnToShoreTurn = sequencer.turnNumber;
            return {
                text: "you returned to shore"
            }
        }
    }

    const surfsUpMove = {
        name: "surfs up",
        type: "self",
        process: (sequencer,user) => {
            user.state.isSurfing = true;
            return {
                text: "you start to ride the waves"
            }
        }
    }


    const pickUpRockMove = {
        name: "pick up rock",
        type: "self",
        process: (sequencer,user) => {
            if(Math.random() < 0.1) {
                return {
                    failed: true,
                    text: "but it wasn't a rock - it was a rock lobster!"
                }
            } else {
                if(user.state.heldItem === "none") {
                    user.state.heldItem = "rock";
                    updateHeldItemSubtext(sequencer);
                    return {
                        text: "you picked up a rock"
                    }
                } else {
                    user.state.heldItem = "rock";
                    updateHeldItemSubtext(sequencer);
                    return {
                        text: "you replaced your item with a rock"
                    }
                }
            }
        }
    }

    const pickUpSharkBaitMove = {
        name: "pick up shark bait",
        type: "self",
        process: (sequencer,user) => {
            if(user.state.heldItem === "none") {
                user.state.heldItem = "shark bait";
                updateHeldItemSubtext(sequencer);
                return {
                    text: "you picked up shark bait"
                }
            } else {
                user.state.heldItem = "shark bait";
                updateHeldItemSubtext(sequencer);
                return {
                    text: "you replaced your item with shark bait"
                }
            }
        }
    }
    const throwItemMove = {
        name: "throw item",
        type: "target",
        process: (sequencer,user,target) => {
            const heldItem = user.state.heldItem;
            user.state.heldItem = "none";
            updateHeldItemSubtext(sequencer);
            switch(heldItem) {
                default:
                    return {
                        failed: true,
                        events: [
                            {
                                text: "you aren't holding an item"
                            }
                        ]
                    }
                case "shark bait":
                    if(user.state.beingSharkChased) {
                        return {
                            events: [
                                {
                                    text: "you threw the shark bait at beach elf"
                                },
                                {
                                    text: "that shark from earlier came onto land"
                                },
                                {
                                    text: "*cronch*",
                                    action: () => target.dropHealth(target.maxHealth)
                                },
                                {
                                    text: "beach elf got eaten by a shark"
                                },
                                {
                                    text: "what a tasty snack!"
                                },
                                {
                                    text: "goodbye shark"
                                }
                            ]
                        }
                    } else {
                        return {
                            events: [
                                {
                                    text: "you threw the shark bait at beach elf"
                                },
                                {
                                    text: "it didn't have any effect"
                                },
                                {
                                    speech: "hey bro i'm just\ntryna relax over here"
                                }
                            ]
                        }
                    }
                    break;
                case "rock":
                    target.state.gotHitWithRock = true;
                    target.dropHealth(Math.round(target.maxHealth/2));
                    return {
                        text: "you threw a rock at beach elf!"
                    }
                    break;
            }
        }
    }

    const relaxMove = {
        name: "relaxation",
        type: "self",
        process: () => {
            return {
                speech: "ahhhhhh\n\nsuch a nice beach\n\nand no sharks..."
            }
        }
    }
    const doingMyOwnThingMove = {
        name: "doing my own thing",
        type: "self",
        process: () => {
            return {
                speech: "i love the beach\n\nbut i hate sharks\n\nthey always try\nand eat me"
            }
        }
    }
    const crackOpenAColdOneMove = {
        name: "crack open a cold one",
        type: "self",
        process: () => {
            return {
                speech: "beach + beer -> winning\n\nalso i heard the\nsharks here are so\nhungry they'd\neven come on land"
            }
        }
    }
    const thisIsTheLifeMove = {
        name: "this is the life",
        type: "self",
        process: () => {
            return {
                speech: "i could stay here forever\n\noh wait\n\ni am trapped here.\nforever. hahaha (help)"
            }
        }
    }
    const itWouldSuckToBeYouMove = {
        name: "it would suck to be you",
        type: "self",
        process: () => {
            return {
                speech: "why all the killing?\n\njust relax.\nhit some waves\n\n- but don't bring back\nany sharks"
            }
        }
    }
    const superRelaxMove = {
        name: "super relaxation",
        type: "self",
        process: () => {
            return {
                speech: "ahhhhhh\n*more ahhhh*\n\n*even more ahhhhhhh*"
            }
        }
    }
    const retaliateMove = {
        name: "retaliate",
        type: "target",
        process: (sequencer,user,target) => {
            target.dropHealth(target.maxHealth);
            return {
                events: [
                    {
                        text: "beach elf threw a boulder at you"
                    },
                    {
                        speech: "that'll teach you\nto mess with me when\ni'm trying to relax"
                    },
                    {
                        speech: "especially when\ni'm relaxing"
                    },
                    {
                        text: "beach elf continues to relax"
                    }
                ]
            }
        }
    }
    
    const lureSharkMove = {
        name: "lure shark",
        type: "self",
        process: (sequencer,user) => {
            user.state.heldItem = "none";
            user.state.beingSharkChased = true;
            updateHeldItemSubtext(sequencer);
            return {
                text: "a shark started chasing you!"
            }
        }
    }

    const putDownItemMove = {
        name: "drop item",
        type: "self",
        process: (sequencer,user) => {
            const item = user.state.heldItem;
            user.state.heldItem = "none";
            updateHeldItemSubtext(sequencer);
            return {
                text: `${user.name} put down their ${item}`
            }
        }
    }

    this.startSpeech = {
        text: "i loooooove\nto relax\n\nthat's why i am here\n\nat a beach"
    }

    this.getMove = sequencer => {
        if(sequencer.elfBattleObject.state.gotHitWithRock) {
            return retaliateMove;
        }
        const elfMoves = [
            relaxMove,
            doingMyOwnThingMove,
            crackOpenAColdOneMove,
            itWouldSuckToBeYouMove,
            thisIsTheLifeMove,
            superRelaxMove,
            moves["nothing"],
            moves["also nothing"]
        ];
        return elfMoves[sequencer.turnNumber%elfMoves.length];
    }

    this.getPlayerMoves = sequencer => {
        if(sequencer.playerBattleObject.state.isSurfing) {
            const playerMoves = [
                keepSurfingMove,
                returnToShoreMove,
            ];
            if(sequencer.playerBattleObject.state.heldItem === "shark bait") {
                playerMoves.push(lureSharkMove);
            }
            return playerMoves;
        } else {
            const playerMoves = [
                surfsUpMove,
                sequencer.playerBattleObject.state.heldItem !== "rock" ? pickUpRockMove : putDownItemMove,
                sequencer.playerBattleObject.state.heldItem !== "shark bait" ? pickUpSharkBaitMove : putDownItemMove,
                throwItemMove
            ];
            return playerMoves;
        }
    }


    this.setup = sequencer => {

        sequencer.playerBattleObject.state.heldItem = "none";

        sequencer.playerBattleObject.state.beingSharkChased = false;
        sequencer.playerBattleObject.state.isSurfing = false;
        sequencer.playerBattleObject.state.usedSharkBait = false;

        sequencer.playerBattleObject.subText = [];
        updateHeldItemSubtext(sequencer);
    }

    this.getDefaultGlobalState = () => {
        return {
            postTurnProcess: sequencer => {
                if(sequencer.playerBattleObject.state.beingSharkChased && sequencer.playerBattleObject.state.returnToShoreTurn + 2 < sequencer.turnNumber) {
                    sequencer.playerBattleObject.dropHealth(sequencer.playerBattleObject.maxHealth);
                    return {
                        events: [
                            {
                                text: `the shark followed you ${!sequencer.playerBattleObject.state.isSurfing ? "to land ":""}and ate you!`
                            },
                            {
                                speech: "whelp - teaches you to\ntease sharks\n\n*goes back to relaxing*"
                            }
                        ]
                    }
                }
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return null;
            }
        }
    }


    this.name = "beach elf";
    this.background = "background-10";
    this.backgroundColor = "white";
    this.foregroundColor = "rgb(0,109,255)";
    this.health = 420;
}
