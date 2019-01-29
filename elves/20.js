elves[19] = {
    name: "upside down elf",
    background: "background-3",
    backgroundColor: "red",
    health: 450,
    defaultRenderLayers: [false,true,true],
    playerMoves: [{
        name: "head explode",
        type: "interface",
        process: sequencer => {
            explodeElfHead(sequencer);
            return null;
        }
    }]
}
const explodeElfHead = sequencer => {
    sequencer.showAnimation({name:"headExplode"});
    sequencer.setRenderLayer(0,false);
    sequencer.setRenderLayer(1,true);
    sequencer.setRenderLayer(2,false);
    sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
    playSound("squish");
}
