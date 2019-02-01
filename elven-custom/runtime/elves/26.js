"use strict";
function MurderedElf() {
    const speeches = [
        "you don't remember me?\n\nfigures",
        "it's true what they said\n\nso true...",
        ".....\n*sigh*",
        "why do you think we kill?",
        "did you not even think?",
        "year after year... used....\n\nabused...",
        "and you don't even\nremember\nwho i am.",
        "you were always so\n[senseless]...",
        "you frustrate me\nto no end.\n\ni hate you.\n\nthey used to call me...\nwimpy...",
        "i'll show them now.",
        "i'll show them all."
    ];

    this.songIntro = "wimpy_intro";
    this.song = "wimpy_loop";

    this.name = "murdered elf";
    this.background = "background-1";
    this.backgroundColor = "red";
    this.health = 1;

    this.startSpeech = {text:"oh. surprised?\n\ni've really let myself go\n\never since you - you know..\nmurdered me"};

    this.playerMoves = [{
        name: "continue",
        type: "interface",
        process: (sequencer,user) => {
            sequencer.globalBattleState.speechIndex++;
            return null;
        }
    }];

    this.getDefaultGlobalState = () => {
        return {
            speechIndex: -1,
            postTurnProcess: sequencer => {
                if(sequencer.globalBattleState.speechIndex === speeches.length) {
                    return {
                        events: [
                            {
                                text: "murdered elf took your elfmart sword",
                                speech: "goodbye.\n\nthis is not death.\nonly rebirth."
                            },
                            {
                                text: "murdered elf stabbed deeply with the sword",
                                action: () => sequencer.elfBattleObject.dropHealth(1)
                            }
                        ]
                    }
                } else {
                    return {
                        speech: speeches[sequencer.globalBattleState.speechIndex]
                    }
                }
            }
        }
    }
}
