"use strict";
const defaultBackgroundCycleTime = 20000;
function Background(name,color,cycleTime) {
    this.name = name;
    this.color = color;
    this.cycleTime = cycleTime || defaultBackgroundCycleTime;

    this.staticY = 372;
    this.staticHeight = 278;
    this.staticTopHeight = fullHeight - this.staticHeight;

    this.renderNormal = timestamp => {

        let horizontalOffset = 0, inverseOffset = fullWidth;

        if(!backgroundStreamMode) {
            horizontalOffset = (((timestamp % this.cycleTime) / this.cycleTime) * fullWidth);
            inverseOffset -= horizontalOffset;
        }

        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0,inverseOffset,fullHeight,
            0,0,inverseOffset,fullHeight
        );

        if(!backgroundStreamMode) {
            context.drawImage(
                imageDictionary[this.name],
                0,0,horizontalOffset,fullHeight,
                inverseOffset,0,horizontalOffset,fullHeight
            );
        }

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,fullWidth,fullHeight);
        context.restore();
    }

    this.render = timestamp => {

        let horizontalOffset = 0, inverseOffset = fullWidth;

        if(!backgroundStreamMode) {
            horizontalOffset = (((timestamp % this.cycleTime) / this.cycleTime) * fullWidth);
            inverseOffset -= horizontalOffset;
        }


        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0,inverseOffset,this.staticTopHeight,
            0,0,inverseOffset,this.staticTopHeight
        );

        if(!backgroundStreamMode) {
            context.drawImage(
                imageDictionary[this.name],
                0,0,horizontalOffset,this.staticTopHeight,
                inverseOffset,0,horizontalOffset,this.staticTopHeight
            );
        }

        context.drawImage(
            imageDictionary[this.name],
            0,this.staticY,
            fullWidth,this.staticHeight,
            0,this.staticY,
            fullWidth,this.staticHeight
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,fullWidth,fullHeight);
        context.restore();

        context.fillStyle = "rgba(0,0,0,0.7)";
        context.fillRect(0,0,fullWidth,this.staticTopHeight);
    }
}
