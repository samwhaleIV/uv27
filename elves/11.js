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
        const startTextOptions = ["hmm","ah","ooh","maybe","how about","spooky","scary","skeletons"];
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
    moves["tell me a joke"],
    moves["rap battle"],
    moves["castles?"],
    moves["dragons?"]
];

const rapBattleList = [];
const addRapBattleEntry = (elfText,playerText,...options) => {
    const speech = `${elfText}\n\n<your line>\n${playerText}`;
    const entryIndex = `rap-segment-${rapBattleList.length}`;

    const processor = sequencer => {
        const responses = [];
        const responseQualities = [];
        for(let i = 0;i<options.length;i++) {
            const option = options[i];
            if(option.historyRequired) {
                if(rapChoicesContains(option.name)) {
                    responses.push(option.name);
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
    "humans suck\nthey are uck",
    "f**k you - you're a-",
    {name:"smuck",quality:"perfect"},
    {name:"camel",quality:"terrible"},
    {name:"jester",quality:"bad"}
);
addRapBattleEntry(
    "humans suck\nthey are uck",
    "f**k you - you're a-",
    {name:"smuck",quality:"perfect"},
    {name:"camel",quality:"terrible"},
    {name:"jester",quality:"bad"}
);

const castleFragments = ["big and strong","tall and large","made of brick"];
const dragonFragments = ["fire with wings"];


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

const rapChoicesContains = (sequencer,isCastleOption,text) => {
    return sequencer.globalBattleState.rapChoicesDictionary[
        isCastleOption ?
            inverseCastleFragments[text]:
            inverseDragonFragments[text],
        isCastleOption ? 0 : 1,1
    ];
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
                            sequencer.playerBattleObject.addHealth(5);
                            break;
                        case "meh":
                            sequencer.playerBattleObject.dropHealth(15);
                            break;
                        case "bad":
                            sequencer.playerBattleObject.dropHealth(30);
                            break;
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
                    },{
                        speech: "hmm - a worthy rapper\n\nwhelp time to 'rap' it\nup boys\n*ded*",
                        persist: true,
                        action: () => sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth)
                    }];
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
/*


oh - hello\nyou're jest in time

Starting moves:
[tell me a joke]
    -> <random joke> as (speech)
[rap battle]
    -> (rap battle start speech) -> [first four rap responses]
[castles?]
    -> <turn independent incremental factoids about castles> 
[dragons?]
    -> <turn independent incremental factoids about dragons> 


*/