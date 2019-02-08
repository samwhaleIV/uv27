"use strict";
function CorruptElf() {

    const setTurnSubtext = sequencer => {
        sequencer.playerBattleObject.subText[0] = `${sequencer.globalBattleState.turnsLeft} turn${sequencer.globalBattleState.turnsLeft !== 1?"s":""} left`;
    }

    const items = [

    ];

    const questions = [

    ];

    const readyToAnswerMove = {
        name: "i know who it is!"
    }
    const askAQuestionMove = {
        name: "ask and deduce"
    }
    const getCurrentSummaryMove = {
        name: "current deductions"
    }

    this.getPlayerMoves = sequencer => {
        switch(sequencer.globalBattleState.menuPosition) {
            case "home":
                return [askAQuestionMove,getCurrentSummaryMove,readyToAnswerMove];
        }
    }

    this.name = "corrupt elf";
    this.background = "background-6";
    this.backgroundColor = "white";

    this.darkHover = true;
    this.backgroundCycleTime = 20000;
    this.health = 700;

    this.setup = sequencer => {
        sequencer.playerBattleObject.subText = [];
        sequencer.elfBattleObject.subText = ["thinking of an elf"];
        sequencer.globalBattleState.postTurnProcess = sequencer => {

        }
        sequencer.globalBattleState.turnsLeft = 10;
        sequencer.globalBattleState.menuPosition = "home";
        setTurnSubtext(sequencer);
    }

    this.startSpeech = {
        text: "don't you know?\n2.5 heads is better\nthan none\n\nlet's play a game...\nguess who i'm\nthinking of"
    }
    this.winSpeech = "";
    this.loseSpeech = "";
}
