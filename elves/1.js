elves[0] = {
    name: "wimpy red elf",
    background: "background-1",
    backgroundColor: "red",

    song: "Wimpy Wimpy",
    backgroundCycleTime: 35000,

    getMove: () => moves["cry"],

    getSpeech: sequencer => {
        const elfBattleObject = sequencer.elfBattleObject;

        const speeches = ["i never learned to fight","stop this plz","i am just a poor elf"];
        if(elfBattleObject.state.speechIndex === undefined) {
            elfBattleObject.state.speechIndex = 0;
        } else {
            elfBattleObject.state.speechIndex = (elfBattleObject.state.speechIndex + 1) % speeches.length;
        }
        return {
            text: speeches[elfBattleObject.state.speechIndex] + "\n*crying sounds*",
            animation:{name:"crying"}
        }
    },
    playerMoves: [
        moves["nothing"],moves["also nothing"],moves["honorable suicide"],moves["senseless murder"]
    ],
    health: 100,

    winSpeech: "bye\nthanks for stopping by\ncome again some time",

    getLoseSpeech: () => {
        return {
            text:"*cue famous last words*\ni am one but we are many\n*dies*",
            action: sequencer => {
                if(sequencer.elfBattleObject.state.isCrying) {
                    sequencer.showAnimation({name:"crying"});
                }
            }
        }
    }
}
