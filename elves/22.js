elves[21] = {
    name: "elfmas tree",
    background: "background-4",
    backgroundColor: "rgb(95,158,58)",
    health: 600,
    playerMoves: [{
        name: "transform",
        type: "interface",
        process: sequencer => {
            if(!sequencer.globalBattleState.showedHenry) {
                showHenry(sequencer);
                sequencer.globalBattleState.showedHenry = true;
            }
            return null;
        }
    }]
}
const showHenry = sequencer => {
    sequencer.showAnimation({name:"henry"});
    sequencer.setRenderLayer(0,true);
    playSound("transform",2.7);
    setTimeout(()=>{
        sequencer.setRenderLayer(0,false);
    },Math.round(animationDictionary.henry.smokeDuration/2));
}
