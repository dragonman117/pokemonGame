/**
 * Created by timothyferrell on 4/11/17.
 */

function gameState(elementId, draw, save, debug=false){
    let canvasTileSize = 16;
    let game = state(elementId, "Game");
    let map = new Map("/js/maps/cmap1.json", draw, canvasTileSize);
    let gps = new Gps(draw, canvasTileSize, 13);
    let player = new Player(draw, canvasTileSize);
    let currentMove = {u:false, r:false, d:false, l:false};

    map.onReady(function () {
        gps.setMapSize(map.getMapSize());
        gps.setPlayerInitialPos(map.getStart());
        player.setStartPos(gps.getPlayerPos());
    });

    game.addInput(KeyEvent.DOM_VK_ESCAPE);
    game.addInput(KeyEvent.DOM_VK_UP);
    game.addInput(KeyEvent.DOM_VK_DOWN);
    game.addInput(KeyEvent.DOM_VK_RIGHT);
    game.addInput(KeyEvent.DOM_VK_LEFT);

    let gameUpdate = function (time, inputs) {
        let now = performance.now();
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                game.changeState("mainMenu");
            }

            if(inputs[KeyEvent.DOM_VK_UP]){
                gps.move(time, "up");
                player.move(now, "up");
                gps.onMoveEnd(function () {
                    player.stopMove("up");
                })
            }else{
                gps.stopMove("up");
            }
            if(inputs[KeyEvent.DOM_VK_DOWN]){
                gps.move(time, "down");
                player.move(now, "down");
                gps.onMoveEnd(function () {
                    player.stopMove("down");
                })
            }else{
                gps.stopMove("down");
            }
            if(inputs[KeyEvent.DOM_VK_RIGHT]){
                gps.move(time, "right");
                player.move(now, "right");
                gps.onMoveEnd(function () {
                    player.stopMove("right");
                })
            }else{
                gps.stopMove("right");
            }
            if(inputs[KeyEvent.DOM_VK_LEFT]){
                gps.move(time, "left");
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

    return game;
}
