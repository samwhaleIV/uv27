"use strict";
addMove({
    name: "elfmart sword",
    type: "target",
    process: (sequencer,user,target) => {
        if(target.name === "not red elfette" && target.state.layerCount !== 0) {
            return {
                failed: true,
                text: "but the elfette's clothes protect her"
            }
        }
        const elfmartSwordDamage = 150;
        return {
            text: "no one is a match for the elfmart sword",
            action: () => target.dropHealth(elfmartSwordDamage)
        }
    }
});
function RogueElf() {

    const taintedHolidayDamage = 40;
    const pureHatredDamage = 40;
    const extraComboDamage = 40;
    const ihatesantaHealAmount = 65;
    const vampireBloodSwapAmount = 20;
    const maniacalSlashDamage = 25;
    const bloodLossAmount = 60;
    const bloodBankGains = 30;
    const rogueElfBloodRegenAmount = 4;
    const getHealthRegenAmount = blood => Math.ceil(blood / 7);

    addMove({
        name: "i hate santa",
        type: "self",
        process: (sequencer,user) => {
            const defaultEvent = {
                text: `${user.name}'s hatred fuels their spirit`,
                action: () => user.addHealth(user.state.phasedOut ? 150 : ihatesantaHealAmount)
            };
            if(user.state.phasedOut) {
                return defaultEvent;
            }
            const endEvents = [];
            if(user.state.inCombo) {
                endEvents.push({
                    text: `${user.name} broke their combo`,
                    action: () => {
                        user.state.inCombo = false;
                        updateComboSubText(sequencer);
                    }
                });
            } else {
                endEvents.push({
                    text: `${user.name} starts their combo`,
                    action: () => {
                        user.state.inCombo = true;
                        user.state.comboIndex = 0;
                        updateComboSubText(sequencer);
                    }
                });
                if(user.name === "rogue elf") {
                    defaultEvent.speech = "prince of darkness...";
                }
            }
            endEvents.push(defaultEvent);
            return {
                events:endEvents
            }
        }
    });
    addMove({
        name: "tainted holiday",
        type: "target",
        process: (sequencer,user,target) => {
            const defaultEvent = {
                text: "not the christmas party you were expecting",
                action: () => target.dropHealth(taintedHolidayDamage)
            }
            if(user.state.inCombo) {
                const endEvents = [];
                if(user.state.comboIndex === 0) {
                    if(user.name === "rogue elf") {
                        defaultEvent.speech = "\n...i beg unto thee...";
                    }
                    endEvents.push({
                        text: `${user.name} continues their combo`,
                        action: () => {
                            user.state.comboIndex = 1;
                            updateComboSubText(sequencer);
                        }
                    });
                } else {
                    endEvents.push({
                        text: `${user.name} broke their combo`,
                        action: () => {
                            user.state.comboIndex = 0;
                            user.state.inCombo = false;
                            updateComboSubText(sequencer);
                        }
                    });
                }
                endEvents.push(defaultEvent);
                return {
                    events: endEvents
                }
            } else {
                return defaultEvent;
            }
        }
    });
    addMove({
        name: "pure hatred",
        type: "target",
        process: (sequencer,user,target) => {
            const defaultEvent = {
                text: "that wasn't very nice!",
                action: () => target.dropHealth(pureHatredDamage)
            }
            if(user.state.inCombo) {
                const endEvents = [];
                if(user.state.comboIndex === 1) {
                    if(user.name === "rogue elf") {
                        defaultEvent.speech = "\n\n...kill this heathen";
                    }
                    endEvents.push(defaultEvent,{
                        text: `this also finishes ${user.name}'s combo`,
                        action: () => {
                            user.state.comboIndex++;
                            updateComboSubText(sequencer);
                        }
                    },{
                        text: "combos make a huge impact",
                        action: () => {
                            target.dropHealth(extraComboDamage)
                            user.state.comboIndex = 0;
                            user.state.inCombo = false;
                            updateComboSubText(sequencer);
                        }
                    });
                } else {
                    endEvents.push({
                        text: `${user.name} broke their combo`,
                        action: () => {
                            user.state.inCombo = false;
                            updateComboSubText(sequencer);
                        }
                    });
                    endEvents.push(defaultEvent);
                }
                return {
                    events: endEvents
                }
            }
            if(user.lastMove === "tainted holiday") {
                return defaultEvent;
            } else {
                return {
                    failed: true,
                    text: `${user.name} must use tainted holiday first`
                }
            }
    
        }
    });
    
    addMove({
        name: "maniacal slash",
        type: "target",
        process: (sequencer,user,target) => {
            let eventText = null;
            if(user.state.slashLyric < maniacLyrics.length) {
                eventText = `'${maniacLyrics[user.state.slashLyric++]}'`;
            }
            return {
                text: eventText,
                action: sequencer => {
                    target.dropHealth(maniacalSlashDamage);
                    sequencer.playerBattleObject.state.forcedBloodLoss = true;
                    sequencer.updatePlayerMoves(getRogueElfPlayerMoves(sequencer));
                }
            }
        }
    });
    
    addMove({
        name: "blood bank",
        type: "self",
        process: (sequencer,user) => {
            if(user.state.blood === 100) {
                return {
                    failed: true,
                    events: [
                        {
                            text: "you already have maximum blood"
                        }
                    ]
                }
            }
            if(Math.random() > 0.5) {
                return {
                    text: "your blood type was in stock",
                    action: () => user.addBlood(bloodBankGains)
                }
            } else {
                return {
                    failed: true,
                    text: "your blood type isn't in stock right now"
                }
            }
        }
    });
    
    addMove({
        name: "interference",
        type: "target",
        process: (sequencer,user,target) => {
            if(target.state.phasedOut) {
                target.state.justBroughtBackIntoPhase = true;
                return {
                    events: [
                        {
                            text:"you brought rogue elf back into phase"
                        },...moves["phase shift"].process(sequencer,target).events
                    ]
                }
            }
            if(target.state.inCombo) {
                return {
                    text: "you broke rogue elf's combo",
                    action: () => {
                        target.state.inCombo = false;
                        updateComboSubText(sequencer);
                    }
                }
            } else {
                return {
                    failed: true,
                    events: [
                        {
                            text: "rogue elf isn't making a combo right now"
                        }
                    ]
                }
            }
        }
    });
    
    addMove({
        name: "vampire",
        type: "target",
        process: (sequencer,user,target) => {
            return {
                text: `${user.name} took blood from ${target.name}`,
                action: () => {
                    user.addBlood(vampireBloodSwapAmount);
                    target.dropBlood(vampireBloodSwapAmount);
                    if(target.state.blood <= 0) {
                        return {
                            text: "rogue died from complete blood loss",
                            action: () => sequencer.elfBattleObject.dropHealth(sequencer.elfBattleObject.maxHealth)          
                        }             
                    }
                }
            }
        }
    });
    
    addMove({
        name: "massive blood loss",
        type: "self",
        process: (sequencer,user) => {
            let eventText = null;
            if(sequencer.elfBattleObject.state.slashLyric < maniacLyrics.length) {
                eventText = `'${maniacLyrics[sequencer.elfBattleObject.state.slashLyric++]}'`;
            }
            return {
                events: [
                    {
                        text: eventText,
                        action: sequencer => {
                            user.dropBlood(bloodLossAmount);
                            sequencer.playerBattleObject.state.forcedBloodLoss = false;
                            sequencer.updatePlayerMoves(getRogueElfPlayerMoves(sequencer));
                        }
                    },
                    {
                        text: "you lost some blood"
                    }
                ]
            }
        }
    });
    
    addMove({
        name: "failed because rogue elf is creepy or something",
        type: "self",
        process: () => {
            return {
                failed: true,
                text: "but rogue elf is out of phase"
            }
        }
    });
    const getRogueElfPlayerMoves = sequencer => {
        if(sequencer.playerBattleObject.state.forcedBloodLoss) {
            return [moves["massive blood loss"]];
        }
        return [
            moves["blood bank"],
            moves["interference"],
            moves["vampire"],
            moves["elfmart sword"]
        ]
    }
    const getRogueElfElfMove = sequencer => {
    
        if(sequencer.elfBattleObject.state.phasedOut) {
            if(sequencer.elfBattleObject.state.inCombo) {
                sequencer.elfBattleObject.state.inCombo = false;
                updateComboSubText(sequencer);
            }
            if(sequencer.elfBattleObject.health >= sequencer.elfBattleObject.maxHealth) {
                return moves["phase shift"];
            } else {
                return moves["i hate santa"];
            }
        }
    
        if(sequencer.elfBattleObject.health <= 135 && !sequencer.elfBattleObject.state.justBroughtBackIntoPhase) {
            if(sequencer.elfBattleObject.state.inCombo) {
                sequencer.elfBattleObject.state.inCombo = false;
                updateComboSubText(sequencer);
            }
            return moves["phase shift"];
        }
    
        const moveOrder = ["i hate santa","tainted holiday","pure hatred"];
    
        if(sequencer.elfBattleObject.state.inCombo) {
            switch(sequencer.elfBattleObject.lastMove) {
                case moveOrder[0]:
                    return moves[moveOrder[1]];
                case moveOrder[1]:
                    return moves[moveOrder[2]];
            }
        }
    
        if(sequencer.playerBattleObject.lastMove === "interference" && !sequencer.playerBattleObject.lastMoveFailed) {
            if(Math.random() < 0.7) {
                moves["maniacal slash"];
            }
        }
    
        const moveSequence = ["decent punch","i hate santa","maniacal slash","decent punch","i hate santa","decent punch","maniacal slash","i hate santa","maniacal slash","band aid"];
        return moves[moveSequence[sequencer.turnNumber%moveSequence.length]];
    }
    
    const getBloodSubText = blood => `${blood} percent blood capacity`;
    
    const updateElfBloodSubText = sequencer =>
        sequencer.elfBattleObject.subText[2] = getBloodSubText(sequencer.elfBattleObject.state.blood);
    
    const updatePlayerBloodSubText = sequencer =>
        sequencer.playerBattleObject.subText[0] = getBloodSubText(sequencer.playerBattleObject.state.blood);
    
    const updateComboSubText = sequencer =>
        sequencer.elfBattleObject.subText[0] = sequencer.elfBattleObject.state.inCombo ? `combo stage - ${sequencer.elfBattleObject.state.comboIndex+1} of 3` : "not in combo";
    
    const updateBloodSubTexts = sequencer => {
        updateElfBloodSubText(sequencer);
        updatePlayerBloodSubText(sequencer);
    }
    
    const maniacLyrics = [
        "just a steel town girl on a saturday night",
        "looking for the fight of her life",
        "they all say she's crazy",
        "in the real time world no one sees her at all",
        "no - they all say she's crazy",
        "impossibe",
        "it can cut you like a knife",
        "she has danced into the danger zone",
        "the dancer becomes the dance...",
        "she's dancing like she's never danced before",
        "maniac at your love"
    ];
    
    const setupRogueElfBattle = sequencer => {
    
        sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
            if(move.type === "target" && move.name !== "interference" && sequencer.elfBattleObject.state.phasedOut) {
                return moves["failed because rogue elf is creepy or something"];
            }
            return move;
        }
    
        const dropBlood = (user,amount) => {
            user.state.blood -= amount;
            if(user.state.blood < 0) {
                user.state.blood = 0;
            }
        }
        const addBlood = (user,amount) => {
            user.state.blood += amount;
            if(user.state.blood > 100) {
                user.state.blood = 100;
            }
        }
    
        sequencer.playerBattleObject.dropBlood = amount => {
            dropBlood(sequencer.playerBattleObject,amount);
            updatePlayerBloodSubText(sequencer);
        }
        sequencer.elfBattleObject.dropBlood = amount => {
            dropBlood(sequencer.elfBattleObject,amount);
            updateElfBloodSubText(sequencer);
        }
    
        sequencer.playerBattleObject.addBlood = amount => {
            addBlood(sequencer.playerBattleObject,amount);
            updatePlayerBloodSubText(sequencer);
        }
        sequencer.elfBattleObject.addBlood = amount => {
            addBlood(sequencer.elfBattleObject,amount);
            updateElfBloodSubText(sequencer);
        }
    
        sequencer.globalBattleState.swapBlood = amount => {
            const playerHealth = sequencer.playerBattleObject.state.health;
            sequencer.playerBattleObject.state.health = sequencer.elfBattleObject.state.health;
            sequencer.elfBattleObject.state.health = playerHealth;
            updateBloodSubTexts(sequencer);
        }
    
        sequencer.playerBattleObject.subText = [];
        sequencer.elfBattleObject.subText = [];
    
        sequencer.playerBattleObject.state.blood = 100;
        sequencer.elfBattleObject.state.blood = 100;
    
        sequencer.elfBattleObject.state.slashLyric = 0;
        updateBloodSubTexts(sequencer);
    
        sequencer.elfBattleObject.inCombo = false;
        sequencer.elfBattleObject.comboIndex = 0;
    
        updateComboSubText(sequencer);
    
    
        sequencer.playerBattleObject.state.phasedOut = false;
        sequencer.elfBattleObject.state.phasedOut = false;
    
        sequencer.elfBattleObject.subText[1] = temporalPhaseText;
    
    }
    this.name = "rogue elf";
    this.background = "background-2";
    this.backgroundColor = "rgb(114,114,114)";
    this.health = 400;
    this.startSpeech = {
        text: "you will die...\ntraitor.\n\nyou're not what you\nthink you are.\n\ni see through your lies."
    };

    this.startText = "blood heals you - but run out and you'll die";
    this.loseSpeech = "there's alway a\nbigger fish...\n\nbut you and i are\nnot so different.";
    this.winSpeech = "predictable.";

    this.setup = setupRogueElfBattle;
    this.getMove = getRogueElfElfMove;
    this.getPlayerMoves = getRogueElfPlayerMoves;
    this.getDefaultGlobalState = () => {
        return {
            postTurnProcess: sequencer => {
                sequencer.elfBattleObject.state.justBroughtBackIntoPhase = false;
                if(sequencer.playerBattleObject.state.blood <= 0) {
                    return {
                        text: "you died from complete blood loss",
                        action: () => sequencer.playerBattleObject.dropHealth(sequencer.playerBattleObject.maxHealth)
                    }
                }
                if(sequencer.elfBattleObject.state.blood <= 0) {
                    return {
                        text: "rogue elf died from complete blood loss",
                        action: () => sequencer.elfBattleObject.dropHealth(sequencer.elfBattleObject.maxHealth)
                    }
                }

                const endEvents = [];

                if(sequencer.elfBattleObject.state.blood < 100) {
                    endEvents.push({
                        text: "rogue elf regenerated some blood",
                        action: () => {
                            sequencer.elfBattleObject.state.blood += rogueElfBloodRegenAmount;
                            if(sequencer.elfBattleObject.state.blood >= 100) {
                                sequencer.elfBattleObject.state.blood = 100;
                            }
                            updateElfBloodSubText(sequencer);
                        }
                    });
                }

                if(sequencer.playerBattleObject.health < sequencer.playerBattleObject.maxHealth) {
                    const regenAmount = getHealthRegenAmount(sequencer.playerBattleObject.state.blood);
                    if(regenAmount >= 1) {
                        endEvents.push({
                            text: "you are healed by your blood",
                            action: () => sequencer.addHealth(
                                sequencer.playerBattleObject,
                                regenAmount
                            )
                        });
                    }
                }

                if(sequencer.elfBattleObject.health < sequencer.elfBattleObject.maxHealth) {
                    const regenAmount = getHealthRegenAmount(sequencer.elfBattleObject.state.blood);
                    if(regenAmount >= 1) {
                        endEvents.push({
                            text: "rogue elf is healed by their blood",
                            action: () => sequencer.addHealth(
                                sequencer.elfBattleObject,
                                regenAmount
                            )
                        });
                    }
                }

                return endEvents.length <= 0 ? null : {events:endEvents};
            }
        }
    }
}
