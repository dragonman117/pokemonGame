/**
 * Created by timothyferrell on 4/11/17.
 */

function gameState(elementId, draw, storage, debug=false){
    let canvasTileSize = 16;
    let game = state(elementId, "Game");
    let map = new Map("/js/maps/collisionsTest.json", draw, canvasTileSize);
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

        gps.setCollisionCheckFunction(function (pos) {
            let res = {
                me: map.queryPos(pos),
                up: map.queryPos({x:pos.x, y:(pos.y-1)}),
                down: map.queryPos({x:pos.x, y:(pos.y+1)}),
                right: map.queryPos({x:(pos.x+1), y:pos.y}),
                left: map.queryPos({x:(pos.x-1), y:pos.y})
            };
            return res;
        });
        player.setCurrentTileFn(function () {
            return map.queryPos(gps.getCurrentMapPos());
        })
    });

    let gameUpdate = function (time, inputs) {
        let now = performance.now();
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                console.log('escape');
                if(debug){
                    console.log("Escape Key selected");
                }
                game.changeState("mainMenu");
            }
            if(inputs[controlKeys.up.key]){
                console.log('up');
                gps.move(now, "up");
                player.move(now, "up");
                gps.onMoveEnd(function () {
                    player.stopMove("up");
                })
            }else{
                gps.stopMove("up");
            }
            if(inputs[controlKeys.down.key]){
                gps.move(now, "down");
                player.move(now, "down");
                gps.onMoveEnd(function () {
                    player.stopMove("down");
                })
            }else{
                gps.stopMove("down");
            }
            if(inputs[controlKeys.right.key]){
                gps.move(now, "right");
                player.move(now, "right");
                gps.onMoveEnd(function () {
                    player.stopMove("right");
                })
            }else{
                gps.stopMove("right");
            }
            if(inputs[controlKeys.left.key]){
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
        console.log('onActivate');
        let sKeys = Object.keys(storageMap);
        for(let i = 0; i < sKeys.length; i++){
            if(storage.contains(storageMap[sKeys[i]])){
                console.log('storage');
                controlKeys[sKeys[i]] = storage.fetch(storageMap[sKeys[i]]);
            }
        }
        game.addInput(KeyEvent.DOM_VK_ESCAPE);
        game.addInput(controlKeys.up.key);
        game.addInput(controlKeys.down.key);
        game.addInput(controlKeys.left.key);
        game.addInput(controlKeys.right.key);
        game.addInput(controlKeys.start.key);
        game.addInput(controlKeys.a.key);
        game.addInput(controlKeys.b.key);
    });

    return game;
}
