addMove({
    name: "tell me a joke",
    type: "option",
    process: sequencer => {
        const jokes = [
            ["why did the chicken\ncross the road?","to get to the other side"],
            ["two elves walk into a bar\nwhat do they drink?","elf beer"],
            ["they say i have a way with\nwords...","well of course.\nthey're all left to right"],
            ["i can never find my keys","i left them in my house"],
            ["knock knock","who's there","it's a me! jester elf"],
            ["what do snowmen eat?","snow flakes\n(or frosted flakes)"],
            ["santa has gained a few\npounds lately","he's been spending\nlots of time in the uk"]
        ];
        const joke = jokes[
            sequencer.globalBattleState.jokeIndex++%jokes.length
        ];
        return {
            events: joke.map(jokePart=>{return {speech:jokePart}})
        }
    }
});
addMove({
    name: "castles?",
    type: "option",
    process: (sequencer,user) => {
        const startTextOptions = ["yikes","neat","clever","what is","they are","i love them"];
        const castleFragment = castleFragments[
            sequencer.globalBattleState.castlesFactoidIndex
        ];
        return {
            speech: `castles?\n${startTextOptions[Math.floor(Math.random()*startTextOptions.length)]}...\n'${castleFragment}'`,
            action: () => {
                sequencer.globalBattleState.rapChoicesDictionary[sequencer.globalBattleState.castlesFactoidIndex][0][1] = true;
                sequencer.globalBattleState.castlesFactoidIndex = (sequencer.globalBattleState.castlesFactoidIndex + 1) % castleFragments.length;
            }
        }
    }
});
addMove({
    name: "dragons?",
    type: "option",
    process: (sequencer,user) => {
        const startTextOptions = ["hmm","ah","ooh","maybe","how about","spooky","scary","skeletons","interesting"];
        const dragonFragment = dragonFragments[
            sequencer.globalBattleState.dragonsFactoidIndex
        ];
        return {
            speech: `dragons?\n${startTextOptions[Math.floor(Math.random()*startTextOptions.length)]}...\n'${dragonFragment}'`,
            action: () => {
                sequencer.globalBattleState.rapChoicesDictionary[sequencer.globalBattleState.dragonsFactoidIndex][1][1] = true;
                sequencer.globalBattleState.dragonsFactoidIndex = (sequencer.globalBattleState.dragonsFactoidIndex + 1) % dragonFragments.length;
            }
        }
    }
});
addMove({
    name: "rap battle",
    type: "option",
    process: sequencer => {
        sequencer.globalBattleState.startRapBattle = true;
        return null;
    }
});

const defaultJesterElfMoves = [
    moves["rap battle"],
    moves["tell me a joke"],
    moves["castles?"],
    moves["dragons?"]
];

const rapBattleList = [];
const addRapBattleEntry = (elfText,playerText,...options) => {
    const speech = `${elfText}\n<your line>\n${playerText}`;
    const entryIndex = `rap-segment-${rapBattleList.length}`;

    const processor = sequencer => {
        const responses = [];
        const responseQualities = [];
        for(let i = 0;i<options.length;i++) {
            const option = options[i];
            if(option.historyRequired) {
                const hasRapChoice = rapChoicesContains(sequencer,option.name);
                if(hasRapChoice) {
                    responses.push(`'${option.name}'`);
                    responseQualities.push(option.quality || "meh");
                }
            } else {
                responses.push(option.name);
                responseQualities.push(option.quality || "meh");
            }
        }
        return [speech,getStaticRadioSet(responses,entryIndex),entryIndex,responseQualities]
    };

    rapBattleList.push(processor);

}

addRapBattleEntry(
    "humans suck.\nthey are uck.",
    "f**k you. you're a-",
    {name:"smuck",quality:"perfect"},
    {name:"camel",quality:"terrible"},
    {name:"jester",quality:"bad"}
);
addRapBattleEntry(
    "i'm an elf. on a shelf.\nyou're just ann.\nwho's a man.",
    "i might be ann\nbut can an elf",
    {name:"read a book?",quality:"bad"},
    {name:"kill yourself?",quality:"perfect"},
    {name:"f**k thyself?",quality:"perfect"},
    {name:"kill a crook?",quality:"bad"}
);
addRapBattleEntry(
    "yo mama so human\nshe john von neumann",
    "yo mama so winter\nshe-",
    {name:"wears a warm coat",quality:"terrible"},
    {name:"got a new man",quality:"decent"},
    {name:"splinters",quality:"meh"},
    {name:"a printer",quality:"perfect"}
);
addRapBattleEntry(
    "your face so long\nit look like a bong",
    "your ear so long\nyou look-",
    {name:"big and strong",quality:"perfect",historyRequired:true},
    {name:"like a thong",quality:"decent"},
    {name:"like a cat",quality:"terrible"},
    {name:"kinda weird",quality:"terrible"}
);
addRapBattleEntry(
    "you remind me of\na starbucks order",
    "what? brew?\nstarbucks would\ncall you-",
    {name:"tall and large",quality:"perfect",historyRequired:true},
    {name:"decaffeinated",quality:"bad"},
    {name:"hipster trash",quality:"terrible"},
    {name:"valued customer",quality:"terrible"}
);
addRapBattleEntry(
    "hey! i am not!",
    "hay is for horses\nbut you are-",
    {name:"neigh",quality:"bad"},
    {name:"mine",quality:"terrible"},
    {name:"hot as f**k",quality:"perfect"},
    {name:"jester elf",quality:"terrible"}
);
addRapBattleEntry(
    "you present. a nice\naccent.",
    "yeah? so? go get-",
    {name:"ready for a hug",quality:"bad"},
    {name:"bent",quality:"perfect"},
    {name:"ice cream",quality:"terrible"},
    {name:"snacks",quality:"meh"}
);
addRapBattleEntry(
    "here's a trick.\nit's a kick.",
    "that was slick...\nunlike my-",
    {name:"yardstick",quality:"decent"},
    {name:"chopstick abilities",quality:"decent"},
    {name:"brick",quality:"perfect",historyRequired:true},
    {name:"d**k",quality:"naugthy"}
);
addRapBattleEntry(
    "i will break you.\nyou will hobble.",
    "you can try. but i have-",
    {name:"cobble",quality:"perfect",historyRequired:true},
    {name:"insurance",quality:"bad"},
    {name:"compassion",quality:"bad"},
    {name:"pain medications",quality:"terrible"}
);
addRapBattleEntry(
    "your fate is sealed.\ni'm the king.",
    "save your hate.\ni bring-",
    {name:"wings",quality:"perfect",historyRequired:true},
    {name:"cards against humanity",quality:"bad"},
    {name:"free food",quality:"bad"},
    {name:"love",quality:"terrible"}
);
addRapBattleEntry(
    "i know braille\nand you are frail",
    "i am frail but\ni brought-",
    {name:"a strong fist",quality:"bad"},
    {name:"scales",quality:"perfect",historyRequired:true},
    {name:"strongly worded letters",quality:"terrible"}
);
addRapBattleEntry(
    "i boast skillz.\nyou host bloat.",
    "at least i'm not-",
    {name:"toasted goats",quality:"perfect",historyRequired:true},
    {name:"a f*****g boat",quality:"decent"},
    {name:"glorified clown",quality:"terrible"},
    {name:"about to die",quality:"bad"}
);

const castleFragments = ["big and strong","tall and large","brick","cobble"];
const dragonFragments = ["wings","hot as f**k","scales","toasted goats"];

const inverseCastleFragments = {};
const inverseDragonFragments = {};

(() => {
    let i;
    for(i = 0;i<castleFragments.length;i++) {
        const key = castleFragments[i];
        inverseCastleFragments[key] = i;
    }
    for(i = 0;i<dragonFragments.length;i++) {
        const key = dragonFragments[i];
        inverseDragonFragments[key] = i;
    }
})();

const rapChoicesContains = (sequencer,text) => {
    let isCastleOption;
    if(inverseCastleFragments[text] >= 0) {
        isCastleOption = true;
    } else if(inverseDragonFragments[text] >= 0) {
        isCastleOption = false;
    } else {
        return false;
    }

    const index1 = isCastleOption ?
    inverseCastleFragments[text]:
    inverseDragonFragments[text];

    const index2 = isCastleOption ? 0 : 1;
    const index3 = 1;
    
    return sequencer.globalBattleState.rapChoicesDictionary[index1][index2][index3];
}
const rapBattleOptionsDictionary = () => {
    const dictionary = [];
    let endLength;

    if(dragonFragments.length > castleFragments.length) {
        endLength = dragonFragments.length;
    } else {
        endLength = castleFragments.length;
    }
    for(let i = 0;i<endLength;i++) {

        const leftHand = i < castleFragments.length ? [castleFragments[i],false] : null;
        const rightHand = i < dragonFragments.length ? [dragonFragments[i],false] : null;

        dictionary.push(
            [leftHand,rightHand]
        );
    }
    return dictionary;
}


const getQualityReport = quality => `this was a ${quality} response`;
elves[10] = {
    name: "jester elf",
    background: "background-7",
    backgroundColor: "rgb(278,0,255)",
    health: 300,
    startSpeech: {
        text: "oh - hello\nyou're 'jest' in time"
    },
    elfDeadText: "jester elf died from pun suicide",
    getDefaultGlobalState: () => {
        return {
            rapChoicesDictionary: rapBattleOptionsDictionary(),
            jokeIndex: 0,
            castlesFactoidIndex: 0,
            dragonsFactoidIndex: 0,
            rapBattleIndex: 0,
            perfectCount: 0,
            postTurnProcess: sequencer => {
                let events = [];
                let justStarted = false;
                if(sequencer.playerBattleObject.state.input) {
                    sequencer.startRapBattle = false;
                    if(sequencer.playerBattleObject.state.input === "yes") {
                        events.push({
                            speech: "woo! here we go\n\ndrop your rhymes\nwhile they're hot\nor you'll be... not"
                        })
                        sequencer.globalBattleState.inRapBattle = true;
                        const rapBattleEntry = rapBattleList[sequencer.globalBattleState.rapBattleIndex](sequencer);
                        sequencer.globalBattleState.lastEntry = rapBattleEntry;
                        sequencer.updatePlayerMoves(
                            rapBattleEntry[1]
                        );
                        sequencer.playerBattleObject.state.input = null;
                        events.push({
                            speech: rapBattleEntry[0],
                            persist: true
                        });
                        sequencer.globalBattleState.rapBattleIndex++;
                        justStarted = true;
                    } else {
                        sequencer.updatePlayerMoves(defaultJesterElfMoves);
                    }
                    sequencer.playerBattleObject.state.input = null;
                }
                if(sequencer.globalBattleState.startRapBattle) {
                    sequencer.globalBattleState.startRapBattle = false;
                    sequencer.updatePlayerMoves([{
                        name: "yes",
                        type: "option",
                        process: (sequencer,user) => {
                            user.state.input = "yes";
                            return null;
                        }
                    },{
                        name: "no",
                        type: "option",
                        process: (sequencer,user) => {
                            user.state.input = "no";
                            return null;
                        }
                    }]);
                    events.push({
                        speech: "alright! let's do this\n\nare you ready?",
                        persist: true
                    });
                } else if(!justStarted && sequencer.globalBattleState.inRapBattle) {
                    const userResponse = sequencer.playerBattleObject.state[sequencer.globalBattleState.lastEntry[2]];
                    const userResponseQuality = sequencer.globalBattleState.lastEntry[3][userResponse];
        
                    console.log("User response: " + userResponse);
                    console.log("User response quality: " + userResponseQuality);
        
                    sequencer.globalBattleState.lastQuality = userResponseQuality;
        
                    switch(userResponseQuality) {
                        case "perfect":
                            sequencer.globalBattleState.perfectCount++;
                            sequencer.playerBattleObject.addHealth(5);
                            break;
                        case "meh":
                            sequencer.playerBattleObject.dropHealth(20);
                            break;
                        case "bad":
                            sequencer.playerBattleObject.dropHealth(30);
                            break;
                        case "naugthy":
                        case "terrible":
                            sequencer.playerBattleObject.dropHealth(60);
                            break;
                    }

                    let skip = false;
        
                    if(sequencer.playerBattleObject.isDead || sequencer.elfBattleObject.isDead) {
                        sequencer.globalBattleState.somebodyDied = true;
                        skip = true;
                    }

                    if(!skip) {
                        const rapBattleEntry = rapBattleList[sequencer.globalBattleState.rapBattleIndex](sequencer);
                        sequencer.globalBattleState.rapBattleIndex++;
            
                        sequencer.globalBattleState.lastEntry = rapBattleEntry;
            
                        sequencer.updatePlayerMoves(
                            rapBattleEntry[1]
                        );
                        if(sequencer.globalBattleState.rapBattleIndex >= rapBattleList.length-1) {
                            sequencer.globalBattleState.atRapBattleEnd = true;
                        }
                        events.push({
                            speech: rapBattleEntry[0],
                            persist: true
                        });
                    }
                }
                

                if(sequencer.globalBattleState.rapBattleIndex >= rapBattleList.length) {
                    sequencer.elfBattleObject.state.diedFromPuns = true;
                    sequencer.globalBattleState.inRapBattle = false;

                    events = [{
                        text: getQualityReport(sequencer.globalBattleState.lastQuality)
                    }];
                    if(sequencer.globalBattleState.perfectCount >= 12) {
                        events.push({
                            text: "all your rapping was perfect"
                        });
                        events.push({
                            speech: "wow.\ni am very impressed\nyou 'sleighed' every verse\n\ni'll let you in on a secret...\n'<insert secret here>'"
                        });
                        events.push({
                            speech: "you've done well...\nand farewell\n\nthis is jester...\ngoodbye quester",
                            action: () => sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth)
                        });
                    } else {
                        events.push({
                            speech: "hmm - a worthy rapper\n\nwhelp time to 'rap' it\nup boys\n*ded*",
                            persist: true,
                            action: () => sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth)
                        });
                    }
                } else if(sequencer.globalBattleState.somebodyDied) {
                    events = [{
                        text: getQualityReport(sequencer.globalBattleState.lastQuality)
                    },{
                        speech: "looks like this battle\nended 'jest' in time",
                        persist: true
                    }];
                } else if(sequencer.globalBattleState.inRapBattle && sequencer.globalBattleState.lastQuality) {
                    events = [{
                        text: getQualityReport(sequencer.globalBattleState.lastQuality)
                    },...events];
                }
                return {
                    events: events
                }
            }
        }
    },
    playerMoves: defaultJesterElfMoves
}
