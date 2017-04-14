/**
 * Requires:
 *  State.js
 *  input.js
 *
 */

function controlState(elementId, storage, input, debug=false){
    let controls = state(elementId, "Controls");
    let keyName;
    let keyCode;
    let waitingForKey = false;

    let controlKeys = {
        up: {key: KeyEvent.DOM_VK_UP, name: "up arrow"},
        down: {key: KeyEvent.DOM_VK_DOWN, name: "down arrow"},
        left: {key: KeyEvent.DOM_VK_LEFT, name: "left arrow"},
        right: {key: KeyEvent.DOM_VK_RIGHT, name: "right arrow"},
        start: {key: KeyEvent.DOM_VK_ENTER, name: "enter"},
        a: {key: KeyEvent.DOM_VK_A, name: "A"},
        b: {key: KeyEvent.DOM_VK_B, name: "B"}
    }

    controls.addInput(KeyEvent.DOM_VK_ESCAPE);
    controls.addInput("up");
    controls.addInput("down");
    controls.addInput("left");
    controls.addInput("right");
    controls.addInput("start");
    controls.addInput("a");
    controls.addInput("b");

    let controlsUpdate = function (time, inputs) {
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                controls.changeState("mainMenu");
            }
            if(inputs["up"]){
                input.onNextKeyPress(function(event){
                    controlKeys.up.key = event.keyCode;
                    controlKeys.up.name = event.key;
                    storage.add("controlUp", controlKeys.up);
                    let up = document.getElementById("up");
                    up.innerHTML = event.key;
                });
            }
            else if(inputs["down"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.down.key = event.keyCode;
                    controlKeys.down.name = event.key;
                    storage.add("controlDown", controlKeys.down);
                    let down = document.getElementById("down");
                    down.innerHTML = event.key;
                });
            }
            else if(inputs["left"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.left.key = event.keyCode;
                    controlKeys.left.name = event.key;
                    storage.add("controlLeft", controlKeys.left);
                    let left = document.getElementById("left");
                    left.innerHTML = event.key;
                });
            }
            else if(inputs["right"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.right.key = event.keyCode;
                    controlKeys.right.name = event.key;
                    storage.add("controlRight", controlKeys.right);
                    let right = document.getElementById("right");
                    right.innerHTML = event.key;
                });
            }
            else if(inputs["start"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.start.key = event.keyCode;
                    controlKeys.start.name = event.key;
                    storage.add("controlStart", controlKeys.start);
                    let start = document.getElementById("start");
                    start.innerHTML = event.key;
                });
            }
            else if(inputs["a"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.a.key = event.keyCode;
                    controlKeys.a.name = event.key;
                    storage.add("controlA", controlKeys.a);
                    let a = document.getElementById("a");
                    a.innerHTML = event.key;
                });
            }
            else if(inputs["b"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.b.key = event.keyCode;
                    controlKeys.b.name = event.key;
                    storage.add("controlB", controlKeys.b);
                    let b = document.getElementById("b");
                    b.innerHTML = event.key;
                });
            }
            resolve();
        })
    };

    controls.init(NaN, controlsUpdate);

    return controls;
}
