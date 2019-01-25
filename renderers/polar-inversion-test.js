function polarInversionRenderer() {
    this.effect = new WarpEffectBase();

    const lerp = (from,to,frac) => {
        return from + frac * (to - from);
    }

    this.effect.quality = 1;
    this.effect.xCenterOffset = canvas.width / 2;
    this.effect.yCenterOffset = canvas.height / 2;

    this.amount = 2;

    const radius = Math.min(canvas.width,canvas.height) * 0.5;
    this.radiusSquared = radius * radius;

    this.effect.inverseTransform = transformData => {
		const x = transformData.x;
		const y = transformData.y;
		const invertDistance = lerp(1,this.radiusSquared / (x * x + y * y), this.amount);
		transformData.x = x * invertDistance;
		transformData.y = y * invertDistance;
    }

    this.process = (context,timestamp,width,height) => {
        this.effect.render(context,context,width,height);
    }
}

function WarpEffectBase() {

    const applyRgssOffsets = (samplesArray,sampleCount,quality) => {
        if(sampleCount === 1) {
            samplesArray[0] = {
                x: 0,
                y: 0
            }
            return;
        }
        for(let i = 0;i<sampleCount;i++) {
            const y = (i + 1) / (sampleCount + 1);
            let x2 = y * quality;
            x2 -= x2 < 0 ? Math.ceil(x2) : Math.floor(x2);
            samplesArray[i] = {
                x: x2 - 0.5,
                y: y - 0.5
            }
        }
    }

    const redChannel = 0;
    const greenChannel = 1;
    const blueChannel = 2;
    const alphaChannel = 3;

    const colors = new Object();
    (()=>{
        const transparent = new Uint8ClampedArray(4);
        transparent[redChannel] = 255;
        transparent[greenChannel] = 255;
        transparent[blueChannel] = 255;
        transparent[alphaChannel] = 0;
        colors.transparent = transparent;

        const white = new Uint8ClampedArray(4);
        white[redChannel] = 255;
        white[greenChannel] = 255;
        white[blueChannel] = 255;
        white[alphaChannel] = 255;
        colors.white = white;

        colors.zero = new Uint8ClampedArray(4);
    })();

    const distanceIgnorantInterpolate = (imageData,x,y) => {

        if(!isFinite(x) || !isFinite(y)) {
            return colors.transparent;
        }

        x = Math.round(x);
        y = Math.round(y);

        if(x < 0) {
            x = 0;
        } else if(x > imageData.width-1) {
            x = imageData.width - 1;
        }
        if(y < 0) {
            y = 0;
        } else if(y > imageData.height-1) {
            y = imageData.height - 1;
        }

        const samples = [getLooseSample(imageData,x,y)];
        if(x > 0) {
            samples.push(
                getLooseSample(imageData,x-1,y)
            );
        }
        if(x < imageData.width-1) {
            samples.push(
                getLooseSample(imageData,x+1,y)
            );
        }
        if(y > 0) {
            samples.push(
                getLooseSample(imageData,x,y-1)
            );
        }
        if(y < imageData.height-1) {
            samples.push(
                getLooseSample(imageData,x,y+1)
            );
        }
        return blendSamples(samples);
    }

    const getLooseSample = (imageData,x,y) => {

        const index = (x + (imageData.width * y)) * 4;

        return imageData.data.slice(index,index + 4);

    }

    const getLooseIndex = (imageData,x,y) => (x + (imageData.width * y)) * 4;

    const isOnSurface = (imageData,u,v) => {
        if(u >= 0 && u <= imageData.width - 1 && v >= 0) {
            return v <= imageData.height - 1;
        }
        return false;
    }

    const blendSamples = samples => {
        const count = samples.length;
        if(count === 0) {
            return colors.zero;
        }
        let aSum = 0;
        for(let j = 0;j<count;j++) {
            aSum += samples[j][alphaChannel];
        }
        let r = 0;
        let b = 0;
        let g = 0;
        if(aSum !== 0) {
            let rSum = 0, gSum = 0, bSum = 0;
            for(let i = 0;i<count;i++) {
                const sample = samples[i];
                rSum = rSum + (sample[alphaChannel] * sample[redChannel]);
                gSum = gSum + (sample[alphaChannel] * sample[greenChannel]);
                bSum = bSum + (sample[alphaChannel] * sample[blueChannel]);
            }
            r = rSum / aSum;
            g = gSum / aSum;
            b = bSum / aSum;
        }
        const newSample = new Uint8ClampedArray(4);
        newSample[redChannel] = r;
        newSample[greenChannel] = g;
        newSample[blueChannel] = b;
        newSample[alphaChannel] = aSum / count;
        return newSample;
    }

    this.inverseTransform = transformData => {return;}

    this.quality = 2;
    this.xCenterOffset = 0;
    this.yCenterOffset = 0;

    this.render = (sourceContext,destinationContext,width,height) => {
        const sourceData = sourceContext.getImageData(
            0,0,width,height
        );

        const destinationData = destinationContext.getImageData(
            0,0,width,height
        );

        const antialiasSampleCount = this.quality * this.quality;
        const antialaiasPoints = new Array(antialiasSampleCount);

        applyRgssOffsets(antialaiasPoints,antialiasSampleCount,this.quality);

        const samples = new Array(antialiasSampleCount);
        let sampleCount = 0;

        for(let y = 0;y<height;y++) {

            const relativeY = y - this.yCenterOffset;
            for(let x = 0;x<width;x++) {
                const relativeX = x - this.xCenterOffset;
                sampleCount = 0;
                for(let p = 0;p<antialiasSampleCount;p++) {

                    const transformData = {
                        x: relativeX + antialaiasPoints[p].x,
                        y: relativeY + antialaiasPoints[p].y
                    }

                    this.inverseTransform(transformData);

                    const sampleX = transformData.x + this.xCenterOffset;
                    const sampleY = transformData.y + this.yCenterOffset;

                    let sample;
                    if(isOnSurface(sourceData,sampleX,sampleY)) {
                        sample = distanceIgnorantInterpolate(sourceData,sampleX,sampleY);
                    } else {
                        sample = colors.transparent;
                    }
                    samples[sampleCount] = sample;
                    sampleCount++;

                }

                const blendedColor = blendSamples(samples);

                const destinationStart = getLooseIndex(sourceData,x,y);

                if(blendedColor[alphaChannel] !== 0) {
                    destinationData.data[destinationStart+redChannel] = blendedColor[redChannel];
                    destinationData.data[destinationStart+greenChannel] = blendedColor[greenChannel];
                    destinationData.data[destinationStart+blueChannel] = blendedColor[blueChannel];
                    destinationData.data[destinationStart+alphaChannel] = blendedColor[alphaChannel];
                }

            }



        }

        destinationContext.putImageData(destinationData,0,0,0,0,width,height);
    }
}
