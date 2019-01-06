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
sequencer.dropHealth(target,amount)
sequencer.addHealth(target,amount)

sequencer.turnNumber -> <number/int>

sequencer.globalBattleState -> {}

*/

const moves = {
    "nothing": {   
        type: "self",
        name: "nothing",
        process: (sequencer,user,target) => {
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
        process: (sequencer,user,target) => {
            return {
                text: "*crickets*"
            }
        }
    },
    "cry": {
        type: "self",
        name: "cry",
        process: (sequencer,user,target) => {

            let text = !user.state.isCrying ?
                `${user.name} ${user.isPlayer ? "are" : "is"} now crying`:
                `${user.name} continue${user.isElf ? "s" : ""} to cry`;

            user.state.isCrying = true;
            return {
                text: text
            }
        }
    },
    "honorous suicide": {
        type: "self",
        name: "honorous suicide",
        process: (sequencer,user,target) => {
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
            sequencer.dropHealth(target,user.state.atePunchingVitamins ? 30 : 15);
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
            sequencer.dropHealth(target,user.state.atePunchingVitamins ? 20 : 10);
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
            sequencer.dropHealth(target,user.state.atePunchingVitamins ? 10 : 5);
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
        process: (sequencer,user,target) => {
            sequencer.addHealth(user,user.maxHealth);
            return {
                text: `${user.name} had ${user.isPlayer ? "your" : "their"} health restored`
            }
        }
    },
    "band aid": {
        type: "self",
        name: "band aid",
        process: (sequencer,user,target) => {
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
        process: (sequencer,user,target) => {
            return {
                text: "but there's no such thing"
            }
        }
    },
    "self punch": {
        type: "self",
        name: "self punch",
        process: (sequencer,user,target) => {
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
        process: (sequencer,user,target) => {
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
        process: (sequencer,user,target) => {
            user.state.atePunchingVitamins = true;
            return {
                text: `${user.name} will have stronker punches now`
            }
        }
    }
};

const elves = [
    /* Full schema:
    {
        name: <string>
        -background: <image dictionary name>
        -backgroundColor: <css color>

        Elves always go second. This move follows a player move.
        -getMove: function(sequencer)

        This is post move text. Win speech is used if the player died from the move.
        -getSpeech: function(sequencer) -> <string>(\n delimited)

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
            return speeches[elfBattleObject.state.speechIndex] + "\n*crying sounds*";
        },
        playerMoves: [
            moves["nothing"],moves["also nothing"],moves["honorous suicide"],moves["senseless murder"]
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
                            return "ah what did i say\nabout crying"
                        case 2:
                            return "i really don't like this";
                        case 3:
                            return "your crying makes me\nuncomfortable";
                        default:
                        case 4:
                            return "i can't take it\nanymore";
                    }
                } else {
                    sequencer.globalBattleState.noticedThatCryingStopped = false;
                    return "ugh\nyou stopped\nwhy start again\njust be happy";
                }
            } else {
                sequencer.playerBattleObject.state.isCrying = false;
                if(sequencer.globalBattleState.turnsCrying && sequencer.globalBattleState.turnsCrying > 0) {
                    sequencer.globalBattleState.noticedThatCryingStopped = true;
                    const responses = ["phew\nthanks for stopping","good\nno more crying","this is fine"];
                    return responses[Math.floor(Math.random() * responses.length)];
                } else {
                    return "this is fine\njust don't cry"
                }
            }
            return null;
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
        startSpeech: "hello i am green elf\nplz be nice\ni come in piece"
    },
    {
        name: "wimpy blue elf",
        background: "background-1",
        backgroundColor: "blue",
        health: 100,
        startText: "you received an empty revolver",
        startSpeech: "here is a revolver\nlet's see if you know\nhow to use it",
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
                        return "oh jeez\nquick and painless\nplz";
                    } else {
                        return "good thing you haven't\nloaded your revolver"
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
            return responses[responseIndex];
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
                name: "purchase bullet",
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
        startSpeech: "i might not\n-look- like a\nboxer... but it's my\nmy strong passion\ni am the best",
        getSpeech: sequencer => {
            if(sequencer.turnNumber % 4 === 3) {
                return "i could do this\nall day";
            }
            return null;
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

            sequencer.playerBattleObject.subText[0] = `turn ${sequencer.turnNumber + 1}`;

            sequencer.playerBattleObject.movePreProcess = move => {
                if(move.name === "protect") {
                    if(!isNaN(sequencer.playerBattleObject.state.protectTurn)) {
                        if(sequencer.turnNumber >= sequencer.playerBattleObject.state.protectTurn+2) {
                            return move;
                        } else {
                            return {
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

            sequencer.elfBattleObject.movePreProcess = move => {
                if(move.type === "target" && sequencer.playerBattleObject.state.isProtected) {
                    sequencer.playerBattleObject.state.isProtected = false;
                    return {
                        process: () => {
                            return {
                                failed: true,
                                text: "but you are protected"
                            }
                        }
                    }
                }
                return move;
            }
        }
    },
    {
        name: "golden elfette",
        background: "background-3",
        backgroundColor: "yellow",
        health: 200
    },
    {
        name: "war elf",
        background: "background-4",
        backgroundColor: "white",
        health: 200
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
        color: "white",
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
