"use strict";
function FireEffect() {

    const height = 23; //Adjust height to have slight margin with the firestack
    const width = Math.ceil(fullWidth / 20) + 1;
    const texelSize = Math.ceil(fullWidth / width);
    const horizontalOffset = texelSize / 4;

    const fire = new Array(height);
    for(let i = 0;i<height;i++) {
        fire[i] = new Array(width).fill(0);
    }

    const rowShiftTime = 40;
    let lastShift = 0;

    this.render = timestamp => {

        const timeDifference = timestamp - lastShift;

        const shouldUpdate = timeDifference > rowShiftTime;

        let verticalTexelOffset = timeDifference / rowShiftTime;
        if(verticalTexelOffset > 1) {
            verticalTexelOffset = 1;
        }

        if(shouldUpdate) {
            verticalTexelOffset--;
            const lastRow = fire.pop();
            let i = 0;
            while(i < width) {
                lastRow[i] = Math.floor(Math.random() * 128) + 128;
                i++;
            }
            fire.unshift(lastRow);
            lastShift = timestamp;
        }

        let y = 1;
        while(y < height) {
            let x = 0;
            while(x < width) {
                if(shouldUpdate) {
                    fire[y][x] -= Math.floor(Math.random() * 30) + 1;
                }
                if(fire[y][x] > 0) {
                    context.fillStyle = `rgb(${fire[y][x]},0,0)`;
                    context.beginPath();
                    context.rect(
                        (x*texelSize)-horizontalOffset,
                        (fullHeight-((y+verticalTexelOffset-1)*(texelSize))),
                        texelSize,texelSize
                    );
                    context.fill();
                }
                x++;
            }
            y++;
        }
    }
}
