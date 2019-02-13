"use strict";
function MurderedElf() {

    const speeches = [
        "you don't remember me?\n\nfigures",
        "it's true what they said\n\nso true...",
        "i taught you everything\nyou know...",
        ".....\n*sigh*",
        "why do you think we kill?",
        "did you not even think?",
        "year after year... used....\n\nabused...",
        "of all people...\n\ni thought you would\nunderstand",
        "it's true what they say...\n\nyou're just a traitor.",
        "you don't even\nremember\nwho i am.",
        "but how can i blame you...\nyou don't even know\nwho you are...\n...what you are",
        "they used to call me\nwimpy...\n\nthen what's left for you?\n\ncoward? bastard?",
        "it doesn't matter now.",
        "i'll show you my true\npurpose.",
        "i'll show them all."
    ];

    this.name = "murdered elf";
    this.background = "background-1";
    this.backgroundColor = "red";
    this.health = 1;

    this.startSpeech = {
        text:"oh. surprised?\n\ni've really let myself go\n\never since you - you know..\nmurdered me"
    };

    this.playerMoves = [{
        name: "continue",
        type: "interface",
        process: (sequencer,user) => {
            sequencer.globalBattleState.speechIndex++;
            updateDetune(sequencer);
            return null;
        }
    }];

    this.song = "dead_loop";
    this.songIntro = "dead_intro";

    const updateDetune = sequencer => {
        const detuneAmount = (sequencer.globalBattleState.speechIndex+1) * 50;
        if(musicNodes[this.song]) {
            musicNodes[this.song].detune.setValueAtTime(detuneAmount,audioContext.currentTime);
        } else {
            startDetuneManifest[this.song] = detuneAmount;
        }
        if(musicNodes[this.songIntro]) {
            musicNodes[this.songIntro].detune.setValueAtTime(detuneAmount,audioContext.currentTime);
        } else {
            startDetuneManifest[this.songIntro] = detuneAmount;
        }
    }

    this.setup = updateDetune;

    this.getDefaultGlobalState = () => {
        return {
            speechIndex: -1,
            postTurnProcess: sequencer => {
                if(sequencer.globalBattleState.speechIndex === speeches.length) {
                    return {
                        events: [
                            {
                                text: "murdered elf took your elfmart sword",
                                speech: "goodbye.\n\nbut this this is not death.\n\nhahaha...\n\n    this is only rebirth..."
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
