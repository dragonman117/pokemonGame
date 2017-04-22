/**
 * Created by timothyferrell on 4/21/17.
 */


let Attack = function(specFilePath, draw){
    let rawSpec = NaN;
    let name = "";
    let maxPP = 0;
    let pp = 0;
    let type = "";
    let power = 0;

    let particlesA = NaN;
    let particlesB = NaN;

    //Helpers
    let fetchSpec = function () {
        return new Promise(function (res, err) {
            //forgot exact link but found on stack overflow somewhere...
            fetch(specFilePath).then(response=>response.json()).then(json=>{
                rawSpec = json;
                maxPP = rawSpec.PP;
                pp = rawSpec.PP;
                type = rawSpec.type;
                power = rawSpec.power;
                res();
            })
        })
    };
    let processSpec = function () {
        name = rawSpec.name;
        particlesA = ParticleSystem({
            image: rawSpec.img,
            center: {x: 150, y: 78},
            speed:{mean: 3, stdev: 9},
            lifetime: {mean:5, stdev: .5}
        }, draw);
        particlesB = ParticleSystem({
            image: rawSpec.img,
            center: {x: 46, y: 129},
            speed:{mean: 3, stdev: 9},
            lifetime: {mean:5, stdev: .5}
        }, draw);
    };
    let initPokemon = function () {
        fetchSpec().then(res=>processSpec());
    };

    //Export Fn
    let getName = function () {
        return name;
    };

    let getPP = function () {
        return {c:pp, total: maxPP};
    };

    let getType = function () {
        return type;
    };

    let reduceByOne = function () {
        pp -= 1;
    };

    let resetPP = function () {
        pp = maxPP;
    };

    let getPower = function () {
        return power;
    };
    
    let attackRender = function (pos) {
        if(pos === "A"){
            particlesA.render();
        }else{
            particlesB.render();
        }
    };

    let attackUpdate = function (time, pos) {
        if(pos === "A"){
            particlesA.create();
            particlesA.update(time);
        }else{
            particlesB.create();
            particlesB.update(time);
        }
    };


    //Start
    initPokemon();

    return {
        getName:getName,
        getPP:getPP,
        getType:getType,
        reduceByOne:reduceByOne,
        resetPP:resetPP,
        getPower:getPower,
        render:attackRender,
        attackUpdate:attackUpdate
    };
};