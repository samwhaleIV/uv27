/*
BattleObject = {
        isPlayer: <bool>
        isElf: <bool>
        isDead: <bool>
        isAlive: <bool>
        health: <number/int>
        maxHealth: <number/int>

        name: <return string>,
        disabledMoves: {
            <name>: <bool>
        }

    };

/*

Adding health and removing health:
    -sequencer.dropHealth(target,amount)
    -sequencer.addHealth(target,amount)

-sequencer.turnNumber -> <number/int>
-sequencer.globalBattleState -> {}
-sequencer.updatePlayerMoves(moves)

*/

const moves = {
    "nothing": {   
        type: "self",
        name: "nothing",
        process: () => {
            return {
                text: "nothing happened"
            }
        }
    },
    "disable": {
        type: "target",
        name: "disable",
        process: (sequencer,user,target) => {
            if(target.lastMove === null) {
                return {
                    failed: true
                }
            } else {
                if(target.disabledMoves[target.lastMove]) {
                    return {
                        text: `but ${target.lastMove} is already disabled`
                    }
                } else {
                    target.disabledMoves[target.lastMove] = true;
                    return {
                        text: target.isPlayer ?
                            `your ${target.lastMove} got disabled`:
                            `${target.name}'${
                                !target.name.endsWith("s")?"s":""
                            } ${target.lastMove} got disabled`
                    }
                }
            }
        }
    },
    "also nothing":{
        type: "target",
        name: "also nothing",
        process: () => {
            return {
                text: "*crickets*"
            }
        }
    },
    "cry": {
        type: "self",
        name: "cry",
        process: (sequencer,user) => {

            let text = !user.state.isCrying ?
                `${user.name} ${user.isPlayer ? "are" : "is"} now crying`:
                `${user.name} continue${user.isElf ? "s" : ""} to cry`;

            user.state.isCrying = true;
            return {
                text: text
            }
        }
    },
    "honorable suicide": {
        type: "self",
        name: "honorable suicide",
        process: (sequencer,user) => {
            sequencer.dropHealth(user,user.maxHealth);
            return {
                text: `${user.name} made an honor bound choice`
            }
        }
    },
    "senseless murder": {
        type: "target",
        name: "senseless murder",
        process: (sequencer,user,target) => {
            sequencer.dropHealth(target,target.maxHealth);
            return {
                text: `${target.name} got fucked up`
            }
        }
    },
    "decent punch": {
        type: "target",
        name: "decent punch",
        process: (sequencer,user,target) => {

            let damage = 15;
            if(user.state.atePunchingVitamins) {
                damage += damage;
            }

            sequencer.dropHealth(target,damage);
            if(target.health > 0) {
                return {
                    text: `${target.name} might need some ice`
                }
            } else {
                return {
                    text: `${target.name} didn't survive that`
                }
            }
        }
    },
    "wimpy punch": {
        type: "target",
        name: "wimpy punch",
        process: (sequencer,user,target) => {

            let damage = 10;
            if(user.state.atePunchingVitamins) {
                damage += damage;
            }

            sequencer.dropHealth(target,damage);
            if(target.health > 0) {
                return {
                    text: `${target.name} might cry now`
                }
            } else {
                return {
                    text: `${target.name} got punched out`
                }
            }
        }
    },
    "wimpier punch": {
        type: "target",
        name: "wimpier punch",
        process: (sequencer,user,target) => {
            const responses = [
                ()=>`${user.name} look${user.isElf ?"s" : ""} confused`,
                ()=>`${target.name} think${target.isElf ?"s" : ""} ${user.name} held back`
            ];
            let damage = 5;
            if(user.state.atePunchingVitamins) {
                damage += damage;
            }
            sequencer.dropHealth(target,damage);
            if(target.health > 0) {
                return {
                    text: responses[Math.floor(Math.random() * responses.length)]()
                };
            } else {
                return {
                    text: "it was a knock out hit"
                }
            }
        }
    },
    "nutcracker": {
        type: "target",
        name: "nutcracker",
        process: (sequencer,user,target) => {
            if(target.state.squirrels >= 1) {
                if(target.isPlayer) {
                    return {
                        text: `but your squirrel${target.state.squirrels === 1 ? "" : "s"} protected you`
                    }
                } else {
                    return {
                        text: "but squirrels protect against this"
                    }
                }
            }
            sequencer.dropHealth(target,Math.floor(target.maxHealth * 0.25));
            if(target.health > 0) {
                return {
                    text: `${target.name} ${target.isPlayer ? "are" : "is"} in immeasurable pain`
                }
            } else {
                return {
                    text: `${target.name} tragically died`
                }
            }

        }
    },
    "i love santa": {
        type: "self",
        name: "i love santa",
        process: (sequencer,user) => {
            if(user.isElf) {
                sequencer.addHealth(user,user.maxHealth);
                return {
                    text: `${user.name} had their health restored`
                }
            } else {
                sequencer.dropHealth(user,user.maxHealth);
                return {
                    text: `${user.name} had their health drained`
                }
            }
        }
    },
    "band aid": {
        type: "self",
        name: "band aid",
        process: (sequencer,user) => {
            sequencer.addHealth(user,10);
            return {
                text: `${user.name} used a band aid`
            }
        }
    },
    "health swap": {
        type: "target",
        name: "health swap",
        process: (sequencer,user,target) => {
            const userHealth = user.health;
            const targetHealth = target.health;
            if(userHealth === targetHealth) {
                return {
                    text: "but it had no effect"
                }
            } else if(userHealth < targetHealth) {
                const difference = targetHealth - userHealth;

                sequencer.addHealth(user,difference);
                sequencer.dropHealth(target,difference);
            } else {
                const difference = userHealth - targetHealth;

                sequencer.addHealth(target,difference);
                sequencer.dropHealth(user,difference);
            }
            return {
                text: `${user.name} and ${target.name} swapped health`
            }
        }
    },
    "violent spell": {
        type: "target",
        name: "violent spell",
        process: (sequencer,user,target) => {
            sequencer.dropHealth(user,10);
            sequencer.dropHealth(target,20);
            return {
                text: "and got hurt by recoil"
            }
        }
    },
    "magic": {
        type: "self",
        name: "magic",
        process: () => {
            return {
                text: "but there's no such thing"
            }
        }
    },
    "self punch": {
        type: "self",
        name: "self punch",
        process: (sequencer,user) => {
            sequencer.dropHealth(
                user,user.state.atePunchingVitamins ? 30 : 15
            );
            return {
                text: `${user.name} ha${user.isPlayer ? "ve" : "s"} self esteem issues`
            }
        }
    },
    "protect": {
        type: "self",
        name: "protect",
        process: (sequencer,user) => {
            if(user.isElf) {
                return {
                    text: `but elves don't know how to do this`
                }
            }
            user.state.protectTurn = sequencer.turnNumber;
            user.state.isProtected = true;
            return {
                failed: false
            }
        }
    },
    "punching vitamins": {
        type: "self",
        name: "punching vitamins",
        process: (sequencer,user) => {
            if(user.state.atePunchingVitamins) {
                sequencer.dropHealth(user,user.maxHealth);
                return {
                    text: `but ${user.isPlayer ? "you" : "they"} didn't read the warning label`
                }
            }
            user.state.atePunchingVitamins = true;
            return {
                text: `${user.name} will have stronker punches now`
            }
        }
    }
};

const getOptionMove = (moveName,questionID,optionID) => {
    return {
        name: moveName,
        type: "option",
        process: (sequencer,user) => {
            user.state[questionID] = optionID || moveName;
            return {
                failed: false
            }
        }
    }
}

const getRadioSet = (options,questionID) => {
    const moves = [];
    for(let i = 0;i<options.length;i++) {
        moves[i] = getOptionMove(options[i],questionID,i);
    }
    return moves;
}

const protectPreProcessPlayer = (sequencer,move) => {
    if(move.name === "protect") {
        if(!isNaN(sequencer.playerBattleObject.state.protectTurn)) {
            if(sequencer.turnNumber >= sequencer.playerBattleObject.state.protectTurn+2) {
                return move;
            } else {
                return {
                    name: "player variant protection preprocessor",
                    process: () => {
                        return {
                            failed: true,
                            text: "but you used it last turn"
                        }
                    }
                }
            }
        } else {
            return move;
        }
    }
    return move;
}

const protectPressProcessElf = (sequencer,move) => {
    if(move.type === "target" && sequencer.playerBattleObject.state.isProtected) {
        sequencer.playerBattleObject.state.isProtected = false;
        return {
            process: () => {
                return {
                    name: "elf variant protection preprocessor",
                    failed: true,
                    text: "but you are protected"
                }
            }
        }
    }
    return move;
}

const elves = [
    /* Full schema:
    {
        name: <string>
        -background: <image dictionary name>
        -backgroundColor: <css color>

        Elves always go second. This move follows a player move.
        -getMove: function(sequencer)

        This is post move text. Win speech is used if the player died from the move.
        -getSpeech: function(sequencer) -> {text:<string>(\n delimited),persist:<boolean>}

        -playerMoves: Array<moves> (4 or less)

        Player always starts with 100
        -health: <number>

        The speech used if the elf wins and kills the player
        -getWinSpeech: function(sequencer) -> (\n delimited)

        The speech used if the player wins and kills the elf
        -getLoseSpeech: function(sequencer) -> (\n delimited)

        The text to show in the message feed box when the elf screen loads
        -startText: <string>
        -startSpeech: <string>

        -getDefaultPlayerState: function() -> {}
        -getDefaultElfState: function() -> {}
        -getDefaultGlobalState: function() -> {}

        -setup: function(sequencer)
    }

    */
    {
        name: "wimpy red elf",
        background: "background-1",
        backgroundColor: "red",
        getMove: sequencer => {
            return moves["cry"];
        },
        getSpeech: sequencer => {
            const elfBattleObject = sequencer.elfBattleObject;

            const speeches = ["i never learned to fight","stop this plz","i am just a poor elf"];
            if(elfBattleObject.state.speechIndex === undefined) {
                elfBattleObject.state.speechIndex = 0;
            } else {
                elfBattleObject.state.speechIndex = (elfBattleObject.state.speechIndex + 1) % speeches.length;
            }
            return {
                text: speeches[elfBattleObject.state.speechIndex] + "\n*crying sounds*"
            }
        },
        playerMoves: [
            moves["nothing"],moves["also nothing"],moves["honorable suicide"],moves["senseless murder"]
        ],
        health: 100,

        getWinSpeech: () => "bye\nthanks for stopping by\ncome again some time",
        getLoseSpeech: () => "*cue famous last words*\ni am one but we are many\n*dies*"
    },
    {
        name: "wimpy green elf",
        background: "background-1",
        backgroundColor: "green",
        health: 100,
        startText: "this battle will be harder so no crying",
        playerMoves: [
            moves["wimpy punch"],
            moves["cry"],
            moves["nothing"]
        ],
        getMove: sequencer => {
            if(sequencer.elfBattleObject.health <= 20) {
                return moves["i love santa"];
            } else if(sequencer.playerBattleObject.health < 50) {
                return moves["nutcracker"];
            }else {
                return moves["wimpier punch"];
            }
        },
        getSpeech: sequencer => {
            if(sequencer.playerBattleObject.lastMove === "cry") {
                if(!sequencer.globalBattleState.turnsCrying) {
                    sequencer.globalBattleState.turnsCrying = 0;
                }
                sequencer.globalBattleState.turnsCrying++;
                if(!sequencer.globalBattleState.noticedThatCryingStopped || sequencer.globalBattleState.turnsCrying === 4) {
                    sequencer.globalBattleState.noticedThatCryingStopped = false;
                    switch(sequencer.globalBattleState.turnsCrying) {
                        case 1:
                            return {
                                text: "ah what did i say\nabout crying"
                            };
                        case 2:
                            return {
                                text: "i really don't like this"
                            };
                        case 3:
                            return {
                                text: "your crying makes me\nuncomfortable"
                            };
                        default:
                        case 4:
                            return {
                                text: "i can't take it\nanymore"
                            };
                    }
                } else {
                    sequencer.globalBattleState.noticedThatCryingStopped = false;
                    return {
                        text: "ugh\nyou stopped\nwhy start again\njust be happy"
                    };
                }
            } else {
                sequencer.playerBattleObject.state.isCrying = false;
                if(sequencer.globalBattleState.turnsCrying && sequencer.globalBattleState.turnsCrying > 0) {
                    sequencer.globalBattleState.noticedThatCryingStopped = true;
                    const responses = ["phew\nthanks for stopping","good\nno more crying","this is fine"];
                    return {
                        text: responses[Math.floor(Math.random() * responses.length)]
                    };
                } else {
                    return {
                        text: "this is fine\njust don't cry"
                    };
                }
            }
            return {
                text: null
            }
        },
        getDefaultGlobalState: () => {
            return {
                postTurnProcess: sequencer => {
                    if(sequencer.globalBattleState.turnsCrying) {
                        if(sequencer.globalBattleState.turnsCrying >= 4) {
                            sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
                            return {
                                text: `${sequencer.elfBattleObject.name} was consumed by your sadness`
                            }
                        }
                    }
                    return {};
                },
            }
        },
        startSpeech: {
            text: "hello i am green elf\nplz be nice\ni come in piece"
        }
    },
    {
        name: "wimpy blue elf",
        background: "background-1",
        backgroundColor: "blue",
        health: 100,
        startText: "you received an empty revolver",
        startSpeech: {
            text: "here is a revolver\nlet's see if you know\nhow to use it"
        },
        setup: sequencer => {
            sequencer.playerBattleObject.subText = ["0 coins"];
        },
        getLoseSpeech: sequencer => {
            return "took you long enough\n*ded*"
        },
        getWinSpeech: sequencer => {
            return "well that's the\nlast time i give\nsomeone a gun"
        },
        getSpeech: sequencer => {
            const responses = [
                "hi\ni love talking",
                "do you like talking",
                "you don't look well",
                "are you nervous",
                "who sent you here",
                "i had a cat once",
                "idk what color i am\ni am color blind",
                "the other elves are cool",
                "have you ever used\na gun before",
                "why did i give you\na gun anyways",
                "this is seeming\nlike a bad idea in\nhindsight",
                (()=>{
                    if(sequencer.playerBattleObject.state.loadedBullets && sequencer.playerBattleObject.state.loadedBullets > 0) {
                        return {
                            text: "oh jeez\nquick and painless\nplz"
                        };
                    } else {
                        return {
                            text: "good thing you haven't\nloaded your revolver"
                        };
                    }
                })(),
                "i really like spinning",
                "here is my new single\n*spinning*\nby me",
                "just keep spinning\n",
                "spinning spinning\nspinning spinning",
                "baby you spin me\nright round\nbaby right round",
                "spin spin spin",
                "come on already",
                "i didn't think\nyou would be\nthis useless",
                "i am getting impatient",
                "don't make me talk\nabout my neighbor",
                "okay\nmy neighbor's\nname is dave",
                "my neighbor dave\nis a cool dude",
                "i bet you'd like to\nmeet dave",
                "did you give up on\nshooting me",
                "i give up too",
                "*yawn*",
                "i talked about\everything",
                "there's nothing left\nto say",
                "just kill me",
                "*more yawning*"
            ];
            let responseIndex;
            if(sequencer.turnNumber >= responses.length) {
                responseIndex = responses.length - 1;
            } else {
                responseIndex = sequencer.turnNumber;
            }
            return {
                text: responses[responseIndex]
            };
        },
        getMove: sequencer => {
            if(sequencer.turnNumber % 2 !== 0) {
                return {
                    type: "target",
                    name: "charity",
                    process: (sequencer,user,target) => {
                        if(!target.state.money) {
                            target.state.money = 0;
                        }
                        target.state.money += 4;
                        target.subText[0] = `${target.state.money} coin${target.state.money === 1 ? "" : "s"}`;
                        return {
                            text: `${user.name} gave you 4 coins for your pain`
                        }
                    }
                }
            } else {
                return {
                    type: "target",
                    name: "chit chat",
                    process: (sequencer,user,target) => {
                        sequencer.dropHealth(target,4);
                        return {
                            text: "the build up scares and hurts you a little"
                        }
                    }
                }
            }
        },
        playerMoves: [
            {
                type: "self",
                name: "buy bullet - 5 coins",
                process: (sequencer,user) => {
                    if(user.state.money && user.state.money >= 5) {
                        user.state.money -= 5;
                        user.subText[0] = `${user.state.money} coin${user.state.money === 1 ? "" : "s"}`;
                        if(!user.state.bullets) {
                            user.state.bullets = 0;
                        }
                        user.state.bullets++;
                        user.subText[1] = `${user.state.bullets} bullet${user.state.bullets === 1 ? "" : "s"}`;
                        return {
                            text: "you bought one bullet for 5 coins"
                        }
                    } else {
                        return {
                            text: "but you have don't have 5 coins"
                        }
                    }
                }
            },
            {
                type: "self",
                name: "load chamber",
                process: (sequencer,user) => {
                    if(user.state.bullets && user.state.bullets > 0) {
                        if(!user.state.loadedBullets) {
                            user.state.loadedBullets = 0;
                        } else if(user.state.loadedBullets === 6) {
                            return {
                                text: "but you can't jam more bullets in"
                            }
                        }
                        if(user.state.freshSpin) {
                            user.subText[3] = "not spun";
                        }
                        user.state.freshSpin = false;
                        let newBullets = 0;
                        while(user.state.loadedBullets < 6 && user.state.bullets > 0) {
                            newBullets++;
                            user.state.bullets--;
                            user.state.loadedBullets++;
                        }
                        user.subText[1] = `${user.state.bullets} bullet${user.state.bullets === 1 ? "" : "s"}`;
                        user.subText[2] = `${user.state.loadedBullets} loaded`;
                        return {
                            text: `you loaded the chamber with ${newBullets} bullet${newBullets !== 1 ? "s":""}`
                        }
                    } else {
                        return {
                            text: "but you have no bullets"
                        }
                    }
                }
            },
            {
                type: "self",
                name: "spin chamber",
                process: (sequencer,user) => {
                    if(user.state.loadedBullets && user.state.loadedBullets > 0) {
                        user.state.freshSpin = true;
                        user.subText[3] = "spun";
                        return {
                            text: "you spun your chamber"
                        }
                    } else {
                        return {
                            text: "you spun an empty chamber"
                        }
                    }
                }
            },
            {
                type: "target",
                name: "boom",
                process: (sequencer,user,target) => {
                    if(user.state.loadedBullets && user.state.loadedBullets > 0) {
                        if(user.state.freshSpin) {
                            user.state.freshSpin = false;
                            user.subText[3] = "not spun";
                            if(Math.random() <= user.state.loadedBullets / 6) {
                                user.state.loadedBullets--;
                                user.subText[2] = `${user.state.loadedBullets} loaded`;
                                if(Math.random() > 0.5) {
                                    sequencer.dropHealth(target,target.maxHealth);
                                    return {
                                        text: "you landed your shot"
                                    }
                                } else {
                                    return {
                                        text: "but you missed your shot"
                                    }
                                }
                            } else {
                                return {
                                    text: "but the odds weren't in your favor"
                                }
                            }
                        } else {
                            return {
                                text: "but you need spin and pray first"
                            }
                        }
                    } else {
                        return {
                            text: "but there's no loaded bullets in the chamber"
                        }
                    }
                }
            }
        ],

    },
    {
        name: "wizard elf",
        background: "background-1",
        backgroundColor: "purple",
        health: 125,
        playerMoves: [
            moves["decent punch"],
            moves["self punch"],
            moves["band aid"],
            moves["health swap"]
        ],
        getMove: sequencer => {
            if(sequencer.playerBattleObject.health === 15) {
                return moves["decent punch"];
            } else if(sequencer.playerBattleObject.health === 20) {
                return moves["violent spell"];
            }
            if(sequencer.elfBattleObject.health <= 30 &&
                sequencer.playerBattleObject.health > sequencer.elfBattleObject.health && sequencer.playerBattleObject.lastMove !== "health swap") {
                return moves["health swap"]
            } else {
                switch(sequencer.turnNumber % 3) {
                    case 0:
                        return moves["decent punch"]
                    case 1:
                        return moves["violent spell"]
                    case 2:
                        return moves["magic"];
                }
            }
        }
    },
    {
        name: "red elfette",
        background: "background-1",
        backgroundColor: "red",
        health: 150,
        playerMoves: [
            moves["protect"],
            moves["wimpy punch"],
            moves["punching vitamins"]
        ],
        getWinSpeech: sequencer => {
            return "i told you i was\na good boxer\nsee ya around"
        },
        getLoseSpeech: sequencer => {
            return "this is...\nimpossible"
        },
        startSpeech: {
            text: "i might not\n-look- like a\nboxer... but it's my\nmy strong passion\ni am the best"
        },
        getSpeech: sequencer => {
            if(sequencer.turnNumber % 4 === 3) {
                if(sequencer.turnNumber % 2 === 0) {
                    return {
                        text: "water breaks\nare essential\nto an effective\nworkout - or a good\nass kicking"
                    };
                } else {
                    return {
                        text: "i could do this\nall day"
                    };
                }
            }
            return {
                text: null
            }
        },
        getMove: sequencer => {
            if(sequencer.turnNumber % 4 === 3) {
                return {
                    name: "water break",
                    type: "self",
                    process: () => {
                        return {
                            failed: false
                        }
                    }
                }
            } else {
                return moves["decent punch"];
            }
        },
        getDefaultGlobalState: () => {
            return {
                postTurnProcess: sequencer => {
                    sequencer.playerBattleObject.subText[0] = `turn ${sequencer.turnNumber + 1}`;
                }
            }
        },
        setup: sequencer => {
            sequencer.playerBattleObject.subText = [`turn ${sequencer.turnNumber + 1}`];
            sequencer.playerBattleObject.movePreProcess = protectPreProcessPlayer;
            sequencer.elfBattleObject.movePreProcess = protectPressProcessElf;
        }
    },
    {
        name: "golden elfette",
        background: "background-3",
        backgroundColor: "yellow",
        health: 200,
        getLoseSpeech: () => {
            return "a golden elf\nwithout gold\nis not an elf at all\n\nit's not worth living\n*ded*"
        },
        getWinSpeech: sequencer => {
            if(sequencer.elfBattleObject.lastMove === "nutcracker" && sequencer.playerBattleObject.lastMove === "take gold") {
                return "don't say i didn't\nwarn you that this\nwould happen";
            }
            return "next time stay away\nfrom my lucky charms";
        },
        playerMoves: [
            {
                name: "take gold",
                type: "target",
                process: (sequencer,user,target) => {
                    if(target.state.gold <= 0) {
                        target.state.gold = 0;
                        return {
                            text: `but ${target.name} ${target.isPlayer ? "have" : "has"} no gold`
                        }
                    }

                    let difference = 1;
                    if(user.state.squirrels) {
                        difference += user.state.squirrels;
                    }

                    if(target.state.gold - difference < 0) {
                        difference = target.state.gold;
                    }

                    target.state.gold-=difference;
                    user.state.gold+=difference;


                    user.subText[0] = `${user.state.gold} gold`;
                    target.subText[0] = `${target.state.gold} gold`;
                    if(target.state.gold <= 0) {
                        sequencer.dropHealth(target,target.maxHealth);
                    }
                    if(user.state.squirrels >= 1) {
                        return {
                            text: `${user.name} and ${user.state.squirrels === 1?"a squirrel" : "squirrels"} took ${difference} gold`
                        }
                    } else {
                        return {
                            text: `${user.name} took ${difference} gold from ${target.name}`
                        }
                    }

                },
            },
            {
                name: "give gold",
                type: "target",
                process: (sequencer,user,target) => {
                    user.state.gold--;
                    if(user.state.gold < 0) {
                        user.state.gold = 0;
                        return {
                            failed: true,
                            text: `but ${user.name} ${user.isPlayer ? "have" : "has"} no gold`
                        }
                    }
                    target.state.gold++;
                    user.subText[0] = `${user.state.gold} gold`;
                    target.subText[0] = `${target.state.gold} gold`;

                    return {
                        failed: false,
                        text: `${user.name} gave 1 gold to ${target.name}`
                    }
                }
            },
            moves["band aid"],
            {
                name: "buy squirrel - 3 gold",
                type: "self",
                process: (sequencer,user) => {
                    if(user.state.gold >= 3) {
                        user.state.gold-=3;
                        user.subText[0] = `${user.state.gold} gold`;
                        if(user.state.squirrels >= 0) {
                            user.state.squirrels++;
                        } else {
                            user.state.squirrels = 1;
                        }
                        if(!user.state.totalSquirrels) {
                            user.state.totalSquirrels = 0;
                        }
                        user.state.totalSquirrels++;
                        user.subText[1] = `${user.state.squirrels} squirrel${user.state.squirrels !== 1 ? "s" : ""}`;
                        return {
                            text: `${user.name} purchased 1 squirrel`
                        }
                    } else {
                        return {
                            failed: true,
                            text: `but ${user.isPlayer ? "you" : "they"} don't have enough gold`
                        }
                    }
                }
            }
        ],
        getMove: sequencer => {
            if(sequencer.elfBattleObject.state.puttingAnEndToThis) {
                return {
                    name: "unfiscal punch",
                    type: "target",
                    process: (sequencer,user,target) => {
                        let difference = 10;
                        if(user.state.gold < difference) {
                            difference = user.state.gold;
                        }
                        user.state.gold-=difference;
                        sequencer.dropHealth(target,9);
                        user.subText[0] = `${user.state.gold} gold`;
                        if(user.isElf && user.state.gold === 0 && user.name === "golden elfette") {
                            sequencer.dropHealth(user,user.maxHealth);
                            return {
                                text: "this was essentially suicide"
                            }
                        }
                        if(target.isPlayer) {
                            return {
                                text: `you punched too hard and dropped ${difference} gold`
                            }
                        } else {
                            return {
                                text: `${target.name} punched too hard and dropped ${difference} gold`
                            }
                        }
                    }
                }
            }
            if(sequencer.playerBattleObject.lastMove === "take gold" && !sequencer.playerBattleObject.state.protectedTheirNuts) {
                if(sequencer.playerBattleObject.state.squirrels >= 1) {
                    sequencer.playerBattleObject.state.protectedTheirNuts = true;
                }
                return moves["nutcracker"];
            } else {
                const elfMoves = [
                    {
                        name: "worship gold",
                        type: "self",
                        process: (sequencer,user) => {
                            const goldIncrease = 3;
                            user.state.gold+=goldIncrease;
                            user.subText[0] = `${user.state.gold} gold`;
                            if(user.isPlayer) {
                                return {
                                    text: `you worship your gold (+${goldIncrease} gold)`
                                }
                            } else {
                                return {
                                    text: `${user.name} worships their gold (+${goldIncrease} gold)`
                                }
                            }
                        }
                    },
                    {
                        name: "gold bath",
                        type: "self",
                        process: (sequencer,user) => {
                            const goldIncrease = 4;
                            user.state.gold+=goldIncrease;
                            user.subText[0] = `${user.state.gold} gold`;
                            return {
                                text: `${user.name} bathe${user.isElf ? "s" : ""} in gold (+${goldIncrease} gold)`
                            }
                        }
                    },
                    moves["decent punch"]
                ];
                if(sequencer.playerBattleObject.state.squirrels >= 1) {
                    if(Math.random() > 0.5) {
                        elfMoves.push({
                            name: "free squirrel",
                            type: "target",
                            process: (sequencer,user,target) => {
                                if(target.state.squirrels >= 1) {
                                    target.state.squirrels--;
                                    target.subText[1] = `${target.state.squirrels} squirrel${target.state.squirrels !== 1 ? "s" : ""}`;
                                    return {
                                        text: `${user.name} freed 1 squirrel from ${target.name}`
                                    }
                                } else {
                                    return {
                                        failed: true,
                                        text: `but ${user.isPlayer ? "your" : "their"} is out of squirrels`
                                    }
                                }
                            }
                        });
                    }
                }
                return elfMoves[Math.floor(Math.random() * elfMoves.length)];
            }
        },
        getSpeech: sequencer => {
            if(sequencer.elfBattleObject.health === 0) {
                return {
                    text: null
                };
            }
            if(sequencer.playerBattleObject.lastMove === "take gold" ||
               sequencer.playerBattleObject.lastMove === "buy squirrel") {

                if(sequencer.playerBattleObject.state.squirrels >= 1) {
                    if(sequencer.playerBattleObject.state.justBoughtSquirrel) {
                        switch(sequencer.playerBattleObject.state.totalSquirrels) {
                            case 1:
                                return {
                                    text: "what!\na squirrel?\nhow dare u"
                                };
                            case 2:
                                return {
                                    text: "what are these\nsquirrels for?"
                                };
                            case 3:
                                return {
                                    text: "seriously\nplz stop\nthis is concerning"
                                };
                            case 4:
                                return {
                                    text: "who is even selling\nthese squirrels to you?!"
                                };
                            case 5:
                                return {
                                    text: "it's about time that\ni call peta"
                                };
                            case 6:
                                sequencer.elfBattleObject.state.puttingAnEndToThis = true;
                                return {
                                    text: "okay you know what?\ni'm putting an end to this"
                                };
                            default:
                                return {
                                    text: "please. stop. buying.\n\squirrels."
                                };
                        }
                    } else {
                        const responses = [
                            ()=>`i'll free your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s" : ""}`,
                            ()=>`i'll take your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s" : ""} away`,
                            ()=>sequencer.playerBattleObject.state.squirrels !== 1 ? "those squirrels\ndon't belong to you" : "that squirrel\ndoesn't belong to you",
                            ()=>sequencer.playerBattleObject.state.squirrels !== 1 ? "those squirrels\nhave families" : "that squirrel\nhas a family",
                            ()=>`maybe i could get\n${sequencer.playerBattleObject.state.squirrels === 1 ? "a squirrel" : "squirrels"} too`,
                            ()=>"what sound\ndoes a squirrel make?",
                            ()=>"*makes nut sounds*",
                            ()=>"*makes squirrel noises*",
                            ()=>`*tries to steal your\nsquirrel${sequencer.playerBattleObject.state.squirrels !== 1 ? "s":""}*`
                        ];
                        return {
                            text: responses[Math.floor(Math.random() * responses.length)]()
                        };
                    }
                } else {
                    if(sequencer.turnNumber === 0) {
                        return {
                            text: "yikes\ni wouldn't do that\nif i were you"
                        };
                    } else {
                        const responses = [
                            "i am a huge animal\nrights advocate",
                            "i really love squirrels",
                            "squirrels are friends\nnot food",
                            "good thing\nyou don't have any\nsquirrels to\nprotect you",
                            "squirrels are good at\nprotecting nuts\n\nwell jock straps are\ntoo but elves don't\nneed those",
                            "i am a gold belt\nin nutcracking\n\nbut a black belt in racism",
                            "some people think i'm\ntoo quirky\nto be an elf",
                            "i love gold - stay away!"
                        ];
                        return {
                            text: responses[Math.floor(Math.random() * responses.length)]
                        };
                    }

                }
            } else if(sequencer.playerBattleObject.lastMove === "give gold") {
                if(sequencer.playerBattleObject.lastMoveFailed) {
                    return {
                        text: "well - it's the thought\nthat counts"
                    };
                } else {
                    return {
                        text: "gold? for me?\ndo you know how\nthis works?"
                    };
                }
            }
        },
        setup: sequencer => {
            sequencer.playerBattleObject.subText = ["0 gold"];
            sequencer.elfBattleObject.subText = ["100 gold"];

            sequencer.playerBattleObject.state.gold = 0;
            sequencer.elfBattleObject.state.gold = 100;

            sequencer.playerBattleObject.movePreProcess = (sequencer,move) => {
                const moveDisplayName = move.name.split("-")[0].trimEnd();
                if(moveDisplayName === "buy squirrel" && sequencer.playerBattleObject.state.gold >= 3) {
                    sequencer.playerBattleObject.state.justBoughtSquirrel = true;
                } else {
                    sequencer.playerBattleObject.state.justBoughtSquirrel = false;
                }
                return move;
            }
        },
        startSpeech: {
            text: "the only way to\nkill a golden\nelf is to obtain\nall their gold"
        }
    },
    {
        name: "war elf",
        background: "background-4",
        backgroundColor: "white",
        health: 200,
        playerMoves: getRadioSet([
            "absolutely nothing","doing the dishes","dying honorably","losing children"
        ],"question1"),
        startSpeech: {
            text: "war...\nwhat is it good for?",
            persist: true
        },
        getSpeech: sequencer => {
            let lines = "";
            switch(sequencer.turnNumber) {
                case 0:
                    switch(sequencer.playerBattleObject.state["question1"]) {
                        case 0:
                            lines += "hmm - you seem\nquite clever";
                            break;
                        case 1:
                        case 2:
                        case 3:
                            lines += "that's not how the\nsong goes..."
                            sequencer.dropHealth(sequencer.playerBattleObject,25);
                            break;
                    }
                    lines += "\n\n";

                    lines += "what never changes?"

                    sequencer.updatePlayerMoves(
                        getRadioSet(["doing the dishes","losing children","war","absolutely nothing"],"question2")
                    );
                    break;
            }
            return {
                text: lines,
                persist: true
            }
        }
    },
    {
        name: "boney elf",
        background: "background-8",
        backgroundColor: "white",
        health: 200
    },
    {
        name: "headless elf",
        background: "background-1",
        backgroundColor: "orange",
        health: 200
    },
    {
        name: "two headed elf",
        background: "background-3",
        backgroundColor: "red",
        health: 300
    },
    {
        name: "jester elf",
        background: "background-7",
        backgroundColor: "rgb(278,0,255)",
        health: 300
    },
    {
        name: "legless elf",
        background: "background-1",
        backgroundColor: "pink",
        health: 300
    },
    {
        name: "phase shift elf",
        background: "background-5",
        backgroundColor: "white",
        health: 300
    },
    {
        name: "old timey elf",
        background: "background-1",
        backgroundColor: "rgb(183,164,145)",
        health: 300
    },
    {
        name: "scorched elf",
        background: "background-9",
        backgroundColor: "rgb(255,182,0)",
        health: 200
    },
    {
        name: "invisible elf",
        background: "background-4",
        backgroundColor: "rgb(224,240,255)",
        health: 300
    },
    {
        name: "rogue elf",
        background: "background-2",
        backgroundColor: "rgb(114,114,114)",
        health: 400
    },
    {
        name: "naked elfette",
        background: "background-1",
        backgroundColor: "rgb(255,215,181)",
        health: 420
    },
    {
        name: "shirtless elf",
        background: "background-1",
        backgroundColor: "rgb(255,215,181)",
        health: 420
    },
    {
        name: "upside down elf",
        background: "background-3",
        backgroundColor: "red",
        health: 450
    },
    {
        name: "tiny arm elf",
        background: "background-4",
        backgroundColor: "red",
        health: 500
    },
    {
        name: "elfmas tree",
        background: "background-4",
        backgroundColor: "rgb(47,255,0)",
        health: 600
    },
    {
        name: "corrupt elf",
        background: "background-6",
        backgroundColor: "white",
        health: 700
    },
    {
        name: "dark elf",
        background: "background-2",
        backgroundColor: "rgb(114,114,114)",
        health: 800
    },
    {
        name: "murder elf",
        background: "background-2",
        backgroundColor: "rgb(114,114,114)",
        health: 900
    },
    {
        name: "murdered elf",
        background: "background-1",
        backgroundColor: "red",
        health: 1
    },
    {
        name: "the boss elf",
        background: "background-1",
        backgroundColor: "red",
        health: 1000
    }
];
