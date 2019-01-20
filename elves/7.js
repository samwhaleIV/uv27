elves[6] = {
    name: "war elf",
    background: "background-4",
    backgroundColor: "white",
    health: 200,
    startText: "wrong questions drain your health - good luck",
    getPlayerMoves: () => {
        return getRadioSet([
            "absolutely nothing","doing the dishes","dying honorably","losing children"
        ],"question1");
    },
    startSpeech: {
        text: "you've got a lot to do\nso i won't waste\nyour time :)\n\nnow tell me..\nwar... war...\nwhat is it good for?",
        persist: true
    },
    getSpeech: sequencer => {
        let lines = "";
        switch(sequencer.turnNumber) {
            case 0:
                switch(sequencer.playerBattleObject.state["question1"]) {
                    case 0:
                        lines += "hmm - you seem\nquite clever";
                        break;
                    case 1:
                        sequencer.playerBattleObject.state.hatesDishes = true;
                        lines += "dishes of war?\ni'm not familiar with\nthat song";
                        sequencer.dropHealth(sequencer.playerBattleObject,34);
                        break;
                    case 2:
                    case 3:
                        lines += "that's not how the\nsong goes..."
                        sequencer.dropHealth(sequencer.playerBattleObject,34);
                        break;
                }
                if(sequencer.playerBattleObject.isAlive) {
                    lines += "\n\n";

                    lines += "what never changes?";

                    sequencer.updatePlayerMoves(
                        getRadioSet(["doing the dishes","losing children","war","absolutely nothing"],"question2")
                    );
                }
                
                break;
            case 1:
                switch(sequencer.playerBattleObject.state["question2"]) {
                    case 0:
                        if(sequencer.playerBattleObject.state.hatesDishes) {
                            lines += "why do you have this\nobsession with\ndishes???";
                        } else {
                            lines += "well - yes - but no";
                        }
                        sequencer.dropHealth(sequencer.playerBattleObject,40);
                        break;
                    case 3:
                        lines += "that's not the right\nanswer but you get\na free pass smh";
                        break;
                    case 1:
                        lines += "that's not how the\nquote goes...";
                        sequencer.dropHealth(sequencer.playerBattleObject,40);
                        break;
                    case 2:
                        if(sequencer.playerBattleObject.health < 100) {
                            lines += "now you're getting it";
                        } else {
                            lines += "nice - 2 in a row";
                        }
                        break;

                }
                if(sequencer.playerBattleObject.isAlive) {
                    lines += "\n\n";

                    lines += "who am i?";

                    sequencer.updatePlayerMoves(
                        getRadioSet(["ugly","confusing","sexy","war elf"],"question3")
                    );
                }

                break;
            case 2:
                switch(sequencer.playerBattleObject.state["question3"]) {
                    case 0:
                        lines += "really? ugly?" ;
                        sequencer.dropHealth(sequencer.playerBattleObject,50);
                        break;
                    case 1:
                        lines += "c o n f u s i n g ?";
                        sequencer.dropHealth(sequencer.playerBattleObject,50);
                        break;
                    case 2:
                        lines += "sexy? you're\ndisgusting. elves and\nhumans is a no go bro"
                        sequencer.dropHealth(sequencer.playerBattleObject,50);
                        break;
                    case 3:
                        lines += "i can't believe\nyou got that one"
                        break;
                }

                if(sequencer.playerBattleObject.isAlive) {
                    lines += "\n\n";
                    lines += "first 22 digits of pi?"

                    sequencer.updatePlayerMoves(
                        getRadioSet(
                            [
                            "3.14259265358979323846",
                            "3.14159265358979323846",
                            "4.14159265358979323846",
                            "3.14159265354979323046"],
                            "question4"
                        )
                    );
                }

                sequencer.playerBattleObject.state.startTime = Date.now();
                break;

            case 3:
                switch(sequencer.playerBattleObject.state["question4"]) {
                    case 0:
                    case 3:
                        lines += "close... but no";
                        sequencer.dropHealth(sequencer.playerBattleObject,34);
                        break;
                    case 2:
                        lines += "really?\ndo you really think\nthat pi starts with a 4?";
                        sequencer.dropHealth(sequencer.playerBattleObject,34 );
                        break;
                    case 1:
                        if(Date.now() - sequencer.playerBattleObject.state.startTime < 7500) {
                            lines += "hmm... you're a nerd";
                        } else {
                            lines += "you're so slow\nfor a human";
                        }
                        break;
                }
                if(sequencer.playerBattleObject.isAlive) {
                    lines += "\n\n";

                    lines += "how many elves came\nbefore me?"

                    sequencer.updatePlayerMoves(
                        getRadioSet(
                            ["5","6","4","5"],
                            "question5"
                        )
                    );
                }


                break;
            case 4:
                switch(sequencer.playerBattleObject.state["question5"]) {
                    case 0:
                    case 2:
                    case 3:
                        lines += "no - i'm number 7";
                        sequencer.dropHealth(sequencer.playerBattleObject,50);
                        break;
                    case 1:
                        lines += "you know how to count?\ni didn't know humans\ncould do that"
                        break;
                }

                if(sequencer.playerBattleObject.isAlive) {
                    lines += "\n\nlast question.\n";

                    lines += "do you like my face\npaint? (be honest)";

                    sequencer.updatePlayerMoves(
                        getStaticRadioSet(
                            ["yes","no","not sure"],"question6"
                        )
                    );
                }
                break;
            default:
            case 5:
                switch(sequencer.playerBattleObject.state["question6"]) {
                    case 0:
                        lines += "really? be honest";
                        sequencer.updatePlayerMoves(
                            getStaticRadioSet(
                                ["yes - really","fine - no","still not sure"],"question6"
                            )
                        );
                        break;
                    case 1:
                        lines += "thank you. everyone\nalways lies about it.\ntruth is - it's not\npaint. this is really\nmy face\nnow i can die happy\n*dies*";
                        sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
                        break;
                    case 2:
                        lines += "sureness is my only\npolicy\n(and genocide)";
                        sequencer.dropHealth(sequencer.playerBattleObject,sequencer.playerBattleObject.maxHealth);
                        break;
                    default:
                        lines += "uh - you shouldn't be\nseeing this\nmessage";
                        break;
                }
                break;
        }
        return {
            text: lines,
            persist: true
        }
    }
}
