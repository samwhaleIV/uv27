"use strict";
function InvisibleElf() {
    const visualFatigueTurnCount = 3;
    const destroyDamage = 60;
    const sluethPunchDamage = 30;
    const sneakyPunchDamage = 17;
    const trapDamage = 50;

    this.song = "inv_loop";
    this.songIntro = "inv_intro";

    addMove({
        name: "search",
        type: "target",
        process: (sequencer,user,target) => {
            if(target.state.searched) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "invisible elf is already found"
                        }
                    ]
                }
            }
            if(user.state.visualFatigue) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "your eyeballs are too tired for that"
                        }
                    ]
                }
            } else {
                target.state.searched = true;
                setElfSearchSubText(sequencer);
                return {
                    text: "invisible elf has been detected"
                }
            }
        }
    });
    addMove({
        name: "destroy",
        type: "target",
        process: (sequencer,user,target) => {
            if(!target.state.searched) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "invisible elf hasn't been detected"
                        }
                    ]
                }
            }
            if(target.state.visualFatigue) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "you are visually fatigued"
                        }
                    ]
                }
            }
            return {
                events: [
                    {
                        text: "a lock-on hit!",
                        action: () => target.dropHealth(destroyDamage)
                    },
                    {
                        text: "invisible elf is now concealed again",
                        action: () => {
                            target.state.searched = false;
                            setElfSearchSubText(sequencer);
                        }
                    }
                ]
            }
        }
    });
    addMove({
        name: "smoke bomb",
        type: "self",
        process: sequencer => {
            return {
                text: "1 smoke dose added",
                action: () => {
                    sequencer.globalBattleState.smokeDoses++;
                    setSmokeSubText(sequencer);
                }
            }      
        }
    });
    addMove({
        name: "sneaky punch",
        type: "target",
        process: (sequencer,user,target) => {
            const chanceOfFailure = sequencer.globalBattleState.smokeDoses * 0.25;
            if(Math.random() >= chanceOfFailure) {
                return {
                    events: [
                        {
                            text: "invisible elf nabbed you!",
                            action: () => target.dropHealth(sneakyPunchDamage)
                        },
                        {
                            text: `maybe you need ${sequencer.globalBattleState.smokeDoses <= 0 ? "some" : "more"} smoke?`
                        }
                    ]
                }
            } else {
                return {
                    failed: true,
                    text: "but smoke got in the way of the sneaky"
                }
            }
        }
    });
    addMove({
        name: "sleuth punch",
        type: "target",
        process: (sequencer,user,target) => {
            const chanceOfSuccess = sequencer.globalBattleState.smokeDoses * 0.25;
            if(Math.random() <= chanceOfSuccess) {
                return {
                    text: "you sleuthed invisible elf and strook hard",
                    action: () => target.dropHealth(sluethPunchDamage),
                    animation: {name:"punch"}
                }
            } else {
                return {
                    failed: true,
                    events: [{
                        text: "invisible elf couldn't be sleuthed"
                    },{
                        text: `maybe you need ${sequencer.globalBattleState.smokeDoses <= 0 ? "some" : "more"} smoke?`
                    }]
                }
            }
        }
    });
    addMove({
        name: "place trap",
        type: "self",
        process: sequencer => {
            return {
                text: "1 trap added",
                action: () => {
                    sequencer.globalBattleState.trapsPlaced++;
                    setTrapSubText(sequencer);
                }
            }
        }
    });
    
    addMove({
        name: "air purifier",
        type: "self",
        process: sequencer => {
            if(sequencer.globalBattleState.smokeDoses <= 0) {
                return {
                    failed: true,
                    text: "but the air is already clean"
                }
            }
            return {
                text: "1 smoke dose removed",
                action: () => {
                    sequencer.globalBattleState.smokeDoses--;
                    setSmokeSubText(sequencer);
                }
            }
        }
    });
    addMove({
        name: "you can't see me",
        type: "self",
        process: (sequencer,user,target) => {
            if(!user.state.searched) {
                return {
                    failed: true
                }
            }
            return {
                text: "invisible elf broke your search",
                action: () => {
                    user.state.searched = false;
                    setElfSearchSubText(sequencer);
                }
            }
        }
    });
    addMove({
        name: "photon proxy",
        type: "target",
        process: (sequencer,user,target) => {
            if(target.state.visualFatigue) {
                return {
                    failed: true,
                }
            } else {
                sequencer.globalBattleState.justSetVisualFatigue = true;
                target.state.visualFatigue = true;
                sequencer.globalBattleState.visualFatigueTurnsLeft = visualFatigueTurnCount;
                setPlayerVisualFatigueSubText(sequencer);
    
                let cancelledSearch = false;
                if(user.state.searched) {
                    user.state.searched = false;
                    cancelledSearch = true;
                    setElfSearchSubText(sequencer);
                }
    
                const events = [{
                    text: "this confused your eyeballs"
                },{
                    text: "search is temporarily disabled"
                }];
    
                if(cancelledSearch) {
                    events.push({
                        text: "this also broke your current search"
                    },{
                        text: "invisible elf is now undetected"
                    });
                }
    
                return {
                    events: events
                }
            }
        }
    });
    addMove({
        name: "trap failure",
        type: "self",
        process: (sequencer,user) => {
            return {
                failed: true,
                events: [
                    {
                        text: "a trap got in the way!"
                    },
                    {
                        text: "a bear trap snapped on invisible elf! ouch",
                        action: () => {
                            sequencer.globalBattleState.trapsPlaced--;
                            setTrapSubText(sequencer);
                            user.dropHealth(trapDamage);
                        }
                    }
                ]
            }
        }
    });
    
    const setElfSearchSubText = sequencer =>
        sequencer.elfBattleObject.subText[0] = sequencer.elfBattleObject.state.searched ?
        "detected" : "undetected";
    
    const setPlayerVisualFatigueSubText = sequencer =>
        sequencer.playerBattleObject.subText[1] = sequencer.playerBattleObject.state.visualFatigue ?
        `visual fatigue - ${sequencer.globalBattleState.visualFatigueTurnsLeft} turn${sequencer.globalBattleState.visualFatigueTurnsLeft!==1?"s":""} left` : "";
    
    const setTrapSubText = sequencer =>
        sequencer.playerBattleObject.subText[0] = `${sequencer.globalBattleState.trapsPlaced} trap${sequencer.globalBattleState.trapsPlaced!==1?"s":""} set`;
    
    const setSmokeSubText = sequencer =>
        sequencer.elfBattleObject.subText[1] = `${sequencer.globalBattleState.smokeDoses} smoke dose${sequencer.globalBattleState.smokeDoses!==1?"s":""}`;
    
    const getInvisibleElfMoves = sequencer => [
        sequencer.elfBattleObject.state.searched ?
            moves["destroy"]:moves["search"],
        moves["smoke bomb"],
        moves["sleuth punch"],
        moves["place trap"]
    ];

    this.name = "invisible elf";
    this.background = "background-4";
    this.backgroundColor = "rgb(224,240,255)";
    this.health = 250;

    this.getPlayerMoves = getInvisibleElfMoves;

    this.setup = sequencer => {
        const player = sequencer.playerBattleObject;
        const elf = sequencer.elfBattleObject;

        elf.movePreProcess = (sequencer,move) => {
            const trapHitChance = sequencer.globalBattleState.trapsPlaced * 0.1;
            if(sequencer.globalBattleState.trapsPlaced >= 1 && Math.random() <= trapHitChance) {
                return moves["trap failure"];
            }
            return move;
        }

        player.subText = [];
        elf.subText = [];

        elf.state.searched = false;
        player.state.visualFatigue = false;


        setElfSearchSubText(sequencer);
        setPlayerVisualFatigueSubText(sequencer);

        setSmokeSubText(sequencer);
        setTrapSubText(sequencer);
    },

    this.getMove = sequencer => {
        switch(sequencer.playerBattleObject.lastMove) {
            case "search":
                if(Math.random() > 0.75) {
                    return moves["you can't see me"];
                }
                break;
            case "destroy":
                if(Math.random() < 0.5) {
                    return moves["photon proxy"];
                }
                break;
            case "sleuth punch":
                if(sequencer.playerBattleObject.lastMoveFailed) {
                    return moves["sneaky punch"];
                }
                break;
        }

        if(sequencer.globalBattleState.smokeDoses >= 4) {
            if(Math.random() < 0.5) {
                return moves["air purifier"];
            }
        } else if(sequencer.globalBattleState.smokeDoses >= 3) {
            if(Math.random() < 0.25) {
                return moves["air purifier"];
            }
        } else if(sequencer.globalBattleState.smokeDoses >= 1) {
            if(Math.random() < 0.125) {
                return moves["air purifier"];
            }
        }

        

        return Math.random() < 0.75 ? moves["sneaky punch"] : sequencer.playerBattleObject.state.visualFatigue ? moves["sneaky punch"] : moves["photon proxy"];
    },

    this.getDefaultGlobalState = () => {
        return {
            smokeDoses: 0,
            trapsPlaced: 0,
            postTurnProcess: sequencer => {

                let endEvent = null;

                if(sequencer.globalBattleState.justSetVisualFatigue) {
                    sequencer.globalBattleState.justSetVisualFatigue = false;
                } else {
                    sequencer.globalBattleState.visualFatigueTurnsLeft--;
                    if(sequencer.globalBattleState.visualFatigueTurnsLeft <= 0) {
                        if(sequencer.playerBattleObject.state.visualFatigue) {
                            sequencer.playerBattleObject.state.visualFatigue = false;
                            endEvent = {
                                text: "your visual fatigue has ended",
                                action: sequencer => setPlayerVisualFatigueSubText(sequencer)
                            }
                        } else {
                            setPlayerVisualFatigueSubText(sequencer);
                        }
                    } else {
                        setPlayerVisualFatigueSubText(sequencer);
                    }
                }
                if(sequencer.elfBattleObject.isDead) {
                    return {
                        events: [
                            {
                                text: "you have defeated invisible elf"
                            },
                            {
                                text: "you are granted the elfmart sword"
                            },
                            {
                                text: "may it guide you to the very end"
                            },
                            {
                                speech: "you have...\npotential"
                            }
                        ]
                    }
                }

                sequencer.updatePlayerMoves(
                    getInvisibleElfMoves(sequencer)
                );

                return endEvent;
            }
        }
    },

    this.startSpeech = {
        text: "oh - have you come for the\nfabled elfmart sword?"
    }
}
