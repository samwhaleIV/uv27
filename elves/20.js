"use strict";
function UpsideDownElf() {
    const explodeElfHead = sequencer => {
        sequencer.showAnimation({name:"headExplode"});
        sequencer.setRenderLayer(0,false);
        sequencer.setRenderLayer(1,true);
        sequencer.setRenderLayer(2,false);
        sequencer.dropHealth(sequencer.elfBattleObject,sequencer.elfBattleObject.maxHealth);
        playSound("squish");
    }
    this.name = "upside down elf";
    this.background = "background-3";
    this.backgroundColor = "red";
    this.health = 450;
    this.defaultRenderLayers = [false,true,true];
    this.playerMoves = [{
        name: "head explode",
        type: "interface",
        process: sequencer => {
            explodeElfHead(sequencer);
            return null;
        }
    }];
}
