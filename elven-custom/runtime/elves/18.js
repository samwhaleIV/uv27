"use strict";
function NotRedElfette() {
    this.name = "not red elfette";
    this.background = "background-1";
    this.backgroundColor = "rgb(255,215,181)";
    this.health = 420;
    this.defaultRenderLayers = [true,false,false,true,true];
    this.setup = sequencer => {
        sequencer.setRenderLayer(1,true);
        sequencer.setRenderLayer(1,true);
    };
    this.playerMoves = [
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
    ];
}
