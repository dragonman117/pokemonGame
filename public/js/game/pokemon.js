/**
 * Created by timothyferrell on 4/19/17.
 */


let PokemonElm = function (specFilePath, draw) {
    let rawSpec = NaN;
    let hp = 0;
    let totalHp = 0;
    let name = "";
    let experince = 0;
    let expToNextLevel = 0;
    let level = 0;
    let ready = false;
    let avitar = NaN;
    let attacks = {};
    let stats = {};

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
        totalHp = rawSpec.hp;
        level = rawSpec.level;
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
        let keys = ["one","two","three","four"];
        for(let i = 0; i < keys.length; i++){
            attacks[keys[i]] = new Attack(rawSpec.attacks[keys[i]], draw);
        }
        stats = rawSpec.stats;
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

    let setLevel = function(nlevel){
        if(nlevel < level){
            let diff = level - nlevel;
            hp *= hp - (diff*5);
            stats.attack = stats.attack - (diff*2);
            stats.defence = stats.defence - (diff*2);
            level = nlevel;
        }
        else if(nlevel > level){
            let diff = nlevel - level;
            hp *= hp + (diff*5);
            stats.attack = stats.attack + (diff*2);
            stats.defence = stats.defence + (diff*2);
            level = nlevel;
        }
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

    let getHpPercent = function () {
        return hp/totalHp;
    };

    let bounce = function (val) {
        toBounce = val;
        bounceStart = null;
    };

    let getAttackName = function(id){
        return attacks[id].getName();
    };

    let getAttackPP = function (id) {
        return attacks[id].getPP();
    };

    let getHP = function () {
        return hp;
    };

    let getAttackType = function (id) {
        return attacks[id].getType();
    };

    let selAttack = function (id) {
        attacks[id].reduceByOne();
        return attacks[id].getPower();
    };

    let getAttack = function () {
        return stats.attack;
    };

    let getDefence = function () {
        return stats.defense;
    };

    let takeDamage = function (damage) {
        hp -= damage;
        if(hp <= 0) hp = 0;
        return {c:hp, t:totalHp};
    };

    let addExp = function (total) {
        experince += total;
        if(experince > expToNextLevel){
            level += 1;
            experince -= expToNextLevel;
            expToNextLevel += Math.floor(expToNextLevel/2);
            totalHp += level;
            hp += level;
            stats.attack += 2;
            stats.defence += 2;
        }
    };

    let renderAttack = function (id) {
        if(currentDraw !== "front"){
            attacks[id].render("A");
        }else{
            attacks[id].render("B");
        }
    };

    let updateAttack = function(time, id){
        if(currentDraw !== "front"){
            attacks[id].attackUpdate(time, "A");
        }else{
            attacks[id].attackUpdate(time, "B");
        }
    };

    let heal = function () {
        hp = totalHp;
        let keys = ["one","two","three","four"];
        for(let i = 0; i < keys.length; i++){
            attacks[keys[i]].resetPP();
        }
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
        bounce:bounce,
        getAttackName:getAttackName,
        getAttackPP:getAttackPP,
        getHP:getHP,
        getAttackType:getAttackType,
        selAttack:selAttack,
        getAttack:getAttack,
        getDefence:getDefence,
        takeDamage:takeDamage,
        addExp:addExp,
        renderAttack:renderAttack,
        updateAttack:updateAttack,
        setLevel:setLevel,
        heal:heal,
        getHpPercent:getHpPercent
    }
};