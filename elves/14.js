"use strict";
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

        if(lastLocation.postAction) {
            lastLocation.postAction();
        }

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
    name: "buy treaty - 100 coins",
    type: "option",
    process: (sequencer,user) => {

        if(user.state.ownsTreaty) {
            return {
                failed: true,
                text: "you already have a treaty"
            }
        }

        const price = 100;
        if(user.state.money >= price) {
            user.state.money -= price;
            user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s":""}`;

            if(!user.state.ownsTreaty) {
                user.state.ownsTreaty = true;
            }
        } else {
            return {
                failed: true,
                text: "you don't have enough coins"
            }
        }
    }
});
addMove({
    name: "buy love - 999 coins",
    type: "option",
    process: (sequencer,user) => {

        if(user.state.ownsLove) {
            return {
                failed: true,
                text: "you already bought love"
            }
        }

        const price = 999;
        if(user.state.money >= price) {
            user.state.money -= price;
            user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s":""}`;

            if(!user.state.ownsLove) {
                user.state.ownsLove = true;
            }

            return {
                text: "you received love"
            }
        } else {
            return {
                failed: true,
                text: "you don't have enough coins"
            }
        }
    }
});
addMove({
    name: "buy matter - 1 coin",
    type: "option",
    process: (sequencer,user) => {
        const price = 1;
        if(user.state.money >= price) {
            user.state.money -= price;
            user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s":""}`;

            if(!user.state.ownsMatter) {
                user.state.ownsMatter = true;
                user.state.matter = 1;
            } else {
                user.state.matter++;
            }

            return {
                text: "you received 1 matter"
            }
        } else {
            return {
                failed: true,
                text: "you don't have enough coins"
            }
        }
    }
});
addMove({
    name: "buy a thing - 2 coins",
    type: "option",
    process: (sequencer,user) => {
        const price = 2;
        if(user.state.money >= price) {
            user.state.money -= price;
            user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s":""}`;

            if(!user.state.ownsAThing) {
                user.state.ownsAThing = true;
                user.state.things = 1;
            } else {
                user.state.things++;
            }

            return {
                text: "you received 1 thing"
            }
        } else {
            return {
                failed: true,
                text: "you don't have enough coins"
            }
        }
    }
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
        
        sequencer.updatePlayerMoves(oldTimeyMoveTree.highNoon(sequencer));

        user.subText = sequencer.globalBattleState.subTexts.highNoon;
        
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;
        user.subText[1] = `${user.state.bullets} bullet${user.state.bullets === 1 ? "" : "s"}`;
        user.subText[2] = `${user.state.loadedBullets} loaded`;
        if(user.state.freshSpin) {
            user.subText[3] = "spun";
        } else {
            user.subText[3] = "not spun";
        }

        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "highNoon";
        return null;
    }
});
addMove({
    name: "down some whiskey",
    type: "self",
    process: (sequencer,user) => moves["drink alchohol"].process(sequencer,user)
});
addMove({
    name: "fist fight - win coins!",
    type: "interface",
    process: (sequencer,user) => {
        sequencer.globalBattleState.timeFreeze = true;
        sequencer.globalBattleState.saloonFisting = true;

        sequencer.globalBattleState.backStack.push({
            name: "saloon",
            subText: user.subText,
            postAction: () => {
                sequencer.globalBattleState.timeFreeze = false;
                sequencer.globalBattleState.saloonFisting = false;
                sequencer.globalBattleState.saidFistFightStart = false;
            }
        });
        
        sequencer.updatePlayerMoves(oldTimeyMoveTree.fistFight(sequencer));

        user.subText = sequencer.globalBattleState.subTexts.fistFight;
        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;
        user.subText[1] = "in a bar fight";

        sequencer.globalBattleState.playerInterfaced = true;
        sequencer.globalBattleState.currentPlace = "fistFight";
        return null;
    }
});
addMove({
    name: "gamble all your coins",
    type: "interface",
    process: (sequencer,user) => {
        if(user.state.money <= 0) {
            return {
                failed: true,
                events: [{
                    text: "you don't have any coins"
                },
                {
                    text: "the raffle is rolled at 6 in the evening"
                }]
            }
        }
        return {
            events: [
                {
                    text: `${user.name} bought ${user.state.money} raffle ticket${user.state.money !== 1 ? "s" : ""}`,
                    action: () => {
                        if(!(sequencer.globalBattleState.raffleAmount >= 0)) {
                            sequencer.globalBattleState.raffleAmount = 0;
                        }
                        sequencer.globalBattleState.raffleAmount += user.state.money;
                        user.state.money = 0;
                        user.subText[0] = `${user.state.money} coin${user.state.money !== 1 ? "s" : ""}`;
                    }
                },
                {
                    text: "the raffle is rolled at 6 in the evening"
                }
            ]
        }
    }
});
addMove({
    name: "sober punch",
    type: "target",
    process: (sequencer,user,target) => {
        target.dropHealth(9);
        return {
            failed: false,
            text: "being lit would've helped",
            animation:{name:"punch"}
        }
    }
});
addMove({
    name: "throw stool",
    type: "target",
    process: (sequencer,user,target,stoolBypass=false) => {
        if(!stoolBypass) {
            if(sequencer.globalBattleState.stools >= 1) {
                sequencer.globalBattleState.stools--;
            } else {
                return {
                    failed: true,
                    events: [
                        {
                            text: "the saloon is out of stools. sorry."
                        },
                        {
                            text: "(stools restock at 1 in the morning)"
                        }
                    ]
                }
            }
        }
        return {
            events: [
                {
                    text: "it was a big stool",
                    action: () => target.dropHealth(35)
                },
                {
                    text: `${sequencer.globalBattleState.stools} stool${sequencer.globalBattleState.stools !== 1?"s":""} left`
                }
            ]
        }
    }
});
addMove({
    name: "sling a thing",
    type: "target",
    process: (sequencer,user,target) => {
        if(user.state.things >= 1) {
            user.state.things--;
            return {
                events: [
                    ...turboTextIncremental(sequencer,"what a neat thing","and awayyyyyyyyyyy it goes"),
                    {
                        text: "oof! that's gonna leave a mark",
                        action: () => target.dropHealth(50)
                    },
                    {
                        text: `${user.name} have ${user.state.things} thing${user.state.things !== 1?"s":""} left`
                    }
                ]
            }
        } else {
            return {
                text: "but you are out of things"
            }
        }
    }
});
addMove({
    name: "mad matter",
    type: "target",
    process: (sequencer,user,target) => {
        if(user.state.matter >= 1) {
            user.state.matter--;
            return {
                events: [
                    {
                        text: "the matter took the form of a stool"
                    },
                    {
                        text: `${user.name} used throw stool`
                    },...moves["throw stool"].process(sequencer,user,target,true).events,
                    {
                        text: `${user.name} have ${user.state.matter} matter left`
                    }
                ]
            }
        } else {
            return {
                text: "but you are out of matter"
            }
        }
    }
});
addMove({
    name: "peace treaty",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            events: [
                {
                    text: `${user.name} hand ${target.name} the treaty`
                },
                {
                    text: "!",
                    action: () => target.dropHealth(target.maxHealth)
                },
                {
                    text: "yikes! it was laced with anthrax"
                },
                {
                    text: "i guess we have a winner!"
                }
            ]
        }
    }
});
addMove({
    name: "drop em",
    type: "target",
    process: (sequencer,user,target) => {
        const eventStack = [];
        const sounds = ["*pcheng*","whiz*","*plonk*","*ping*","*ahhh!*","*blargh!*"];

        const shotCount = Math.floor(Math.random() * 6) + 1;

        for(let i = 0;i<shotCount;i++) {
            eventStack.push({
                text: sounds[i%sounds.length],
                action: () => target.dropHealth(10)
            });
        }
        
        eventStack.push({
            text: `${user.name} fired ${shotCount} shot${shotCount !== 1 ? "s" : ""} at you`
        });

        return {
            events: events
        }
    }
});
addMove({
    name: "drunken shot",
    type: "target",
    process: (sequencer,user,target) => {
        if(Math.random() > 0.5) {
            return {
                failed: true,
                text: "but their shot missed!"
            }
        } else {
            return {
                text: "their shot hit you!",
                action: () => target.dropHealth(Math.ceil(target.maxHealth / 2))
            }
        }
    }
});
addMove({
    name: "snake in ur boot",
    type: "target",
    process: (sequencer,user,target) => {
        if(Math.random() > 0.5) {
            return {
                text: "you fell for it and hit a rock",
                action: () => target.dropHealth(5)
            }
        } else {
            return {
                text: "you saw through the drunken lie"
            }
        }
    }
});
addMove({
    name: "sip whiskey",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: `${user.name} sips ${user.isPlayer ? "your" : "their"} whiskey`
        }
    }
});
addMove({
    name: "f**k off",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            events: [
                {
                    text: `${user.name} passed ${target.name} the whiskey`
                },
                ...moves["drink alchohol"].process(sequencer,target,user)
            ]
        }
    }
});

function OldTimeyElf() {
    const oldTimeyMoveTree = {
        fistFight: sequencer => {
            if(sequencer.playerBattleObject.state.ownsLove) {
                return [
                    moves["big hug"],
                    moves["big hug"],
                    moves["big hug"],
                    moves["big hug"]
                ]
            }
            const fightMoves = [
                sequencer.playerBattleObject.state.isLit ? moves["drunken punch"] : moves["sober punch"],
                moves["throw stool"]
            ];
            if(sequencer.playerBattleObject.state.ownsAThing) {
                fightMoves.push(moves["sling a thing"]);
            }
            if(sequencer.playerBattleObject.state.ownsMatter) {
                fightMoves.push(moves["mad matter"]);
            }
            return fightMoves;
        },
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
            moves["down some whiskey"],
            moves["fist fight - win coins!"],
            moves["gamble all your coins"],
            moves["leave"]
        ],
        highNoon: sequencer => sequencer.playerBattleObject.ownsTreaty ?
            [moves["retreat"],moves["peace treaty"]]:
    
            [moves["retreat"],
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

    this.name = "old timey elf";
    this.background = "background-1";
    this.backgroundColor = "rgb(183,164,145)";

    this.getMove = sequencer => {
        if(sequencer.globalBattleState.playerInterfaced) {
            return null;
        }
        if(sequencer.globalBattleState.saloonFisting) {
            if(!sequencer.elfBattleObject.state.isLit || !sequencer.elfBattleObject.state.isSuperLit) {
                const move = Math.random() < 0.75 ? moves["down some whiskey"] : moves["decent punch"];
                return move;
                
            }
            return moves["drunken punch"];
        }
        if(sequencer.globalBattleState.currentPlace === "highNoon") {
            const movePool = ["f**k off","sip whiskey","snake in ur boot","drunken shot","drop em"];
            return moves[movePool[Math.floor(Math.random()*movePool.length)]];
        }
        return null;
    };
    
    this.health = 200;

    this.startSpeech = {
        text: "howdy...\nthat's a cool gun...\n\nseen it somewhere\nbefore\n\ni'll be at the saloon"
    };

    this.startText = "you dust off your old revolver";

    this.setup = sequencer => {
        sequencer.elfBattleObject.subText = [timeOfDayLookup[
            sequencer.globalBattleState.time
        ]];

        sequencer.playerBattleObject.state.bullets = 0;
        sequencer.playerBattleObject.state.loadedBullets = 0;

        sequencer.playerBattleObject.state.money = 0;
        sequencer.playerBattleObject.subText = [`${sequencer.playerBattleObject.state.money} coin${sequencer.playerBattleObject.state.money !== 1 ? "s" : ""}`];

        Object.keys(sequencer.globalBattleState.moveTree).forEach(
            key => {
                sequencer.globalBattleState.subTexts[key] = ["<coin schema - this is an error>"];
            }
        );
    };

    this.getDefaultGlobalState = () => {
        return {
            time: 6,
            timeFreeze: false,
            backStack: [],
            moveTree: oldTimeyMoveTree,
            subTexts: {},
            stools: 3,
            postTurnProcess: sequencer => {
                const playerJustInterfaced = sequencer.globalBattleState.playerInterfaced;
                sequencer.globalBattleState.playerInterfaced = false;

                const timeFrozen = sequencer.globalBattleState.timeFreeze || sequencer.globalBattleState.currentPlace === "highNoon";

                if(!timeFrozen) {

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

                if(sequencer.globalBattleState.saloonFisting) {
                    if(!sequencer.globalBattleState.saidFistFightStart) {
                        sequencer.globalBattleState.saidFistFightStart = true;
                        return {
                            speech: "hello - again...\nhere for some coins?\n\nbring it"
                        }
                    }
                    if(sequencer.elfBattleObject.health <= 65) {
                        return {
                            events: [
                                {
                                    text: "whoa! take it easy on him"
                                },
                                {
                                    text: "the bartender attends to his bruises",
                                    action: () => sequencer.elfBattleObject.addHealth(
                                        sequencer.elfBattleObject.maxHealth
                                    )
                                },
                                {
                                    text: "(and to yours)",
                                    action: () => sequencer.playerBattleObject.addHealth(
                                        sequencer.playerBattleObject.maxHealth
                                    )
                                },
                                {
                                    text: "you are awarded 10 coins for kicking a**",
                                    action: () => {
                                        sequencer.playerBattleObject.state.money += 10;
                                        const money = sequencer.playerBattleObject.state.money;
                                        sequencer.playerBattleObject.subText[0] = `${money} coin${money!==1?"s":""}`;

                                        moves["go back"].process(sequencer,sequencer.playerBattleObject);
                                    }
                                }
                            ]
                        }
                    }
                    if(sequencer.playerBattleObject.health <= 30) {
                        return {
                            events: [
                                {
                                    text: "okay! that's enough"
                                },
                                {
                                    text: "the bartender attends to your bruises",
                                    action: () => sequencer.playerBattleObject.addHealth(
                                        sequencer.playerBattleObject.maxHealth
                                    )
                                },
                                {
                                    text: "(and to old timey elf's)",
                                    action: () => sequencer.elfBattleObject.addHealth(
                                        sequencer.elfBattleObject.maxHealth
                                    )
                                },
                                {
                                    text: "you are awarded 5 coins for trying",
                                    action: () => {
                                        sequencer.playerBattleObject.state.money += 5;
                                        const money = sequencer.playerBattleObject.state.money;
                                        sequencer.playerBattleObject.subText[0] = `${money} coin${money!==1?"s":""}`;

                                        moves["go back"].process(sequencer,sequencer.playerBattleObject);
                                    }
                                }
                            ]
                        }
                    }
                }

                if(!timeFrozen) {
                    if(sequencer.globalBattleState.time === 1) {
                        if(sequencer.globalBattleState.stools < 3) {
                            sequencer.globalBattleState.stools = 3;
                            return {
                                text: "the saloon got new stools!"
                            }
                        }
                    }
                    if(sequencer.globalBattleState.time === 0) {

                        sequencer.elfBattleObject.state.isLit = false;
                        sequencer.elfBattleObject.state.isSuperLit = false;
                        sequencer.elfBattleObject.state.alchoholWarning = false;

                        if(sequencer.playerBattleObject.state.isLit || sequencer.playerBattleObject.state.isSuperLit) {
                            sequencer.playerBattleObject.state.isLit = false;
                            sequencer.playerBattleObject.state.isSuperLit = false;
                            sequencer.playerBattleObject.state.alchoholWarning = false;
                            return {
                                events: [
                                    {
                                        text: "new day - new you"
                                    },
                                    {
                                        text: "the effects of daytime drinking wore off"
                                    }
                                ]
                            }
                        }
                    }

                    if(sequencer.globalBattleState.time === 18 && sequencer.globalBattleState.raffleAmount) {
                        sequencer.globalBattleState.raffleAmount = 0;
                        const winChance = sequencer.globalBattleState.raffleAmount * 0.01;
                        const winEvents = Math.random() < winChance ? [{
                            text: "the human dude!",
                            action: () => {
                                sequencer.playerBattleObject.money += 100;
                                sequencer.playerBattleObject.subText[0] = `${money} coin${money!==1?"s":""}`;
                            }
                        },{
                            text: "you got 100 coins! nice!"
                        }] : [{
                            text: "old timey elf!"
                        },{
                            text: "he got 100 coins. better luck next time!"
                        }];
                        return {
                            events: [
                                {
                                    text: "it is 6 o' clock!"
                                },...turboTextIncremental(sequencer,"the results are in","the winner isssssssss......"),
                                ...winEvents
                            ]
                        }
                    }

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
    };

    this.playerMoves = [...oldTimeyMoveTree.home,moves["stall"]];
}
