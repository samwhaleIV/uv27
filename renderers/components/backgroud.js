function Background(name,color,cycleTime) {
    this.name = name;
    this.color = color;
    this.cycleTime = cycleTime || 20000;

    this.staticY = 372;
    this.staticHeight = 278;
    this.staticTopHeight = canvas.height - this.staticHeight;

    this.renderNormal = (context,timestamp,width,height) => {
        const horizontalOffset = -(((timestamp % this.cycleTime) / this.cycleTime) * width);

        context.drawImage(
            imageDictionary[this.name],
            horizontalOffset,0
        );

        context.drawImage(
            imageDictionary[this.name],
            (width + horizontalOffset),0
        );

        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.color;
        context.fillRect(0,0,width,height);
        context.restore();

    }

    this.render = (context,timestamp,width,height) => {

        const horizontalOffset = -(((timestamp % this.cycleTime) / this.cycleTime) * width);

        context.drawImage(
            imageDictionary[this.name],
            0,0,width,this.staticTopHeight,
            horizontalOffset,0,width,this.staticTopHeight
        );


        context.drawImage(
            imageDictionary[this.name],
            0,0,width,this.staticTopHeight,
            (width + horizontalOffset),0,width,this.staticTopHeight
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
