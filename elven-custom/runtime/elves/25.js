"use strict";
function MurderElf() {
    this.name = "murder elf";
    this.background = "background-2";
    this.backgroundColor = "rgb(114,114,114)";
    this.health = 900;

    const guiltyMove = {
        name: "plead guilty",
        type: "option",
        process: (sequencer,user) => {

        }
    }
    const notGuiltyMove = {
        name: "plead not guilty",
        type: "option",
        process: (sequencer,user) => {
            
        }
    }

    this.moveTree = {
        WimpyRedElf:[],
        WimpyGreenElf:[],
        WimpyBlueElf:[],
        WizardElf:[],
        RedElfette:[],
        GoldenElfette:[],
        WarElf:[],
        BoneyElf:[],
        HeadlessElf:[],
        TwoHeadedElf:[],
        JesterElf:[],
        LeglessElf:[],
        PhaseShiftElf:[],
        OldTimeyElf:[],
        ScorchedElf:[],
        InvisibleElf:[],
        RogueElf:[],
        NotRedElfette:[],
        BeachElf:[],
        UpsideDownElf:[],
        TinyArmElf:[],
        ElfmasTree:[],
        CorruptElf:[],
        DarkElf:[],
    }


    this.playerMoves = [
        {
            text: "submit",
            type: "self",
            process: sequencer => {
                sequencer
            }
        }
    ];

    this.getDefaultGlobalState = () => {
        return {
            speechIndex: 0,
            postTurnProcess: sequencer => {

            }
        }
    }

    this.startSpeech = {
        text: "actions have\nconsequences.\n\nit's time to atone\nfor your sins.\nlet's see what you\ncan still recall."
    }
}
