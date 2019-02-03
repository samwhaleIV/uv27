function ParticleWhammerEffect() {

    this.calloutFunction = null;
    this.centerX = halfWidth;
    this.centerY = halfHeight;
    this.radius = 200;
    this.rotationTime = 1000;
    this.secondRotationTime = 15000;
    this.tickRate = 1000 / 61;
    let lastUpdate = 0;

    this.render = timestamp => {
        if(timestamp - lastUpdate > this.tickRate) {
            if(this.calloutFunction) {
                const secondTimeNormal = (timestamp % this.secondRotationTime)/this.secondRotationTime;
                const adjustedRadius = this.radius + Math.sin(PI2 * secondTimeNormal) * 150;


                const timeNormal = (timestamp % this.rotationTime)/this.rotationTime;


                const angle = Math.PI * (timeNormal*360) / 180;
                const x = this.centerX + (adjustedRadius * Math.cos(angle));
                const y = this.centerY + (adjustedRadius * Math.sin(angle));
                this.calloutFunction(x,y);
            }
            lastUpdate = timestamp;
        }
    }
}