/**
 * Created by timothyferrell on 4/11/17.
 */

function gameState(elementId, draw, storage, debug=false){
    let canvasTileSize = 16;
    let game = state(elementId, "Game");
    let map = new Map("/js/maps/bigMap.json", draw, canvasTileSize);
    let gps = new Gps(draw, canvasTileSize, 13);
    let player = new Player(draw, canvasTileSize);
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
        up: {key: KeyEvent.DOM_VK_UP, name: "up arrow"},
        down: {key: KeyEvent.DOM_VK_DOWN, name: "down arrow"},
        left: {key: KeyEvent.DOM_VK_LEFT, name: "left arrow"},
        right: {key: KeyEvent.DOM_VK_RIGHT, name: "right arrow"},
        start: {key: KeyEvent.DOM_VK_ENTER, name: "enter"},
        a: {key: KeyEvent.DOM_VK_A, name: "A"},
        b: {key: KeyEvent.DOM_VK_B, name: "B"}
    };

    map.onReady(function () {
        gps.setMapSize(map.getMapSize());
        gps.setPlayerInitialPos(map.getStart());
        player.setStartPos(gps.getPlayerPos());
    });

    let gameUpdate = function (time, inputs) {
        let now = performance.now();
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                game.changeState("mainMenu");
            }
            if(inputs[KeyEvent[controlKeys.up.key]]){
                gps.move(now, "up");
                player.move(now, "up");
                gps.onMoveEnd(function () {
                    player.stopMove("up");
                })
            }else{
                gps.stopMove("up");
            }
            if(inputs[KeyEvent[controlKeys.down.key]]){
                gps.move(now, "down");
                player.move(now, "down");
                gps.onMoveEnd(function () {
                    player.stopMove("down");
                })
            }else{
                gps.stopMove("down");
            }
            if(inputs[KeyEvent[controlKeys.right.key]]){
                gps.move(now, "right");
                player.move(now, "right");
                gps.onMoveEnd(function () {
                    player.stopMove("right");
                })
            }else{
                gps.stopMove("right");
            }
            if(inputs[KeyEvent[controlKeys.left.key]]){
                gps.move(now, "left");
                player.move(now, "left");
                gps.onMoveEnd(function () {
                    player.stopMove("left");
                })
            }else{
                gps.stopMove("left");
            }

            gps.gpsUpdate(now);
            player.playerUpdate(now);
            resolve();
        })
    };

    let gameRender = function () {
        draw.beginRender();
        map.draw(gps.getMapRange(), gps.getOffset());
        player.draw();
    };

    game.init(gameRender, gameUpdate);
    
    game.onActivate(function () {
        let sKeys = Object.keys(storageMap);
        for(let i = 0; i < sKeys.length; i++){
            if(storage.contains(storageMap[sKeys[i]])){
                controlKeys[sKeys[i]] = storage.fetch(storageMap[sKeys[i]]);
            }
        }
        game.addInput(KeyEvent.DOM_VK_ESCAPE);
        game.addInput(KeyEvent[controlKeys.up.key]);
        game.addInput(KeyEvent[controlKeys.down.key]);
        game.addInput(KeyEvent[controlKeys.left.key]);
        game.addInput(KeyEvent[controlKeys.right.key]);
        game.addInput(KeyEvent[controlKeys.start.key]);
        game.addInput(KeyEvent[controlKeys.a.key]);
        game.addInput(KeyEvent[controlKeys.b.key]);
    });

    return game;
}
