elves[17] = {
    name: "naked elfette",
    background: "background-1",
    backgroundColor: "rgb(255,215,181)",
    health: 420,
    defaultRenderLayers: [true,true,true,true,true],

    playerMoves: [
        {
            name: "toggle layer 1",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(1,!sequencer.elfRenderLayers[1]);
                return null;
            }
        },
        {
            name: "toggle layer 2",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(2,!sequencer.elfRenderLayers[2]);
                return null;
            }
        },
        {
            name: "toggle layer 3",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(3,!sequencer.elfRenderLayers[3]);
                return null;
            }
        },
        {
            name: "toggle layer 4",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(4,!sequencer.elfRenderLayers[4]);
                return null;
            }
        }
    ]
}
