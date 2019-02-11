function ParallaxBackground(layer1,layer2) {



    this.render = (timestamp,xOffset) => {

        context.drawImage(imageDictionary[layer1],
            xOffset*0.1,0,fullWidth,fullHeight,
            0,0,fullWidth,fullHeight
        );

        context.drawImage(imageDictionary[layer2],
            xOffset*0.5,0,fullWidth,fullHeight,
            0,0,fullWidth,fullHeight
        );

    }
}