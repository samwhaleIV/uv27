"use strict";
function BossBackground(cycleTime) {

    if(!cycleTime) {
        cycleTime = 10000;
    }

    this.background = new Background("background-2","rgb(20,20,20)",cycleTime);

    this.fragmentPoints = [
        {   //Left most
            originX: 138, originY: 141,
            destinationX: 138, destinationY: 141,
            width: 63, height: 179,
        },
        {   //Second-right
            originX: 138, originY: 141,
            destinationX: 207, destinationY: 276,
            width: 63, height: 179,
        },
        {   //Second-left
            originX: 138, originY: 141,
            destinationX: 485, destinationY: 274,
            width: 63, height: 179,
        },
        {   //Right most
            originX: 138, originY: 141,
            destinationX: 551, destinationY: 145,
            width: 63, height: 179,
        },

        {   //Center
            originX: 315, originY: 83,
            destinationX: 315, destinationY: 83,
            width: 119, height: 300,
        },            
    ];
    this.rotationTime = 1000;
    this.fragmentRadius = 50;

    this.globalYOffset = 29;
    this.render = timestamp => {

        this.background.renderNormal(timestamp);

        context.drawImage(imageDictionary["boss-layer-background"],0,this.globalYOffset);

        let angle;
        if(Math.floor(timestamp / this.rotationTime) % 2 === 0) {
            angle = (timestamp % this.rotationTime) / this.rotationTime * 180;
        } else {
            angle = 1 - (timestamp % this.rotationTime) / this.rotationTime * 180;
        }


        let inverseAngle = Math.abs(angle - 180);

        angle = Math.PI * angle / 180;
        inverseAngle = Math.PI * inverseAngle / 180;



        let xOffset = (this.fragmentRadius * Math.cos(angle));
        let yOffset = (this.fragmentRadius * Math.sin(angle)) + this.globalYOffset;
        
        let inverseXOffset = (this.fragmentRadius * Math.cos(inverseAngle));
        let inverseYOffset = (this.fragmentRadius * Math.sin(inverseAngle)) + this.globalYOffset;

        for(let i = 0;i < this.fragmentPoints.length;i++) {

            const fragment = this.fragmentPoints[i];

            context.drawImage(
                imageDictionary["boss-layer-effect"],
                fragment.originX,fragment.originY,
                fragment.width,fragment.height,
                fragment.destinationX + xOffset,
                fragment.destinationY + yOffset,
                fragment.width,fragment.height
            );

            context.drawImage(
                imageDictionary["boss-layer-effect"],
                fragment.originX,fragment.originY,
                fragment.width,fragment.height,
                fragment.destinationX + inverseXOffset,
                fragment.destinationY + inverseYOffset,
                fragment.width,fragment.height
            );

        }

        context.drawImage(imageDictionary["boss-layer-top"],0,this.globalYOffset);

    }
}
