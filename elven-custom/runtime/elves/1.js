"use strict";
function WimpyRedElf() {
    this.name = "wimpy red elf";
    this.background = "background-1";
    this.backgroundColor = "red";

    this.song = "wimpy_loop";
    this.songIntro = "wimpy_intro";
    
    this.backgroundCycleTime = 35000;

    this.getMove = sequencer => {
        if(sequencer.globalBattleState.readyForMove++ >= 1) {
            return moves["cry"];
        }
        return null;
    }

    this.getSpeech = sequencer => {
        if(sequencer.globalBattleState.readyForMove < 2) {
            return null;
        }
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

    const readyMoves = [
        moves["nothing"],moves["also nothing"],moves["honorable suicide"],moves["senseless murder"]
    ];

    const yesMove = {
        name: "yes",
        type: "interface",
        process: sequencer => {
            sequencer.updatePlayerMoves(readyMoves);
            sequencer.globalBattleState.readyForMove = 0;
            return {
                speech: "whelp - this concludes\nthe tutorial.\ngood luck - and again...\n\ni hate you :)"
            }
        }
    }
    const noMove = {
        name: "no",
        type: "interface",
        process: sequencer => {
            sequencer.updatePlayerMoves(readyMoves);
            sequencer.globalBattleState.readyForMove = 0;
            return {
                speech: "okay well sorry\n\ni don't have time to teach\nyou right now...\n\ni am very busy"
            }
        }
    }
    const noIdeaMove = {
        name: "no idea",
        type: "interface",
        process: sequencer => {
            sequencer.updatePlayerMoves(readyMoves);
            sequencer.globalBattleState.readyForMove = 0;
            return {
                speech: "ehhh - close enough\n\nyou seem ready\nfor anything"
            }
        }
    }

    this.playerMoves = [
        yesMove,noMove,noIdeaMove
    ];
    this.health = 100;

    this.winSpeech = "bye\nthanks for stopping by\ncome again some time";

    this.startSpeech = {
        text: "nice to meet you.\nhahaha just kidding.\ni hate humans.\n\nbut before i kill you\ndo you know how to use\nbuttons?",
        persist: true
    }

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
