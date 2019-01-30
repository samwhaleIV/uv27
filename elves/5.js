"use strict";
addMove({
    name: "water break",
    type: "self",
    process: () => {
        return {
            failed: false
        }
    }
});
function RedElfette() {
    this.name = "red elfette";
    this.background = "background-1";
    this.song = "boxer_loop";
    this.songIntro = "boxer_intro";
    this.backgroundColor = "red";
    this.backgroundCycleTime = 45000;
    this.health = 150;
    this.playerMoves = [
        moves["protect"],
        moves["wimpy punch"],
        moves["punching vitamins"]
    ];
    this.getWinSpeech = () => {
        return {text:"i told you i was\na good boxer\nsee ya around"}
    };
    this.getLoseSpeech = () => {
        return {text:"this is...\nimpossible"}
    };
    this.startSpeech = {
        text: "i might not\n-look- like a\nboxer... but it's my\nmy strong passion\ni am the best"
    };
    this.getSpeech = sequencer => {
        if(sequencer.turnNumber % 4 === 3) {
            if(sequencer.turnNumber % 2 === 0) {
                return {
                    text: "water breaks\nare essential\nto an effective\nworkout - or a good\nass kicking"
                };
            } else {
                return {
                    text: "i could do this\nall day"
                };
            }
        }
        return {
            text: null
        }
    };
    this.getMove = sequencer => {
        if(sequencer.turnNumber % 4 === 3) {
            return moves["water break"];
        } else {
            return moves["decent punch"];
        }
    };
    this.getDefaultGlobalState = () => {
        return {
            postTurnProcess: sequencer => {
                sequencer.playerBattleObject.subText[0] = `turn ${sequencer.turnNumber + 1}`;
            }
        }
    };
    this.setup = sequencer => {
        sequencer.playerBattleObject.subText = [`turn ${sequencer.turnNumber + 1}`];
        sequencer.playerBattleObject.movePreProcess = protectPreProcessPlayer;
        sequencer.elfBattleObject.movePreProcess = protectPreProcessElf;
    }
}
