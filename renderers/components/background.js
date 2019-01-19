function Background(name,color,cycleTime) {
    this.name = name;
    this.color = color;
    this.cycleTime = cycleTime || 20000;

    this.staticY = 372;
    this.staticHeight = 278;
    this.staticTopHeight = canvas.height - this.staticHeight;

    this.renderNormal = (context,timestamp,width,height) => {
        const horizontalOffset = (((timestamp % this.cycleTime) / this.cycleTime) * width);
        const inverseOffset = width - horizontalOffset;

        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0,inverseOffset,height,
            0,0,inverseOffset,height
        );

        context.drawImage(
            imageDictionary[this.name],
            0,0,horizontalOffset,height,
            inverseOffset,0,horizontalOffset,height
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,width,height);
        context.restore();
    }

    this.render = (context,timestamp,width,height) => {

        const horizontalOffset = (((timestamp % this.cycleTime) / this.cycleTime) * width);
        const inverseOffset = width - horizontalOffset;

        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0,inverseOffset,this.staticTopHeight,
            0,0,inverseOffset,this.staticTopHeight
        );

        context.drawImage(
            imageDictionary[this.name],
            0,0,horizontalOffset,this.staticTopHeight,
            inverseOffset,0,horizontalOffset,this.staticTopHeight
        );



        context.drawImage(
            imageDictionary[this.name],
            0,this.staticY,
            width,this.staticHeight,
            0,this.staticY,
            width,this.staticHeight
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,width,height);
        context.restore();

        context.fillStyle = "rgba(0,0,0,0.7)";
        context.fillRect(0,0,width,this.staticTopHeight);
    }
}
