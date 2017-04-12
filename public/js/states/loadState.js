/**
 * Created by timothyferrell on 3/8/17.
 * Requires State.js to be loaded before this file
 */

/**
 * This generates the load state, this state should be active prior to game initialization so really all it is is a
 *  temporary distraction. It adds no unique features to the game.
 * @param elementId
 * @returns {state}
 */
function loadState(elementId) {
    let load = state(elementId, "Load", true);

    return load;
}
