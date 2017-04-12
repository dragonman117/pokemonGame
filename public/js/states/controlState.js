/**
 * Requires:
 *  State.js
 *  input.js
 *
 */

function controlState(elementId, debug=false){
    let controls = state(elementId, "Controls");

    controls.addInput(KeyEvent.DOM_VK_ESCAPE);
    controls.addInput("left");
    controls.addInput("right");
    controls.addInput("up");
    controls.addInput("down");

    let controlsUpdate = function (time, inputs) {
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                controls.changeState("mainMenu");
            }
            // if(inputs["left"]){
            //
            // }
            // if(inputs["right"]){
            //
            // }
            // if(inputs["up"]){
            //
            // }
            // if(inputs["down"]){
            //
            // }
            resolve();
        })
    };

    controls.init(NaN, controlsUpdate);

    return controls;
}
