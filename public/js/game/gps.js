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
    let moveCompliment = {
        up:"down",
        down:"up",
        right:"left",
        left:"right"
    };
    let collisionComp = {
        up:"bot",
        down:"top",
        right:"left",
        left:"right"
    };
    let collision = false;
    let moveInProgress = false;
    let caryOn = false;
    let moveOffset = 0;
    let speedDivisor = 16;
    let onMoveEndFn = NaN;

    let ledge = false;

    let cCheckFn = NaN;
    let healTrigFn = NaN;
    let healstart = false;

    let convTrigFn = NaN;
    let convStart = false;

    let battleProb = 0;


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
        range.x2 = logicalPosRelMap.x + (logicalPos.x);
        range.y1 = logicalPosRelMap.y - (logicalPos.y-1);
        range.y2 = logicalPosRelMap.y + (logicalPos.y);
        if(!collision){
            if(movement.up){
                range.y1 -=1;
                offset.y -= moveOffset;
            }
            if(movement.down){
                range.y2 += 1;
                if(ledge){
                    range.y2 += 1;
                    offset.y -= 2*tileSize - moveOffset;
                }else{
                    offset.y -= tileSize - moveOffset;
                }
            }
            if(movement.right){
                range.x2 +=1;
                offset.x -= tileSize - moveOffset;
            }
            if(movement.left){
                range.x1 -=1;
                offset.x -= moveOffset;

            }
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
        let now = time;
        collision = false;
        if(moveInProgress){
            let nearby = cCheckFn(logicalPosRelMap);
            let current = null;
            let collisionCurrent = null;
            if(movement.up) {
                current = "up";
                collisionCurrent="top";
            }
            if(movement.down){
                current = "down";
                collisionCurrent = "bot";
            }
            if(movement.left) current = "left";
            if(movement.right) current = "right";
            if(collisionCurrent === null) collisionCurrent = current;
            if(nearby.me.walls[collisionCurrent]) collision = true;
            if(nearby[current] && nearby[current].walls[collisionComp[current]]) collision = true;
            if(nearby[current] && collision && current ==="down"){
                if(nearby[current].attribute.hasOwnProperty("ledge")){
                    collision = false;
                    ledge = true;
                }
            }
            if(nearby[current] && collision && movement.up && !healstart){
                if(nearby[current].attribute.hasOwnProperty("healer")){
                    if(healTrigFn ) healTrigFn();
                    healstart = true;
                }
            }
            if(nearby[current] && collision && movement.up && !convStart){
                if(nearby[current].attribute.hasOwnProperty("conversation")){
                    if(convTrigFn ) convTrigFn();
                    convStart = true;
                }
            }

            let timeDiff = now - movement[current];
            if(timeDiff < 250){
                if(!collision){
                    moveOffset = tileSize - Math.floor(timeDiff/speedDivisor);
                    if(ledge)moveOffset = (2*tileSize) - Math.floor(timeDiff/(speedDivisor/2));
                }
                else moveOffset = 0;
            }else{
                if(!collision){
                    if(movement.up)logicalPosRelMap.y -= 1;
                    if(movement.down)logicalPosRelMap.y += 1;
                    if(movement.left)logicalPosRelMap.x -= 1;
                    if(movement.right)logicalPosRelMap.x += 1;
                    if(ledge)logicalPosRelMap.y += 1;
                    ledge = false;
                }
                if(caryOn){
                    moveOffset = speedDivisor;
                    movement[current] = time;
                }else{
                    movement[current] = null;
                    moveOffset = 0;
                    moveInProgress = false;
                    if(onMoveEndFn){
                        onMoveEndFn();
                        //console.log("final Neighbors: ", cCheckFn(logicalPosRelMap));
                        onMoveEndFn = NaN; //remove the fn after calling...
                        collision = false;
                        battleProb = Math.random()*100;
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
            movement[dir] = time;
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

    let setCollisionCheckFunction= function(fn){
        cCheckFn = fn;
    };

    let getCurrentMapPos = function () {
        return logicalPosRelMap;
    };

    let getBattleProb = function(){
        return battleProb;
    };

    let clearProb = function () {
        battleProb = 0;
    };

    let getLedge = function () {
        return ledge;
    };

    let setHealTiggerFn = function (fn) {
        healTrigFn = fn;
    };

    let clearHeal = function () {
        healstart = false;
    };

    let setConvTriggerFn = function (fn) {
        convTrigFn = fn;
    };

    let clearConv = function () {
        convStart = false;
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
        onMoveEnd:onMoveEnd,
        setCollisionCheckFunction:setCollisionCheckFunction,
        getCurrentMapPos:getCurrentMapPos,
        getBattleProb:getBattleProb,
        clearProb:clearProb,
        getLedge:getLedge,
        setHealTriggerFn:setHealTiggerFn,
        clearHeal:clearHeal,
        setConvTriggerFn:setConvTriggerFn,
        clearConv:clearConv
    }
};