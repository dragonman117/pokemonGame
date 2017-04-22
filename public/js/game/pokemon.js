/**
 * Created by timothyferrell on 4/19/17.
 */


let PokemonElm = function (specFilePath, draw, initLevel = 3) {
    let rawSpec = NaN;
    let hp = 0;
    let name = "";
    let moves = {};
    let experince = 0;
    let expToNextLevel = 0;
    let level = initLevel;
    let ready = false;
    let avitar = NaN;

    let drawFace = {
        front: {
            r:0,
            c:0
        },
        back: {
            r:0,
            c:1
        }
    };

    let posSets = {
        front:{
            x:120,
            y:38
        },
        back: {
            x:16,
            y:89
        }
    };
    let spriteHeight = 64;
    let currentDraw = "front";
    
    let toBounce = false;
    let bounceStart = null;

    //Helper Functions
    let fetchSpec = function () {
        return new Promise(function (res, err) {
            //forgot exact link but found on stack overflow somewhere...
            fetch(specFilePath).then(response=>response.json()).then(json=>{
                rawSpec = json;
                res();
            })
        })
    };
    let processSpec = function () {
        name = rawSpec.name;
        hp = rawSpec.hp;
        avitar = draw.ImgSprite({
            index:drawFace[currentDraw],
            position:posSets[currentDraw],
            tileWidth:64,
            tileHeight:64,
            width: 64,
            height:spriteHeight,
            source: rawSpec.img
        });
        expToNextLevel = rawSpec.pointsToNextLevel;
        ready = true;
    };
    let initPokemon = function () {
        fetchSpec().then(res=>processSpec());
    };

    //Export
    let getName = function () {
        return name;
    };

    let getLevel = function () {
        return level;
    };

    let drawPokemon = function () {
        if(ready){
            avitar.draw();
        }
    };

    let updatePokemon = function (time) {
        if(ready){
            let drawHeight = 64;
            let pos = JSON.parse(JSON.stringify(posSets[currentDraw]));
            if(toBounce){
                if(!bounceStart) bounceStart = time;
                let lDif = time = bounceStart;
                if(lDif%500 > 250){
                    pos.y = posSets[currentDraw].y+2;
                    drawHeight = 62;
                }else{
                    pos.y = posSets[currentDraw].y;
                    drawHeight = 64;
                }
            }
            avitar.update(pos,drawFace[currentDraw], drawHeight, drawHeight);
        }
    };

    let setSide = function (side) {
        if(side === "defend"){
            currentDraw = "back";
        }else if(side === "opose"){
            currentDraw = "front";
        }
    };

    let getExperincePercent = function () {
        return experince/expToNextLevel;
    };
    let bounce = function (val) {
        toBounce = val;
        bounceStart = null;
    };

    //Startup
    initPokemon();

    return {
        getName:getName,
        getLevel:getLevel,
        draw:drawPokemon,
        setSide:setSide,
        update:updatePokemon,
        getExperincePercent:getExperincePercent,
        bounce:bounce
    }
};