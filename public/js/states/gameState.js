/**
 * Created by timothyferrell on 4/11/17.
 */

function gameState(elementId, draw, storage, debug=false){
    let exploreAudio = new Audio('explore.mp3');
    let battleAudio = new Audio('battle.mp3');
    let startAudio = true;
    //pokemon :)
    let pokemonList = [
        "/js/pokemon/rattata.json",
        "/js/pokemon/pidgey.json",
        "/js/pokemon/sparrow.json",
        "/js/pokemon/nidoran.json"
    ];
    let controlKeys = {
        up: {key: "DOM_VK_UP", name: "up arrow"},
        down: {key: "DOM_VK_DOWN", name: "down arrow"},
        left: {key: "DOM_VK_LEFT", name: "left arrow"},
        right: {key: "DOM_VK_RIGHT", name: "right arrow"},
        start: {key: "DOM_VK_ENTER", name: "enter"},
        a: {key: "DOM_VK_A", name: "A"},
        b: {key: "DOM_VK_B", name: "B"}
    };
    let battleInProg = false;
    let healInProg = false;
    let battleCheck = false;
    let battleProb = 0;

    let canvasTileSize = 16;

    let conversation = NaN;

    let game = state(elementId, "Game");
    let map = new Map("/js/maps/collisionsTest.json", draw, canvasTileSize);
    let gps = new Gps(draw, canvasTileSize, 13);
    let battle = new Battle(draw, pokemonList,controlKeys);
    let player = new Player(draw, canvasTileSize);
    let storageMap = {
        up: "controlUp",
        down: "controlDown",
        left: "controlLeft",
        right: "controlRight",
        start: "controlStart",
        a: "controlA",
        b: "controlB"
    };

    map.onReady(function () {
        gps.setMapSize(map.getMapSize());
        gps.setPlayerInitialPos(map.getStart());
        player.setStartPos(gps.getPlayerPos());

        gps.setHealTriggerFn(function () {
           healInProg = true;
            if(!conversation){
                let pos = gps.getCurrentMapPos();
                let tile = map.queryPos({x:pos.x, y:(pos.y-1)});
                if(tile.attribute.hasOwnProperty("file")){
                    conversation = new Conversation(tile.attribute.file, draw, controlKeys, function () {
                        conversation = NaN;
                        healInProg = false;
                        player.heal();
                        setTimeout(function () { // have to set a timeout to prevent a infinite loop
                            gps.clearHeal();
                        },1000)
                    })
                }
            }
        });

        gps.setCollisionCheckFunction(function (pos) {
            let res = {
                me: map.queryPos(pos),
                up: map.queryPos({x:pos.x, y:(pos.y-1)}),
                down: map.queryPos({x:pos.x, y:(pos.y+1)}),
                right: map.queryPos({x:(pos.x+1), y:pos.y}),
                left: map.queryPos({x:(pos.x-1), y:pos.y})
            };
            return res;
        });
        player.setCurrentTileFn(function () {
            return map.queryPos(gps.getCurrentMapPos());
        });

        player.setLedgeCheckFn(function () {
            return gps.getLedge();
        });

        battleCheck = function () {
            let pos = map.queryPos(gps.getCurrentMapPos());
            if(pos.attribute.hasOwnProperty("grass")){
                if(battleProb > 73){
                    exploreAudio.currentTime = 0;
                    exploreAudio.pause();
                    battleAudio.play();
                    battleInProg = true;
                    battle.setFinishFn(function () {
                        gps.clearProb();
                        battleInProg = false;
                        if(player.checkWin()) player.addWin();
                    });
                    battle.setPlayerPokemon(player.getPokemonList());
                }
            }
        };
    });

    let gameUpdate = function (time, inputs) {
        let now = performance.now();
        if (!battleInProg){
            battleAudio.currentTime = 0;
            battleAudio.pause();
            exploreAudio.play();
        }
        else {
            battleAudio.play();
        }
        exploreAudio.addEventListener("ended", function(){
            exploreAudio.currentTime = 0;
            exploreAudio.play();
        });
        return new Promise(function (resolve, reject) {
            if(inputs[KeyEvent.DOM_VK_ESCAPE]){
                if(debug){
                    console.log("Escape Key selected");
                }
                exploreAudio.currentTime = 0;
                exploreAudio.pause();
                battleAudio.currentTime = 0;
                battleAudio.pause();

                $.ajax({
            		url: 'http://localhost:3000/saveScores',
            		type: 'POST',
            		error: function() { alert('POST failed'); },
            		success: function() {
                        
            		}
            	});

                game.changeState("mainMenu");
            }

            if(!battleInProg){
                if(!conversation){
                    if(inputs[KeyEvent[controlKeys.up.key]]){
                        gps.move(now, "up");
                        player.move(now, "up");
                        gps.onMoveEnd(function () {
                            player.stopMove("up");
                        })
                    }else{
                        gps.stopMove("up");
                    }
                    if(inputs[KeyEvent[controlKeys.down.key]]){
                        gps.move(now, "down");
                        player.move(now, "down");
                        gps.onMoveEnd(function () {
                            player.stopMove("down");
                        })
                    }else{
                        gps.stopMove("down");
                    }
                    if(inputs[KeyEvent[controlKeys.right.key]]){
                        gps.move(now, "right");
                        player.move(now, "right");
                        gps.onMoveEnd(function () {
                            player.stopMove("right");
                        })
                    }else{
                        gps.stopMove("right");
                    }
                    if(inputs[KeyEvent[controlKeys.left.key]]){
                        gps.move(now, "left");
                        player.move(now, "left");
                        gps.onMoveEnd(function () {
                            player.stopMove("left");
                        })
                    }else{
                        gps.stopMove("left");
                    }
                }else{
                    conversation.update(now, inputs);
                }
                gps.gpsUpdate(now);//important goes before the player...
                player.playerUpdate(now);
                battleProb = gps.getBattleProb();
                //Check for grass
                if(battleCheck) battleCheck();
            }else{
                battle.update(now, inputs);
            }
            resolve();
        })
    };

    let gameRender = function () {
        if(!battleInProg){
            draw.beginRender();
            map.draw(gps.getMapRange(), gps.getOffset());
            player.draw();
            map.drawUpper(gps.getMapRange(), gps.getOffset());
            if(conversation)conversation.draw();
        }else{
            battle.draw();
        }
    };

    game.init(gameRender, gameUpdate);

    game.onActivate(function () {
        let sKeys = Object.keys(storageMap);
        for(let i = 0; i < sKeys.length; i++){
            if(storage.contains(storageMap[sKeys[i]])){
                controlKeys[sKeys[i]] = storage.fetch(storageMap[sKeys[i]]);
            }
        }
        game.addInput(KeyEvent.DOM_VK_ESCAPE);
        game.addInput(KeyEvent[controlKeys.up.key]);
        game.addInput(KeyEvent[controlKeys.down.key]);
        game.addInput(KeyEvent[controlKeys.left.key]);
        game.addInput(KeyEvent[controlKeys.right.key]);
        game.addInput(KeyEvent[controlKeys.start.key]);
        game.addInput(KeyEvent[controlKeys.a.key]);
        game.addInput(KeyEvent[controlKeys.b.key]);
    });

    return game;
}
