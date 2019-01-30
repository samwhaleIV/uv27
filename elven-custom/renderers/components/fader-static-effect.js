function FaderStaticEffect() {
    const noiseBlackOut = function(intensity,grainSize=30,minShade=0,maxShade=255) {
        const shadeRange = maxShade - minShade;
        let horizontalGrain = Math.ceil(fullWidth / grainSize);
        let verticalGrain = Math.ceil(fullHeight / grainSize);
    
        const xOffset = Math.floor(((horizontalGrain * grainSize) - fullWidth) / 2);
        const yOffset = Math.floor(((verticalGrain * grainSize) - fullHeight) / 2);
    
        grainSize = Math.ceil(grainSize);
    
        for(let x = 0;x<horizontalGrain;x++) {
            for(let y = 0;y<verticalGrain;y++) {
                const grainShade = Math.floor(Math.random() * shadeRange) + minShade;
                const color = `rgba(${grainShade},${grainShade},${grainShade},${intensity})`;
                context.fillStyle = color;
                context.fillRect(
                    (x*grainSize)-xOffset,
                    (y*grainSize)-yOffset,
                    grainSize,
                    grainSize
                );
            }
        }
    }
    const preRenderedInverseCircle = function(diameter,color) {
        context.fillStyle = color;
    
        const height = (fullHeight - diameter) / 2;
        context.fillRect(0,0,fullWidth,height);
        context.fillRect(0,height + diameter,fullWidth,height);
    
        const width = (fullWidth - diameter) / 2;
    
        context.fillRect(0,height,width,diameter);
        context.fillRect(width+diameter,height,width,diameter);
    
        context.drawImage(imageDictionary[`big-${color}-ass-circle`],width,height,diameter,diameter);
    }    
    this.render = intensity => {
        let diameter = Math.floor(1000 - (intensity * 1000));
        if(diameter < 0) {
            diameter = 0;
        }
        if(backgroundStreamMode) {
            preRenderedInverseCircle(diameter,"black");
        } else {
            preRenderedInverseCircle(diameter,"white");
            noiseBlackOut(
                intensity,
                15 + (intensity * 40),
                255 - (intensity * 255)
            );
        }
    }
}
