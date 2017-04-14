/**
 * Created by timothyferrell on 3/8/17.
 *
 * Requires:
 *  State.js
 *  input.js
 *  loadState.js
 *  mainMenuState.js
 *  scoreState.js
 */

let Pokemon = {};
Pokemon.debug = false;

let tstCanvas = document.getElementById("tstCanvas");
let height = tstCanvas.offsetHeight;

let states = document.getElementsByClassName("state");
for(let i = 0; i < states.length; i++){
    let tmp = states.item(i);
    //tmp.setAttribute("style","min-height: " + height + "px;");
}

let highScoreId = {"first":"hs1", "second":"hs2", "third": "hs3", "fourth":"hs4", "fifth":"hs5"};
let controlsId = {"controlUp": "up", "controlDown": "down", "controlLeft": "left", "controlRight": "right", "controlStart": "start", "controlA": "a", "controlB": "b"};

//Initialize Draw Library
Pokemon.draw = Graphics();
Pokemon.draw.initalize("canvasMain", 208, 208);

Pokemon.store = persistantStorage("pokemonGame");

//Initialize Input
Pokemon.input = input();

//Include Game States inside Pokemons states
Pokemon.states = {
    load: loadState("load"),
    mainMenu: mainMenuState("main", Pokemon.debug),
    game: gameState("game", Pokemon.draw, Pokemon.store, Pokemon.debug),
    score: scoreState("scores", highScoreId, Pokemon.store, Pokemon.debug),
    controls: controlState("controls", Pokemon.store, Pokemon.input, Pokemon.debug),
    credits: creditState("credits", Pokemon.debug)
    // pause: pauseState("pause", Pokemon.debug)
};

//Game Main Loop
Pokemon.main = (function () {

    let lastTimestamp = 0;
    let debug = Pokemon.debug;
    let globalKeys = {};

    //State Vars
    let currentState = Pokemon.states['load']; // Set the initial state to load.

    function processInput() {
        if(debug){
            console.log("Process Input Called")
        }
        let res = Pokemon.input.fetchInput();
        for(let i = 0; i < res.length; i++){
            if(!currentState.hasInput(res[i])){
                if(globalKeys.hasOwnProperty(res[i])){
                    globalKeys[res[i]](); // call the function for that key
                }
            }// else ignore it there is no other option we do not have a key for it
        }
        res = [];
    }

    function update(time){
        if(debug){
            console.log("Update Function Called");
        }
        //Get any Input Processed
        processInput();
        //Check if there needs to be a state change
        let newState = currentState.isReqChangeState();
        if(newState){
            changeGameState(newState);
        }
        //Run Update on current state
        currentState.update(time);
    }

    function render() {
        if(debug){
            console.log("Render Function Called");
        }
        Pokemon.draw.beginRender();
        currentState.render();
    }

    function gameLoop(time) {
        let diff = time - lastTimestamp;
        lastTimestamp = time;

        processInput(diff);
        update(diff);
        render();

        requestAnimationFrame(gameLoop);
    }

    function changeGameState(key){
        currentState.deactivate();
        currentState = Pokemon.states[key];
        currentState.activate();
    }

    //Initialization Code Below
    if(debug){
        console.log("Game Initializing");
        let keys = Object.keys(Breakout.states);
        for(let i = 0; i < keys.length; i++){
            Breakout.states[keys[i]].setDebug(true);
        }
    }

    //Initialize Global Inputs

    //Change state to main menu prior to start
    changeGameState("mainMenu");

    //Start the game loop
    requestAnimationFrame(gameLoop);
})();
