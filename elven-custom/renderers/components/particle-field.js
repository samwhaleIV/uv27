function ParticleFieldEffect() {

    const particleRadius = 4;
    const particleColor = "rgba(0,255,255,0.5)";

    const particleResetVelocity = 3;
    const particleDeacceleration = 100;

    const particlePushDistance = 50;

    function bumpParticle(particle,xDelta,yDelta,dx,dy) {
        if(!xDelta && !yDelta) {
            particle.x += dx;
            particle.y += dy;
        } else {
            particle.x += xDelta;
            particle.y += yDelta;
        }

    }

    function particle() {
        this.x = 0;
        this.y = 0;
    }
    
    const rows = 30;
    const columns = 30;

    const columnSpacing = fullWidth / (columns-1);
    const rowSpacing = fullHeight / (rows-1);

    const particles = new Array(rows);
    for(let y = 0;y<rows;y++) {
        const columnArray = new Array(columns);
        for(let x = 0;x<columns;x++) {
            columnArray[x] = new particle();
        }
        particles[y] = columnArray;
    }

    let lastMouseX = null;
    let lastMouseY = null;
    let bumpTimeout = null;

    const maxDelta = 200;

    this.bumpRegion = (mouseX,mouseY) => {
        if(bumpTimeout !== null) {
            clearTimeout(bumpTimeout);
        }

        let xDelta = 0, yDelta = 0, size;

        if(lastMouseX !== null) {
            xDelta = (lastMouseX - mouseX) * 2;
            yDelta = (lastMouseY - mouseY) * 2;
            size = (Math.abs(xDelta) + Math.abs(yDelta)) / 2;
            size *= 2;
            if(size > 75) {
                size = 75;
            }
        } else {
            size = 0;
        }

        if(xDelta > maxDelta) {
            xDelta = maxDelta;
        } else if(xDelta < -maxDelta) {
            xDelta = -maxDelta;
        }
        if(yDelta > maxDelta) {
            yDelta = maxDelta;
        } else if(yDelta < -maxDelta) {
            yDelta = -maxDelta;
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
        bumpTimeout = setTimeout(()=>{
            lastMouseX = null;
            lastMouseY = null;
        },500);
        
        let y = 0;
        while(y < rows) {
            let x = 0;
            while(x < columns) {
                const particle = particles[y][x];

                const drawX = (columnSpacing * x) + particle.x;
                const drawY = (rowSpacing * y) + particle.y;


                const dx = drawX - mouseX;
                const dy = drawY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if(distance < particleRadius + size) {
                    bumpParticle(particle,xDelta,yDelta,dx,dy);
                }

                x++;
            }
            y++;
        }
    }

    this.readout = () => {
        console.log(particles);
    }

    const frameTime = 1000 / 60;
    let lastFrame = 0;

    this.render = timestamp => {

        const timeDiffference = timestamp - lastFrame;
        const timeFactor = timeDiffference / frameTime;
        lastFrame = timestamp;

        context.fillStyle = particleColor;
        let y = 0;
        while(y < rows) {
            let x = 0;
            while(x < columns) {
                const particle = particles[y][x];

                const absoluteDifferenceX = Math.abs(particle.x);
                const absoluteDifferenceY = Math.abs(particle.y);


                if(absoluteDifferenceX > 0 && absoluteDifferenceY > 0) {
                    let velocityX, velocityY;
                    if(absoluteDifferenceX > absoluteDifferenceY) {
                        velocityX = particleResetVelocity * (absoluteDifferenceX / particleDeacceleration);
                        velocityY = velocityX / (absoluteDifferenceX / absoluteDifferenceY);
                    } else {
                        velocityY = particleResetVelocity * (absoluteDifferenceY / particleDeacceleration);
                        velocityX = velocityY / (absoluteDifferenceY / absoluteDifferenceX);
                    }

                    velocityX *= timeFactor;
                    velocityY *= timeFactor;

                    if(particle.x < 0) {
                        particle.x += velocityX;
                        if(particle.x > 0) {
                            particle.x = 0;
                        }
                    } else if(particle.x > 0) {
                        particle.x -= velocityX;
                        if(particle.x < 0) {
                            particle.x = 0;
                        }
                    }

                    if(particle.y < 0) {
                        particle.y += velocityY;
                        if(particle.y > 0) {
                            particle.y = 0;
                        }
                    } else if(particle.y > 0) {
                        particle.y -= velocityY;
                        if(particle.y < 0) {
                            particle.y = 0;
                        }
                    }

                } else if(absoluteDifferenceY > 0) {
                    if(particle.y < 0) {
                        particle.y += ((particleResetVelocity * (-particle.y / particleDeacceleration))+1)*timeFactor;
                        if(particle.y > 0) {
                            particle.y = 0;
                        }
                    } else {
                        particle.y -= ((particleResetVelocity * (particle.y / particleDeacceleration))+1)*timeFactor;
                        if(particle.y < 0) {
                            particle.y = 0;
                        }
                    }
                } else if(absoluteDifferenceX > 0) {
                    if(particle.x < 0) {
                        particle.x += ((particleResetVelocity * (-particle.x / particleDeacceleration))+1)*timeFactor;
                        if(particle.x > 0) {
                            particle.x = 0;
                        }
                    } else {
                        particle.x -= ((particleResetVelocity * (particle.x / particleDeacceleration))+1)*timeFactor;
                        if(particle.x < 0) {
                            particle.x = 0;
                        }
                    }
                }

                
                const drawX = (columnSpacing * x) + particle.x;
                const drawY = (rowSpacing * y) + particle.y;
    
                context.beginPath();
                context.arc(drawX,drawY,particleRadius,0,PI2);
                context.fill();
                x++;
            }
            y++;
        }
    }
}