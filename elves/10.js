addMove({
    name: "offer fruit",
    type: "interface",
    process: (sequencer,user,target) => {
        sequencer.globalBattleState.moveStage = "fruit selection";
        return null;
    }
});
addMove({
    name: "apple",
    type: "option",
    process: (sequencer,user,target) => {
        user.state.option = "apple";
        sequencer.globalBattleState.endSelection = true;
        return null;
    }
});
addMove({
    name: "banana",
    type: "option",
    process: (sequencer,user,target) => {
        user.state.option = "banana";
        sequencer.globalBattleState.endSelection = true;
        return null;
    }
});

const getSelectionMove = (name,...options) => {
    const optionMoves = [...options].map(optionMove => {
        return {
            move: {
                name: optionMove.name,
                type: "option",
                process: (sequencer,user) => {
                    user.state.option = optionMove.name;
                    sequencer.globalBattleState.endSelection = true;
                    return null;
                }
            },
            events: optionMove.events
        }
    });
    return {
        move: {
            name: name,
            type: "interface",
            process: (sequencer,user) => {
                
                return null;
            }
        },
        optionMoves: {
        
        }
    }
}

const selectionScreen1 = [moves["offer fruit"]];
const fruitOptions = [moves["apple"],moves["banana"]];

const getDoubleSpeech = (speech1,speech2) => `head one:\n${speech1}\n\nhead two:\n${speech2}`;
elves[9] = {
    name: "two headed elf",
    background: "background-3",
    backgroundColor: "red",
    health: 300,
    getPlayerMoves: sequencer => {
        return selectionScreen1
    },
    setup: sequencer => {
        //Todo
    },
    startSpeech: {
        text: "head 1:\ni'm very conceited :(\n\nhead 2:\nbut i'm more outgoing! :)"
    },
    getSpeech: sequencer => {
        if(sequencer.globalBattleState.endSelection) {
            switch(sequencer.globalBattleState.moveStage) {
                case "fruit selection":
                    switch(sequencer.playerBattleObject.state.option) {
                        case "apple":
                            return {
                                text: getDoubleSpeech("i hate apple!","mmmm my favorite")
                            }
                        case "banana":
                            return {
                                text: getDoubleSpeech("banana - that's hot","eh...\nnot really my thing")
                            }
                    }
                    break;
            }
        }
        return null;
    },
    getDefaultGlobalState: () => {
        return {
            moveStage: "selection screen 1",
            postTurnProcess: sequencer => {
                if(sequencer.globalBattleState.endSelection) {
                    switch(sequencer.globalBattleState.moveStage) {
                        case "fruit selection":
                            sequencer.globalBattleState.moveStage = "selection screen 1";
                            break;
                    }
                    sequencer.playerBattleObject.option = null;
                    sequencer.globalBattleState.endSelection = false;
                }
                switch(sequencer.globalBattleState.moveStage) {
                    case "selection screen 1":
                        sequencer.updatePlayerMoves(selectionScreen1);
                        break;
                    case "fruit selection":
                        sequencer.updatePlayerMoves(fruitOptions);
                        break;
                }

            }
        }
    }
}
