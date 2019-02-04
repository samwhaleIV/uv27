function FigureEightEffect() {

    this.calloutFunction = null;
    this.centerY = halfHeight;
    this.scale = 300;
    this.centerX = halfWidth;
    this.rotationTime = 100;

    this.tickRate = 1000 / 61;
    let lastUpdate = 0;

    this.calloutFunction = null;

    this.render = timestamp => {

        if(timestamp - lastUpdate > this.tickRate) {
            if(this.calloutFunction) {
                const timeNormal = timestamp / this.rotationTime;

                const x = Math.cos(timeNormal);
                const y = Math.sin(timeNormal * 2) / 2;

                this.calloutFunction(x*this.scale+this.centerX,y*this.scale+this.centerY);
            }
            lastUpdate = timestamp;
        }
    }
}