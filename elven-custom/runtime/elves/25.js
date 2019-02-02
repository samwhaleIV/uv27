"use strict";
function MurderElf() {
    this.name = "murder elf";
    this.background = "background-2";
    this.backgroundColor = "rgb(114,114,114)";
    this.health = 900;

    const guiltyMove = {
        name: "plead guilty",
        type: "interface",
        process: (sequencer,user) => {
            user.state.pleadedGuilty = true;
            user.state.guiltyCount++;
            return null;
        }
    }
    const notGuiltyMove = {
        name: "plead not guilty",
        type: "interface",
        process: (sequencer,user) => {
            user.state.pleadedGuilty = false;
            user.state.notGuiltyCount++;
            return null;
        }
    }

    this.playerMoves = [
        {
            name: "cease and desist",
            type: "interface",
            process: sequencer => {
                sequencer.updatePlayerMoves([guiltyMove,notGuiltyMove]);
                return null;
            }
        }
    ];

    this.setup = sequencer => {
        sequencer.playerBattleObject.state.guiltyCount = 0;
        sequencer.playerBattleObject.state.notGuiltyCount = 0;
    }

    this.getDefaultGlobalState = () => {
        return {
            speechIndex: 0,
            postTurnProcess: sequencer => {
                let s = null;
                switch(sequencer.globalBattleState.speechIndex) {
                    case 0:
                        s = "murdered after teaching\na human to press buttons";
                        break;
                    case 1:
                        s = "second hand sadness.\nnotes: died instantly.";
                        break;
                    case 2:
                        s = "shot to death by a\ngift that was just given.";
                        break;
                    case 3:
                        s = "manipulated into\nviolent suicide";
                        break;
                    case 4:
                        s = "punched to death in a\ndrug fueled fist fight";
                        break;
                    case 5:
                        s = "stolen from by squirrels\nto the point of no return";
                        break;
                    case 6:
                        s = "died from facial\ninsecurities";
                        break;
                    case 7:
                        s = "alcohol overdose brought\non by peer pressure";
                        break;
                    case 8:
                        s = "died at an unfair\nfoot race";
                        break;
                    case 9:
                        s = "generic conspiracy";
                        break;
                    case 10:
                        s = "got served a diss track\nmade of their own words";
                        break;
                    case 11:
                        s = "kicked to death\n(depsite not having legs)";
                        break;
                    case 12:
                        s = "sucked into a vacuum";
                        break;
                    case 13:
                        s = "shot relentlessly\nin broad daylight";
                        break;
                    case 14:
                        s = "punched to death while\nignoring climate issues";
                        break;
                    case 15:
                        s = "likely killed in bear trap\nnotes: body not recovered";
                        break;
                    case 16:
                        s = "slain by forbidden\nweaponry";
                        break;
                    case 17:
                        s = "forced into nudity\nthen slain by sword";
                        break;
                    case 18:
                        s = "eaten by a shark\nor maybe a rock lobster?";
                        break;
                    case 19:
                        s = "head exploded by science";
                        break;
                    case 20:
                        s = "maimed in a\ndrive by shooting";
                        break;
                    case 21:
                        s = "turned into a tree\nand axed into pieces";
                        break;
                    case 22:
                        //corrupt
                        s = "trapped in a\nlimbo-like hell forever";
                        break;
                    case 23:
                        s = "blinded and incinerated\nby an led flashlight";
                        break;
                    case 24:
                        s = "wait... no plz!";
                        sequencer.updatePlayerMoves([
                            moves["honorable suicide"],
                            moves["senseless murder"]
                        ]);
                        break;
                }
                sequencer.globalBattleState.speechIndex++;
                if(s) {
                    return {
                        speech: `${sequencer.globalBattleState.speechIndex}. ${elves[sequencer.globalBattleState.speechIndex-1].name}\n\n[cause of death]\n${s}${sequencer.globalBattleState.speechIndex<24?"\n\nhow do you plead?":""}`,
                        persist: true
                    }
                }
                return null;
            }
        }
    }

    this.startSpeech = {
        text: "actions have\nconsequences.\n\nit's time to atone\nfor your sins.\nyou are charged with 24\naccounts of murder.",
        persist: true
    }
}
