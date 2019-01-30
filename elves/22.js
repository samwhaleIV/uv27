"use strict";
function ElfmasTree() {
    const showHenry = sequencer => {
        sequencer.showAnimation({name:"henry"});
        sequencer.setRenderLayer(0,true);
        playSound("transform",2.7);
        setTimeout(()=>{
            sequencer.setRenderLayer(0,false);
        },Math.round(animationDictionary.henry.smokeDuration/2));
    }

    this.name = "elfmas tree";
    this.background = "background-4";
    this.backgroundColor = "rgb(95,158,58)";
    this.health = 600;
    this.playerMoves = [{
        name: "transform",
        type: "interface",
        process: sequencer => {
            if(!sequencer.globalBattleState.showedHenry) {
                showHenry(sequencer);
                sequencer.globalBattleState.showedHenry = true;
            }
            return null;
        }
    }];
}
