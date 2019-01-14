const getRaceProgressSubText = progress => {
    const raceString = "------------";
    for(let i = 0;i<progress;i++) {
        raceString[i] = "+";
    }
    return `start${raceString}end`;
}
addMove({
    name: "tie shoes",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.tiedShoes) {
            return {
                failed: true,
                text: `but ${oposv(user)} shoes are already tied`
            }
        } else {
            user.state.tiedShoes = true;
            return {
                text: `${user.name} tied ${oposv(user)} shoes`
            }
        }
    }
});
addMove({
    name: "untie shoes",
    type: "self",
    process: (sequencer,user) => {
        if(!user.state.tiedShoes) {
            return {
                failed: true,
                text: `but ${oposv(user)} shoes are already untied`
            }
        } else {
            user.state.tiedShoes = false;
            return {
                text: `${user.name} untied ${oposv(user)} shoes`
            }
        }
    }
});
addMove({
    name: "take drugs",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.tookDrugs) {
            user.dropHealth(user.maxHealth);
            return {
                text: `${user.name} overdosed`
            }
        } else {
            user.state.tookDrugs = true;
            return {
                events: [
                    {
                        text: `${user.name} took some drugs`
                    },
                    {
                        text: `${user.name} ${overb(user)} ready for anything`
                    }
                ]
            }
        }
    }
})

addMove({
    name: "go barefoot",
    type: "self",
    process: (sequencer,user) => moves["ready up"].process(sequencer,user)
});
addMove({
    name: "ready up",
    type: "self",
    process: (sequencer,user) => {
        sequencer.globalBattleState.stage = "starting line";
        return {
            text: `${user.name} ${overb(user)} ready to race`
        }
    }
});
addMove({
    name: "stall",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: `${user.name} ${overb(user)} stalling for no reason`
        }
    }
});
addMove({
    name: "bring water",
    type: "self",
    process: (sequencer,user) => {
        user.state.broughtWater = true;
        return {
            text: `${user.name} ${overb(user)} bringing water`
        }
    }
});
addMove({
    name: "wake up",
    type: "self",
    process: (sequencer,user) => {
        user.state.isNapping = false;
        return {
            text: `${user.name} woke up`
        }
    }
});
addMove({
    name: "zzzzzzz",
    type: "self",
    process: (sequencer,user) => {
        return turboTextIncremental(
            sequencer,
            `${user.name} continue${user.isElf ? "s" : ""} to sleep`,
            "zzzzzzzzzzzzzzzzzzzzzzzzz"
        )
    }
});
addMove({
    name: "start running",
    type: "self",
    process: (sequencer,user) => {
        sequencer.globalBattleState.stage = "stage1"
        return {
            text: "let the race begin!"
        }
    }
});
addMove({
    name: "take a nap",
    type: "self",
    process: (sequencer,user) => {
        user.state.tookANap = true;
        user.state.isNapping = true;
        return {
            text: `${user.name} fell asleep`
        }
    }
});
addMove({
    name: "stay on path",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "find shortcut",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "poke bear",
    type: "self",
    process: (sequencer,user) => {

    }
})
addMove({
    name: "distracting thoughts",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "trip elf",
    type: "target",
    process: (sequencer,self,target) => {

    }
});
addMove({
    name: "go turbo",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "trash talk",
    type: "target",
    process: (sequencer,self,target) => {

    }
});
addMove({
    name: "call an uber",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "self destruct",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "peaceful pace",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "use a driving piano",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "calm mind",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "break ankle",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "pedal to the metal",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "rip clothes off",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "overheat and die",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "stay on path",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "sportsmanship",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "reconsider taking drugs",
    type: "self",
    process: (sequencer,user) => moves["take drugs"].process(sequencer,user)
});
addMove({
    name: "try to stay strong",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "drink water",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "find pond",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "finish race",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "admit drug use",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "stretch",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "hydrate",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "perseverance",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "elf trot",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "steady pace",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "congrats",
    type: "self",
    process: (sequencer,user) => {

    }
});
addMove({
    name: "take more drugs",
    type: "self",
    process: (sequencer,user) => moves["take drugs"].process(sequencer,user)
});
addMove({
    name: "short rest",
    type: "self",
    process: (sequencer,user) => {
        
    }
})
const getRaceMoveSet = (sequencer,index) => {
    const raceMoves = [
        () => {
            const theseMoves = [//0
                sequencer.playerBattleObject.state.tiedShoes ?
                    moves["untie shoes"]: moves["tie shoes"],
                    
                sequencer.playerBattleObject.state.tiedShoes ?
                    moves[sequencer.playerBattleObject.state.tookDrugs ? "take more drugs" : "take drugs"] : moves["go barefoot"],

                moves["ready up"],

                sequencer.playerBattleObject.state.broughtWater ?
                    moves["stall"] : moves["bring water"]
            ]
            return theseMoves;
        },
        () => sequencer.playerBattleObject.state.isNapping? [//1
            moves["wake up"],
            moves["zzzzzzz"],
            ]:[
            moves["start running"],
            moves["take a nap"],
            sequencer.playerBattleObject.state.tookDrugs ?
                moves["take more drugs"] : moves["take drugs"]
        ],
        () => [//2
            moves["stay on path"],
            moves["find shortcut"],
        ],
        () => [//3
            moves["stay on path"],
            moves["poke bear"],
        ],
        () => [//4
            moves["stay on path"],
            moves["distracting thoughts"]
        ],
        () => [//5
            moves["trip elf"],
            moves["go turbo"],
        ],
        () => [//6
            moves["trash talk"],
            moves["call an uber"],
        ],
        () => [//7
            moves["self destruct"],
            moves["peaceful pace"],
        ],
        () => [//8
            moves["use a driving piano"],
            moves["calm mind"]
        ],
        () => [//9
            moves["break ankle"],
            moves["pedal to the metal"]
        ],
        () => [//10
            moves["rip clothes off"],
            moves["overheat and die"]
        ],
        () => {//11
            const theseMoves = [moves["stay on path"],moves["sportsmanship"]];
            if(!sequencer.playerBattleObject.state.tookDrugs) {
                lastMoves.push(moves["reconsider taking drugs"]);
            }
            return theseMoves;
        },
        () => {//12
            const theseMoves = [
                moves["try to stay strong"],
                sequencer.playerBattleObject.state.broughtWater ? moves["drink water"] : moves["find pond"]
            ];
            return theseMoves;
        },
        () => {//13
            const lastMoves = [moves["finish race"],moves["give up"]];
            if(sequencer.playerBattleObject.state.tookDrugs) {
                lastMoves.push(moves["admit drug use"]);
            }
            return lastMoves;
        }
    ];
    console.log(raceMoves,index);
    return raceMoves[index]();
}

elves[8] = {
    name: "headless elf",
    background: "background-1",
    backgroundColor: "orange",
    health: 200,
    getMove: sequencer => {
        if(sequencer.playerBattleObject.reachedFinish) {
            return sequencer.playerBattleObject.trippedElf ? moves["trash talk"] : moves["congrats"]
        } else {
            switch(sequencer.globalBattleState.stage) {
                case "readying to go":
                case "starting line":
                    const startingLineMoves = [sequencer.elfBattleObject.state.tiedShoes ? "untie shoes" : "tie shoes","stretch","hydrate"];
                    return moves[startingLineMoves[sequencer.turnNumber % startingLineMoves.length]];
                default:
                    const elfMoves = ["perseverance","elf trot","steady pace","elf trot","short rest"];
                    return moves[elfMoves[sequencer.turnNumber % elfMoves.length]];
            }
        }
    },
    getPlayerMoves: sequencer => getRaceMoveSet(sequencer,0),
    setup: sequencer => {
        sequencer.playerBattleObject.subText = [getRaceProgressSubText(0)];
        sequencer.elfBattleObject.subText = [getRaceProgressSubText(0)];
    },
    startText: "time to get your head in the game",
    startSpeech: {
        text: "ever beat a headless elf\nin a foot race?"
    },
    getDefaultGlobalState: () => {
        return {
            stage: "readying to go",
            postTurnProcess: sequencer => {
                switch(sequencer.globalBattleState.stage) {
                    case "readying to go":
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,0)
                        );
                        break;
                    case "starting line":
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,1)
                        );
                        break;
                    case "stage1":
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,2)
                        );
                        break;
                }
            }
        }
    }
}
