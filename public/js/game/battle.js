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
        five: false,
        six: false,
        eight: false,
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
    let oHealthValue = helthMaxWidth;
    let oHealthIndex = "green";
    let oFaint = false;

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
    let pHealthValue = helthMaxWidth;
    let pHealthIndex = "green";
    let pFaint = false;
    let experienceGain = 0;
    let initExperince = 0;

    //DecisionSelection
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

    //Move Selection
    let moveBg = draw.ImgStatic({
        center:{
            x: 104,
            y: 21
        },
        width:208,
        height: 48,
        source:"/img/fightBg.png"
    });
    let ppLable = draw.Text({
        pos:{x:147, y:164},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"PP"});
    let ppVal = draw.Text({
        pos:{x:162, y:164},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""});
    let typeLable = draw.Text({
        pos:{x:147, y:178},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"Type"});
    let typeVal = draw.Text({
        pos:{x:177, y:178},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:""});
    let atk1 = draw.Text({
        pos:{x:16, y:164},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"atk1"});
    let atk2 = draw.Text({
        pos:{x:16, y:179},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"atk2"});
    let atk3 = draw.Text({
        pos:{x:75, y:164},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"atk3"});
    let atk4 = draw.Text({
        pos:{x:75, y:179},
        font:"5pt Pokemon GB",
        fill:"black",
        stroke:"transparent",
        rotation:0,
        text:"atk4"});
    let movePos = {
        one:{x:12, y:167},
        two:{x:12, y:181},
        three:{x:71, y:167},
        four:{x:71, y:181}
    };
    let currentMovePos = "one";

    //Attack Globals
    let playerAttack = null;
    let pAttackName = "";
    let oAttack = null;
    let oCurMove = "";
    let oAttackName = "";
    let pDamage = 0;
    let oDamage = 0;
    let oHealthBat = {};
    let pHealthBat = {};

    let initOponet = false;


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
            if(!initOponet){
                opponent.setLevel(Math.floor((Math.random()*10)%5)+1);
                initOponet = true;
            }
            opponent.update(time);
            oName.update(opponent.getName());
            oLevel.update("Lv" + opponent.getLevel());
        }
        if(phases.one){
            tbLine1.update("Wild " + opponent.getName() + " appeared!");
            oHealth.update({x:49,y:45}, healthIndex[oHealthIndex], 3,3,9,oHealthValue);
            if(dif%500 > 250){
                dwnArrowCener.y  = 171;
            }else{
                dwnArrowCener.y = 172;
            }
            dwnArrow.update(dwnArrowCener);
            if(inputs[KeyEvent[controlKeys.a.key]]){
                if(player.getHP() > 0){
                    phases.one = false;
                    phases.two = true;
                    animiationStage.one = time;
                    tbLine1.update("");
                }else{
                    phases.one = false;
                    phases.eight = true;
                    aBtnBlock = true;
                }
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
                if(currentSelectPos==="one"){
                    aBtnBlock = true;
                    phases.three = false;
                    phases.five = true;
                }
                if(currentSelectPos==="two"){
                    aBtnBlock = true;
                    phases.three = false;
                    phases.four = true;
                }
            }
            player.bounce(true);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            pHealth.update({x:151,y:131}, healthIndex[pHealthIndex], 3,3,9,pHealthValue);
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
            pHealth.update({x:151,y:131}, healthIndex[pHealthIndex], 3,3,9,pHealthValue);
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
        if(phases.five){
            tbLine1.update("");
            tbLine2.update("");
            player.bounce(true);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            pHealth.update({x:151,y:131}, healthIndex[pHealthIndex], 3,3,9,pHealthValue);
            pExperience.update({x:135,y:147}, {r:0,c:0}, 2,2,7,Math.floor(expMax*player.getExperincePercent()));
            moveBg.update({x:104, y:177});
            selector.update(movePos[currentMovePos]);
            atk1.update(player.getAttackName("one").substr(0,8));
            atk2.update(player.getAttackName("two").substr(0,8));
            atk3.update(player.getAttackName("three").substr(0,8));
            atk4.update(player.getAttackName("four").substr(0,8));
            let ppTmp = player.getAttackPP(currentMovePos);
            ppVal.update(ppTmp.c + " / " + ppTmp.total);
            typeVal.update(player.getAttackType(currentMovePos));
            if(inputs[KeyEvent[controlKeys.b.key]]){
                currentMovePos = "one";
                phases.five = false;
                phases.three = true;
            }
            if(inputs[KeyEvent[controlKeys.up.key]]){
                if(currentMovePos === "two"){
                    currentMovePos = "one";
                }
                if(currentMovePos === "four"){
                    currentMovePos = "three";
                }
            }
            if(inputs[KeyEvent[controlKeys.down.key]]){
                if(currentMovePos === "one") currentMovePos = "two";
                if(currentMovePos === "three") currentMovePos = "four";
            }
            if(inputs[KeyEvent[controlKeys.right.key]]){
                if(currentMovePos === "one") currentMovePos = "three";
                if(currentMovePos === "two") currentMovePos = "four";
            }
            if(inputs[KeyEvent[controlKeys.left.key]]){
                if(currentMovePos === "three") currentMovePos = "one";
                if(currentMovePos === "four") currentMovePos = "two";
            }
            if(inputs[KeyEvent[controlKeys.a.key]]){
                if(!aBtnBlock){
                    if(player.getAttackPP(currentMovePos).c > 0){
                        playerAttack = player.selAttack(currentMovePos);
                        pAttackName = player.getAttackName(currentMovePos);
                        let moves = Object.keys(movePos);
                        let i = Math.floor(Math.random()* moves.length);
                        oAttack = opponent.selAttack(moves[i]);
                        oCurMove = moves[i];
                        oAttackName = opponent.getAttackName(moves[i]);
                        pDamage = damageCalc(player, opponent, playerAttack);
                        oDamage = damageCalc(opponent, player, oAttack);
                        phases.five = false;
                        phases.six = true;
                        animiationStage.one = time;
                    }
                    aBtnBlock = true;
                }
            }else{
                aBtnBlock = false;
            }
        }
        if(phases.six){
            player.bounce(false);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            pExperience.update({x:135,y:147}, {r:0,c:0}, 2,2,7,Math.floor(expMax*player.getExperincePercent()));
            if(animiationStage.one){
                tbLine1.update(player.getName() + " used");
                tbLine2.update(pAttackName);
                let ldiff = time = animiationStage.one;
                if(ldiff > 400){
                    oHealthBat = opponent.takeDamage(pDamage);
                    animiationStage.one = false;
                    animiationStage.two = time;
                }
            }
            if(animiationStage.two){
                let oHealthBar = (oHealthBat.c/oHealthBat.t);
                if(oHealthBar <= .15){
                    oHealthIndex = "red";
                }else if( oHealthBar <= .5){
                    oHealthIndex = "yellow";
                }
                oHealthBar = Math.floor(oHealthBar * helthMaxWidth);
                let diff = oHealthValue - oHealthBar;
                let ldiff = time - animiationStage.two;
                oHealthValue = oHealthValue -  Math.floor((ldiff/800)*diff);
                oHealth.update({x:49,y:45}, healthIndex[oHealthIndex], 3,3,9,oHealthValue);
                player.updateAttack(ldiff, currentMovePos);
                //Need to do attack
                if(ldiff > 800 ){
                    animiationStage.two = false;
                    animiationStage.three = time;
                    oHealthValue = oHealthBar;
                    if(oHealthBat.c <= 0){
                        oFaint = true;
                        animiationStage.three = false;
                        phases.six = false;
                        phases.seven = true;
                        animiationStage.one = true;
                    }
                }
            }
            if(animiationStage.three){
                let diff = time - animiationStage.three;
                if(diff > 160 ){
                    tbLine1.update(opponent.getName() + " used");
                    tbLine2.update(oAttackName);
                }else{
                    tbLine1.update("");
                    tbLine2.update("");
                }
                if(diff > 560){
                    pHealthBat = player.takeDamage(oDamage);
                    animiationStage.three = false;
                    animiationStage.four = time;
                }
            }
            if(animiationStage.four){
                let pHealthBar = (pHealthBat.c/pHealthBat.t);
                if(pHealthBar <= .15){
                    pHealthIndex = "red";
                }else if( pHealthBar <= .5){
                    pHealthIndex = "yellow";
                }
                pHealthBar = Math.floor(pHealthBar * helthMaxWidth);
                let diff = pHealthValue - pHealthBar;
                let ldiff = time - animiationStage.four;
                pHealthValue = pHealthValue -  Math.floor((ldiff/800)*diff);
                pHealth.update({x:151,y:131}, healthIndex[pHealthIndex], 3,3,9,pHealthValue);
                opponent.updateAttack(ldiff, oCurMove);
                if(ldiff > 800 ){
                    animiationStage.four = false;
                    pHealthValue = pHealthBar;
                    //Animation is over...
                    if(pHealthBat.c <= 0){
                        pFaint = true;
                        animiationStage.four = false;
                        phases.six = false;
                        phases.seven = true;
                        animiationStage.one = true;
                    }else{
                        phases.six = false;
                        phases.three = true;
                    }
                }
            }
        }
        if(phases.seven){
            player.bounce(false);
            player.update(time);
            dBgBox.update({x:155,y:132});
            pLevel.update("Lv" + player.getLevel());
            pName.update(player.getName());
            if(dif%500 > 250){
                dwnArrowCener.y  = 171;
            }else{
                dwnArrowCener.y = 172;
            }
            dwnArrow.update(dwnArrowCener);
            if(animiationStage.one){
                if(oFaint){
                    tbLine1.update("Wild " + opponent.getName());
                    tbLine2.update("fainted!");
                }else{
                    tbLine1.update(player.getName());
                    tbLine2.update("fainted!");
                }
                if(inputs[KeyEvent[controlKeys.a.key]]){
                    if(!aBtnBlock){
                        if(oFaint){
                            animiationStage.one = false;
                            animiationStage.two = time;
                            experienceGain = Math.pow(opponent.getLevel(), 3);
                        }else{
                            animiationStage.one = false;
                            finishFn();
                            reset();
                            return;
                        }
                        aBtnBlock = true;
                    }
                }else{
                    aBtnBlock = false;
                }
            }
            if(animiationStage.two){
                tbLine1.update(player.getName() + " gained");
                tbLine2.update(experienceGain + " EXP. Points!");
                if(inputs[KeyEvent[controlKeys.a.key]]){
                    if(!aBtnBlock){
                        animiationStage.two = false;
                        animiationStage.three = time;
                        initExperince = player.getExperincePercent();
                        player.addExp(experienceGain);
                        aBtnBlock = true;
                    }
                }else{
                    aBtnBlock = false;
                }
            }
            if(animiationStage.three){
                let diff = time - animiationStage.three;
                let epdiff = player.getExperincePercent() - initExperince;
                if(epdiff <= 0) epdiff = 1;
                let expUpdate = expMax*((diff/800) * epdiff);
                pExperience.update({x:135,y:147}, {r:0,c:0}, 2,2,7,Math.floor(expUpdate));
                if(diff > 800){
                    animiationStage.three = false;

                    finishFn();
                    reset();
                }
            }
        }
        if(phases.eight){
            tbLine1.update(player.getName() + " fainted!");
            tbLine2.update("You ran away!");
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
        if(opponent && !oFaint){
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
        if(phases.five){
            player.draw();
            //Ready to draw the Defend box
            dBgBox.draw();
            pLevel.draw();
            pName.draw();
            pHealth.draw();
            pExperience.draw();
            moveBg.draw();
            ppLable.draw();
            ppVal.draw();
            typeLable.draw();
            typeVal.draw();
            selector.draw();
            atk1.draw();
            atk2.draw();
            atk3.draw();
            atk4.draw();
        }
        if(phases.six){
            player.draw();
            if(animiationStage.two){
                player.renderAttack(currentMovePos);
            }
            if(animiationStage.four){
                opponent.renderAttack(oCurMove);
            }
            dBgBox.draw();
            pLevel.draw();
            pName.draw();
            pHealth.draw();
            pExperience.draw();

        }
        if(phases.seven){
            if(!pFaint){
                player.draw();
                dBgBox.draw();
                pLevel.draw();
                pName.draw();
                pHealth.draw();
                pExperience.draw();
            }
            dwnArrow.draw();
        }
        if(phases.eight){
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
        phases.six = false;
        phases.seven = false;
        phases.eight = false;
        currentSelectPos = "one";
        currentMovePos = "one";
        helthMaxWidth = 48;
        expMax = 64;
        playerAttack = null;
        pAttackName = "";
        oAttack = null;
        oAttackName = "";
        pDamage = 0;
        oDamage = 0;
        oHealthBat = {};
        pHealthBat = {};
        pFaint = false;
        experienceGain = 0;
        initExperince = 0;
        oHealthValue = helthMaxWidth;
        oHealthIndex = "green";
        oFaint = false;
    };

    let setPlayerPokemon = function (pList) {
        playerList = pList;
        player = playerList[0];
        player.setSide("defend");
    };

    let damageCalc = function (attack, defend, power) {
        let randVal = ((Math.floor(Math.random() * 100))%15)/100 + .85;
        return Math.round(((((2 * attack.getLevel())/5 + 2) * power * (attack.getAttack() / defend.getDefence()))/50 + 2) * randVal);
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