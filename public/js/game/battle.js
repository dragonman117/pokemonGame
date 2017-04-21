/**
 * Created by timothyferrell on 4/19/17.
 */

let Battle = function (draw, pokemonList, controlKeys) {
    let spec = {center:{x:104, y:104}, width:208, height:208, rotation:0, source:"/img/battleBg.png"};
    let bg = draw.ImgStatic(spec);
    let beginning = true;

    let finishFn = NaN;

    let batleStart = null;
    let battleId = -1;
    let opponent = NaN;
    let player = NaN;
    let playerList = [];
    let healthIndex = {
        green:{r:0,c:0},
        yellow:{r:1,c:0},
        red:{r:2, c:0}
    };
    let helthMaxWidth = 48;
    let expMax = 64;

    let aBtnBlock = false;

    //Phases
    let phases = {
        one: false,
        two: false,
        three: false,
        four: false,
        five: false
    };
    let animiationStage = {
        one: null,
        two: null,
        three: null,
        four:null,
        five:null,
        six:null,
        seven:null
    };

    //TextBox Lines
    let tbLine1 = draw.Text({
        pos:{x:12, y:168},
        font:"6pt Pokemon GB",
        fill:"white",
        stroke:"transparent",
        rotation:0,
        text:""});
    let tbLine2 = draw.Text({
        pos:{x:12, y:182},
        font:"6pt Pokemon GB",
        fill:"white",
        stroke:"transparent",
        rotation:0,
        text:""});

    let dwnArrowCener = { x:185, y:172 };
    let dwnArrow = draw.ImgStatic({
        center: dwnArrowCener,
        width: 10,
        height: 10,
        rotation: 0,
        source:"/img/dwnArrow.png"
    });

    //Oponent Id Bar
    let oBgBox = draw.ImgStatic({
        center:{
            x: 60,
            y:43
        },
        width: 100,
        height: 30,
        rotation: 0,
        source: "/img/oponentHealth.png"
    });
    let oName = draw.Text({
        pos:{
            x: 16,
            y: 34
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let oLevel = draw.Text({
        pos:{
            x: 80,
            y: 34
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let oHealth = draw.ImgSprite({
        index:healthIndex.green,
        position:{
            x:49,
            y:45
        },
        tileWidth: 9,
        tileHeight:3,
        width: 9,
        height: 3,
        source:"/img/healthTile.png"
    });

    //Trainer
    let trainer = draw.ImgSprite({
        index:{
            r:0,
            c:0,
        },
        position:{
            x:30,
            y:103
        },
        tileWidth: 60,
        tileHeight: 60,
        width: 60,
        height: 60,
        source: "/img/trainerThrow.png"
    });
    let pokeball = draw.ImgSprite({
        index:{
            r:0,
            c:0,
        },
        position:{
            x:7,
            y:128
        },
        tileWidth: 12,
        tileHeight: 12,
        width: 12,
        height:12,
        source: "/img/pokeball.png"
    });

    //Fight Screen
    let selectBG = draw.ImgStatic({
        center:{
            x:148,
            y:177
        },
        width:120,
        height: 48,
        rotation:0,
        source:"/img/selectionBg.png"
    });

    //defend Id bar
    let dBgBox = draw.ImgStatic({
        center:{
            x:155,
            y:132
        },
        width: 106,
        height: 38,
        rotation: 0,
        source:"/img/defendStatus.png"
    });
    let pLevel = draw.Text({
        pos:{
            x: 182,
            y: 120
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let pName = draw.Text({
        pos:{
            x: 118,
            y: 120
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let pHealth = draw.ImgSprite({
        index:healthIndex.green,
        position:{
            x:151,
            y:131
        },
        tileWidth: 9,
        tileHeight:3,
        width: 9,
        height: 3,
        source:"/img/healthTile.png"
    });
    let pExperience = draw.ImgSprite({
        index:{r:0,c:0},
        position:{
            x:135,
            y:147
        },
        tileWidth: 7,
        tileHeight:2,
        width: 7,
        height: 2,
        source:"/img/experienceTile.png"
    });

    //MoveSelection
    let sOption1 = draw.Text({
        pos:{
            x: 108,
            y: 167
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let sOption2 = draw.Text({
        pos:{
            x: 108,
            y: 182
        },
        font: "5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""
    });
    let selector = draw.ImgStatic({
        center:{x:3, y:180},
        width: 6,
        height: 10,
        rotation: 0,
        source: "/img/iArrow.png"
    });
    let selectionPos = {
        one:{x:100, y:170},
        two:{x:100, y:184}
    };
    let currentSelectPos = "one";


    let battleUpdate = function (time, inputs) {
        bg.update(spec.center);
        if(beginning){
            battleId = Math.floor((Math.random()*1000))%pokemonList.length;
            opponent = new PokemonElm(pokemonList[battleId], draw);
            phases.one = true;
            beginning = false;
            batleStart = time;
        }
        let dif = time - batleStart ;
        if(opponent){
            opponent.update(time);
            oName.update(opponent.getName());
            oLevel.update("Lv" + opponent.getLevel())
        }
        if(phases.one){
            tbLine1.update("Wild " + opponent.getName() + " appeared!");
            oHealth.update({x:49,y:45}, healthIndex.green, 3,3,9,helthMaxWidth);
            if(dif%500 > 250){
                dwnArrowCener.y  = 171;
            }else{
                dwnArrowCener.y = 172;
            }
            dwnArrow.update(dwnArrowCener);
            if(inputs[KeyEvent[controlKeys.a.key]]){
                phases.one = false;
                phases.two = true;
                animiationStage.one = time;
                tbLine1.update("");
            }
        }
        if(phases.two){
            tbLine1.update("Go! " + player.getName() + "!");
            if(animiationStage.one){
                let lDif = time - animiationStage.one;
                if(lDif > 80){
                    animiationStage.one = null;
                    animiationStage.two = time;
                }else{
                    trainer.update({x:30, y:103}, {r:0,c:0})
                }
            }
            else if(animiationStage.two){
                //Switch to first throw...
                let lDif = time - animiationStage.two;
                let x = 30 - Math.floor(30 * (lDif/500));
                trainer.update({x:x, y:103}, {r:0,c:1});
                if(lDif > 500){
                    animiationStage.two = null;
                    animiationStage.three = time;
                }
            }
            else if(animiationStage.three){
                //Switch to first throw...
                let lDif = time - animiationStage.three;
                trainer.update({x:0, y:103}, {r:0,c:2});
                if(lDif > 20){
                    animiationStage.three = null;
                    animiationStage.four = time;
                }
            }
            else if(animiationStage.four){
                //Switch to first throw...
                let lDif = time - animiationStage.four;
                let x = 0 - Math.floor(30 * (lDif/500));
                trainer.update({x:x, y:103}, {r:0,c:3});
                let animationFrame = Math.floor(lDif/120)%4;
                let px = 32 + Math.floor(4 * (lDif/200));
                let py = 96 - Math.floor(8 * (lDif/200));
                pokeball.update({x:px, y:py},{r:0,c:animationFrame});
                if(lDif > 40){
                    animiationStage.four = null;
                    animiationStage.five = time;
                }
            }
            else if(animiationStage.five){
                //Switch to first throw...
                let lDif = time - animiationStage.five;
                let x = -15 - Math.floor(30 * (lDif/500));
                trainer.update({x:x, y:103}, {r:0,c:4});
                let animationFrame = Math.floor(lDif/150)%4;
                let px = 36 + Math.floor(4 * (lDif/200));
                let py = 88 + Math.floor(8 * (lDif/200));
                pokeball.update({x:px, y:py},{r:0,c:animationFrame});
                if(lDif > 120){
                    animiationStage.five = null;
                    animiationStage.six = time;
                }
            }
            else if(animiationStage.six){
                let lDif = time - animiationStage.six;
                let animationFrame = Math.floor(lDif/250)%4;
                let pY =96 +  Math.floor(44 * lDif/200);
                let tx = -30 - Math.floor(60 * lDif/200);
                trainer.update({x:tx, y:103}, {r:0,c:4});
                pokeball.update({x:50, y:140},{r:0,c:animationFrame});
                if(lDif > 200){
                    animiationStage.six = null;
                }
            }
            else{
                phases.two = false;
                phases.three = true;
            }
        }
        if(phases.three){
            if(inputs[KeyEvent[controlKeys.up.key]]){
                if(currentSelectPos === "two"){
                    currentSelectPos = "one";
                }
            }
            if(inputs[KeyEvent[controlKeys.down.key]]){
                if(currentSelectPos === "one"){
                    currentSelectPos = "two";
                }
            }
            if(inputs[KeyEvent[controlKeys.a.key]]){
                if(currentSelectPos==="two"){
                    aBtnBlock = true;
                    phases.three = false;
                    phases.four = true;
                }
            }
            tbLine1.update("");
            player.bounce(true);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            pHealth.update({x:151,y:131}, healthIndex.green, 3,3,9,helthMaxWidth);
            pExperience.update({x:135,y:147}, {r:0,c:0}, 2,2,7,Math.floor(expMax*player.getExperincePercent()));
            tbLine1.update("What will");
            tbLine2.update(player.getName() + " do");
            sOption1.update("Fight");
            sOption2.update("Run");
            selector.update(selectionPos[currentSelectPos]);
        }
        if(phases.four){
            player.bounce(false);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            pHealth.update({x:151,y:131}, healthIndex.green, 3,3,9,helthMaxWidth);
            pExperience.update({x:135,y:147}, {r:0,c:0}, 2,2,7,Math.floor(expMax*player.getExperincePercent()));
            tbLine1.update("Got Away Safely!");
            tbLine2.update("");
            if(dif%500 > 250){
                dwnArrowCener.y  = 171;
            }else{
                dwnArrowCener.y = 172;
            }
            dwnArrow.update(dwnArrowCener);
            if(inputs[KeyEvent[controlKeys.a.key]]){
                if(!aBtnBlock){
                    finishFn();
                    reset();
                }
            }else{
                aBtnBlock = false;
            }
        }
    };

    let battleDraw = function () {
        draw.beginRender();
        bg.draw();
        tbLine1.draw();
        tbLine2.draw();
        if(opponent){
            opponent.draw();
            oBgBox.draw();
            oName.draw();
            oLevel.draw();
            oHealth.draw();
        }
        if(phases.one){
            trainer.draw();
            dwnArrow.draw();
        }
        if(phases.two){
            if(animiationStage.four){
                pokeball.draw();
            }
            if(animiationStage.five){
                pokeball.draw();
            }
            if(animiationStage.six){
                pokeball.draw();
            }
            trainer.draw();
        }
        if(phases.three){
            player.draw();
            selectBG.draw();
            //Ready to draw the Defend box
            dBgBox.draw();
            pLevel.draw();
            pName.draw();
            pHealth.draw();
            pExperience.draw();
            sOption1.draw();
            sOption2.draw();
            selector.draw();
        }
        if(phases.four){
            player.draw();
            //Ready to draw the Defend box
            dBgBox.draw();
            pLevel.draw();
            pName.draw();
            pHealth.draw();
            pExperience.draw();
            dwnArrow.draw();
        }
    };

    let reset = function () {
        tbLine1.update("");
        tbLine2.update("");
        beginning = true;
        phases.one = false;
        phases.two = false;
        phases.three = false;
        phases.four = false;
        phases.five = false;
        currentSelectPos = "one";
    };

    let setPlayerPokemon = function (pList) {
        playerList = pList;
        player = playerList[0];
        player.setSide("defend");
    };

    let setFinishFn = function (fn) {
        finishFn = fn;
    };

    return {
        draw: battleDraw,
        update: battleUpdate,
        setPlayerPokemon:setPlayerPokemon,
        setFinishFn:setFinishFn
    }
};