addMove({
    name: "visit general store",
    type: "interface",
    process: (sequencer,user) => {
        sequencer.globalBattleState.backStack.push({
            name: "home",
            subText: user.subText
        });
        sequencer.updatePlayerMoves(oldTimeyMoveTree.generalStore);

        user.subText = [];
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;
        user.subText[1] = "at the general store";

        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "generalStore";
        return null;
    }
});
addMove({
    name: "visit specific store",
    type: "interface",
    process: (sequencer,user) => {
        sequencer.globalBattleState.backStack.push({
            name: "home",
            subText: user.subText
        });
        sequencer.updatePlayerMoves(oldTimeyMoveTree.specificStore);

        user.subText = [];
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`
        user.subText[1] = "at the specific store";


        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "specificStore";
        return null;
    }
});
addMove({
    name: "visit saloon",
    type: "interface",
    process: (sequencer,user) => {
        sequencer.globalBattleState.backStack.push({
            name: "home",
            subText: user.subText
        });
        sequencer.updatePlayerMoves(oldTimeyMoveTree.saloon);

        user.subText = [];
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`
        user.subText[1] = "at the saloon";

        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "saloon";
        return null;
    }
});

addMove({
    name: "go back",
    type: "interface",
    process: (sequencer,user) => {
        const lastLocation = sequencer.globalBattleState.backStack.pop();
        sequencer.updatePlayerMoves(sequencer.globalBattleState.moveTree[
            lastLocation.name
        ]);

        sequencer.globalBattleState.subTexts[sequencer.globalBattleState.currentPlace] = user.subText;

        user.subText = sequencer.globalBattleState.subTexts[lastLocation.name];

        user.subText = lastLocation.subText;
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;
        sequencer.globalBattleState.playerInterfaced = true;

        sequencer.globalBattleState.currentPlace = lastLocation.name;
        return null;
    }
});
addMove({
    name: "leave",
    type: "interface",
    process: (sequencer,user) => moves["go back"].process(sequencer,user)
});
addMove({
    name: "retreat",
    type: "interface",
    process: (sequencer,user) => moves["go back"].process(sequencer,user)
});

addMove({
    name: "buy treaty - 100 coins"
});
addMove({
    name: "buy love - 999 coins"
});
addMove({
    name: "buy matter - 1 coin"
});
addMove({
    name: "buy a thing - 2 coins"
});
addMove({
    name: "buying in and of itself",
    type: "option",
    process: (sequencer,user,target) => moves["multiverse"].process(sequencer,user,target)
});

addMove({
    name: "high noon",
    type: "interface",
    process: (sequencer,user) => {
        sequencer.globalBattleState.backStack.push({
            name: "home",
            subText: user.subText
        });
        sequencer.updatePlayerMoves(oldTimeyMoveTree.highNoon);

        user.subText = sequencer.globalBattleState.subTexts.highNoon;
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;

        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "highNoon";
        return null;   
    }
});

const oldTimeyMoveTree = {
    home: [
        moves["visit general store"],
        moves["visit specific store"],
        moves["visit saloon"]
    ],
    specificStore: [
        moves["buy bullet - 5 coins"],
        moves["buy treaty - 100 coins"],
        moves["buy love - 999 coins"],
        moves["leave"]
    ],
    generalStore: [
        moves["buy matter - 1 coin"],
        moves["buy a thing - 2 coins"],
        moves["buying in and of itself"],
        moves["leave"]
    ],
    saloon: [
        moves["leave"]
    ],
    highNoon: [
        moves["retreat"],
        moves["load chamber"],
        moves["spin chamber"],
        moves["boom"]
    ]
}

const timeOfDayLookup = {
    0:"midnight",
    1:"1 in the black of night",
    2:"2 in the black of night",
    3:"3 in the black of night",
    4:"4 in the morning",
    5:"5 in the morning",
    6:"6 in the morning",
    7:"7 in the morning",
    8:"8 in the morning",
    9:"9 in the morning",
    10:"10 in the late morning",
    11:"11 in the late morning",
    12:"high noon",
    13:"1 in the afternoon",
    14:"2 in the afternoon",
    15:"3 in the early evening",
    16:"4 in the evening",
    17:"5 in the evening",
    18:"6 in the evening",
    19:"7 at night",
    20:"8 at night",
    21:"9 at night",
    22:"10 at night",
    23:"11 at night"
};

elves[13] = {
    name: "old timey elf",
    background: "background-1",
    backgroundColor: "rgb(183,164,145)",

    getMove: sequencer => {
        if(sequencer.globalBattleState.playerInterfaced) {
            return null;
        }

        return null;
    },
    
    health: 200,

    startSpeech: {
        text: "howdy...\nthat's a cool gun...\n\nseen it somewhere\nbefore\n\ni'll be at the saloon"
    },

    startText: "you dust off your old revolver",

    setup: sequencer => {
        sequencer.elfBattleObject.subText = [timeOfDayLookup[
            sequencer.globalBattleState.time
        ]];

        sequencer.playerBattleObject.state.money = 0;
        sequencer.playerBattleObject.subText = [`${sequencer.playerBattleObject.state.money} coin${sequencer.playerBattleObject.state.money !== 1 ? "s" : ""}`];

        Object.keys(sequencer.globalBattleState.moveTree).forEach(
            key => {
                sequencer.globalBattleState.subTexts[key] = ["<coin schema>"];
            }
        );
    },

    getDefaultGlobalState: () => {
        return {
            time: 6,
            timeFreeze: false,
            backStack: [],
            moveTree: oldTimeyMoveTree,
            subTexts: {},
            postTurnProcess: sequencer => {
                const playerJustInterfaced = sequencer.globalBattleState.playerInterfaced;
                sequencer.globalBattleState.playerInterfaced = false;

                if(!(sequencer.globalBattleState.timeFreeze || sequencer.globalBattleState.currentPlace === "highNoon")) {

                    sequencer.globalBattleState.time += 1;
                    sequencer.globalBattleState.time %= 24;
    
                    sequencer.elfBattleObject.subText[0] = timeOfDayLookup[
                        sequencer.globalBattleState.time
                    ];
    
                }

                if(sequencer.globalBattleState.backStack.length === 0) {
                    if(sequencer.globalBattleState.time === 12) {
                        sequencer.updatePlayerMoves(
                            [...sequencer.globalBattleState.moveTree.home,moves["high noon"]]
                        );
                    } else {
                        sequencer.updatePlayerMoves(
                            [...sequencer.globalBattleState.moveTree.home,moves["stall"]]
                        );
                    }
                }

                if(sequencer.globalBattleState.currentPlace !== "highNoon") {
                    if(sequencer.globalBattleState.time === 10) {
                        return {
                            text: "2 hours until high noon"
                        }
                    } else if(sequencer.globalBattleState.time === 12) {
                        return {
                            text: "it is high noon"
                        }
                    }
                }

                return null;

            }
        }
    },

    playerMoves: [...oldTimeyMoveTree.home,moves["stall"]]
}
