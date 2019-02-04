"use strict";
function DarkElf() {


    const lightsOnColor = "rgb(114,114,114)";
    const lightsOffColor = "black";

    const setFlashLightChargeText = sequencer => {
        sequencer.playerBattleObject.subText[0] = `${sequencer.playerBattleObject.state.flashLightCharges} of 3 flashlight charges`
    }

    const turnLightsOn = sequencer => {
        sequencer.globalBattleState.lightsJustTurnedOn = true;
        sequencer.globalBattleState.lightsOn = true;
        sequencer.renderer.background.color = lightsOnColor;
        sequencer.renderer.rightHealthBar.backgroundColor = "black";
        sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
    }
    const turnLightsOff = sequencer => {
        sequencer.globalBattleState.lightsJustTurnedOff = true;
        sequencer.globalBattleState.lightsOn = false;
        sequencer.renderer.background.color = lightsOffColor;
        sequencer.renderer.rightHealthBar.backgroundColor = "rgb(44, 33, 33)";
        sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
    }

    const turnLightsOnMove = {
        name: "lights on",
        type: "self",
        process: sequencer => {
            return {
                name: "you turned the lights on",
                action: turnLightsOn
            }
        }
    }
    const turnLightsOffMove = {
        name: "lights off",
        type: "self",
        process: sequencer => {
            return {
                name: "you turned the lights off",
                action: turnLightsOff
            }
        }
    }

    const chargeFlashlightMove = {
        name: "charge flashlight",
        type: "self",
        process: (sequencer,user) => {
            if(user.state.flashLightCharges <= 2) {
                user.state.flashLightCharges++;
                setFlashLightChargeText(sequencer);
                return {
                    text: "+1 flashlight charge"
                }
            } else {
                return {
                    text: "your flashlight can't hold any more charges"
                }
            }
        }
    }

    const flashlightMove = {
        name: "flashlight blast",
        type: "target",
        process: (sequencer,user,target) => {
            if(user.state.flashLightCharges >= 1) {
                target.dropHealth(250);
                user.state.flashLightCharges--;
                sequencer.globalBattleState.shouldBlindElf = true;
                setFlashLightChargeText(sequencer);
                return {
                    speech: "ah! my eyes!\n\ni thought leds\nare banned!",
                    animation: {name:"eyeballMurder"}
                }
            } else {
                return {
                    failed: true,
                    events: [
                        {
                            text: "your flashlight isn't charged"
                        }
                    ]
                }
            }
        }
    }

    addMove({
        name: "ultra punch",
        type: "target",
        process: (sequencer,user,target) => {
            const damage = user.state.atePunchingVitamins ? 200 : 100;
            return {
                action: () => target.dropHealth(damage),
                text: "all that training finally paid off",
                animation:target.isElf?{name:"punch"}:null
            }
        }
    });
    addMove({
        name: "elf punch",
        type: "target",
        process: (sequencer,user,target) => {
            
            return {
                events: [
                    {
                        text: "ouch! where'd an elf learn to punch like that",
                        action: () => target.dropHealth(60)
                    },
                    {
                        text: `${user.name} also got bruised by the impact`,
                        action: () => user.dropHealth(50)
                    }
                ]
            }
        }
    })

    const fumbleMove = {
        name: "stumble around",
        type: "self",
        process: (sequencer,user,target) => {
            if(!user.state.foundVitamins) {
                user.state.foundVitamins = true;
                return {
                    text: "you found some punching vitamins!"
                }
            } else {
                return {
                    text: "you stumbled into a wall but didn't get hurt"
                }
            }
        }
    }

    const noSuchThingAsMagicMove = {
        name: "magic isn't real",
        type: "interface",
        process: (sequencer,user,target) => {
            user.state.magicWasntReal = true;
            sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
            return {
                speech: "now isn't the time\nfor politics!\n\nwe have to battle\nto the death!"
            }
        }
    }
    const magicIsRealMove = {
        name: "magic is real!",
        type: "interface",
        process: (sequencer,user,target) => {
            user.state.magicIsReal = true;
            sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
            return {
                events:[{
                    speech: "i agree with you...\n\nbut...\n\nlet's keep this going\nplease."
                },
                {
                    text: "the magic fairies heard your plea"
                },{
                    text: "you can now use magic band aids"
                }]
            }
        }
    }

    const magicBandAidMove = {
        name: "magic band aid",
        type: "self",
        process: (sequencer,user) => {
            user.addHealth(Math.ceil(user.maxHealth / 4));
            return {
                events: [
                    {
                        text: "you've been healed. praise be! thanks fairies"
                    },
                    {
                        speech: "smh\n\nstupid magic\n\nstupid fairies"
                    }
                ]
            }
        }
    }

    this.loseSpeech = "*turns your sword back\ninto a sword*\n\nthis is only my end.\nyours is just beginning.";
    this.winSpeech = "you will never win.";

    this.getPlayerMoves = sequencer => {
        let playerMoves = [];
        if(sequencer.globalBattleState.lightsOn) {
            let endMove;
            if(sequencer.playerBattleObject.state.magicWasntReal) {
                if(sequencer.playerBattleObject.state.magicIsReal) {
                    endMove = magicBandAidMove;
                } else {
                    endMove = magicIsRealMove;
                }
            } else {
                endMove = noSuchThingAsMagicMove;
            }
            playerMoves = [
                turnLightsOffMove,moves["ultra punch"],chargeFlashlightMove,
                endMove
            ];
        } else {
            playerMoves = [
                turnLightsOnMove,
                flashlightMove,
                sequencer.playerBattleObject.state.foundVitamins ? moves["punching vitamins"] : fumbleMove,
                sequencer.playerBattleObject.state.magicIsReal ? magicBandAidMove: moves["band aid 2.0"]
            ];
        }
        return playerMoves;
    }

    this.setup = sequencer => {
        sequencer.elfBattleObject.subText = ["not in combo"];
        sequencer.elfBattleObject.state.inCombo = false;
        sequencer.elfBattleObject.state.comboIndex = 0;

        sequencer.playerBattleObject.subText = [];
        sequencer.playerBattleObject.state.flashLightCharges = 0;
        setFlashLightChargeText(sequencer);
    }

    const blinkMove = {
        name: "blistering eyeball pain recovery",
        type: "self",
        process: sequencer => {
            sequencer.globalBattleState.shouldBlindElf = false;
            return {
                speech: "why meeeee",
                animation:{name:"crying"}
            }
        }
    }

    this.getMove = sequencer => {
        let elfMoves;
        if(sequencer.globalBattleState.shouldBlindElf) {
            return blinkMove;
        }
        if(sequencer.globalBattleState.lightsOn) {
            elfMoves = [
                moves["elf punch"],
                moves["elf punch"],
                sequencer.elfBattleObject.state.inCombo ? moves["tainted holiday"] : moves["i hate santa"]
            ];
        } else {
            if(sequencer.elfBattleObject.state.inCombo) {
                if(sequencer.elfBattleObject.state.comboIndex === 0) {
                    return moves["tainted holiday"]
                } else if(sequencer.elfBattleObject.state.comboIndex === 1) {
                    return moves["pure hatred"];
                }
            } else {
                return moves["i hate santa"];
            }
        }
        return elfMoves[sequencer.turnNumber%elfMoves.length];
    }

    this.getDefaultGlobalState = () => {
        return {
            lightsJustTurnedOff: false,
            lightsJustTurnedOn: false,
            lightsOn: true,
            postTurnProcess: sequencer => {
                if(sequencer.globalBattleState.lightsJustTurnedOn) {
                    sequencer.globalBattleState.lightsJustTurnedOn = false;
                    const lightOnSpeeches = ["awe\ni was just getting used\nto the darkness","finally!\ni can see again"];
                    const speech = lightOnSpeeches[Math.floor(Math.random()*lightOnSpeeches.length)];
                    if(speech) {
                        return {
                            speech: speech
                        }
                    }
                } else if(sequencer.globalBattleState.lightsJustTurnedOff) {
                    sequencer.globalBattleState.lightsJustTurnedOff = false;
                    const lightOffSpeeches = ["hello darkness...\nmy old friend","hey!\nwho turned\nout the lights?","is it dark in here\nor is it just me?"];
                    const speech = lightOffSpeeches[Math.floor(Math.random()*lightOffSpeeches.length)];
                    if(speech) {
                        return {
                            speech: speech
                        }
                    }
                }
                return null;
            }
        }
    }

    this.startSpeech = {
        text: "wanna see some\n'dark magic'?\n*turns your elfmart\nsword into a flashlight*\n\noh... whoops.\nthat was light magic."
    }

    this.foregroundColor = "rgb(173, 50, 50)";

    this.startText = "caution: elf punch doesn't break combos!";

    this.name = "dark elf";
    this.background = "background-2";
    this.backgroundColor = lightsOnColor;
    this.health = 800;
    this.playerHealth = 250;

}
