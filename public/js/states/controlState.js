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

    let up = document.getElementById("up");
    let down = document.getElementById("down");
    let left = document.getElementById("left");
    let right = document.getElementById("right");
    let start = document.getElementById("start");
    let a = document.getElementById("a");
    let b = document.getElementById("b");

    let storageMap = {
        up: "controlUp",
        down: "controlDown",
        left: "controlLeft",
        right: "controlRight",
        start: "controlStart",
        a: "controlA",
        b: "controlB"
    };
    let controlKeys = {
        up: {key: KeyEvent.DOM_VK_UP, name: "ArrowUp"},
        down: {key: KeyEvent.DOM_VK_DOWN, name: "ArrowDown"},
        left: {key: KeyEvent.DOM_VK_LEFT, name: "ArrowLeft"},
        right: {key: KeyEvent.DOM_VK_RIGHT, name: "ArrowRight"},
        start: {key: KeyEvent.DOM_VK_ENTER, name: "enter"},
        a: {key: KeyEvent.DOM_VK_A, name: "a"},
        b: {key: KeyEvent.DOM_VK_B, name: "b"}
    };

    let sKeys = Object.keys(storageMap);
    for(let i = 0; i < sKeys.length; i++){
        if(storage.contains(storageMap[sKeys[i]])){
            controlKeys[sKeys[i]] = storage.fetch(storageMap[sKeys[i]]);
        }
    }

    up.innerHTML = controlKeys.up.name;
    down.innerHTML = controlKeys.down.name;
    left.innerHTML = controlKeys.left.name;
    right.innerHTML = controlKeys.right.name;
    a.innerHTML = controlKeys.a.name;
    b.innerHTML = controlKeys.b.name;

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
                    controlKeys.up.key = input.keyToGlobal(event.keyCode);
                    controlKeys.up.name = event.key;
                    storage.add("controlUp", controlKeys.up);
                    up.innerHTML = event.key;
                });
            }
            else if(inputs["down"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.down.key = input.keyToGlobal(event.keyCode);
                    controlKeys.down.name = event.key;
                    storage.add("controlDown", controlKeys.down);
                    down.innerHTML = event.key;
                });
            }
            else if(inputs["left"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.left.key = input.keyToGlobal(event.keyCode);
                    controlKeys.left.name = event.key;
                    storage.add("controlLeft", controlKeys.left);
                    left.innerHTML = event.key;
                });
            }
            else if(inputs["right"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.right.key = input.keyToGlobal(event.keyCode);
                    controlKeys.right.name = event.key;
                    storage.add("controlRight", controlKeys.right);
                    right.innerHTML = event.key;
                });
            }
            else if(inputs["start"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.start.key = input.keyToGlobal(event.keyCode);
                    controlKeys.start.name = event.key;
                    storage.add("controlStart", controlKeys.start);
                    start.innerHTML = event.key;
                });
            }
            else if(inputs["a"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.a.key = input.keyToGlobal(event.keyCode);
                    controlKeys.a.name = event.key;
                    storage.add("controlA", controlKeys.a);
                    a.innerHTML = event.key;
                });
            }
            else if(inputs["b"]){
                input.onNextKeyPress(function(event){
                    console.log(event);
                    controlKeys.b.key = input.keyToGlobal(event.keyCode);
                    controlKeys.b.name = event.key;
                    storage.add("controlB", controlKeys.b);
                    b.innerHTML = event.key;
                });
            }
            resolve();
        })
    };

    controls.init(NaN, controlsUpdate);

    return controls;
}
