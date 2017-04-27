function scoreState(elementId, ids, storage, debug = false) {
    let score = state(elementId, "Score State");
    let rawScores = {};

    score.addInput(KeyEvent.DOM_VK_ESCAPE);
    score.addInput("clear");

    fetch('/saveScores').then(response=>response.json()).then(json=>{
        rawScores = json;
        keys = Object.keys(ids);

        for(let i = 0; i < keys.length; i++){
            ids[keys[i]] = document.getElementById(ids[keys[i]]);
            if(rawScores.hasOwnProperty(keys[i])){
                ids[keys[i]].innerHTML = rawScores[keys[i]];
            }
        }
    });

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
        fetch('/clearScores').then(response=>response.json()).then(json=>{
            rawScores = json;
            keys = Object.keys(ids);

            for(let i = 0; i < keys.length; i++){
                // ids[keys[i]] = document.getElementById(ids[keys[i]]);
                if(rawScores.hasOwnProperty(keys[i])){
                    ids[keys[i]].innerHTML = rawScores[keys[i]];
                }
            }
        });
    }

    score.onActivate(function(){
        fetch('/saveScores').then(response=>response.json()).then(json=>{
            rawScores = json;
            keys = Object.keys(ids);

            for(let i = 0; i < keys.length; i++){
                // ids[keys[i]] = document.getElementById(ids[keys[i]]);
                if(rawScores.hasOwnProperty(keys[i])){
                    if(ids[keys[i]]) ids[keys[i]].innerHTML = rawScores[keys[i]];
                }
            }
        });
    });

    score.init(NaN, scoreUpdate);

    return score;
}
