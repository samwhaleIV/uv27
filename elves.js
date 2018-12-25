function BattleSeqeuencer(renderer) {

    this.elf = renderer.elf;

    this.playerDiedMethod = () => {
        this.bottomMessage = "you are dead";
        renderer.firstInputMask = "game over";
        
        setTimeout(() => {
            elfIndex--;
            renderer.battleEndCallback();
        },3000);

        if(this.elf.getWinSpeech) {
            this.showElfSpeech(this.elf.getWinSpeech(),0,Infinity);
        }
    }
    this.elfDiedMethod = () => {
        this.bottomMessage = `${this.elf.name} ran out of christmas spirit`;
        renderer.firstInputMask = "a job well done";
        setTimeout(renderer.battleEndCallback,3000);

        if(this.elf.getLoseSpeech) {
            this.showElfSpeech(this.elf.getLoseSpeech(),0,Infinity);
        }
    }

    this.playerHasDied = false;
    this.elfHasDied = false;

    this.playerBattleObject = {
        isPlayer: true,
        isElf: false,
        isDead: false,
        isAlive: true,
        health: 100,
        maxHealth: 100,
        jitterHealthBar: false,
        healthBarDrop: false,
        name: "you",
        disabledMoves: {},
        lastMove: null
    };
    this.elfBattleObject = {
        isPlayer: false,
        isElf: true,
        isDead: false,
        isAlive: true,
        health: this.elf.health,
        maxHealth: this.elf.health,
        jitterHealthBar: false,
        healthBarDrop: false,
        name: this.elf.name,
        disabledMoves: {},
        lastMove: null
    };
    
    this.dropHealth = (target,amount) => {
        target.health -= amount;
        target.jitterHealthBar = true;
        if(target.health <= 0) {
            if(target.isPlayer) {
                this.playerHasDied = true;
                playerBattleObject.isDead = true;
                playerBattleObject.isAlive = false;
            } else {
                this.elfHasDied = true;
                this.elfBattleObject.isDead = true;
                this.elfBattleObject.isAlive = false;
            }
        } else {
            setTimeout(()=>{
                target.jitterHealthBar = false;
            },100);
        }
    },
    this.addHealth = (target,amount) => {
        target.health += amount;
        target.healthBarDrop = true;
        if(target.health > target.maxHealth) {
            target.health = target.maxHealth;
        }
        setTimeout(()=>{
            target.healthBarDrop = false;
        },80);
    }

    if(this.elf.getDefaultPlayerState) {
        this.playerBattleObject.state = this.elf.getDefaultPlayerState();
    } else {
        this.playerBattleObject.state = getSuperDefaultPlayerState();
    }
    if(this.elf.getDefaultElfState) {
        this.elfBattleObject.state = this.elf.getDefaultElfState();
    } else {
        this.elfBattleObject.state = getSuperDefaultElfState();
    }

    this.processPlayerInput = moveIndex => {
        this.playerMove(
            this.elf.playerMoves[moveIndex]
        );
    }

    this.showText = (text,delay,duration,callback) => {
        if(!duration) {
            duration = 1000;
        }
        const innerMethod = () => {
            this.bottomMessage = text;
            if(duration !== Infinity) {
                setTimeout(()=>{
                    this.bottomMessage = null;
                    if(callback) {
                        callback();
                    }
                },duration);
            }
        }
        if(delay) {
            setTimeout(innerMethod,delay);
        } else {
            innerMethod();
        }
    }

    this.genericMove = (move,user,target,callback) => {
        const text = `${user.name} used ${move.name}`;
        this.showText(text,0,this.getTextDuration(text),()=>{
            let moveResult;
            if(!move) {
                moveResult = {
                    text: "but the developer made a mistake"
                }
                console.error("Hey idiot, you probably have a move key wrong");
            } else if(user.disabledMoves[move.name]) {
                moveResult = {
                    text: "but it has been disabled"
                }
            } else if(target.isDead && move.type === "target") {
                moveResult = {
                    text: "but their target is already dead"
                }
            } else {
                moveResult = move.process(
                    this,
                    user,
                    target
                );
            }
            user.lastMove = move.name;
            if(moveResult.text) {
                this.showText(
                    moveResult.text,0,
                    this.getTextDuration(moveResult.text),
                    callback
                );
            } else if(callback) {
                callback(moveResult);
            }
        });

    }

    this.getTextDuration = text => {
        return 500 + (text.split(" ").length * 200);
    }

    this.playerMove = move => {
        this.genericMove(move,
            this.playerBattleObject,
            this.elfBattleObject,
            ()=>{
                if(!this.elfHasDied) {
                    this.elfMove();
                } else {
                    this.returnInput();
                }
            }
        );
        renderer.disablePlayerInputs();
    }

    this.elfMove = () => {
        let move;
        if(!this.elf.getMove) {
            move = moves[0];
        } else {
            move = this.elf.getMove(this);
        }
        this.genericMove(
            move,
            this.elfBattleObject,
            this.playerBattleObject,
            () => {
                if(!this.playerHasDied) {
                    let elfSpeech = null;
                    if(this.elf.getSpeech) {
                        elfSpeech = this.elf.getSpeech(this);
                    }
                    if(elfSpeech !== null) {
                        this.showElfSpeech(
                            elfSpeech,0,
                            this.getTextDuration(elfSpeech) * 1.33,
                            this.returnInput
                        );
                    } else {
                        this.returnInput();
                    }
                } else {
                    this.returnInput();
                }
            }
        );
    }
    this.elfSpeech = null;
    this.showElfSpeech = (text,delay,duration,callback) => {
        if(!duration) {
            duration = 1000;
        }
        const innerMethod = () => {
            this.elfSpeech = text.split("\n");
            renderer.moveElf(80,0.25);
            if(duration !== Infinity) {
                setTimeout(()=>{
                    this.elfSpeech = null;
                    renderer.moveElf(80,0.5);
                    if(callback) {
                        callback();
                    }
                },duration);
            }
        }
        if(delay) {
            setTimeout(innerMethod,delay);
        } else {
            innerMethod();
        }
    }

    this.turnNumber = 0;

    this.returnInput = () => {
        if(this.elfHasDied) {
            this.elfDiedMethod();
        } else if(this.playerHasDied) {
            this.playerDiedMethod();
        } else {
            this.turnNumber++;
            renderer.enablePlayerInputs();
        }
    }

    this.bottomMessage = null;

    if(this.elf.startText) {
        renderer.playerInputs = this.elf.playerMoves;
        const endMethod = !this.elf.startSpeech?
            renderer.enablePlayerInputs: 
            () => {
                this.showElfSpeech(
                    this.elf.startSpeech,
                    0,this.getTextDuration(this.elf.startSpeech),
                    renderer.enablePlayerInputs
                );
            }
        this.showText(
            this.elf.startText,0,
            500+this.getTextDuration(this.elf.startText),
            endMethod
        );
    } else {
        const startEnd = () => {
            renderer.playerInputs = this.elf.playerMoves;
            renderer.enablePlayerInputs();
        }
        if(this.elf.startSpeech) {
            this.showElfSpeech(
                this.elf.startSpeech,0,
                500+this.getTextDuration(this.elf.startSpeech),
                startEnd
            );
        } else {
            startEnd();
        }
    }


}

const getSuperDefaultPlayerState = () => {return {}};
const getSuperDefaultElfState = () => {return {}};

const moves = {
    "nothing": {   
        type: "target",
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
                    text: "but it failed"
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

    }

    */
    {
        name: "wimpy red elf",
        background: "background-1",
        backgroundColor: "red",
        getMove: () => {
            return moves["cry"];
        },
        getSpeech: (sequencer) => {
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
        startText: "this battle will be harder",
        playerMoves: [
            moves["nothing"],
            moves["cry"]
        ],
        getMove: (elfBattleObject) => {
            return moves["disable"];
        },
        getStartSpeech: () => "hello i am green elf\nplz be nice\ni come in piece"
    },
    {
        name: "wimpy blue elf",
        background: "background-1",
        backgroundColor: "blue",
        health: 100
    },
    {
        name: "wizard elf",
        background: "background-1",
        backgroundColor: "purple",
        health: 125
    },
    {
        name: "red elfette",
        background: "background-1",
        backgroundColor: "red",
        health: 150
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
        background: null,
        backgroundColor: "red",
    }
];
