addMove({
    name: "glitch punch",
    type: "target",
    process: (sequencer,user,target) => {
        if(user.state.dimensionIndex !== target.state.dimensionIndex) {
            return {
                failed: true,
                text: "but this is the wrong dimension"
            }
        }
        if(Math.random() > 0.5) {
            return {
                failed: true,
                text: "but it slipped through a black hole"
            }
        } else if(Math.random() < 0.5) {
            target.dropHealth(15);
            return {
                text: "it went through a goat but it worked"
            }
        } else {
            user.dropHealth(15);
            return {
                text: "but the fist went backwards"
            }
        }
    }
});
addMove({
    name: "dimensional shift",
    type: "self",
    process: (sequencer,user) => {
        user.state.justJumped = true;

        user.state.dimensionIndex++;
        user.state.dimensionIndex %= sequencer.globalBattleState.dimensionCount;

        const dimensionText = `dimension ${user.state.dimensionIndex+1}`;
        user.subText[0] = dimensionText;
        return {
            text: `${user.name} entered ${dimensionText}`
        }
    }
});
addMove({
    name: "dimensional jump",
    type: "target",
    process: (sequencer,user,target) => {
        user.state.justJumped = true;

        user.state.dimensionIndex = target.state.dimensionIndex;
        const dimensionText = `dimension ${user.state.dimensionIndex+1}`;
        user.subText[0] = dimensionText;
        return {
            text: `${user.name} jumped to ${dimensionText}`
        }
    }
});
addMove({
    name: "lizard",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: "lizard? huh. weird."
        }
    }
});
addMove({
    name: "trapezoid",
    type: "target",
    process: (sequencer,user,target) => {
        target.dropHealth(20);
        return {
            text: `${user.name} got hit with an abject trapezoid. ouch!`
        }
    }
});
addMove({
    name: "eternal darkness",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    text: "a cute unicorn showed up"
                },
                {
                    text: `it gave ${user.name} a friendly kiss`,
                    action: () => user.addHealth(20)
                },
                {
                    text: "goodbye unicorn!"
                }
            ]
        }
    }
});

elves[12] = {
    name: "phase shift elf",
    background: "background-5",
    backgroundColor: "white",
    health: 100,
    playerMoves: [
        moves["glitch punch"],
        moves["dimensional shift"]
    ],

    getMove: sequencer => {
        if(sequencer.playerBattleObject.state.dimensionIndex === sequencer.elfBattleObject.state.dimensionIndex) {
            const moveSets = [
                ["lizard"],
                ["trapezoid"],
                ["eternal darkness"],
            ];
            const moveSet = moveSets[sequencer.elfBattleObject.state.dimensionIndex];
            const moveName = moveSet[sequencer.turnNumber % moveSet.length];
            const move = moves[moveName];
            return move;
        } else if(!sequencer.playerBattleObject.state.justJumped) {
            return moves["dimensional jump"];
        }
        return null;
    },
    
    setup: sequencer => {
        sequencer.playerBattleObject.state.dimensionIndex = 0;
        sequencer.elfBattleObject.state.dimensionIndex = 0;

        sequencer.playerBattleObject.state.jumpCount = 0;
        sequencer.elfBattleObject.state.jumpCount = 0;

        sequencer.playerBattleObject.subText = ["dimension 1"];
        sequencer.elfBattleObject.subText = ["dimension 1"];

        sequencer.globalBattleState.dimensionCount = 3;
    },

    getDefaultGlobalState: () => {
        return {
            dimensionCount: 3,
            postTurnProcess: sequencer => {
                if(sequencer.playerBattleObject.state.justJumped) {
                    sequencer.playerBattleObject.state.jumpCount++;
                }
                if(sequencer.elfBattleObject.state.justJumped) {
                    sequencer.playerBattleObject.state.jumpCount++;
                }
                sequencer.playerBattleObject.state.justJumped = false;
                sequencer.elfBattleObject.state.justJumped = false;
            }
        }
    }
}
