/**
 * Created by timothyferrell on 3/21/17.
 *
 * Requires:
 *  State.js
 *  input.js
 *
 */

function scoreState(elementId, ids, storage, debug = false) {
    let score = state(elementId, "Score State");

    score.addInput(KeyEvent.DOM_VK_ESCAPE);
    score.addInput("clear");

    keys = Object.keys(ids);
    for(let i = 0; i < keys.length; i++){
        ids[keys[i]] = document.getElementById(ids[keys[i]]);
        if(storage.contains(keys[i])){
            ids[keys[i]].innerHTML = storage.fetch(keys[i]);
        }
    }

    let scoreUpdate = function (time, inputs) {
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                score.changeState("mainMenu");
            }
            if(inputs["clear"]){
                clearScores();
            }
            resolve();
        })
    };

    function clearScores() {
        storage.clearAll();
        for(let i = 0; i < keys.length; i++){
            ids[keys[i]].innerHTML = "0";
        }
    }

    score.init(NaN, scoreUpdate);

    return score;
}
