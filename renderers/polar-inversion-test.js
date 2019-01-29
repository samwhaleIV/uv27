"use strict";
function polarInversionRenderer() {

    this.amount = 3.2929858549731463;

    this.drawPrecision = 2;

    //const radius = Math.min(canvas.width,canvas.height) * 0.5; 

    this.radiusSquared = 96952;

    this.xCenterOffset = canvas.width / 2;
    this.yCenterOffset = canvas.height / 2;

    const left = 100;
    const right = canvas.width - 100;

    const top = 100;
    const bottom = canvas.height - 100;


    this.process = (context,timestamp,width,height) => {

        const sourceData = context.getImageData(0,0,width,height);

        for(let y = 0;y<sourceData.height;y+=this.drawPrecision) {

            const relativeY = y - this.yCenterOffset;
            for(let x = 0;x<sourceData.width;x+=this.drawPrecision) {
                const relativeX = x - this.xCenterOffset;

                const invertDistance = 1 + this.amount * (this.radiusSquared / (relativeX * relativeX + relativeY * relativeY) - 1);
                const sampleX = (relativeX * invertDistance) + this.xCenterOffset;
                const sampleY = (relativeY * invertDistance) + this.yCenterOffset;

                let isOnSurface = false;
                if(sampleX >= 0 && sampleX <= sourceData.width - 1 && sampleY >= 0) {
                    isOnSurface = sampleY <= sourceData.height - 1;
                }

                if(isOnSurface && isFinite(sampleX) && isFinite(sampleY)) {

                    const sampleIndex = (Math.round(sampleX) + (sourceData.width * Math.round(sampleY))) * 4;

                    if(sampleIndex === null) continue;
                    const destinationStart = (x + (sourceData.width * y)) * 4;

                    sourceData.data[destinationStart] = sourceData.data[sampleIndex];
                    sourceData.data[destinationStart+1] = sourceData.data[sampleIndex+1];
                    sourceData.data[destinationStart+2] = sourceData.data[sampleIndex+2];
                    sourceData.data[destinationStart+3] = sourceData.data[sampleIndex+3];
                    
                }
            }
        }
        context.putImageData(sourceData,0,0);
    }
}
