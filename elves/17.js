addMove({ //Elf combo 1
    name: "i hate santa",
    type: "self"
});
addMove({ //Elf combo 2
    name: "tainted holiday",
    type: "target"
});
addMove({ //Elf combo 3
    name: "pure hatred",
    type: "self"
});

addMove({
    name: "maniacal slash",
    name: "target"
});

addMove({
    name: "blood bank",
    type: "self"
});

addMove({
    name: "interference",
    type: "target"
});

addMove({
    name: "vampire",
    type: "target"

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
    name: "blood loss"
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
    if(sequencer.playerBattleObject.forcedBloodLoos) {
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
    return moves["phase shift"];
}

const getBloodSubText = blood => `${blood} percent blood capacity`;

const updateElfBloodSubText = sequencer =>
    sequencer.elfBattleObject.subText[0] = getBloodSubText(sequencer.elfBattleObject.state.blood);

const updatePlayerBloodSubText = sequencer => {
    sequencer.playerBattleObject.subText[0] = getBloodSubText(sequencer.playerBattleObject.state.blood);
}

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

    sequencer.playerBattleObject.subText = [];
    sequencer.elfBattleObject.subText = [];

    sequencer.playerBattleObject.state.blood = 100;
    sequencer.elfBattleObject.state.blood = 100;
    updateBloodSubTexts(sequencer);

    sequencer.playerBattleObject.state.phasedOut = false;
    sequencer.elfBattleObject.state.phasedOut = false;

    sequencer.elfBattleObject.subText[1] = temporalPhaseText;

}

const taintedHolidayDamage = 20;
const pureHatredDamage = 40;//Pure hatred must be used after tained holiday

const ihatesantaHealAmount = 50;

const vampireBloodSwapAmount = 15;
const elfmartSwordDamage = 100;

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
    getDefaultBattleState: () => {
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
                    endEvents.push({
                        text: "you are healed by your blood",
                        action: () => sequencer.addHealth(
                            sequencer.playerBattleObject,
                            getHealthRegenAmount(sequencer.playerBattleObject.state.blood)
                        )
                    });
                }

                if(sequencer.elfBattleObject.health < sequencer.elfBattleObject.maxHealth) {
                    endEvents.push({
                        text: "rogue elf is healed by their blood",
                        action: () => sequencer.addHealth(
                            sequencer.elfBattleObject,
                            getHealthRegenAmount(sequencer.elfBattleObject.state.blood)
                        )
                    });
                }


                return endEvents.length <= 0 ? null : endEvents;
            }
        }
    }
}
