const shuffleArrangements = "012301320213023103120321103210231230120313201302201320312103213023012310302130123120310232103201";
const shuffleWithMask = items => {
    const arrangement = shuffleArrangements.substr(Math.floor(Math.random() * 24)*4,4);
    const shuffledItems = [];
    for(let i = 0;i<4;i++) {
        const item = items[i];
        const mask = arrangement[i];
        shuffledItems[mask] = item;
    }
    return shuffledItems;
}

const getStaticRadioSet = (options,questionID) => getRadioSet(options,questionID,false);
const getRadioSet = (options,questionID,randomize=true) => {
    const moves = [];
    for(let i = 0;i<options.length;i++) {
        moves[i] = getOptionMove(options[i],questionID,i);
    }
    return randomize ? shuffleWithMask(moves) : moves;
}

const getOptionMove = (moveName,questionID,optionID) => {
    return {
        name: moveName,
        type: "option",
        process: (sequencer,user) => {
            console.log(`Option '${moveName}' - ID '${optionID}' @ '${questionID}'`);
            user.state[questionID] = optionID;
            return {
                failed: false
            }
        }
    }
}


const protectPreProcessPlayer = (sequencer,move) => {
    if(move.name === "protect") {
        if(!isNaN(sequencer.playerBattleObject.state.protectTurn)) {
            if(sequencer.turnNumber >= sequencer.playerBattleObject.state.protectTurn+2) {
                return move;
            } else {
                return moves["player variant protection preprocessor"];
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
        return moves['elf variant protection preprocessor'];
    }
    return move;
}

const addMove = move => {
    moves[move.name] = move;
}

const elves = [];
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
    },
    "player variant protection preprocessor": {
        name: "player variant protection preprocessor",
        process: () => {
            return {
                failed: true,
                text: "but you used it last turn"
            }
        }
    },
    "elf variant protection preprocessor": {
        process: () => {
            return {
                name: "elf variant protection preprocessor",
                failed: true,
                text: "but you are protected"
            }
        }      
    },
};