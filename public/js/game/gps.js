/**
 * Created by timothyferrell on 4/12/17.
 */


let Gps = function (draw, tileSize, canvasGrid) {
    let canvasSize = draw.getMaxSize();
    let mapSize = {};
    let range = {x1:0,x2:13, y1:17, y2:30};
    let offset = {x:0, y:0};
    let logicalPosRelMap = {};
    let logicalPos = {x: Math.ceil(canvasGrid/2), y:Math.ceil(canvasGrid/2)};
    let keyPixels = [];

    let movement = {
        up: null,
        down: null,
        right: null,
        left: null
    };
    let moveInProgress = false;
    let caryOn = false;
    let moveOffset = 0;
    let speedDivisor = 16;
    let onMoveEndFn = NaN;


    let playerPos = {x:tileSize*(logicalPos.x-1), y:tileSize*(logicalPos.y-1)};
    for(let i = 0; i < canvasSize.xSize; i += tileSize){
        keyPixels.push(i);
    }

    let getMapRange = function(){
        return range;
    };

    let setPlayerInitialPos = function (pos) {
        logicalPosRelMap = pos;
        genMapPos();
    };

    let setMapSize = function (size) {
        mapSize = size;

    };

    let getPlayerPos = function () {
        return playerPos;
    };

    let genMapPos = function(){
        offset = {x:0, y:0};
        range.x1 = logicalPosRelMap.x - (logicalPos.x-1);
        range.x2 = logicalPosRelMap.x + (logicalPos.x)+1;
        range.y1 = logicalPosRelMap.y - (logicalPos.y-1)-1;
        range.y2 = logicalPosRelMap.y + (logicalPos.y);
        if(movement.up){
            range.y1 -=1;
            offset.y -= moveOffset;
        }
        if(movement.down){
            range.y2 += 1;
            offset.y -= tileSize - moveOffset;
        }
        if(movement.right){
            range.x2 +=1;
            offset.x -= tileSize - moveOffset;
        }
        if(movement.left){
            range.x1 -=1;
            offset.x -= moveOffset;

        }

        if(range.x1 < 0){
            offset.x = Math.abs(range.x1) * tileSize + offset.x;
            range.x1 = 0;
        }
        if(range.y1 < 0){
            offset.y = Math.abs(range.y1) * tileSize + offset.y;
            range.y1 = 0;
        }
        if(range.x2 > mapSize.c){
            range.x2 = mapSize.c;
        }
        if(range.y2 > mapSize.r){
            range.y2 = mapSize.r;
        }

        // console.log(offset);
        // console.log(range);
    };

    let gpsUpdate = function (time) {
        let now = performance.now();
        if(moveInProgress){
            let current = null;
            if(movement.up) current = "up";
            if(movement.down) current = "down";
            if(movement.left) current = "left";
            if(movement.right) current = "right";
            let timeDiff = now - movement[current];
            if(timeDiff < 250){
                moveOffset = tileSize - Math.floor(timeDiff/speedDivisor);
            }else{
                if(movement.up)logicalPosRelMap.y -= 1;
                if(movement.down)logicalPosRelMap.y += 1;
                if(movement.left)logicalPosRelMap.x -= 1;
                if(movement.right)logicalPosRelMap.x += 1;
                if(caryOn){
                    moveOffset = speedDivisor;
                    movement[current] = performance.now();
                }else{
                    movement[current] = null;
                    moveOffset = 0;
                    moveInProgress = false;
                    if(onMoveEndFn){
                        onMoveEndFn();
                        onMoveEndFn = NaN; //remove the fn after calling...
                    }
                }
            }
            genMapPos();
        }
    };

    let getOffset = function () {
        return offset;
    };

    let move = function (time, dir) {
        if(!moveInProgress){
            if(onMoveEndFn){ // see if this fixes bug that immediate switch direction can mess up animations...
                onMoveEndFn();
                onMoveEndFn = false;
            }
            movement[dir] = performance.now();
            moveInProgress = true;
            caryOn = true;
        }
    };

    let stopMove = function (dir) {
        if(movement[dir]){
            caryOn = false;
        }
    };

    let onMoveEnd = function (fn) {
        if(!onMoveEndFn){
            onMoveEndFn = fn;
        }
    };

    return {
        getMapRange:getMapRange,
        setPlayerInitialPos:setPlayerInitialPos,
        getPlayerPos:getPlayerPos,
        setMapSize:setMapSize,
        getOffset:getOffset,
        gpsUpdate:gpsUpdate,
        move:move,
        stopMove:stopMove,
        onMoveEnd:onMoveEnd
    }
};