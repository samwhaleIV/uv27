const getRaceProgressSubText = progress => `${progress} race points`
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
    process: (sequencer,user) => {
        user.state.barefoot = true;
        return moves["ready up"].process(sequencer,user);
    }
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
        return {
            events: turboTextIncremental(
                sequencer,
                `${user.name} continue${user.isElf ? "s" : ""} to sleep`,
                "zzzzzzzzzzzzzzzzzzzzzzzzz"
            )
        }
    }
});
addMove({
    name: "start running",
    type: "self",
    process: (sequencer,user) => {
        sequencer.globalBattleState.stage = 1;
        user.state.raceProgress++;
        if(user.state.tookDrugs) {
            user.state.raceProgress++;
        }
        user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
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
        if(!user.state.tiedShoes || user.state.barefoot) {
            if((user.isPlayer && Math.random() > 0.8) || (user.isElf && Math.random() > 0.9)) {
                if(user.state.barefoot) {
                    user.dropHealth(user.maxHealth);
                    return {
                        text: `${user.name} stepped on a nail with ${user.isElf?"their":"your"} bare foot`
                    }
                } else {
                    user.dropHealth(user.maxHealth);
                    return {
                        text: `${user.name} tripped on their shoelaces`
                    }
                }
            }
        }
        if(!(user.state.raceProgress >= 0)) {
            user.state.raceProgress = 0;
        }
        user.state.raceProgress++;
        if(user.state.goingTurbo) {
            user.state.raceProgress++;
        }
        if(user.state.tookDrugs) {
            user.state.raceProgress++;
        }
        if(user.state.stretches >= 1) {
            user.state.raceProgress += user.state.stretches;
        }
        user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
        return {
            text: `${user.name} stay${user.isElf?"s":""} on the path`
        }
    }
});
addMove({
    name: "find shortcut",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.barefoot) {
            user.dropHealth(user.maxHealth);
            return {
                text: `${user.name} got ${user.isPlayer ? "your" : "their"} bare feet stuck in a bear trap`
            }
        } else if(!user.state.tiedShoes) {
            user.dropHealth(user.maxHealth);
            if(user.isElf) {
                return {
                    text: `${user.name}'${user.name.endsWith("s")?"":"s"} shoelaces got stuck in mud`
                }
            } else {
                return {
                    text: "your shoelaces got stuck in a mud"
                }
            }
        }
        if(user.state.goingTurbo) {
            user.dropHealth(user.maxHealth);
            return {
                text: `${user.name} hit a tree and died`
            }
        }
        if(Math.random() > 0.5) {
            user.state.raceProgress += 2;
            user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
            return {
                text: `${user.name} found a great shortcut!`
            }
        } else {
            user.dropHealth(user.maxHealth);
            return {
                failed: true,
                text: `${user.name} found a bottomless pit and died`
            }
        }
    }
});
addMove({
    name: "poke bear",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [{
                text: `${user.name} poked a bear`,
            },{
                text: "this was a stupid idea"
            },{
                text: "obviously the bear will attack back"
            },{
                text: `${user.name} got mauled to death`,
                action: () => user.dropHealth(user.maxHealth)
            },{
            }]
        }
    }
})
addMove({
    name: "distracting thoughts",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: "there's a time and place but not now!"
        }
    }
});
addMove({
    name: "trip elf",
    type: "target",
    process: (sequencer,user,target) => {
        user.state.trippedElf = true;
        target.state.raceProgress-=2;
        if(target.state.raceProgress < 0) {
            target.state.raceProgress = 0;
        }
        target.dropHealth(Math.floor(target.maxHealth * 0.15));
        target.subText[0] = getRaceProgressSubText(target.state.raceProgress);
        return {
            text: `${user.name} tripped ${target.name}. how rude!`
        }
    }
});
addMove({
    name: "go turbo",
    type: "self",
    process: (sequencer,user) => {
        user.state.goingTurbo = true;
        return {
            text: `${user.name} ${overb(user)} emulating sonic`
        }
    }
});
addMove({
    name: "trash talk",
    type: "target",
    process: (sequencer,user,target) => {
        user.state.trashTalked = true;
        return {
            events: [{
                text: "wow jeez these words are harsh"
            },
            {
                text: "*censored due to profanity*"
            },
            {
                text: "i am ashamed to be a narrator"
            },
            {
                text: "i have standards"
            },
            {
                text: "and you feed me this garbage?"
            },
            {
                text: "*super bad words and racial epithet*"
            },
            {
                text: "w o w"
            },
            {
                text: "this is a race folks - let's be civil"
            }
            ]
        }
    }
});
addMove({
    name: "call an uber",
    type: "self",
    process: (sequencer,user) => {
        return {
            failed: true,
            text: "but there's no cell service here"
        }
    }
});
addMove({
    name: "self destruct",
    type: "self",
    process: (sequencer,user) => {
        user.state.exploded = true;
        user.dropHealth(user.maxHealth);
        return {
            text: `${user.name} couldn't handle the pressure`
        }
    }
});
addMove({
    name: "peaceful pace",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.goingTurbo) {
            return {
                failed: true,
                events: [
                    {
                        text: `but ${user.name} ${overb(user)} going full turbo`
                    },
                    {
                        text: `this hurts a bit`,
                        action: () => {
                            user.state.raceProgress++;
                            if(user.state.tookDrugs) {
                                user.state.raceProgress++;
                            }
                            user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
                            user.dropHealth(20);
                        }
                    }
                ]
            }
        } else {
            return moves["stay on path"].process(sequencer,user)
        }
    }
});
addMove({
    name: "drive piano",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: `but ${user.name} ${overb(user)}n't vanessa carlton`,
                    action: () => sequencer.turboTextVelocity = 150
                },{
                    text: `but ${user.name} won't let a game dictate ${oposv(user)} choices`
                },{
                    text: `${user.name} spend${user.isElf?"s":""} 4 years in singing school`
                },...turboTextWordByWord(sequencer,"making my way downtown walking fast faces pass and i'm home bound staring blanky ahead just making my way"),
                {
                    text: `${user.name} forgot the rest of the lyrics`
                },
                {
                    text: "anyways - you scored some points",
                    action: () => {
                        user.state.raceProgress++;
                        if(user.state.tookDrugs) {
                            user.state.raceProgress++;
                        }
                        if(user.state.goingTurbo) {
                            user.state.raceProgress++;
                        }
                        user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
                    }
                }
            ]
        }
    }
});
addMove({
    name: "calm mind",
    type: "self",
    process: (sequencer,user) => {
        return {
            failed: true,
            events: [
                {
                    text: "but this isn't pokemon"
                },
                {
                    text: "this still helped a little bit",
                    action: () => {
                        user.state.raceProgress++;
                        user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
                    }
                }
            ]
        }
    }
});
addMove({
    name: "break ankle",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: `${user.name} broke their ankle`
                },
                {
                    text: `${user.isPlayer ? "your" : "their"} racing days are over`
                },
                {
                    text: "this is so sad"
                },
                {
                    text: "alexa. play despacito."
                },
                {
                    text: "the song playing did the final blow",
                    action: () => user.dropHealth(user.maxHealth)
                }
            ]
        }
    }
});
addMove({
    name: "pedal to the metal",
    type: "self",
    process: (sequencer,user) => {
        return {
            failed: true,
            text: "but this isn't a bicycle race"
        }
    }
});
addMove({
    name: "rip clothes off",
    type: "self",
    process: (sequencer,user) => {
        user.state.naked = true;
        return {
            text: `${user.name} ${overb(user)} now running naked`
        }
    }
});
addMove({
    name: "overheat and die",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: `${user.name} upheld their notions of modesty`
                },
                {
                    text: "the heat is a bit too much though",
                    action: () => user.dropHealth(user.maxHealth)
                }
            ]
        }
    }
});
addMove({
    name: "sportsmanship",
    type: "target",
    process: (sequencer,user,target) => {
        if(user.trashTalked) {
            return {
                text: "but with what was said earlier it's too late"
            }
        } else {
            return {
                text: `${user.name} exchanges kind words with ${target.name}`
            }
        }
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
        if(user.isPlayer && Math.random() > 0.5) {
            user.dropHealth(user.maxHealth);
            return {
                text: `${user.name} died from dehydration`
            }
        } else {
            user.state.raceProgress++;
            user.subText[0] = getRaceProgressSubText(user.state.raceProgress);
            return {
                text: `${user.name} ${overb(user)} a ${user.isElf?"trooper":"camel"}`
            }
        }
    }
});
addMove({
    name: "drink water",
    type: "self",
    process: (sequencer,user) => {
        if(user.state.broughtWater) {
            user.state.hydrated = true;
            return {
                text: `${user.name} ${overb(user)} now hydrated`
            }
        } else {
            return {
                failed: true,
                text: `but ${user.isElf ? "they" : "you"} didn't bring any`
            }
        }
    }
});
addMove({
    name: "find pond",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: `${user.name} found a nice pond`
                },
                {
                    text: `${user.name} took a big sip`
                },
                Math.random() < 0.9 ? {
                    text: `${user.name} ${user.isPlayer ? "have" : "has"} died of dysentery`,
                    action: () => user.dropHealth(user.maxHealth)
                } : {
                    text: `${user.name} must have a good immune system`,
                    action: () => user.isHydrated = true
                }
            ]
        }
    }
});
addMove({
    name: "finish race",
    type: "self",
    process: (sequencer,user) => {
        sequencer.globalBattleState.stage = "finish line";
        if(user.state.tookDrugs) {
            if(Math.random() < 0.75) {
                return {
                    events: [
                        {
                            text: `${user.name} got called out on drug use`
                        },
                        {
                            text: "the committee punishes harshly"
                        },
                        {
                            text: `the comittee beat ${user.name} with a shoe`,
                            action: () => user.dropHealth(user.maxHealth)
                        }
                    ]
                }
            } else {
                return {
                    events: [
                        {
                            text: "no one noticed the drug use"
                        }
                    ]
                }
            }
        } else if(user.state.trippedElf) {
            if(Math.random() < 0.5) {
                return {
                    events: [
                        {
                            text: `the judges noticed ${user.name} cheated`
                        },
                        {
                            text: "no bad deed goes unpunished"
                        },
                        {
                            text: "it's shoe time"
                        },
                        {
                            text: `the judges beat ${user.name} with a shoe`
                        },
                        {
                            action: () => user.dropHealth(user.maxHealth)
                        }
                    ]
                }
            } else {
                return {
                    text: `no one noticed ${user.name} cheated`
                }
            }
        } else if(user.state.trashTalked) {
            if(Math.random() > 0.7) {
                return {
                    events: [
                        {
                            text: `the judges noticed your foul mouth`
                        },
                        {
                            text: "no bad deed goes unpunished"
                        },
                        {
                            text: "it's shoe time"
                        },
                        {
                            text: `the judges beat ${user.name} with a shoe`
                        },
                        {
                            action: () => user.dropHealth(user.maxHealth)
                        }
                    ]
                }
            } else {
                return {
                    text: `no one noticed your foul mouth`
                }
            }
        } else {
            return {
                text: `${user.name} finished fair and square!`
            }
        }
    }
});
addMove({
    name: "admit drug use",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: "the racing comittee listens"
                },
                {
                    text: "they all concur on your fate"
                },
                {
                    text: "the racing rules were clear"
                },
                {
                    text: "they decide drugs are punishable by death"
                },
                {
                    text: "... here comes a shoe ..."
                },
                {
                    action: () => user.dropHealth(user.maxHealth)
                }
            ]
        }
    }
});
addMove({
    name: "stretch",
    type: "self",
    process: (sequencer,user) => {
        if(!(user.state.stretches >= 0)) {
            user.state.stretches = 0;
        }
        user.state.stretches++;
        return {
            text: `${user.name} stretched for performance`
        }
    }
});
addMove({
    name: "hydrate",
    type: "self",
    process: (sequencer,user) => {
        if(!(user.state.hydrations >= 0)) {
            user.state.hydrations = 0;
        }
        if(++user.state.hydrations >= 5) {
            if(Math.random() > 0.75) {
                user.dropHealth(user.maxHealth);
                return {
                    text: `${user.name} drank too much and died`
                }
            } else {
                user.state.hydrations = 1;
                return {
                    text: `${user.name} drank more water`
                }          
            }
        } else if(user.state.hydrations === 1) {
            return {
                text: `${user.name} drank some water`
            }
        } else {
            return {
                text: `${user.name} drank more water`
            }
        }
    }
});
addMove({
    name: "perseverance",
    type: "self",
    process: (sequencer,user) => moves["try to stay strong"].process(sequencer,user)
});
addMove({
    name: "elf trot",
    type: "self",
    process: (sequencer,user) => moves["stay on path"].process(sequencer,user)
});
addMove({
    name: "steady pace",
    type: "self",
    process: (sequencer,user) => moves["peaceful pace"].process(sequencer,user)
});
addMove({
    name: "congrats",
    type: "target",
    process: (sequencer,user,target) => {
        return {
            text: `${user.name} tell${user.isPlayer?"":"s"} ${target.name} a canned congrats`
        }
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
        return {
            text: `${user.name} rest${user.isPlayer?"":"s"} eagerly`
        }
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
            moves["poke bear"],
            moves["stay on path"],
        ],
        () => [//4
            moves["stay on path"],
            moves["distracting thoughts"]
        ],
        () => [//5
            moves["distracting thoughts"],
            moves["trip elf"],
            moves["go turbo"]
        ],
        () => [//6
            moves["trash talk"],
            moves["poke bear"],
            moves["call an uber"]
        ],
        () => [//7
            moves["self destruct"],
            moves["peaceful pace"],
        ],
        () => [//8
            moves["poke bear"],
            moves["drive piano"],
            moves["calm mind"]
        ],
        () => [//9
            moves["break ankle"],
            moves["find shortcut"],
            moves["pedal to the metal"],
            moves["poke bear"]
        ],
        () => [//10
            moves["rip clothes off"],
            moves["overheat and die"]
        ],
        () => {//11
            const theseMoves = [moves["stay on path"],moves["sportsmanship"]];
            if(!sequencer.playerBattleObject.state.tookDrugs) {
                theseMoves.push(moves["reconsider taking drugs"]);
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
            const lastMoves = [moves["finish race"],moves["poke bear"]];
            if(sequencer.playerBattleObject.state.tookDrugs) {
                lastMoves.push(moves["admit drug use"]);
            }
            return lastMoves;
        },
        () => [//14
            moves["decent punch"],
            moves["punching vitamins"],
            moves["protect"],
            moves["band aid"]
        ]
    ];
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
                case "finish line":
                    return null;
                case "fist fight":
                    return moves["wimpy punch"];
                default:
                    const elfMoves = ["perseverance","elf trot","steady pace","elf trot","short rest"];
                    return moves[elfMoves[sequencer.turnNumber % elfMoves.length]];
            }
        }
    },
    getPlayerMoves: sequencer => getRaceMoveSet(sequencer,0),
    setup: sequencer => {
        sequencer.playerBattleObject.state.raceProgress = 0;
        sequencer.elfBattleObject.state.raceProgress = 0;
        sequencer.playerBattleObject.subText = [getRaceProgressSubText(0)];
        sequencer.elfBattleObject.subText = [getRaceProgressSubText(0)];
    },
    startText: "no drugs. no exceptions.",
    startSpeech: {
        text: "ever beat a headless elf\nin a foot race?\n\nps - drugs are against\nthe rules of racing"
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
                    case 1:
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,2)
                        );
                        sequencer.globalBattleState.stage++;
                        break;
                    default:
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,sequencer.globalBattleState.stage + 1)
                        );
                        sequencer.globalBattleState.stage++;
                        break;
                    case 12:
                        sequencer.updatePlayerMoves(
                            getRaceMoveSet(sequencer,13)
                        );
                        break;
                    case "fist fight":
                        return null;
                    case "finish line":
                        if(sequencer.playerBattleObject.isAlive && sequencer.elfBattleObject.isAlive && sequencer.playerBattleObject.lastMove === "finish race") {
                            if(sequencer.playerBattleObject.state.raceProgress > sequencer.elfBattleObject.state.raceProgress) {
                                //player wins
                                return {
                                    text: `${sequencer.elfBattleObject.name} died from shame`,
                                    action: () => sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth)
                                }                           
                            } else if(sequencer.elfBattleObject.state.raceProgress > sequencer.playerBattleObject.state.raceProgress) {
                                //player loses
                                return {
                                    events: [
                                        {
                                            text: `${sequencer.elfBattleObject.name} won the race!`
                                        },
                                        {
                                            text: "losers have to die - sorry"
                                        },
                                        {
                                            action: () => sequencer.dropHealth(sequencer.playerBattleObject,sequencer.playerBattleObject.maxHealth)
                                        }
                                    ]
                                }
                            } else {
                                return {
                                    events: [{
                                        text: "the race was a two way tie!"
                                    },{
                                        text: "time for a fist fight!",
                                        action: () => {
                                            sequencer.updatePlayerMoves(getRaceMoveSet(sequencer,14));
                                            sequencer.globalBattleState.stage = "fist fight";
                                        }
                                    }
                                    ]
                                }
                            }
                        }
                }
            }
        }
    }
}
