"use strict";
function TinyArmElf() {

    const updateVestSubText = sequencer => {
        sequencer.playerBattleObject.subText[1] = `${sequencer.playerBattleObject.state.vests} bullet proof vest${sequencer.playerBattleObject.state.vests!==1?"s":""}`;
    }
    const getBulletSubtext = whomstve => {
        return `${whomstve.state.bullets} bullet${whomstve.state.bullets!==1?"s":""}`;
    }
    const updatePlayerBulletSubtext = sequencer => {
        sequencer.playerBattleObject.subText[0] = getBulletSubtext(sequencer.playerBattleObject);
    }
    const updateElfBulletSubtext = sequencer => {
        sequencer.elfBattleObject.subText[0] = getBulletSubtext(sequencer.elfBattleObject);
    }

    const fallBackMove = {
        name: "fall back",
        type: "self",
        process: (sequencer,user) => {
            return {
                events: [
                    {
                        text: "you bandage up your bullet holes",
                        action: () => user.addHealth(30)
                    },
                    {
                        text: "in a hurry - you dropped some of your bullets",
                        action: () => {
                            user.state.bullets = Math.ceil(user.state.bullets * 0.75);
                            updatePlayerBulletSubtext(sequencer);
                        }
                    }
                ]
            }
        }
    }
    const bulletProofVestMove = {
        name: "bullet proof vest",
        type: "self",
        process: (sequencer,user) => {
            sequencer.playerBattleObject.state.vests++;
            updateVestSubText(sequencer);
            return {
                text: "+1 bullet proof vest"
            }
        }
    }
    const returnFireMove = {
        name: "return fire",
        type: "target",
        process: (sequencer,user,target) => {
            if(user.state.bullets > 0) {
                const shotCount = Math.round(Math.random() * user.state.bullets * 0.8);
                user.state.bullets-=shotCount;
                updatePlayerBulletSubtext(sequencer);
                target.dropHealth(shotCount*2);
                if(shotCount === 1) {
                    return {
                        events: [
                            {
                                text: "you shot 1 single bullet"
                            },
                            {
                                text: "nice one chief"
                            }
                        ]
                    }
                } else {
                    return {
                        text: `you shot tiny arm elf with ${shotCount} bullets!`
                    }
                }
            } else {
                return {
                    failed: true,
                    events: [
                        {text: "you don't have any bullets"}
                    ]
                }
            }
        }
    } 
    const bulletHellMove = {
        name: "bullet hell",
        type: "target",
        process: (sequencer,user,target) => {
            if(user.state.bullets > 0) {
                const shotCount = Math.ceil(Math.random() * user.state.bullets * 0.8);
                user.state.bullets-=shotCount;
                updateElfBulletSubtext(sequencer);
                let multiplier = 2;
                const endEvent = [];
                if(target.state.vests >= 1) {
                    multiplier = 1;
                    endEvent[0] = {
                        text: `your vest${target.state.vests!==1?'s':''} reduced the damage by half`,
                    }
                    endEvent[1] = {
                        text: "-1 vest (the vest disintegrated)",
                        action: () => {
                            target.state.vests--;
                            updateVestSubText(sequencer);
                        }
                    }
                }
                target.dropHealth(shotCount*multiplier);
                if(shotCount === 1) {
                    return {
                        events: [
                            {
                                text: "tiny arm elf shot you with 1 bullet"
                            },
                            {
                                text: "how laughable!"
                            },
                            {
                                text: "still though - ow"
                            },
                            {
                                text: "a bullet is a bullet no matter how... bullet?"
                            },...endEvent
                        ]
                    }
                } else {
                    return {
                        events: [
                            {text: `you got shot with ${shotCount} bullets!`}
                            ,...endEvent
                        ]
                    }
                }
            } else {
                return {
                    failed: true,
                    events: [
                        {text: "tiny arm elf doesn't have any bullets"}
                    ]
                }
            }
        }
    }
    const stealBulletsMove = {
        name: "top shelf bullets",
        type: "self",
        process: (sequencer,user) => {
            const bulletIncrease = Math.ceil(Math.random() * 40) + 10;
            user.state.bullets += bulletIncrease;
            return {
                events: [
                    {
                        text: "you get the bullets tiny arm elf can't reach"
                    },
                    {
                        text: `+${bulletIncrease} bullets`,
                        action: updatePlayerBulletSubtext
                    }
                ]
            }
        }
    }

    const trexComplexMove = {
        name: "tyrannosaurus complex",
        type: "self",
        process: (sequencer,user) => {
            const bulletIncrease = Math.round(Math.random() * 125) + 33;
            return {
                events: [
                    {
                        text: "he is gathering bullets like a chicken eating"
                    },
                    {
                        text: `he got ${bulletIncrease} bullets. what a haul!`,
                        action: () => {
                            user.state.bullets += bulletIncrease;
                            updateElfBulletSubtext(sequencer);
                        }
                    }
                ]
            }
        }
    }
    const reloadoramaMove2 = {
        name: "reload-o-rama",
        type: "self",
        process: () => {
            return {
                text: "tiny arm elf encourages their gun"
            }
        }
    }
    const reloadoramaMove1 = {
        name: "reload-o-rama",
        type: "self",
        process: (sequencer,user) => {
            sequencer.globalBattleState.turnNumberOffset++;
            return reloadoramaMove2.process(sequencer,user);
        }
    }
    const elfmartStitchesMove = {
        name: "elfmart brand stitches",
        type: "self",
        process: (sequencer,user) => {
            user.state.isWounded = false;
            return {
                events: [
                    {
                        text: "elfmart really does it all. praise be."
                    },
                    {
                        text: "tiny arm elf had their bullet holes closed"
                    }
                ]
            }
        }
    }
    const removePlayerVestMove = {
        name: "unvested vest",
        type: "target",
        process: (sequencer,user,target) => {
            return {
                text: "-1 bullet proof vest",
                action: () => {
                    target.state.vests--;
                    updateVestSubText(sequencer);
                }
            }
        }
    }

    this.playerMoves = [
        fallBackMove,
        bulletProofVestMove,
        returnFireMove,
        stealBulletsMove
    ];


    this.getMove = sequencer => {
        const moves = [
            bulletHellMove,
            bulletHellMove,
            trexComplexMove,
            bulletHellMove,
            sequencer.playerBattleObject.state.vests > 0?

                removePlayerVestMove://Option 1
                sequencer.elfBattleObject.state.isWounded?//Option 2

                    elfmartStitchesMove://Option 1
                    reloadoramaMove1,//Option 2

            reloadoramaMove2
        ];
        return moves[(sequencer.turnNumber+sequencer.globalBattleState.turnNumberOffset)%moves.length];
    }

    this.setup = sequencer => {
        sequencer.playerBattleObject.subText = [];
        sequencer.elfBattleObject.subText = [];

        sequencer.playerBattleObject.state.vests = 0;
        sequencer.playerBattleObject.state.bullets = 0;
        sequencer.elfBattleObject.state.bullets = 10;

        updateElfBulletSubtext(sequencer);
        updatePlayerBulletSubtext(sequencer);
        updateVestSubText(sequencer);
        sequencer.globalBattleState.turnNumberOffset = 0;
    }

    this.startSpeech = {
        text: "don't let my tiny arms\ndeceive you.\ntiny arms...\nalso known as...\nsmall arms! >:)\n\nas usual prepare to die."
    }
    this.loseSpeech = {
        text: "you only won because\ni'm at a disadvantage"
    }
    this.winSpeech = {
        text: "tiny arms: 1\nyou: 0\n\ndid you want a hug?\nwell too bad!\nmy arms are too short\nanyways"
    }
    this.name = "tiny arm elf";
    this.background = "background-4";
    this.backgroundColor = "cyan";
    this.foregroundColor = "cyan";
    this.health = 400;
    this.playerHealth = 250;
}
