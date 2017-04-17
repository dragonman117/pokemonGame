/**
 * Created by timothyferrell on 4/12/17.
 */


let Player = function (draw, canvasTileSize) {
    let pos = {};
    let spec = {
        index:{
            r: 0,
            c: 1
        },
        position:{
            x: 0,
            y: 0,
        },
        tileHeight: 16,
        tileWidth: 16,
        width:canvasTileSize,
        height: canvasTileSize,
        source: "/img/playerSheet.png"
    };
    let playerImg = draw.ImgSprite(spec);
    let ready = false;
    let speedDivisor = 125;

    let movementAnimations = {
        'down':{
            animation:[
                {r:0,c:1},
                {r:0,c:0},
                {r:0,c:1},
                {r:0,c:2}
            ],
            index: 0,
            stationary: {r:0,c:1}
        },
        'up':{
            animation:[
                {r:1,c:1},
                {r:1,c:0},
                {r:1,c:1},
                {r:1,c:2}
            ],
            index: 0,
            stationary: {r:1,c:1}
        },
        'right':{
            animation:[
                {r:3,c:1},
                {r:3,c:0},
                {r:3,c:1},
                {r:3,c:2}
            ],
            index: 0,
            stationary: {r:3,c:1}
        },
        'left':{
            animation:[
                {r:2,c:1},
                {r:2,c:0},
                {r:2,c:1},
                {r:2,c:2}
            ],
            index: 0,
            stationary: {r:2,c:1}
        }
    };
    let movement = {
        up:false,
        down:false,
        left:false,
        right:false
    };
    let moveInProgress = false;

    let currentRest = movementAnimations.down.stationary;
    let currentDraw = currentRest;

    let currentTileFn = NaN;

    let playerDraw = function () {
        if(ready){
            playerImg.draw();
        }
    };

    let setStartPos = function(startPos){
        pos = startPos;
        spec.position.x = startPos.x;
        spec.position.y = startPos.y;
        ready = true;
    };

    let playerUpdate = function (time) {
        let tile = null;
        let height = 16;
        if(currentTileFn) tile = currentTileFn();
        if(tile && tile.attribute.hasOwnProperty("grass")) height = 13;
        if(moveInProgress){
            //Animate
            //let now = performance.now();
            let current = null;
            if(movement.up) current = 'up';
            if(movement.down) current = 'down';
            if(movement.right) current = "right";
            if(movement.left) current = "left";
            let timeDiff = time - movement[current];
            let indexOffset = Math.floor(timeDiff/speedDivisor)%movementAnimations[current].animation.length;
            currentDraw = movementAnimations[current].animation[indexOffset];
        }else{
            currentDraw = currentRest;
        }
        playerImg.update(pos,currentDraw, height, height);
    };

    let move = function (time, dir) {
        if(!moveInProgress){
            movement[dir] = time;
            currentRest = movementAnimations[dir].stationary;
            moveInProgress = true;
        }
    };

    let stopMove = function (dir) {
        if(movement[dir]){
            movement[dir] = false;
            moveInProgress = false;
        }
    };

    let setCurrentTileFn = function(fn){
        currentTileFn = fn;
    };

    return {
        draw:playerDraw,
        setStartPos:setStartPos,
        move:move,
        stopMove:stopMove,
        playerUpdate:playerUpdate,
        setCurrentTileFn:setCurrentTileFn
    }
};