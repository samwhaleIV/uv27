const getDoubleSpeech = (speech1,speech2) => `head one:\n${speech1}\n\nhead two:\n${speech2}`;

const advanceSelectionScreen = sequencer => {
    sequencer.updatePlayerMoves(
        selectionSetMoves[
            ++sequencer.globalBattleState.selectionSetIndex
        ]
    );
    sequencer.globalBattleState.totalSelections++;
}

const increaseHead1Disposition = sequencer => {
    sequencer.elfBattleObject.state.head1Disposition++;
    advanceSelectionScreen(sequencer);
}

const increaseHead2Disposition = sequencer => {
    sequencer.elfBattleObject.state.head2Disposition++;
    advanceSelectionScreen(sequencer);
}


const getEndEvents = sequencer => {
    const disposition1 = sequencer.elfBattleObject.state.head1Disposition;
    const disposition2 = sequencer.elfBattleObject.state.head2Disposition;

    const updateMoves = sequencer => {
        const newMoves = [moves["wimpier punch"],moves["protect"],moves["band aid"]];
        if(sequencer.playerBattleObject.state.canUsePunchingVitamins) {
            newMoves.push(moves["punching vitamins"]);
        }
        sequencer.updatePlayerMoves(newMoves);
    }

    const endEvents = [{
        text: "looks like there's nothing else to say"
    },{
        text: "the elves learned more about themselves"
    }];
    if(disposition1 > disposition2) {
        endEvents.push({
            speech: getDoubleSpeech("we just differ too much\ntime to get rekt","i hate you! you're\nnothing like me! :("),
        },{
            text: "time to settle this the old way",
            action: sequencer => {
                updateMoves(sequencer);
                sequencer.globalBattleState.endBattleType = "head 1";
                sequencer.globalBattleState.turnOffset = sequencer.turnNumber;
            }
        });
    } else if(disposition2 > disposition1) {
        endEvents.push({
            speech: getDoubleSpeech("i always felt indifferent","what! but we've always\nbeen so close!\nyou're all going down!")
        },{
            text: "time to settle this the old way",
            action: sequencer => {
                updateMoves(sequencer)
                sequencer.globalBattleState.endBattleType = "head 2";
                sequencer.globalBattleState.turnOffset = sequencer.turnNumber;
            }
        });
    } else {
        if(disposition1 === 0) {
            endEvents.push({
                speech: getDoubleSpeech("ha! loser human","we are inseparable")
            },{
                text: "two headed elf used companionship"
            },{
                text: "two headed elf used double punch",
                action: sequencer => sequencer.playerBattleObject.dropHealth(sequencer.playerBattleObject.maxHealth)
            },{
                text: "a one hit knockout"
            },{
                speech: "see ya around kiddo"
            });
        } else {
            endEvents.push({
                speech: getDoubleSpeech("huh - so i guess we just\nhate each other equally","yep. i hate you too"),
            },{
                speech: getDoubleSpeech("you're finna die","ha - you and what army?"),
            },{
                text: "two headed elf used self punch",
                action: sequencer => twentyFivePercentElfHealthDrop(sequencer)
            },{
                speech: getDoubleSpeech("take that!","you idiot!\nyou'll kill us both!")
            },{
                text: "two headed elf used self punch",
                action: sequencer => twentyFivePercentElfHealthDrop(sequencer)                
            },{
                speech: getDoubleSpeech("what! you can punch me\nbut i can't?","yeah. i hate u")               
            },{
                text: "two headed elf used self punch",
                action: sequencer => twentyFivePercentElfHealthDrop(sequencer)                    
            },{
                speech: getDoubleSpeech("ouch! we should just\nmake up","ha - not a chance!")
            },{
                text: "two headed elf is planning a punch"
            },{
                speech: getDoubleSpeech("brother - plz don't","it's what the human\nwants anyways!")
            },{
                speech: getDoubleSpeech("what do you mean?","if we don't kill ourselves\nthe human will just\nfind their own way")
            },{
                text: "you stare innocently"
            },{
                speech: getDoubleSpeech("hmm...","see. look at them")
            },{
                speech: getDoubleSpeech("allow me the honors...","be my guest")
            },{
                text: "two headed elf used self punch",
                action: sequencer => sequencer.elfBattleObject.dropHealth(sequencer.elfBattleObject.maxHealth)
            });
        }
    }
    sequencer.globalBattleState.ranEndEvents = true;
    return {
        events: endEvents
    }
}

const fruitSelector = getSelectionMove(
    "offer fruit",{
        name: "apple",
        events: [{
            speech: getDoubleSpeech("ew - apples suck","mmmm - my favorite"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "banana",
        events: [{
            speech: getDoubleSpeech("thank you for\nthis great fruit","this fruit is cursed"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    },{
        name: "elf berries",
        events: [{
            speech: getDoubleSpeech("yeah those are good","i think so too"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    }
);

const sportSelector = getSelectionMove(
    "play sport",{
        name: "chess",
        events: [{
            speech: getDoubleSpeech("chess! my favorite","i never\nlearned to play..."),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    },{
        name: "elfball",
        events: [{
            speech: getDoubleSpeech("ew - i hate elf ball\nthere's balls everywhere","yessss!\ngive me the balls"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "elf hockey",
        events: [{
            speech: getDoubleSpeech("okay - but do we need to\nput elf in front of it?","at least this is\nsomething we both like"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    }
);

const colorSelector = getSelectionMove(
    "talk about a color",{
        name: "red",
        events: [{
            speech: getDoubleSpeech("you like red?\nwhoaaa - me too!","(does he realize that\nwe are red?)"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "blue",
        events: [{
            speech: getDoubleSpeech("ohhh yeah\nblue gets me going","ugh that color is so\ndready"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    },{
        name: "orange",
        events: [{
            speech: getDoubleSpeech("meh.\norange? isn't that a fruit?","yes - it's also my\nfavorite color"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "black",
        events: [{
            speech: getDoubleSpeech("black...now we're talking!","lol you're such emos"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    }
);
const animalSelector = getSelectionMove(
    "talk about an animal",{
        name: "squirrels",
        events: [{
            speech: getDoubleSpeech("ew - rodents with nuts","squirrels remind me of\ngolden elfette..\ni haven't seen her in a bit"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "bears",
        events: [{
            speech: getDoubleSpeech("ha! bears. fun times.","yeah remember those\nbears in the racing\ntrails?"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "elves",
        events: [{
            speech: getDoubleSpeech("elves?? elves!?","yikes - he's uh...\nvery insecure")
        },{
            speech: getDoubleSpeech("t r i g g e r e d","just let it go dude")
        },{
            speech: getDoubleSpeech("no! who does this human\nthink he is?","it's not worth it bro")
        },{
            speech: getDoubleSpeech("i'm gonna kick their\nf***ing a**!","remember what the\ndoctor said?")
        },{
            speech: getDoubleSpeech("i. don't. care!","this is bad for your\nblood pressure")
        },{
            speech: getDoubleSpeech("*clutches their chest*","head one! no!!"),
            action: sequencer => sequencer.elfBattleObject.dropHealth(Math.floor(sequencer.elfBattleObject.health/2))
        },{
            speech: getDoubleSpeech("*ded*","great - now he's dead")
        },{
            speech: getDoubleSpeech("*still ded*","this is all your fault!")
        },{
            speech: getDoubleSpeech("*still ded*","now i'm stuck forever\n*sigh*"),
        },{
            action: sequencer => sequencer.updatePlayerMoves([moves["honorable suicide"],moves["senseless murder"]])
        }
    ]
    },{
        name: "ferret",
        events: [{
            speech: getDoubleSpeech("ferrts are weird like me\nthey cry when i cry","ferrets perturb my soul"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    }
);
const politicsSelector = getSelectionMove(
    "talk politics",{
        name: "santa",
        events: [{
            speech: getDoubleSpeech("what a fatty","hey - bro - this is 2019\nyou can't just say santa is\na fatty"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "elf labor abuse",
        events: [{
            speech: getDoubleSpeech("yes - elf labor rights\nare a huge issue","why do you think we\nkill humans?"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "elf genocide",
        events: [{
            speech: getDoubleSpeech("genocide on elves?\nor genocide by elves?","either way - count me in"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "the naughty list",
        events: [{
            speech: getDoubleSpeech("i like the naugthy list :)","that's classified\ni refuse to discuss this"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    }
);
const shoppingSelector = getSelectionMove(
    "let's go shopping",{
        name: "elf mall",
        events: [{
            speech: getDoubleSpeech("ahh - too many people","yeah! great idea"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "elfmart",
        events: [{
            speech: getDoubleSpeech("okay i guess","everyone loves elfmart"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "card shop",
        events: [{
            speech: getDoubleSpeech("ooh - i love cards","... of course you do"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    }
);
const nameSelector = getSelectionMove(
    "tell them your name",{
        name: "names are overrated",
        events: [{
            speech: getDoubleSpeech("finally someone gets it","yeah - we didn't even\nget our own names"),
            action: sequencer => advanceSelectionScreen(sequencer)
        }]
    },{
        name: "human",
        events: [{
            speech: getDoubleSpeech("heh. your parents named you\nhuman? cute","i  l o v e  elves\n...but i hate humans"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    },{
        name: "bob",
        events: [{
            speech: getDoubleSpeech("bob... the builder?","bob... that's got a\ngreat ring to it!"),
            action: sequencer => increaseHead1Disposition(sequencer)
        }]
    },{
        name: "apostle of darkness",
        events: [{
            speech: getDoubleSpeech("hello there.\nnice to meet you","oh. interesting.. freak"),
            action: sequencer => increaseHead2Disposition(sequencer)
        }]
    }
);
const presentSelector = getSelectionMove(
    "christmas wishlist",{
        name: "a new puppy",
        events: [{
            speech: getDoubleSpeech("puppies are too needy","aweeeeeee\ncute doggos!"),
            action: sequencer => sequencer.elfBattleObject.state.head1Disposition++
        },{
            action: sequencer => getEndEvents(sequencer)
        }]
    },{
        name: "punching vitamins",
        events: [{
            speech: getDoubleSpeech("ask and you shall receive","are you sure about that\nhead one??")
        },{
            text: "you received punching vitamins",
            action: sequencer => sequencer.playerBattleObject.state.canUsePunchingVitamins = true
        },{
            action: sequencer => getEndEvents(sequencer)
        }]
    },{
        name: "a new bike",
        events: [{
            speech: getDoubleSpeech("that is very elf racist","i concur with head one")
        },{
            speech: getDoubleSpeech("just because we are elves-","-you think we care\nabout toys? smh")
        },{
            action: sequencer => getEndEvents(sequencer)
        }]
    },{
        name: "an exit strategy",
        events: [{
            speech: getDoubleSpeech("there's no way out","we are trapped here too")
        },{
            speech: getDoubleSpeech("and trust us-","-we tried everything")
        },{
            action: sequencer => getEndEvents(sequencer)
        }]
    }
);

const twentyFivePercentElfHealthDrop = sequencer => {
    sequencer.elfBattleObject.dropHealth(
        Math.ceil(sequencer.elfBattleObject.health / 4)
    );
}

const selectionSets = [
    [fruitSelector],
    [sportSelector],
    [shoppingSelector,politicsSelector],
    [colorSelector,nameSelector],
    [fruitSelector,colorSelector,sportSelector],
    [fruitSelector,animalSelector,sportSelector],
    [nameSelector,politicsSelector,colorSelector],
    [presentSelector]
];

const selectionSetMoves = [];
selectionSets.forEach(
    selectionSet => selectionSetMoves.push(
        selectionSet.map(item => item.move)
    )
);

const updateDispositionSubtexts = sequencer => {
    if(sequencer.elfBattleObject.state.head1Disposition === sequencer.elfBattleObject.state.head2Disposition) {
        if(sequencer.elfBattleObject.state.head1Disposition === 0) {
            sequencer.elfBattleObject.subText[0] = "no disposition";
            sequencer.elfBattleObject.subText[1] = "no disposition";
        } else {
            sequencer.elfBattleObject.subText[0] = "equal disposition";
            sequencer.elfBattleObject.subText[1] = "equal disposition";
        }
    } else {
        if(sequencer.elfBattleObject.state.head1Disposition > sequencer.elfBattleObject.state.head2Disposition) {
            const difference = sequencer.elfBattleObject.state.head1Disposition - sequencer.elfBattleObject.state.head2Disposition;
            let dispositionText;
            switch(difference) {
                case NaN:
                    dispositionText = "broken disposition";
                    break;
                case 1:
                    dispositionText = "low disposition";
                    break;
                case 2:
                    dispositionText = "medium disposition";
                    break;
                default:
                case 3:
                    dispositionText = "high disposition";
                    break;
            }
            sequencer.elfBattleObject.subText[0] = dispositionText;
            sequencer.elfBattleObject.subText[1] = sequencer.elfBattleObject.state.head2Disposition === 0 ? "no disposition" : "less disposition";
        } else {
            const difference = sequencer.elfBattleObject.state.head2Disposition - sequencer.elfBattleObject.state.head1Disposition;
            let dispositionText;
            switch(difference) {
                case NaN:
                    dispositionText = "broken disposition";
                    break;
                case 1:
                    dispositionText = "low disposition";
                    break;
                case 2:
                    dispositionText = "medium disposition";
                    break;
                default:
                case 3:
                    dispositionText = "high disposition";
                    break;
            }
            sequencer.elfBattleObject.subText[1] = dispositionText;
            sequencer.elfBattleObject.subText[0] = sequencer.elfBattleObject.state.head1Disposition === 0 ? "no disposition" : "less disposition";
        }
    }
}

addMove({
    name: "disposition - 1",
    type: "self",
    process: () => {
        const speeches = ["you were my only friend!","you betray me","you think differently\ntherefore i hate you","get out of my life!"];
        return {
            speech: `head one:\n${speeches[Math.floor(Math.random()*speeches.length)]}`
        }
    }
});
addMove({
    name: "disposition - 2",
    type: "self",
    process: () => {
        const speeches = ["you were my best friend!","i don't even know you\nanymore","i just wanted to get along!","stay away from me!"];
        return {
            speech: `head two:\n${speeches[Math.floor(Math.random()*speeches.length)]}`
        }
    }
});

elves[9] = {
    name: "two headed elf",
    background: "background-3",
    backgroundColor: "red",
    health: 250,
    getPlayerMoves: sequencer => {
        return selectionSetMoves[0];
    },
    startSpeech: {
        text: getDoubleSpeech("i'm very conceited :(","but i'm more outgoing! :)")
    },
    getMove: sequencer => {
        if(sequencer.globalBattleState.ranEndEvents) {
            let moveChoices;
            if(sequencer.globalBattleState.endBattleType === "head 1") {
                moveChoices = ["decent punch","disposition","decent punch","disposition - 1","decent punch","self punch","cry","wimpy punch","disposition - 1","wimpier punch"];
            } else {
                moveChoices = ["decent punch","self punch","decent punch","disposition - 2","decent punch","cry","wimpy punch","wimpier punch","disposition - 2"];
            }
            return moves[moveChoices[(sequencer.turnNumber - sequencer.globalBattleState.turnOffset) % moveChoices.length]];
        } else {
            return null;
        }
    },
    setup: sequencer => {
        sequencer.elfBattleObject.state.head1Disposition = 0;
        sequencer.elfBattleObject.state.head2Disposition = 0;

        sequencer.elfBattleObject.subText = ["no disposition","no disposition"];

        sequencer.playerBattleObject.movePreProcess = protectPreProcessPlayer;
        sequencer.elfBattleObject.movePreProcess = protectPressProcessElf;
    },
    getDefaultGlobalState: () => {
        return {
            selectionSetIndex: 0,
            totalSelections: 0,
            postTurnProcess: sequencer => {
                let returnResult = null;
                if(!sequencer.globalBattleState.ranEndEvents) {
                    returnResult = selectionPostProcessor(sequencer);
                }
                if(returnResult !== null) {
                    if(returnResult.events) {
                        returnResult.events.push({
                            action: sequencer => updateDispositionSubtexts(sequencer)
                        });
                    } else {
                        returnResult.action = sequencer => updateDispositionSubtexts(sequencer)
                    }
                }
                return returnResult;
            }
        }
    }
}
