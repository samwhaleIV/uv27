"use strict";
function WimpyRedElf() {
    this.name = "wimpy red elf";
    this.background = "background-1";
    this.backgroundColor = "red";

    this.song = "wimpy_loop";
    this.songIntro = "wimpy_intro";
    
    this.backgroundCycleTime = 35000;

    this.getMove = () => moves["cry"];

    this.getSpeech = sequencer => {
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
    };
    this.playerMoves = [
        moves["nothing"],moves["also nothing"],moves["honorable suicide"],moves["senseless murder"]
    ];
    this.health = 100;

    this.winSpeech = "bye\nthanks for stopping by\ncome again some time";

    this.getLoseSpeech = () => {
        return {
            text: "*cue famous last words*\ni am one but we are many\n*dies*",
            action: sequencer => {
                if(sequencer.elfBattleObject.state.isCrying) {
                    sequencer.showAnimation({name:"crying"});
                }
            }
        }
    }
}
