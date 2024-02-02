function randomRGBA() {
    const rgbaMaximumValue = 255;
    return {
        red:    randomValue() * rgbaMaximumValue,
        green:  randomValue() * rgbaMaximumValue,
        blue:   randomValue() * rgbaMaximumValue,
        alpha:  randomValue() * rgbaMaximumValue
    };
}



function randomValue() {
    return Math.random();
}