addMove({
    name: "water break",
    type: "self",
    process: () => {
        return {
            failed: false
        }
    }
});
elves[4] = {
    name: "red elfette",
    background: "background-1",
    backgroundColor: "red",
    health: 150,
    playerMoves: [
        moves["protect"],
        moves["wimpy punch"],
        moves["punching vitamins"]
    ],
    getWinSpeech: sequencer => {
        return "i told you i was\na good boxer\nsee ya around"
    },
    getLoseSpeech: sequencer => {
        return "this is...\nimpossible"
    },
    startSpeech: {
        text: "i might not\n-look- like a\nboxer... but it's my\nmy strong passion\ni am the best"
    },
    getSpeech: sequencer => {
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
    },
    getMove: sequencer => {
        if(sequencer.turnNumber % 4 === 3) {
            return moves["water break"];
        } else {
            return moves["decent punch"];
        }
    },
    getDefaultGlobalState: () => {
        return {
            postTurnProcess: sequencer => {
                sequencer.playerBattleObject.subText[0] = `turn ${sequencer.turnNumber + 1}`;
            }
        }
    },
    setup: sequencer => {
        sequencer.playerBattleObject.subText = [`turn ${sequencer.turnNumber + 1}`];
        sequencer.playerBattleObject.movePreProcess = protectPreProcessPlayer;
        sequencer.elfBattleObject.movePreProcess = protectPressProcessElf;
    }
}
