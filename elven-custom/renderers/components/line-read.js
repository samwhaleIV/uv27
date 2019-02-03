function LineReadEffect() {


    const dataLength = 100;
    const lineGap = fullWidth / (dataLength-1);
    const sineRollover = 10000;
    const maxLineHeight = 50;
    const lineCenter = halfHeight;

    this.calloutFunction = null;


    this.render = timestamp => {

        const timeNormal = (timestamp % sineRollover) / sineRollover;


        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.beginPath();


        const angleAdjustment = (720 * timeNormal) - 360;

        context.moveTo(0-lineGap,lineCenter+Math.sin(Math.PI*angleAdjustment/180)*maxLineHeight);
        for(let i = 0;i<dataLength+1;i++) {

            const iAngle = (((i / dataLength) * 720)-360) + angleAdjustment;

            const iInRadians = Math.PI * iAngle / 180;

            const x = i * lineGap;
            const y = lineCenter + Math.sin(iInRadians) * maxLineHeight
            context.lineTo(x,y);

            if(this.calloutFunction) {
                this.calloutFunction(x,y);
            }
        }

        context.stroke();
    }
}
