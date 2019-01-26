addMove({
    type: "target",
    name: "violent spell",
    process: (sequencer,user,target) => {
        sequencer.dropHealth(user,10);
        sequencer.dropHealth(target,20);
        return {
            text: "and got hurt by recoil",
            animation: {name:"robeSmoke"}
        }
    }
});
addMove({
    type: "self",
    name: "magic",
    process: () => {
        return {
            text: "but there's no such thing"
        }
    }
});
addMove({
    type: "self",
    name: "self punch",
    process: (sequencer,user) => {

        let animation = null;
        if(user.isElf) {
            animation = {name:"punch"};
        }

        sequencer.dropHealth(
            user,user.state.atePunchingVitamins ? 30 : 15
        );
        return {
            text: `${user.name} ha${user.isPlayer ? "ve" : "s"} self esteem issues`,
            animation: animation
        }
    }
});
elves[3] = {
    name: "wizard elf",
    background: "background-1",
    backgroundColor: "purple",
    song: "Magic",
    health: 125,
    backgroundCycleTime: 45000,
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
}
