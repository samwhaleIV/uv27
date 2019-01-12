elves[7] = {
    name: "boney elf",
    background: "background-8",
    backgroundColor: "white",
    health: 200,
    playerMoves: [
        moves["nothing"]
    ],
    spam:[],
    getDefaultGlobalState: () => {
        return {
            postTurnProcess: sequencer => {
                return {
                    events: [{
                        text: "text",
                        speech: "speech"
                    }]
                }
            }
        }
    }
}
