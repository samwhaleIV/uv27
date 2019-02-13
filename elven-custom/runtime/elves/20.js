"use strict";
function UpsideDownElf() {

    this.song = "upside_loop";
    this.songIntro = "upside_intro";

    const explodeElfHead = sequencer => {
        sequencer.showAnimation({name:"headExplode"});
        sequencer.setRenderLayer(2,false);
        sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
    }

    const setElfRightSideUp = sequencer => {
        sequencer.setRenderLayer(0,false);
        sequencer.setRenderLayer(1,true);
        sequencer.setRenderLayer(2,true);
    }

    const setElfUpsideDown = sequencer => {
        sequencer.setRenderLayer(0,true);
        sequencer.setRenderLayer(1,false);
        sequencer.setRenderLayer(2,false);
    }

    const operations = {
        Add: Symbol("Add"),
        Subtract: Symbol("Subtract"),
        Multiply: Symbol("Multiply")
    };
    const getRandomOperation = () => {
        const keys = Object.keys(operations);
        return operations[keys[Math.floor(Math.random() * keys.length)]];
    }

    const getOperationSymbol = operation => {
        switch(operation) {
            case operations.Add:
                return "+";
            case operations.Subtract:
                return "-";
            case operations.Multiply:
                return "*";
        }
    }

    const calculateWithOperations = (number1,number2,number3,operation1,operation2) => {
        console.log(number1,operation1,number2,operation2,number3);
        let answer;
        const processSecondOperation = () => {
            switch(operation2) {
                case operations.Multiply:
                    answer = answer * number3;
                    break;
                case operations.Add:
                    answer = answer + number3;
                    break;
                case operations.Subtract:
                    answer = answer - number3;
                    break;
            }
        }
        switch(operation1) {
            case operations.Multiply:
                answer = number1 * number2;
                processSecondOperation();
                break;
            case operations.Add:
                if(operation2 === operations.Multiply) {
                    answer = number1 + (number2 * number3);
                } else {
                    answer = number1 + number2;
                    processSecondOperation();
                }
                break;
            case operations.Subtract:
                if(operation2 === operations.Multiply) {
                    answer = number1 - (number2 * number3);
                } else {
                    answer = number1 - number2;
                    processSecondOperation();
                }
                break;
        }
        console.log("Answer",answer);
        return answer;
    }

    const getMathProblemSet = difficulty => {
        const number1 = (Math.floor(Math.random() * 9) + 1) + Math.floor(Math.random() * (difficulty*50));
        const number2 = (Math.floor(Math.random() * 9) + 1) + Math.floor(Math.random() * (difficulty*50));
        const number3 = (Math.floor(Math.random() * 9) + 1) + Math.floor(Math.random() * (difficulty*50));

        const operation1 = getRandomOperation();
        const operation2 = getRandomOperation();

        const realAnswer = calculateWithOperations(number1,number2,number3,operation1,operation2);

        let number1Pass = false;
        let number2Pass = false;
        let number3Pass = false;

        let fakeAnswer1;
        let fakeAnswer2;
        let fakeAnswer3;

        const flaggedCount = () => {
            let count = 0;
            if(number1Pass) {
                count++;
            }
            if(number2Pass) {
                count++;
            }
            if(number3Pass) {
                count++;
            }
            return count;
        }

        while(flaggedCount() < 3) {
            const fakeNumber1 = Math.round(Math.random() * 4) - 2;
            const fakeNumber2 = Math.round(Math.random() * 4) - 2;
            const fakeNumber3 = Math.round(Math.random() * 4) - 2;
    
            fakeAnswer1 = calculateWithOperations(fakeNumber1,number2,number3,operation1,operation2);
            fakeAnswer2 = calculateWithOperations(number1,fakeNumber2,number3,operation1,operation2);
            fakeAnswer3 = calculateWithOperations(number1,number2,fakeNumber3,operation1,operation2);

            number1Pass = true;
            number2Pass = true;
            number3Pass = true;

            if(fakeAnswer1 === fakeAnswer3) {
                number1Pass = false;
            }
            if(fakeAnswer2 === fakeNumber1) {
                number2Pass = false;
            }
            if(fakeAnswer3 === fakeNumber2) {
                number3Pass = false;
            }

            if(fakeAnswer1 === realAnswer) {
                number1Pass = false;
            }
            if(fakeAnswer2 === realAnswer) {
                number2Pass = false;
            }
            if(fakeAnswer3 === realAnswer) {
                number3Pass = false;
            }
        }
        const realAnswerString = String(realAnswer);
        const options = [realAnswerString];
        if(number1Pass) {
            options.push(String(fakeAnswer1));
        }
        if(number2Pass) {
            options.push(String(fakeAnswer2));
        }
        if(number3Pass) {
            options.push(String(fakeAnswer3));
        }

        let number1String = number1;
        if(number1 < 0) {
            number1String = `(${number1String})`;
        }

        let number2String = number2;
        if(number2 < 0) {
            number2String = `(${number2String})`
        }

        let number3String = number3;
        if(number3 < 0) {
            number3String = `(${number3String})`
        }

        

        const formulaString = `${number1String} ${getOperationSymbol(operation1)} ${number2String} ${getOperationSymbol(operation2)} ${number3String}`;

        return {
            answer: realAnswerString,
            moves: getRadioSet(options),
            formula: formulaString
        }
    }


    const exitBattle = sequencer => {
        sequencer.playerBattleObject.dropHealth(sequencer.playerBattleObject.maxHealth);
        return {
            text: "you killed yourself to get out of here"
        }
    }
    const pressTheRedButtonEvent = {speech: "okay - now just press\nthe big red button\nto start the\nparticle accelerator",persist:true};
    const instructionsText = `create some subatomic\nparticles\nfor me and reverse the\npolarity of gravity.`;

    const setASubText = (sequencer,index,name,count) =>
        sequencer.playerBattleObject.subText[index] = `${count} ${name}${count !== 1?"s":""}`;
    const updateParticlesSubText = sequencer =>
        setASubText(sequencer,0,"particle",sequencer.playerBattleObject.state.particles);
    const updateHeliumSubText = sequencer =>
        setASubText(sequencer,1,"helium atom",sequencer.playerBattleObject.state.helium);
    const updateHydrogenSubText = sequencer =>
        setASubText(sequencer,2,"hydrogen atom",sequencer.playerBattleObject.state.hydrogen);
    const updateGravitonsSubText = sequencer =>
        setASubText(sequencer,3,"graviton",sequencer.playerBattleObject.state.gravitons);

    const setAllSubtext = sequencer => {
        updateParticlesSubText(sequencer);
        updateHeliumSubText(sequencer);
        updateHydrogenSubText(sequencer);
        updateGravitonsSubText(sequencer);
    }

    const initializeSubtextState = sequencer => {
        sequencer.playerBattleObject.subText = [];

        sequencer.playerBattleObject.state.particles = 0;
        sequencer.playerBattleObject.state.helium = 0;
        sequencer.playerBattleObject.state.hydrogen = 0;
        sequencer.playerBattleObject.state.gravitons = 0;

        setAllSubtext(sequencer);
    }
    const moveTree = {
        start1: [
            {
                name: "what do i do?",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start2);
                    return {
                        speech: `oh. easy.\n\n${instructionsText}`,
                    }
                }
            },
            {
                name: "bye felecia",
                type: "interface",
                process: sequencer => exitBattle(sequencer)
            },
            {
                name: "f**k off",
                type: "interface",
                process: sequencer => exitBattle(sequencer)
            }
        ],
        start2: [
            {
                name: "what?",
                type: "interface",
                process: () => {
                    return {
                        speech: `i said...\n\n${instructionsText}`,
                    }                   
                }
            },
            {
                name: "particle accelerator?",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start3);
                    return {
                        speech: "yes - we've got one.\n\n(it's genuine \nelfmart brand)"
                    }
                }
            },
            {
                name: "i want to go home plz",
                type: "interface",
                process: sequencer => exitBattle(sequencer)
            }
        ],
        start3: [
            {
                name: "i'll try my best",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start4);
                    return {
                        speech: "thanks - i appreicate it\n\nare you ready?",
                        persist: true
                    }
                }
            },
            {
                name: "why would i help you?",
                type: "interface",
                process: () => {
                    return {
                        speech: "you want to finish\nthis game\ndon't you?\n\nthat's what i thought"
                    }
                }
            },
            {
                name: "i am still confused",
                type: "interface",
                process: () => {
                    return {
                        speech: `oi you're dense...\n\n${instructionsText}`
                    }
                }
            }
        ],
        startSub4: [
            {
                name: "yolo",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start5);
                    return {
                        events: [
                            {speech: "yolo?\n\nthe perfect spirit for\nsomeone working with a\nparticle accelerator!\n\nright this way"},
                            pressTheRedButtonEvent
                        ]
                    }
                }
            },
            {
                name: "let me think for a sec",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start4);
                    return null;
                }
            },
        ],
        start4: [
            {
                name: "i am not a scientist",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.startSub4);
                    return {
                        speech: "i'm running out\nof options.\n\nthis might be dangerous\nif you're not legit.\ndo you want to\ntry anyways?",
                        persist: true
                    }
                }
            },
            {
                name: "show me the money",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.start5);
                    return {
                        speech: "i'm not paying you!\n\ngreedy jerk...\n\nyou know what?\nfigure this out\non your own",
                        persist: true
                    }
                }
            },
            {
                name: "i am ready for anything",
                type: "interface",
                process: (sequencer,user) => {
                    sequencer.updatePlayerMoves(moveTree.start5);
                    return {
                        events: [
                            {
                                speech: "you must be a scientist\n\nhere - take this then\n\nyou'll need it"
                            },
                            {
                                text: "you received an elfmart brand lab coat",
                                action: sequencer => {
                                    user.state.hasLabCoat = true;
                                }
                            },
                            pressTheRedButtonEvent
                        ]
                    }
                }
            }
        ],
        start5: [
            {
                name: "big hug",
                type: "interface",
                process: () => {
                    return {
                        speech: "please don't hug me\nwhile i'm upside down\n\nthink of\nthe implication..."
                    }
                }
            },
            {
                name: "big red button",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.acceleratorHome);
                    return {
                        events: [
                            {
                                text: "you have started the particle accelerator"
                            },
                            {
                                speech: "you're a pro\n\nhave you done this before?\n\ni expect you can figure\nit out from here"
                            },
                            {
                                action: sequencer => initializeSubtextState(sequencer)
                            }
                        ]
                    }
                }
            },
            {
                name: "big rewards",
                type: "interface",
                process: () => {
                    return {
                        speech: "ah yes - the reward of\nhelping a fellow friend\n\ninvaluable"
                    }
                }
            },
            {
                name: "big thrills",
                type: "interface",
                process: () => {
                    return {
                        speech: "it's a f***ing particle\naccelerator - what more\nthrill do you need?"
                    }
                }
            }
        ],
        particlePurchaseScreen: [
            {
                name: "back",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.acceleratorHome);
                    return null;
                }
            },
            {
                name: "gravitons - 4 particles",
                type: "option",
                process: (sequencer,user) => {
                    if(user.state.particles >= 4) {
                        user.state.particles -= 4;
                        user.state.gravitons += 1;
                        updateParticlesSubText(sequencer);
                        updateGravitonsSubText(sequencer);
                        return {
                            text: "you received 1 graviton"
                        }
                    } else {
                        return {
                            text: "you don't have enough particles"
                        }
                    }
                }
            },
            {
                name: "hydrogen - 1 particle",
                type: "option",
                process: (sequencer,user) => {
                    if(user.state.particles >= 1) {
                        user.state.particles--;
                        user.state.hydrogen++;
                        updateParticlesSubText(sequencer);
                        updateHydrogenSubText(sequencer);
                        return {
                            text: "you received 1 hydrogen atom"
                        }
                    } else {
                        return {
                            text: "you don't have enough particles"
                        }
                    }
                }
            },
            {
                name: "helium - 2 particles",
                type: "option",
                process: (sequencer,user) => {
                    if(user.state.particles >= 2) {
                        user.state.particles -= 2;
                        user.state.helium++;
                        updateParticlesSubText(sequencer);
                        updateHeliumSubText(sequencer);
                        return {
                            text: "you received 1 helium atom"
                        }
                    } else {
                        return {
                            text: "you don't have enough particles"
                        }
                    }
                }
            }
        ],
        acceleratorHome: [
            {
                name: "particle generation",
                type: "interface",
                process: (sequencer,user) => {
                    if(!user.state.hasLabCoat) {
                        return {
                            events: [
                                {
                                    text: "uh oh - you don't have a lab coat"
                                },
                                {
                                    text: "the machine mistook you for particles",
                                    action: () => user.dropHealth(user.maxHealth)
                                }
                            ]
                        }
                    }
                    let mathProblemCount = 4;
                    let mathProblem = getMathProblemSet(0);
                    const setMovesToProblem = () => {
                        sequencer.updatePlayerMoves(mathProblem.moves.map(move => {
                            let processMethod;
                            if(move.name === mathProblem.answer) {
                                processMethod = sequencer => {
                                    if(--mathProblemCount > 0) {
                                        const difficulty = 4 - mathProblemCount;
                                        mathProblem = getMathProblemSet(difficulty);
                                        const newParticles = 1 + Math.floor(difficulty / 2);
                                        return {
                                            events: [
                                                {
                                                    text: `correct! you received ${newParticles} particle${newParticles !== 1?"s":""}`,
                                                    action: () => {
                                                        user.state.particles+=newParticles;
                                                        updateParticlesSubText(sequencer);
                                                    }
                                                },
                                                {
                                                    speech: `please solve\nthis problem:\n\n${mathProblem.formula}`,
                                                    persist: true,
                                                    action: () => setMovesToProblem()
                                                }
                                            ]
                                        }
                                    } else {
                                        sequencer.updatePlayerMoves(moveTree.acceleratorHome);
                                        return {
                                            events: [
                                                {
                                                    speech: "good job! you got them\nall right\n\nyou're a natural"
                                                },
                                                {
                                                    speech: "keep doing this and\ni'll be right side\nup in no time"
                                                }
                                            ]
                                        }
                                    }
                                }
                            } else {
                                processMethod = (sequencer,user) => {
                                    user.dropHealth(40);
                                    return {
                                        events: [
                                            {
                                                speech: "oh no!\nthat was wrong!\n\nplease be careful.\n\nthis machine is very\ndelicate!",
                                                action: sequencer => sequencer.updatePlayerMoves(moveTree.acceleratorHome)
                                            }
                                        ]
                                    }
                                }
                            }
                            return {
                                name: move.name,
                                type: "interface",
                                process: processMethod
                            }
                        }));
                    }
                    return {
                        events: [
                            {
                                speech: "okay - just folow these\ninstructions\n\nand remember...\n\npudgy elves may\ndemand a snack"
                            },
                            {
                                speech: `please solve\nthis problem:\n\n${mathProblem.formula}`,
                                persist: true,
                                action: () => setMovesToProblem()
                            }
                        ]
                    }
                }
            },
            {
                name: "particle refinement",
                type: "interface",
                process: sequencer => {
                    sequencer.updatePlayerMoves(moveTree.particlePurchaseScreen);
                    return null;
                }
            },
            {
                name: "nuclear fusion",
                type: "interface",
                process: (sequencer,user,target) => {
                    const insufficientText = "you need at least 3 hydrogen and 2 helium";
                    if(user.state.helium >= 2 && user.state.hydrogen >= 3) {
                        user.state.helium-=2;
                        user.state.hydrogen-=3;
                        updateHeliumSubText(sequencer);
                        updateHydrogenSubText(sequencer);
                        
                        user.state.particleGenerations++;
                        if(user.state.particleGenerations === 1) {
                            return {
                                text: "nuclear fusion will now generate you particles"
                            }
                        } else if(user.state.particleGenerations > 10) {
                            user.dropHealth(user.maxHealth);
                            target.dropHealth(target.maxHealth);
                            return {
                                events: [
                                    {
                                        text: "the fusion generator went over capacity"
                                    },
                                    {
                                        text: "everyone got blown into tiny little pieces"
                                    }
                                ]
                            }
                        }else {
                            return {
                                text: "nuclear fusion output increased"
                            }
                        }

                        
                    } else {
                        return {
                            text: insufficientText
                        }
                    }
                }
            },
            {
                name: "gravity reversal",
                type: "target",
                process: (sequencer,user,target) => {
                    if(user.state.gravitons >= 3) {
                        user.state.gravitons-=3;
                        updateGravitonsSubText(sequencer);
                        target.state.swapCount++;
                        if(target.state.swapCount > 3) {
                            if(!target.state.rightSideUp) {
                                target.state.rightSideUp = true;
                                setElfRightSideUp(sequencer);
                                return {
                                    events: [
                                        {
                                            speech: "aghhhhhhh\n\n*a boiling sound begins*"
                                        },
                                        {
                                            text: "the poor elf couldn't handle the gravity shift",
                                            action: () => explodeElfHead(sequencer)
                                        }
                                    ]
                                }
                            }
                        }
                        if(target.state.rightSideUp) {
                            target.state.rightSideUp = false;
                            setElfUpsideDown(sequencer);
                            return {
                                events: [
                                    {
                                        speech: "oh no!\nnow the blood is pooling\nthe other way!\n\nthis hurts so much!"
                                    },
                                    {
                                        speech: "quick!\nchange it back!"
                                    }
                                ]
                            }
                        } else {
                            target.state.rightSideUp = true;
                            setElfRightSideUp(sequencer);
                            return {
                                events: [
                                    {
                                        speech: "ouch!\n\nyou hurt my\nblood circulation!"
                                    },
                                    {
                                        speech: "quick!\nchange it back!"
                                    }
                                ]
                            }
                        }
                    } else {
                        return {
                            text: "you need at least 3 gravitons"
                        }
                    }
                }
            }
        ]
    }

    this.getDefaultGlobalState = () => {
        return {
            postTurnProcess: sequencer => {
                if(sequencer.playerBattleObject.state.particleGenerations > 0) {
                    sequencer.playerBattleObject.state.particles += sequencer.playerBattleObject.state.particleGenerations;
                    updateParticlesSubText(sequencer);
                    return {
                        text: `nuclear fusion generated you ${
                            sequencer.playerBattleObject.state.particleGenerations
                        } particle${
                            sequencer.playerBattleObject.state.particleGenerations !== 1 ? 's' : ''
                        }`
                    }
                }
            }
        }
    }

    this.setup = sequencer => {
        sequencer.elfBattleObject.state.swapCount = 0;
        sequencer.elfBattleObject.state.rightSideUp = false;
        sequencer.playerBattleObject.state.hasLabCoat = false;
        sequencer.playerBattleObject.state.particleGenerations = 0;
    }

    this.startSpeech = {
        text: "help!\ni'm stuck upside down\n\nan experiment\nwent wrong...\n\nnow i need your help",
        persist: true
    }

    this.name = "upside down elf";
    this.background = "background-3";
    this.backgroundColor = "red";
    this.health = 450;
    this.defaultRenderLayers = [true,false,false];
    this.playerMoves = moveTree.start1;
}
