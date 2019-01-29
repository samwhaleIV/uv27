"use strict";
elves[17] = {
    name: "not red elfette",
    background: "background-1",
    backgroundColor: "rgb(255,215,181)",
    health: 420,
    defaultRenderLayers: [true,false,false,true,true],
    setup: sequencer => {
        sequencer.setRenderLayer(1,true);
        sequencer.setRenderLayer(1,true);
    },
    playerMoves: [
        {
            name: "toggle layer 1",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(1,!sequencer.elfRenderLayers[1]);
                return {
                    text: "toggled layer",
                    animation:{name:"crying"}
                };
            }
        },
        {
            name: "toggle layer 2",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(2,!sequencer.elfRenderLayers[2]);
                return {
                    text: "toggled layer",
                    animation:{name:"crying"}
                };
            }
        },
        {
            name: "toggle layer 3",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(3,!sequencer.elfRenderLayers[3]);
                return {
                    text: "toggled layer",
                    animation:{name:"crying"}
                };
            }
        },
        {
            name: "toggle layer 4",
            type: "interface",
            process: sequencer => {
                sequencer.setRenderLayer(4,!sequencer.elfRenderLayers[4]);
                return {
                    text: "toggled layer",
                    animation:{name:"crying"}
                };
            }
        }
    ]
}
