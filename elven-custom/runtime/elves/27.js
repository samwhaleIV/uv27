"use strict";
function TheBossElf() {

    const abdictateMove = {
        name: "abdictate",
        type: "interface",
        process: () => null
    }

    const surrenderMove = {
        name: "surrender",
        type: "self",
        process: () => null
    }

    const giveUpMove = {
        name: "give up",
        type: "self",
        process: () => null
    }

    const playDeadMove = {
        name: "play dead",
        type: "self",
        process: () => null
    }

    const justKiddingMove = {
        name: "just kidding!",
        type: "self",
        process: () => null
    }

    const stealSwordMove = {
        name: "steal sword",
        type: "self",
        process: () => null
    }

    const elfmartSwordMove = {
        name: "elfmart sword",
        target: "target",
        process: (sequencer,user,target) => {
            target.dropHealth(250);
            return {
                events: [
                    {
                        speech: "hahaha."
                    },
                    {
                        speech: "this sword made me\nwhat i am."
                    },
                    {
                        speech: "we are but one."
                    },
                    {
                        speech: "did you really think\nit could hurt me?"
                    },
                    {
                        text: "the boss elf regenerated their health",
                        action: () => target.addHealth(target.maxHealth)
                    }
                ]
            }
        }
    }
    const strikeGroundMove = {
        name: "strike the ground",
        type: "self",
        process: () => null
    }

    const sacrificeSwordMove = {
        name: "sacrifice sword",
        type: "self",
        process: () => null
    }

    const jumpIntoHell = {
        name: "jump into the pit",
        type: "self",
        process: (sequencer,user) => {
            return {
                events: [
                    {
                        text: "you jumped head first into hell",
                        action: ()=> user.dropHealth(user.maxHealth)
                    },
                    {
                        speech: "the first good choice\nyou've ever made."
                    },
                    {
                        speech: "suffer."
                    },
                    {
                        speech: "\nrot."
                    },
                    {
                        speech: "\n\ndie."
                    }
                ]
            }
        }
    }

    const sacrificeSelfMove = {
        name: "honorable sacrifice",
        type: "self",
        process: (sequencer,user) => {
            user.dropHealth(user.maxHealth);
            return {
                events: [
                    {
                        text: "you stabbed deeply with the elfmart sword"
                    },
                    {
                        text: "this is the end"
                    },
                    {
                        speech: "don't think just because\nyou're dead that this is over."
                    },
                    {
                        speech: "see you in hell."
                    }
                ]
            }
        }
    }

    const spartaKickMove = {
        name: "sparta kick",
        type: "target",
        process: (sequencer,user,target) => {
            return {
                events: [
                    {
                        text: "it's over - you have the high ground"
                    },
                    {
                        speech: "this isn't the end of me."
                    },
                    {
                        speech: "i'll see to it that you\nsuffer..."
                    },
                    {
                        speech: "\n\nsuffer..."
                    },
                    {
                        speech: "\n\n\nsuffer..."
                    },
                    {
                        speech: "\n\n\n\nand suffer."
                    },
                    {
                        speech: "let your conscience\neat you at\nevery bite."
                    },
                    {
                        speech: "let your hatred ruin\neverything you ever loved."
                    },
                    {
                        speech: "burn."
                    },
                    {
                        speech: "\nrot."
                    },
                    {
                        speech: "\n\ndie."
                    },
                    {
                        speech: "for you have done\nthe unspeakable..."
                    },
                    {
                        speech: "the elves will always\nremember what you did."
                    },
                    {
                        speech: "the elves will\nnever forget..."
                    },
                    {
                        text: "you've heard enough"
                    },
                    {
                        text: "you kicked the boss elf into hell",
                        action: () => target.dropHealth(target.maxHealth)
                    }
                ]
            }
        }
    }

    this.getPlayerMoves = sequencer => {
        switch(sequencer.globalBattleState.mode) {
            case "setup":
                return [abdictateMove];
            case "normal":
                return [
                    moves["nothing"],
                    moves["also nothing"],
                    moves["senseless murder"],
                    moves["honorable suicide"]
                ];
            case "postNormal":
                return [surrenderMove,moves["decent punch"]];
            case "postPunch":
                return [moves["cry"],giveUpMove,playDeadMove];
            case "playingDead":
                return [stealSwordMove,justKiddingMove];
            case "hasSword":
                return [elfmartSwordMove,strikeGroundMove,sacrificeSelfMove];
            case "strikedGround":
                return [elfmartSwordMove,sacrificeSwordMove,sacrificeSelfMove,jumpIntoHell];
            case "end":
                return [spartaKickMove,jumpIntoHell];
            default:
                return [moves["nothing"]];
        }
    }

    this.setup = sequencer => {

        animationDictionary.fire.fireEffect = new FireEffect(40,0,false);

        const notGuiltyCount = Number(localStorage.getItem("pleadedNotGuilty"));
        const guiltyCount = Number(localStorage.getItem("pleadedGuilty"));
        const setupSpeeches = [
            `pleaded guilty...\n${guiltyCount} time${guiltyCount !== 1 ? "s": ""}`,
            `pleaded not guilty...\n${notGuiltyCount} time${notGuiltyCount !== 1 ? "s": ""}`,
            "but do you know what\nthe reality is?",
            guiltyCount === 24 ? "it doesn't even matter\nif you feel remorse" : "you were guilty\nthe second you were born",
            "you were guilty\ntaking your first steps...",
            "you were born guilty...\nand you will die guilty...",
            "you are garbage.",
            "human scum...\nand you're not even that...",
            "if you could start\nall over again...\n\ni bet you'd make the same\nterrible decisions..."
        ];

        sequencer.globalBattleState.mode = "setup";
        let setupIndex = 0;
        let nothingCount = 0;
        let decentPunchCount = 0;
        let usedSurrender = false;
        sequencer.globalBattleState.postTurnProcess = sequencer => {
            if(sequencer.globalBattleState.mode === "setup") {
                const endSpeech = setupSpeeches[setupIndex];
                if(++setupIndex>setupSpeeches.length) {
                    sequencer.globalBattleState.mode = "normal";
                    sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                }
                return {
                    speech: endSpeech,
                    persist: true
                }
            }
            if(sequencer.playerBattleObject.lastMove === giveUpMove.name) {
                return {
                    events: [
                        {
                            speech: "no no...\nthat's not how this works."
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === "cry") {
                return {
                    events: [
                        {
                            speech: "only babies cry.",
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                        },
                        {
                            speech: "is that better baby?"
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === stealSwordMove.name) {
                sequencer.globalBattleState.mode = "hasSword";
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return {
                    events: [
                        {
                            text: "you stole the elfmart sword back"
                        },
                        {
                            speech: "*anger and confusion*"
                        },
                        {
                            speech: "double crossing bastard!"
                        },
                        {
                            speech: "i really thought you\nwere dead!"
                        },
                        {
                            text: "the boss elf used - uh - nothing?",
                        },
                        {
                            speech: "agh!!!!\ni need that sword!"
                        },
                        {
                            text: "the boss elf exerts their anger"
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === playDeadMove.name) {
                sequencer.globalBattleState.mode = "playingDead";
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return {
                    events: [
                        {
                            text: "you look convincingly dead"
                        },
                        {
                            speech: "yikes. guess the pressure\ngot to them..."
                        },
                        {
                            speech: "now how am i supposed to\ntorture them for all\neternity?" 
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === strikeGroundMove.name) {
                sequencer.globalBattleState.mode = "strikedGround";
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return {
                    events: [
                        {
                            text: "the strike opened up the grounds below",
                            action: sequencer => {
                                sequencer.showAnimation({name:"fire"});
                            }
                        },
                        {
                            speech: "do you even know what\nyou're doing?"
                        },
                        {
                            speech: "you're making a\ngreat mistake."
                        }
                    ]
                }

            }
            if(sequencer.playerBattleObject.lastMove === sacrificeSwordMove.name) {
                sequencer.globalBattleState.mode = "end";
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return {
                    events: [
                        {
                            text: "you threw the elfmart sword into hell",
                        },
                        {
                            text: "the boss elf is dying",
                            action: () => sequencer.elfBattleObject.dropHealth(200)
                        },
                        {
                            speech: "no!",
                            action: () => sequencer.elfBattleObject.dropHealth(200)
                        },
                        {
                            speech: "what have you done!",
                            action: () => sequencer.elfBattleObject.dropHealth(200)
                        },
                        {
                            speech: "you're more of an idiot\nthat i thought!",
                            action: () => sequencer.elfBattleObject.dropHealth(300)
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === justKiddingMove.name) {
                sequencer.globalBattleState.mode = "postPunch";
                sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                return {
                        events: [
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                        },
                        {
                            speech: "foolish idiot."
                        }                 
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === "nothing" || sequencer.playerBattleObject.lastMove === "also nothing") {
                if(++nothingCount >= 5) {
                    sequencer.globalBattleState.mode = "postNormal";
                    sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                    return {
                        events: [
                            {
                                speech: "i've had enough of this."
                            },
                            {
                                text: "the boss elf used elfmart sword"
                            },
                            {
                                text: "ouch! a taste of your own medicine",
                                action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                            },
                            {
                                speech: "your move. idiot."
                            }
                        ]
                    }
                }
                switch(nothingCount) {
                    case 1:
                        return {
                            speech: "stalling gets you nowhere."
                        }
                    case 2:
                        return {
                            speech: "you are wasting your time."
                        }
                    case 3:
                        return {
                            speech: "coward."
                        }
                    case 4:
                        return {
                            speech: "you're not going to make\nthis any easier you know..."
                        }
                }
            }
            if(sequencer.playerBattleObject.lastMove === "surrender") {
                if(usedSurrender) {
                    return {
                        events: [
                            {
                                speech: "haven't we been over this?"
                            },
                            {
                                speech: "suffer."
                            },
                            {
                                text: "the boss elf used elfmart sword",
                                action: sequencer => sequencer.playerBattleObject.dropHealth(250)                            
                            }
                        ]
                    }
                }
                usedSurrender = true;
                return {
                    events: [
                        {
                            speech: "really? a surrender?"
                        },
                        {
                            speech: "you don't get it do you."
                        },
                        {
                            speech: "you are living trash.\nscum of the earth."
                        },
                        {
                            speech: "you don't even deserve death."
                        },
                        {
                            speech: "you deserve to suffer."
                        },
                        {
                            speech: "\nsuffer..."
                        },
                        {
                            speech: "\n\nsuffer..."
                        },
                        {
                            speech: "\n\n\nand suffer."
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)                            
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === "decent punch") {
                if(++decentPunchCount>=5) {
                    sequencer.globalBattleState.mode = "postPunch";
                    sequencer.updatePlayerMoves(this.getPlayerMoves(sequencer));
                    return {
                        speech: "alright... that's enough."
                    }
                }
                switch(decentPunchCount) {
                    case 1:
                        return {
                            speech: "ha. is that the\nbest you can do?"
                        }
                    case 2:
                        return {
                            speech: "even at your best...\nyou are you your worst."
                        }
                    case 3:
                        return {
                            speech: "keep it coming."
                        }
                    case 4:
                        return {
                            speech: "i could do this all day."
                        }
                }
            }
            if(sequencer.playerBattleObject.lastMove === "honorable suicide") {
                return {
                    events: [
                        {
                            speech: "ha. hahaha."
                        },
                        {
                            speech: "nice try loser."
                        },
                        {
                            speech: "it's so cute that you\nthink you can just leave."
                        },
                        {
                            speech: "but...\n\nno.",
                            action: sequencer => sequencer.playerBattleObject.addHealth(sequencer.playerBattleObject.maxHealth)
                        }
                    ]
                }
            }
            if(sequencer.playerBattleObject.lastMove === "senseless murder") {
                return {
                    events: [
                        {
                            speech: "ha.\n\ndo you really think\nlightning can strike\ntwice in the same spot?",
                        },
                        {
                            speech: "hahahaha.",
                            action: sequencer => sequencer.elfBattleObject.addHealth(sequencer.elfBattleObject.maxHealth)
                        },
                        {
                            speech: "worthless idiot."
                        },
                        {
                            speech: "you are so predictable."
                        },
                        {
                            speech: "you know what i might\ndo just for that?"
                        },
                        {
                            speech: "why don't i play along too?"
                        },
                        {
                            text: "the boss elf used elfmart sword",
                        },
                        {
                            text: "ouch! a taste of your own medicine",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                        },
                        {
                            speech: "oh? did that hurt?"
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)
                        },
                        {
                            speech: "what's that? stop?"
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: sequencer => sequencer.playerBattleObject.dropHealth(250)                            
                        },
                        {
                            speech: "sorry. can't hear you."
                        },
                        {
                            speech: "alright... enough playing.\n\ni'm sick of you."
                        },
                        {
                            text: "the boss elf used elfmart sword",
                            action: () => sequencer.playerBattleObject.dropHealth(250)                            
                        },
                        {
                            speech: "rot."
                        }
                    ]
                }
            }
        }
    }

    this.songIntro = "intro_b";
    this.song = "loop_b";

    this.name = "the boss elf";
    this.background = "background-1";
    this.backgroundColor = "red";
    this.health = 1000;
    this.playerHealth = 1000;
    this.startSpeech = {
        text: "so this it it... huh?\n\nthe big f***ing finale?",
        persist: true
    }
}
