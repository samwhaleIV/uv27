addMove({
    name: "i hate santa",
    type: "self",
    process: (sequencer,user) => {
        const defaultEvent = {
            text: "rogue elf's hatred fuels their spirit",
            action: () => user.addHealth(ihatesantaHealAmount)
        };
        if(user.state.phasedOut) {
            return defaultEvent;
        }
        const endEvents = [];
        if(user.state.inCombo) {
            endEvents.push({
                text: "rogue elf broke their combo",
                action: () => {
                    user.state.inCombo = false;
                    updateComboSubText(sequencer);
                }
            });
        } else {
            endEvents.push({
                text: "rogue elf starts their combo",
                action: () => {
                    user.state.inCombo = true;
                    user.state.comboIndex = 0;
                    updateComboSubText(sequencer);
                }
            });
            defaultEvent.speech = "prince of darkness...";
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
                defaultEvent.speech = "\n...i beg unto thee...";
                endEvents.push({
                    text: "rogue elf continues their combo",
                    action: () => {
                        user.state.comboIndex = 1;
                        updateComboSubText(sequencer);
                    }
                });
            } else {
                endEvents.push({
                    text: "rogue elf broke their combo",
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
                defaultEvent.speech = "\n\n...kill this heathen"
                endEvents.push(defaultEvent,{
                    text: "this also finishes rogue elf's combo",
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
                    text: "rogue elf broke their combo",
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
                text: `${user.name} must used tainted holiday first`
            }
        }

    }
});

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

addMove({
    name: "maniacal slash",
    name: "target",
    process: (sequencer,user,target) => {
        let eventText = null;
        if(user.state.slashLyric < maniacLyrics.length) {
            eventText = `'${maniacLyrics[user.state.slashLyric++]}'`;
        }
        return {
            text: eventText,
            process: sequencer => {
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
                        text: "but it failed"
                    },
                    {
                        text: "you already have maximum blood"
                    }
                ]
            }
        }
        if(Math.random() > 0.5) {
            return {
                text: "your blood type was in stock",
                process: () => user.addBlood(bloodBankGains)
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
                        text: "but it failed"
                    },
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
            }
        }
    }
});
addMove({
    name: "elfmart sword",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            text: "no one is a match for the elfmart sword",
            action: () => target.dropHealth(elfmartSwordDamage)
        }
    }
});

addMove({
    name: "blood loss",
    type: "self",
    process: (sequencer,user) => {
        let eventText = null;
        if(user.state.slashLyric < maniacLyrics.length) {
            eventText = `'${maniacLyrics[user.state.slashLyric++]}'`;
        }
        return {
            events: [
                {
                    text: eventText,
                    process: sequencer => {
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
        return [moves["blood loss"]];
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
        if(sequencer.elfBattleObject.state.health >= sequencer.elfBattleObject.state.maxHealth) {
            return moves["phase shift"];
        } else {
            return moves["i hate santa"]; //This move heals lol
        }
    }

    if(sequencer.elfBattleObject.health <= 125) {
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

    const moveSequence = ["decent punch","i hate santa","maniacal slash","decent punch","i hate santa","decent punch","maniacal slash","i hate santa","maniacal slash","band aid"];
    return moves[moveSequence[sequencer.turnNumber%moveSequence.length]];
}

const getBloodSubText = blood => `${blood} percent blood capacity`;

const updateElfBloodSubText = sequencer =>
    sequencer.elfBattleObject.subText[0] = getBloodSubText(sequencer.elfBattleObject.state.blood);

const updatePlayerBloodSubText = sequencer =>
    sequencer.playerBattleObject.subText[0] = getBloodSubText(sequencer.playerBattleObject.state.blood);

const updateComboSubText = sequencer =>
    sequencer.elfBattleObject.subText[2] = sequencer.elfBattleObject.state.inCombo ? `combo - ${sequencer.elfBattleObject.state.comboIndex+1} of 3` : "";

const updateBloodSubTexts = sequencer => {
    updateElfBloodSubText(sequencer);
    updatePlayerBloodSubText(sequencer);
}

const setupRogueElfBattle = sequencer => {

    sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
        if(move.type === "target" && sequencer.elfBattleObject.state.phasedOut) {
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

const taintedHolidayDamage = 20;
const pureHatredDamage = 40;

const extraComboDamage = 40;

const ihatesantaHealAmount = 100;

const vampireBloodSwapAmount = 15;
const elfmartSwordDamage = 100;

const maniacalSlashDamage = 5;
const bloodLossAmount = 15;

const bloodBankGains = 15;

const getHealthRegenAmount = blood => Math.ceil(blood / 4);

elves[16] = {
    name: "rogue elf",
    background: "background-2",
    backgroundColor: "rgb(114,114,114)",
    health: 400,
    startSpeech: {
        text: "you will die...\ntraitor"
    },

    startText: "blood heals you - but run out and you'll die",

    getLoseSpeech: () => "there's alway a\nbigger fish.",
    getWinSpeech: () => "predictable.",

    setup: setupRogueElfBattle,
    getMove: getRogueElfElfMove,
    getPlayerMoves: getRogueElfPlayerMoves,
    getDefaultGlobalState: () => {
        return {
            postTurnProcess: sequencer => {
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
