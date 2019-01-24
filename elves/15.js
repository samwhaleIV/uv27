const getTemperatureString = (temperature,prefix) =>
    `${prefix ? `${prefix} `:""}${formatDegrees(fixNumber(temperature,1))}`;
const playerTemperaturePrefix = "you:     ";
const worldTemperaturePrefix = "world:";

const startingTemperature = 100;
const fakeFreezingPoint = 50;
const bodyTemperature = 98.6;

const cookiesTemperature = 350;
const overheatTemperature = 105;
const hypothermiaTemperature = 95;

const playerHeatRiseFactor = 0.6;
const baseTemperatureRiseFactor = 1.015;
const neutralCoolingFactor = 0.5;

const formatDegrees = degrees => `${degrees} degree${degrees !== 1 ?"s":""} f`;

const updatePlayerTemperatureSubtext = sequencer => {
    sequencer.playerBattleObject.subText[0] =
    getTemperatureString(
        sequencer.playerBattleObject.state.temperature,playerTemperaturePrefix
    );
}
const updateWorldTemperatureSubText = sequencer => {
    sequencer.playerBattleObject.subText[1] =
    getTemperatureString(
        sequencer.globalBattleState.temperature,worldTemperaturePrefix
    );
    const colorByTemperature = getColorByTemperature(
        sequencer.globalBattleState.temperature
    );
    sequencer.renderer.background.color = colorByTemperature;
    sequencer.renderer.rightHealthBar.foregroundColor = colorByTemperature;
}
const updateTemperatureSubTexts = sequencer => {
    updatePlayerTemperatureSubtext(sequencer);
    updateWorldTemperatureSubText(sequencer);
}
const updateAntifreezeSubText = sequencer => {
    const count = sequencer.globalBattleState.antifreezeCount;
    sequencer.elfBattleObject.subText[0] =
        `${count} antifreeze${count !== 1 ? "s":""}`;
}

const fixNumber = (number,fractionDigits) => {
    const factor = Math.pow(10,fractionDigits);
    return Math.round(number * factor) / factor;
}

addMove({
    name: "fiery fist",
    type: "target",
    process: (sequencer,user,target) => {
        const baseDamage = 15;
        const damagePerDegree = 0.25;
        const damageFactor = 1 / damagePerDegree;

        if(sequencer.globalBattleState.temperature >= startingTemperature) {
            let damage = baseDamage + Math.floor((sequencer.globalBattleState.temperature - startingTemperature) / damageFactor);
            const events = [{
                text: "ouch! a scorching fist",
                action: () => {
                    target.dropHealth(damage)
                }
            }];
            if(damage !== baseDamage) {
                events.push({
                    text: `(fist power was boosted by ${Math.floor(fixNumber((damage-baseDamage)/baseDamage,2)*100)} percent!)`
                });
            }
            return {
                events: events
            }
        } else {
            let damage = baseDamage - Math.floor(Math.abs(sequencer.globalBattleState.temperature - startingTemperature) / damageFactor);
            if(damage < 0) {
                damage = 0;
                return {
                    failed: true,
                    events: [
                        {
                            text: "but it failed"
                        },
                        {
                            text: "it's too cold for a fiery fist"
                        }
                    ]
                }
            } else {
                const events = [{
                    text: "ouch! a scorching fist",
                    action: () => {
                        target.dropHealth(damage)
                    }
                }];
                if(damage !== baseDamage) {
                    events.push({
                        text: `(fist power was reduced by ${Math.floor(fixNumber((baseDamage-damage)/baseDamage,2)*100)} percent!)`
                    });
                }
                return {
                    events: events
                }
            }
        }

    }
    
});
addMove({
    name: "glacial blast",
    type: "target",
    process: (sequencer,user,target) => {
        let reductionAmount = 10 - (sequencer.globalBattleState.antifreezeCount * 2);
        if(reductionAmount <= 0) {
            return {
                events: [
                    {
                        text: "it had no effect!"
                    },
                    {
                        text: "there's too much antifreeze"
                    }
                ]
            }
        }
        reductionAmount = Math.floor(reductionAmount);
        return {
            events: [
                {
                    text: `temperature dropped ${formatDegrees(reductionAmount)}`,
                    action: sequencer => {
                        sequencer.globalBattleState.temperature -= reductionAmount;
                        updateWorldTemperatureSubText(sequencer);
                    }
                },
                {
                    text: `${target.name} got hurt a little bit too`,
                    action: () => target.dropHealth(reductionAmount)
                }
            ]
        }
    }
});
addMove({
    name: "antifreeze",
    type: "self",
    process: (sequencer,user) => {
        return {
            text: "1 antifreeze added",
            action: sequencer => {
                sequencer.globalBattleState.antifreezeCount++;
                updateAntifreezeSubText(sequencer);
            }
        }
    }
});
addMove({
    name: "anti antifreeze",
    type: "self",
    process: (sequencer,user) => {
        if(sequencer.globalBattleState.antifreezeCount <= 0) {
            return {
                failed: true,
                events: [
                    {text: "but it failed"},
                    {text: "there are no antifreezes right now"}
                ]
            }
        }
        return {
            text: "1 antifreeze removed",
            action: sequencer => {
                sequencer.globalBattleState.antifreezeCount--;
                updateAntifreezeSubText(sequencer);
            }
        }
    }
});
addMove({
    name: "consume ice cubes",
    type: "self",
    process: (sequencer,user) => {
        if(sequencer.globalBattleState.antifreezeCount >= 1) {
            return {
                failed: true,
                events: [
                    {
                        text: "but it failed"
                    },
                    {
                        text: "antifreeze prevents ice cube use"
                    }
                ]
            }
        }
        const degreeDrop = 2;
        return {
            text: `your temperature dropped by ${formatDegrees(degreeDrop)}`,
            action: () => {
                user.state.temperature-=degreeDrop;
                updatePlayerTemperatureSubtext(sequencer);
            }
        }
    }
});
addMove({
    name: "bake cookies",
    type: "self",
    process: (sequencer,user) => {
        return {
            events: [
                {
                    speech: "ooh! the perfect\ntemperature"
                },
                {
                    text: `${user.name} ${overb(user)} baking cookies`
                }
            ]
        }
    }
});
addMove({
    name: "icy band aid",
    type: "self",
    process: (sequencer,user) => {
        if(user.health === user.maxHealth) {
            return {
                failed: true,
                events: [
                    {
                        text: "but it failed"
                    },
                    {
                        text: "you don't have any wounds"
                    }
                ]
            }
        }
        if(sequencer.globalBattleState.antifreezeCount >= 1) {
            return {
                failed: true,
                events: [
                    {
                        text: "but it failed"
                    },
                    {
                        text: "antifreeze prevents icy band aids!"
                    }
                ]
            }
        }
        if(sequencer.globalBattleState.temperature < startingTemperature && sequencer.globalBattleState.temperature > fakeFreezingPoint) {
            return {
                text: "some of your burn wounds have been healed",
                action: () => user.addHealth(Math.ceil(user.maxHealth/4))
            }
        }
        return {
            text: "most of your burn wounds have been healed",
            action: () => user.addHealth(Math.ceil(user.maxHealth/2))
        }
    }
});
addMove({
    name: "global warming",
    type: "self",
    process: sequencer => {
        const increaseAmount = 10;
        return {
            text: `temperature raised by ${formatDegrees(increaseAmount)}`,
            action: sequencer => {
                sequencer.globalBattleState.temperature += increaseAmount;
                updateWorldTemperatureSubText(sequencer);
            }
        }
    }
});

const clampAtMax = (number,max) => {
    if(number > max) {
        return max;
    }
    return number;
}
const clampAtMin = (number,min) => {
    if(number < min) {
        return min;
    }
    return number;
}
const clampAll = (number,min,max,withRound) => {
    if(withRound) {
        number = Math.round(number);
    }
    number = clampAtMax(number,max);
    number = clampAtMin(number,min);
    return number;
}

const downMixColor = (red,green,blue) => {
    return `rgba(${clampAll(red*255,0,255,true)},${clampAll(green*255,0,255,true)},${clampAll(blue*255,0,255,true)},1)`;
}
const colorTemperatureData = {};
(()=>{
    const fullBlueTemperature = 30;
    const fullOrangeTemperature = startingTemperature;

    const centerPoint = (fullBlueTemperature + fullOrangeTemperature) / 2;

    colorTemperatureData.centerPoint = centerPoint;
    colorTemperatureData.orangeRange = fullOrangeTemperature - centerPoint;
    colorTemperatureData.blueRange = centerPoint - fullBlueTemperature;
})();

const getColorByTemperature = temperature => {
    if(temperature > colorTemperatureData.centerPoint) {
        const normalizer =
            (temperature - colorTemperatureData.centerPoint) / colorTemperatureData.orangeRange

        const blue = 1 - normalizer;
        const red = 1;
        const green = (red + blue) / 2;

        return downMixColor(red,green,blue);

    } else if(temperature < colorTemperatureData.centerPoint) {
        const normalizer =
            (temperature - colorTemperatureData.centerPoint) / colorTemperatureData.blueRange;

        const blue = 1;
        const red = normalizer + 1;
        const green = (red + blue) / 2

        return downMixColor(red,green,blue);

    } else {
        return "rgba(255,255,255,1)";
    }
}

elves[14] = {
    name: "scorched elf",
    background: "background-9",
    backgroundColor: getColorByTemperature(startingTemperature),
    health: 200,

    startSpeech: {
        text: "originally this\nwasn't hell...\nbut management made\nsome changes...\n\nps - only antifreeze can\nmelt ice here - not heat"
    },

    startText: `keep your temperature below ${formatDegrees(overheatTemperature)}`,

    playerMoves: [
        moves["glacial blast"],
        moves["decent punch"],
        moves["icy band aid"],
        moves["consume ice cubes"]
    ],

    setup: sequencer => {
        sequencer.playerBattleObject.state.temperature = bodyTemperature;
        sequencer.playerBattleObject.subText = new Array(2);
        updateTemperatureSubTexts(sequencer);

        sequencer.elfBattleObject.subText = new Array(1);
        updateAntifreezeSubText(sequencer);
    },

    getMove: sequencer => {
        
        if(sequencer.globalBattleState.temperature >= cookiesTemperature && !sequencer.elfBattleObject.state.bakedCookies) {
            sequencer.elfBattleObject.state.bakedCookies = true;
            return moves["bake cookies"];
        }
        
        //Pioneers used to rideeeeeee these babies for miles.
        const punchMove = sequencer.globalBattleState.temperature < 60 ? "wimpy punch" : "fiery fist";
        if(sequencer.playerBattleObject.lastMove === "anti antifreeze") {
            return Math.random() > 0.25 ? moves["global warming"] : moves[punchMove];
        } else if(sequencer.playerBattleObject.lastMove === "glacial blast") {
            return Math.random() > 0.25 ? moves["antifreeze"] : Math.random() > 0.5 ? moves[punchMove] : moves["global warming"];
        } else if(sequencer.playerBattleObject.lastMove === "icy band aid" || sequencer.playerBattleObject.lastMove === "consume ice cubes") {
            return Math.random() > 0.33 ? (Math.random() > 0.5 ? moves[punchMove] : moves["global warming"]) : moves["antifreeze"];
        }

        return Math.random() > 0.5 ? (Math.random() > 0.33 ? moves[punchMove] : moves["antifreeze"]) : moves["global warming"];
    },

    getDefaultGlobalState: () => {
        return {
            temperature: startingTemperature,
            antifreezeCount: 0,
            postTurnProcess: sequencer => {

                if(sequencer.globalBattleState.temperature >= startingTemperature) {
                    sequencer.playerBattleObject.state.temperature += (sequencer.globalBattleState.temperature / startingTemperature) * playerHeatRiseFactor;
                    //Heating up until death at 105 internal body temperature.
                } else if(sequencer.globalBattleState.temperature <= fakeFreezingPoint) {
                    sequencer.playerBattleObject.state.temperature -= (1 + (fakeFreezingPoint - sequencer.globalBattleState.temperature)) / 10;
                    //Freezing to death below <fake freezing point>(38) degrees. (not freezing point, just the start of freezing)
                } else {
                    if(sequencer.playerBattleObject.state.temperature > bodyTemperature) {
                        sequencer.playerBattleObject.state.temperature -= neutralCoolingFactor;
                        if(sequencer.playerBattleObject.state.temperature < bodyTemperature) {
                            sequencer.playerBattleObject.state.temperature = bodyTemperature;
                        }
                        //Cooling off in a neutral temperature zone. Between 40-100 and not already <body temperature>(98.6).
                    }
                }

                sequencer.globalBattleState.temperature = sequencer.globalBattleState.temperature * baseTemperatureRiseFactor;
                updateTemperatureSubTexts(sequencer);

                const nextMoves = [
                    elves[14].playerMoves[0],
                    elves[14].playerMoves[1],
                    elves[14].playerMoves[2],
                    sequencer.globalBattleState.antifreezeCount >= 1 ? moves["anti antifreeze"]:moves["consume ice cubes"]
                ];
                sequencer.updatePlayerMoves(nextMoves);

                if(sequencer.playerBattleObject.state.temperature >= overheatTemperature) {
                    return {
                        events: [
                            {
                                text: `your temperature reached ${formatDegrees(overheatTemperature)}`
                            },
                            {
                                text: "you overheated and died",
                                action: () => sequencer.playerBattleObject.dropHealth(
                                    sequencer.playerBattleObject.maxHealth
                                )
                            }
                        ]
                    }
                } else if(sequencer.playerBattleObject.state.temperature <= hypothermiaTemperature) {
                    return {
                        events: [
                            {
                                text: `your temperature reached ${formatDegrees(hypothermiaTemperature)}`
                            },
                            {
                                text: "you died from hypothermia",
                                action: () => sequencer.playerBattleObject.dropHealth(
                                    sequencer.playerBattleObject.maxHealth
                                )
                            }
                        ]
                    }
                }
                return null;
            }
        }
    }
}
