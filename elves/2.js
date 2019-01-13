elves[1] = {
    name: "wimpy green elf",
    background: "background-1",
    backgroundColor: "green",
    health: 100,
    startText: "this battle will be harder so no crying",
    playerMoves: [
        moves["wimpy punch"],
        moves["cry"],
        moves["nothing"]
    ],
    getMove: sequencer => {
        if(sequencer.elfBattleObject.health <= 20) {
            return moves["i love santa"];
        } else if(sequencer.playerBattleObject.health < 50) {
            return moves["nutcracker"];
        }else {
            return moves["wimpier punch"];
        }
    },
    getSpeech: sequencer => {
        if(sequencer.playerBattleObject.lastMove === "cry") {
            if(!sequencer.globalBattleState.turnsCrying) {
                sequencer.globalBattleState.turnsCrying = 0;
            }
            sequencer.globalBattleState.turnsCrying++;
            if(!sequencer.globalBattleState.noticedThatCryingStopped || sequencer.globalBattleState.turnsCrying === 4) {
                sequencer.globalBattleState.noticedThatCryingStopped = false;
                switch(sequencer.globalBattleState.turnsCrying) {
                    case 1:
                        return {
                            text: "ah what did i say\nabout crying"
                        };
                    case 2:
                        return {
                            text: "i really don't like this"
                        };
                    case 3:
                        return {
                            text: "your crying makes me\nuncomfortable"
                        };
                    default:
                    case 4:
                        return {
                            text: "i can't take it\nanymore"
                        };
                }
            } else {
                sequencer.globalBattleState.noticedThatCryingStopped = false;
                return {
                    text: "ugh\nyou stopped\nwhy start again\njust be happy"
                };
            }
        } else {
            sequencer.playerBattleObject.state.isCrying = false;
            if(sequencer.globalBattleState.turnsCrying && sequencer.globalBattleState.turnsCrying > 0) {
                sequencer.globalBattleState.noticedThatCryingStopped = true;
                const responses = ["phew\nthanks for stopping","good\nno more crying","this is fine"];
                return {
                    text: responses[Math.floor(Math.random() * responses.length)]
                };
            } else {
                return {
                    text: "this is fine\njust don't cry"
                };
            }
        }
        return {
            text: null
        }
    },
    getDefaultGlobalState: () => {
        return {
            postTurnProcess: sequencer => {
                if(sequencer.globalBattleState.turnsCrying) {
                    if(sequencer.globalBattleState.turnsCrying >= 4) {
                        sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
                        return {
                            text: `${sequencer.elfBattleObject.name} was consumed by your sadness`
                        }
                    }
                }
                return {};
            },
        }
    },
    startSpeech: {
        text: "hello i am green elf\nplz be nice\ni come in piece"
    }
}
