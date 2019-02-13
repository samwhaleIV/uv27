"use strict";
function CorruptElf() {

    this.song = "corrupt_loop";
    this.songIntro = "corrupt_intro";

    const guessAnswers = {
        Unknown: Symbol("Unknown"),
        Yes: Symbol("Yes"),
        No: Symbol("No"),
        NotSure: Symbol("Not sure"),
        Probably: Symbol("Probably"),
        Kinda: Symbol("Kinda")
    }

    const getQuestionString = deductionKey => {
        switch(deductionKey) {
            case "hasRedClothes":
                return "wears red clothes?";
            case "likesBooze":
                return "likes alchohol?";
            case "hasTwoEyes":
                return "has two eyes?";
            case "hasAHat":
                return "wears a hat?";
            case "hasLegs":
                return "has legs?";
            case "hasBeigeSkin":
                return "has beige skin?";
            case "hasAMouth":
                return "has a mouth?";
            case "hasACheckeredBackground":
                return "has checkered background?";
            case "hasAGoodSenseOfHumor":
                return "has good sense of humor?";
            case "makesPuns":
                return "battle had puns?";
            case "hasWhiteGloves":
                return "wears white gloves?";
            case "wantsToDie":
                return "wanted to die?";
        }
    }

    const getDeductionString = (deductionKey,answerSymbol,noPrefix) => {
        let answerString;
        switch(answerSymbol) {
            case guessAnswers.Unknown:
                answerString = "unknown";
                break;
            case guessAnswers.NotSure:
                answerString = "uncertain";
                break;
            case guessAnswers.Yes:
                answerString = "yes";
                break;
            case guessAnswers.No:
                answerString = "no";
                break;
            case guessAnswers.Kinda:
                answerString = "a little bit";
                break;
        }
        const prefix = noPrefix ? "" : "hmm... let me think\n\n";
        switch(deductionKey) {
            case "hasRedClothes":
                return `${prefix}wearing red clothes?\n${answerString}`;
            case "likesBooze":
                return `${prefix}likes alchohol?\n${answerString}`;
            case "hasTwoEyes":
                return `${prefix}has two eyes?\n${answerString}`;
            case "hasAHat":
                return `${prefix}wearing a hat?\n${answerString}`;
            case "hasLegs":
                return `${prefix}has legs?\n${answerString}`;
            case "hasBeigeSkin":
                return `${prefix}has beige skin?\n${answerString}`;
            case "hasAMouth":
                return `${prefix}has a mouth?\n${answerString}`;
            case "hasACheckeredBackground":
                return `${prefix}has a checkered\nbackground?\n${answerString}`;
            case "hasAGoodSenseOfHumor":
                return `${prefix}has a good sense of humor?\n${answerString}`;
            case "makesPuns":
                return `${prefix}battle involved puns?\n${answerString}`;
            case "hasWhiteGloves":
                return `${prefix}wearing white gloves?\n${answerString}`;
            case "wantsToDie":
                return `${prefix}wanted to die?\n${answerString}`;
        }
    }

    const getDefaultDeductionsList = () => {
        return {
            hasRedClothes: guessAnswers.Unknown,
            likesBooze: guessAnswers.Unknown,
            hasTwoEyes: guessAnswers.Unknown,
            hasAHat: guessAnswers.Unknown,
            hasLegs: guessAnswers.Unknown,
            hasBeigeSkin: guessAnswers.Unknown,
            hasAMouth: guessAnswers.Unknown,
            hasACheckeredBackground: guessAnswers.Unknown,
            hasAGoodSenseOfHumor: guessAnswers.Unknown,
            makesPuns: guessAnswers.Unknown,
            hasWhiteGloves: guessAnswers.Unknown,
            wantsToDie: guessAnswers.Unknown
        }
    }
    const elfProperties = [
        {
            name: elves[0].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[1].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[2].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[3].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.Probably,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Probably,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[4].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[5].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.No,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[6].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.Probably,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.No,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.No,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.Probably,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[7].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.Yes,
            hasTwoEyes: guessAnswers.No,
            hasAHat: guessAnswers.No,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.No,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.Kinda,
            makesPuns: guessAnswers.Yes,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[8].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.No,
            hasAHat: guessAnswers.No,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.Probably
        },
        {
            name: elves[9].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.Kinda,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.Probably
        },
        {
            name: elves[10].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.Probably,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.Yes,
            makesPuns: guessAnswers.Yes,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.Kinda
        },
        {
            name: elves[11].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.No,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.Kinda,
            makesPuns: guessAnswers.Kinda,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.Probably
        },
        {
            name: elves[12].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.Kinda,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[13].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.Yes,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.No,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.Probably
        },
        {
            name: elves[14].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.NotSure,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[15].name,
            hasRedClothes: guessAnswers.NotSure,
            likesBooze: guessAnswers.NotSure,
            hasTwoEyes: guessAnswers.NotSure,
            hasAHat: guessAnswers.NotSure,
            hasLegs: guessAnswers.NotSure,
            hasBeigeSkin: guessAnswers.NotSure,
            hasAMouth: guessAnswers.NotSure,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.NotSure,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[16].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.No,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.NotSure,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.No,
            wantsToDie: guessAnswers.Probably
        },
        {
            name: elves[17].name,
            hasRedClothes: guessAnswers.Kinda,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.Yes,
            hasAGoodSenseOfHumor: guessAnswers.NotSure,
            makesPuns: guessAnswers.Kinda,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[18].name,
            hasRedClothes: guessAnswers.Kinda,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[19].name,
            hasRedClothes: guessAnswers.Yes,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.Probably,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.Yes,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[20].name,
            hasRedClothes: guessAnswers.No,
            likesBooze: guessAnswers.Probably,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.Yes,
            hasBeigeSkin: guessAnswers.Yes,
            hasAMouth: guessAnswers.Yes,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.NotSure,
            makesPuns: guessAnswers.Yes,
            hasWhiteGloves: guessAnswers.No,
            wantsToDie: guessAnswers.No
        },
        {
            name: elves[21].name,
            hasRedClothes: guessAnswers.Kinda,
            likesBooze: guessAnswers.No,
            hasTwoEyes: guessAnswers.Yes,
            hasAHat: guessAnswers.Yes,
            hasLegs: guessAnswers.No,
            hasBeigeSkin: guessAnswers.Kinda,
            hasAMouth: guessAnswers.No,
            hasACheckeredBackground: guessAnswers.No,
            hasAGoodSenseOfHumor: guessAnswers.No,
            makesPuns: guessAnswers.No,
            hasWhiteGloves: guessAnswers.No,
            wantsToDie: guessAnswers.Yes
        }
    ];

    const setQuestionsSubtext = sequencer => {
        sequencer.playerBattleObject.subText[0] = `${sequencer.globalBattleState.questionsLeft} question${sequencer.globalBattleState.questionsLeft !== 1?"s":""} left`;
    }
    const setGuessesSubtext = sequencer => {
        sequencer.playerBattleObject.subText[1] = `${sequencer.globalBattleState.guessesLeft} guess${sequencer.globalBattleState.guessesLeft !== 1?"es":""} left`;
    }

    const readyToAnswerMove = {
        name: "i know who it is!",
        type: "interface",
        process: sequencer => {
            sequencer.globalBattleState.menuPosition = "guess";
            sequencer.globalBattleState.guessIndex = 0;
            return null;
        }
    }
    const askAQuestionMove = {
        name: "ask and deduce",
        type: "interface",
        process: (sequencer,user) => {
            if(sequencer.globalBattleState.questionsLeft >= 1) {
                sequencer.globalBattleState.questionIndex = 0;
                sequencer.globalBattleState.menuPosition = "ask";
                return null;
            } else {
                return {
                    events: [
                        {
                            text: "you don't have any questions left"
                        },
                        {
                            text: "it's time to make a guess"
                        }
                    ]
                }
            }
        }
    }
    const getCurrentSummaryMove = {
        name: "current deductions",
        type: "interface",
        process: sequencer => {
            const deductions = Object.entries(
                sequencer.globalBattleState.currentDeductionsList
            ).filter(
               entry => entry[1] !== guessAnswers.Unknown
            );
            if(deductions.length <= 0) {
                return {
                    text: "there are no deductions yet"
                }
            }
            return {
                events: deductions.map(entry => {
                    return {
                        speech: getDeductionString(entry[0],entry[1],true)
                    }
                })
            }
        }
    }

    const returnToHomeMove = {
        name: "exit",
        type: "interface",
        process: sequencer => {
            sequencer.globalBattleState.menuPosition = "home";
            return null;
        }
    }

    this.getPlayerMoves = sequencer => {
        switch(sequencer.globalBattleState.menuPosition) {
            case "home":
                return [askAQuestionMove,getCurrentSummaryMove,readyToAnswerMove];
            case "guess":
                const elf1Answer = elfProperties[(sequencer.globalBattleState.guessIndex)%elfProperties.length];
                const elf2Answer = elfProperties[(sequencer.globalBattleState.guessIndex+1)%elfProperties.length];
                const questions = [elf1Answer,elf2Answer].map(answer => {
                    const processMethod = answer.name === sequencer.globalBattleState.theAnswerElf.name ?
                    () => {
                        sequencer.globalBattleState.guessesLeft--;
                        setGuessesSubtext(sequencer);
                        returnToHomeMove.process(sequencer);
                        sequencer.globalBattleState.solved = true;
                        return null;
                    }:
                    () => {
                        sequencer.globalBattleState.guessesLeft--;
                        setGuessesSubtext(sequencer);
                        returnToHomeMove.process(sequencer);
                        return {
                            speech: "nope!\n\nthat's not the elf\ni'm thinking of"
                        }
                    };
                    return {
                        name: answer.name,
                        type: "interface",
                        process: processMethod
                    }
                });
                return [
                    returnToHomeMove,
                    {
                        name: "next page",
                        type: "interface",
                        process: sequencer => {
                            sequencer.globalBattleState.guessIndex+=2;
                            return null;
                        }
                    },...questions
                ];
            case "ask":
                const remainingQuestions = Object.entries(
                    sequencer.globalBattleState.currentDeductionsList
                ).filter(
                   entry => entry[1] === guessAnswers.Unknown
                );
                let endQuestions = new Array();
                const q1Index = sequencer.globalBattleState.questionIndex%remainingQuestions.length;
                const q1Key = remainingQuestions[q1Index][0];
                endQuestions.push({
                    name: getQuestionString(q1Key),
                    type: "interface",
                    process: sequencer => {
                        const answerSymbol = sequencer.globalBattleState.theAnswerElf[q1Key];
                        sequencer.globalBattleState.currentDeductionsList[q1Key] = answerSymbol;
                        sequencer.globalBattleState.questionsLeft--;
                        setQuestionsSubtext(sequencer);
                        returnToHomeMove.process(sequencer);
                        return {
                            speech: getDeductionString(q1Key,answerSymbol)
                        }
                    }  
                });
                if(remainingQuestions.length >= 2) {
                    const q2Index = (sequencer.globalBattleState.questionIndex+1)%remainingQuestions.length;
                    const q2Key = remainingQuestions[q2Index][0];
                    endQuestions.push({
                        name: getQuestionString(q2Key),
                        type: "interface",
                        process: sequencer => {
                            const answerSymbol = sequencer.globalBattleState.theAnswerElf[q2Key];
                            sequencer.globalBattleState.currentDeductionsList[q2Key] = answerSymbol;
                            sequencer.globalBattleState.questionsLeft--;
                            setQuestionsSubtext(sequencer);
                            returnToHomeMove.process(sequencer);
                            return {
                                speech: getDeductionString(q2Key,answerSymbol)
                            }
                        }
                    });
                }
                return [
                    returnToHomeMove,
                    {
                        name: "next page",
                        type: "interface",
                        process: sequencer => {
                            sequencer.globalBattleState.questionIndex+=2;
                            return null;
                        }
                    },      
                    ...endQuestions
                ];
        }
    }

    this.name = "corrupt elf";
    this.background = "background-6";
    this.backgroundColor = "white";

    this.darkHover = true;
    this.backgroundCycleTime = 20000;
    this.health = 700;

    this.setup = sequencer => {
        sequencer.playerBattleObject.subText = [];
        sequencer.elfBattleObject.subText = ["thinking of an elf"];
        sequencer.globalBattleState.theAnswerElf = elfProperties[
            Math.floor(Math.random() * elfProperties.length)
        ];
        sequencer.globalBattleState.postTurnProcess = sequencer => {
            if(sequencer.globalBattleState.solved) {
                return {
                    events: [
                        {
                            speech: `yep!\ngreat job\n\nit was ${sequencer.globalBattleState.theAnswerElf.name}`
                        },
                        {
                            text: "corrupt elf died from answer exhaustion",
                            action: () => sequencer.elfBattleObject.dropHealth(sequencer.elfBattleObject.maxHealth)
                        }
                    ]
                }
            }
            if(sequencer.globalBattleState.guessesLeft <= 0) {
                return {
                    events: [
                        {
                            text: "you ran out of guesses"
                        },
                        {
                            text: "you died from question exhaustion",
                            action: () =>
                            sequencer.playerBattleObject.dropHealth(sequencer.playerBattleObject.maxHealth)
                        }
                    ]
                }
            }
            sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
        }
        sequencer.globalBattleState.currentDeductionsList = getDefaultDeductionsList();
        sequencer.globalBattleState.questionsLeft = 6;
        sequencer.globalBattleState.guessesLeft = 3;
        sequencer.globalBattleState.menuPosition = "home";
        setQuestionsSubtext(sequencer);
        setGuessesSubtext(sequencer);
    }

    this.startSpeech = {
        text: "don't you know?\n2.5 heads is better\nthan none\n\nlet's play a game...\nguess who i'm\nthinking of"
    }
    this.winSpeech = "better luck next time!\npractice makes perfect.\n\njust keep studying\nthe elves you murdered.";
    this.loseSpeech = "thanks for playing\nmy game.\n\nbye...\n\nplease leave now.";
}
