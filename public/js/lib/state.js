/**
 * Created by timothyferrell on 3/8/17.
 */

/**
 * This is an interface for all states (inherit and redefine required functions)
 * @param elementId html element id for this state
 * @param stateName human readable name for this state (for debugging purposes)
 * @param startingState (optional) boolean for if state is active (true) or not (false) defaults to false
 */
function state(elementId, stateName, startingState = false){
    let id = elementId;
    let element = document.getElementById(id);
    let name = stateName;
    let active = startingState;
    let debugActive = false;
    let inputs = {};
    let usrRender = NaN;
    let usrUpdate = NaN;
    let changeStateReq = NaN;
    let activateHook = NaN;
    let deactivateHook = NaN;

    /**
     * A simple function to assign the users render and update extension funcitons
     * @param render a function to be called on render
     * @param update a promise to be called on update (must be a promise)
     */
    let initialize = function (render = NaN, update = NaN) {
        usrRender = render;
        usrUpdate = update;
    };

    /**
     * Render function is the function required for state render, will call the render function provided in initialization
     */
    let render = function () {
        if(debugActive){
            console.log("State " + name + " render function called");
        }
        if(usrRender){
            usrRender();
        }
    };

    /**
     * Update is the function required for state update, will call the update function provided in initialization
     * @param time current game timestamp
     */
    let update = function (time) {
        if(debugActive){
            console.log("State " + name + " update function called");
        }
        //console.log(inputs);
        if(usrUpdate){
            usrUpdate(time, inputs).then(function () {
                cleanInputs();
            })
        }else{
            cleanInputs();
        }
    };

    /**
     * Check and accepts inputs allowed by this game state, check goes state, then global, then ignored
     * @param input the input signifier (aka keycode or click)
     * @returns {boolean} True if this state has input actions defined, false if not
     */
    let hasInput = function (input){
        if(debugActive){
            console.log("State " + name + " hasInput method called")
        }
        if(inputs.hasOwnProperty(input)){
            inputs[input] = true;
            return true;
        }
        return false
    };

    /**
     * Adds definition for an input action to the state's register
     * @param trigger the keycode or mouse event key that will trigger this event
     * @param status (optional) the current status of inputs (key pressed or not) defaults to false
     */
    let addInput = function (trigger, status = false){
        inputs[trigger] = status;
    };

    /**
     * Sets the debug status
     * @param debug a boolean value to show debug logging or not
     */
    let setDebug = function (debug) {
        debugActive = debug;
    };

    /**
     * Gets the current state
     * @returns {boolean} true or false based on if the state is active
     */
    let getState = function () {
        return active;
    };

    /**
     * Sets the state to be active
     */
    let activate = function () {
        active = true;
        cleanInputs(); // fixes a bug that state gets switched before clean can happen
        element.removeAttribute("hidden");
        if(activateHook){
            activateHook();
        }
    };

    /**
     * Sets the state to be deactive
     */
    let deactivate = function () {
        active = false;
        cleanInputs();
        element.setAttribute("hidden","");
        if(deactivateHook){
            deactivateHook();
        }
    };

    /**
     * Sets a request to change the state of current game
     * @param value name of state to go to
     */
    let changeState = function (value){
        cleanInputs();
        this.changeStateReq = value;
    };

    /**
     * Alerts monitoring loop that there is a state change request
     * @returns {*} Returns name of state if true, or false if no state requested
     */
    let isReqChangeState = function () {
        if(this.changeStateReq){
            let val = this.changeStateReq;
            this.changeStateReq = NaN;
            return val;
        }
        return false;
    };

    /**
     * Adds an Activation function to a state
     * @param func the function to run
     */
    let onActivate = function(func){
        activateHook = func;
    };

    /**
     * Adds a Deactivation function to a state
     * @param func the function to run
     */
    let onDeactivate = function (func) {
        deactivateHook = func;
    };

    /**
     * Makes shure that in between each update the inputs are cleared (our main input class will reset if needed)
     */
    let cleanInputs = function () {
        //reset keys
        let keys = Object.keys(inputs);
        for(let i = 0; i < keys.length; i++){
            inputs[keys[i]] = false;
        }
    };

    return {
        init: initialize,
        render: render,
        update: update,
        hasInput: hasInput,
        addInput: addInput,
        getState: getState,
        activate: activate,
        deactivate: deactivate,
        setDebug: setDebug,
        changeState: changeState,
        isReqChangeState: isReqChangeState,
        onActivate: onActivate,
        onDeactivate: onDeactivate
    }

}