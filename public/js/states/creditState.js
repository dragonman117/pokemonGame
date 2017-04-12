/**
 * Created by timothyferrell on 3/21/17.
 *
 * Requires:
 *  State.js
 *  input.js
 *
 */

function creditState(elementId, debug=false){
    let credits = state(elementId, "Credits");

    credits.addInput(KeyEvent.DOM_VK_ESCAPE);

    let creditsUpdate = function (time, inputs) {
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                credits.changeState("mainMenu");
            }
            resolve();
        })
    };

    credits.init(NaN, creditsUpdate);

    return credits;
}
