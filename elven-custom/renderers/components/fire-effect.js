"use strict";
function FireEffect(time=40,blue=0,prerender=true) {

    const height = 23;
    const width = 30;
    const texelSize = fullWidth / width;

    const fire = new Array(height);
    for(let i = 0;i<height;i++) {
        fire[i] = new Array(width).fill(0);
    }

    if(prerender) {
        for(let i = 0;i<60;i++) {
            const lastRow = fire.pop();
            let i = 0;
            while(i < width) {
                lastRow[i] = Math.floor(Math.random() * 128) + 128;
                i++;
            }
            fire.unshift(lastRow);
    
            let y = 1;
            while(y < height) {
                let x = 0;
                while(x < width) {
                    fire[y][x] -= Math.floor(Math.random() * 30) + 1;
                    x++;
                }
                y++;
            }
        }
    }

    const rowShiftTime = time;
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
                    context.fillStyle = `rgb(${fire[y][x]},0,${blue})`;
                    context.beginPath();
                    context.rect(
                        x*texelSize,
                        (fullHeight-((y+verticalTexelOffset-1)*texelSize)),
                        texelSize,texelSize+1
                    );
                    context.fill();
                }
                x++;
            }
            y++;
        }
    }
}
