const gamepadDeadzone = 0.5;
const deadzoneNormalizer = 1 / (1 - gamepadDeadzone);

const fakeButtonPressEvent = {pressed:true};
const buttonStates = {}, buttonRollverTimeout = 150, axisRolloverTimeout = 180, firstPressRepeatDelay = 400, firstPressRepeatDelayAxis = 200;
function applyDeadZone(value) {
    if(value < 0) {
        value = value + gamepadDeadzone;
        if(value > 0) {
            value = 0;
        } else {
            value *= deadzoneNormalizer;
        }
    } else {
        value = value - gamepadDeadzone;
        if(value < 0) {
            value = 0;
        } else {
            value *= deadzoneNormalizer;
        }
    }
    return value;
}
function processButton(name,action,endAction,button,timestamp,isAxis) {
    if(button.pressed) {
        if(!buttonStates[name]) {
            buttonStates[name] = {
                timestamp:timestamp,
                start:timestamp + (isAxis ? firstPressRepeatDelayAxis : firstPressRepeatDelay)
            };
            action();
        } else if(
                timestamp >= buttonStates[name].timestamp + (isAxis ? axisRolloverTimeout : buttonRollverTimeout) &&
                timestamp >= buttonStates[name].start
            ) {
            buttonStates[name].timestamp = timestamp;
            action();
        }
    } else {
        if(buttonStates[name]) {
            endAction();
            delete buttonStates[name];
        }
    }
};
const leftBumperDown = () => {
    window.onkeydown(leftBumperCode);
};
const rightBumperDown = () => {
    window.onkeydown(rightBumperCode);
};
const aButtonDown = () => {
    window.onkeydown(aButtonCode);
};
const yButtonDown = () => {
    window.onkeydown(yButtonCode);
};
const bButtonDown = () => {
    window.onkeydown(bButtonCode);
};
const upButtonDown = () => {
    window.onkeydown(upButtonCode);
};
const downButtonDown = () => {
    window.onkeydown(downButtonCode);
};
const leftButtonDown = () => {
    window.onkeydown(leftButtonCode);
};
const rightButtonDown = () => {
    window.onkeydown(rightButtonCode);
};
const startButtonDown = () => {
    window.onkeydown(startButtonCode);
};
const leftBumperUp = () => {
    window.onkeyup(leftBumperCode);
};
const rightBumperUp = () => {
    window.onkeyup(rightBumperCode);
};
const aButtonUp = () => {
    window.onkeyup(aButtonCode);
};
const yButtonUp = () => {
    window.onkeyup(yButtonCode);
};
const bButtonUp = () => {
    window.onkeyup(bButtonCode);
};
const upButtonUp = () => {
    window.onkeyup(upButtonCode);
};
const downButtonUp = () => {
    window.onkeyup(downButtonCode);
};
const leftButtonUp = () => {
    window.onkeyup(leftButtonCode);
};
const rightButtonUp = () => {
    window.onkeyup(rightButtonCode);
};
const startButtonUp = () => {
    window.onkeyup(startButtonCode);
};

function processGamepad(gamepad,timestamp=0) {

    processButton("LeftBumper",leftBumperDown,leftBumperUp,gamepad.buttons[4],timestamp);
    processButton("RightBumper",rightBumperDown,rightBumperUp,gamepad.buttons[5],timestamp);
    processButton("a",aButtonDown,aButtonUp,gamepad.buttons[0],timestamp);
    processButton("y",yButtonDown,yButtonUp,gamepad.buttons[3],timestamp);
    processButton("b",bButtonDown,bButtonUp,gamepad.buttons[1],timestamp);
    processButton("up",upButtonDown,upButtonUp,gamepad.buttons[12],timestamp);
    processButton("down",downButtonDown,downButtonUp,gamepad.buttons[13],timestamp);
    processButton("left",leftButtonDown,leftButtonUp,gamepad.buttons[14],timestamp);
    processButton("right",rightButtonDown,rightButtonUp,gamepad.buttons[15],timestamp);
    processButton("start",startButtonDown,startButtonUp,gamepad.buttons[9],timestamp);

    const leftXAxis = applyDeadZone(gamepad.axes[0]);
    const leftYAxis = applyDeadZone(gamepad.axes[1]);

    if(leftXAxis > 0) {
        processButton("leftXAxis",rightButtonDown,rightButtonUp,fakeButtonPressEvent,timestamp,true);
    } else if(leftXAxis < 0) {
        processButton("leftXAxis",leftButtonDown,leftButtonUp,fakeButtonPressEvent,timestamp,true);
    } else {
        if(buttonStates["leftXAxis"]) {
            leftButtonUp();
            rightButtonUp();
            delete buttonStates["leftXAxis"];
        }
    }
    if(leftYAxis > 0) {
        processButton("leftYAxis",downButtonDown,downButtonUp,fakeButtonPressEvent,timestamp,true);
    } else if(leftYAxis < 0) {
        processButton("leftYAxis",upButtonDown,upButtonUp,fakeButtonPressEvent,timestamp,true);
    } else {
        if(buttonStates["leftYAxis"]) {
            downButtonUp();
            upButtonUp();
            delete buttonStates["leftYAxis"];
        }
    }

    const rightXAxis = applyDeadZone(gamepad.axes[2]);
    const rightYAxis = applyDeadZone(gamepad.axes[3]);

    if(rightXAxis > 0) {
        processButton("rightXAxis",rightButtonDown,rightButtonUp,fakeButtonPressEvent,timestamp,true);
    } else if(rightXAxis < 0) {
        processButton("rightXAxis",leftButtonDown,leftButtonUp,fakeButtonPressEvent,timestamp,true);
    } else {
        if(buttonStates["rightXAxis"]) {
            leftButtonUp();
            rightButtonUp();
            delete buttonStates["rightXAxis"];
        }
    }
    if(rightYAxis > 0) {
        processButton("rightYAxis",downButtonDown,downButtonUp,fakeButtonPressEvent,timestamp,true);
    } else if(rightYAxis < 0) {
        processButton("rightYAxis",upButtonDown,upButtonUp,fakeButtonPressEvent,timestamp,true);
    } else {
        if(buttonStates["rightYAxis"]) {
            downButtonUp();
            upButtonUp();
            delete buttonStates["rightYAxis"];
        }
    }
}
