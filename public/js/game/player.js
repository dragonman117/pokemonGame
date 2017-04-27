/**
 * Created by timothyferrell on 4/12/17.
 */


let Player = function (draw, canvasTileSize) {
    let grassAudio = new Audio('firered_0094.wav');
    let pos = {};
    let initPosY = 0;
    let score = 0;
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
    let playerShadow = draw.ImgSprite({
        index: {r:0,c:0},
        position: {x:0,y:0},
        tileHeight: 16,
        tileWidth: 16,
        width: canvasTileSize,
        height: canvasTileSize,
        source: "/img/shadow.png"
    });
    let ready = false;
    let speedDivisor = 125;

    let mail = false;

    let ledgeCheck = NaN;
    let ledge = false;

    let pokemonList = [
        new PokemonElm("/js/pokemon/pikachuDefault.json",draw)
    ];

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
            if(ledge) playerShadow.draw();
            playerImg.draw();
        }
    };

    let setStartPos = function(startPos){
        pos = startPos;
        spec.position.x = startPos.x;
        spec.position.y = startPos.y;
        initPosY = startPos.y;
        ready = true;
    };

    let playerUpdate = function (time) {
        let tile = null;
        let height = 16;
        if(currentTileFn) tile = currentTileFn();
        if(ledgeCheck)ledge = ledgeCheck();
        if(tile && tile.attribute.hasOwnProperty("grass")){
            height = 13;
            if (moveInProgress) grassAudio.play();
        }
        if(ledgeCheck)ledge = ledgeCheck();
        pos.y  = initPosY;
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
            if(ledge) pos.y = initPosY - 7;
            currentDraw = movementAnimations[current].animation[indexOffset];
        }else{
            currentDraw = currentRest;
        }
        playerImg.update(pos,currentDraw, height, height);
        playerShadow.update({x:pos.x,y:initPosY},{r:0,c:0});
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

    let setLedgeCheckFn = function (fn) {
        ledgeCheck = fn;
    };

    let getPokemonList = function () {
        return pokemonList;
    };

    let heal = function () {
        pokemonList[0].heal();
    };

    let addWin = function () {
        score += 1;
    };

    let getScore = function () {
        return score;
    };

    let checkWin = function () {
        if(pokemonList[0].getHP() > 0)return true;
        return false;
    };

    let hasMail = function () {
        return mail;
    };

    let aquireMail = function () {
        mail = true;
    };

    return {
        draw:playerDraw,
        setStartPos:setStartPos,
        move:move,
        stopMove:stopMove,
        playerUpdate:playerUpdate,
        setCurrentTileFn:setCurrentTileFn,
        setLedgeCheckFn:setLedgeCheckFn,
        getPokemonList:getPokemonList,
        heal:heal,
        addWin:addWin,
        getScore:getScore,
        checkWin:checkWin,
        hasMail:hasMail,
        aquireMail:aquireMail
    }
};
