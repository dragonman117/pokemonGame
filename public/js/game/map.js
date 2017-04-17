/**
 * Created by timothyferrell on 4/10/17.
 */

let Map = function(mapPath, draw, canvasTileSize){
    let tiles = {}; // object of each tile and it's properties
    let tileSets = {}; // array of tile sets (actual image)
    let mapFile = {};
    let masterMap = [];
    let startPos = {x:0, y:0};
    let ready = false;
    let onReadyFn = NaN;

    let currentTileFn = NaN;


    //Helper Functions
    let fetchMap = function () {
        return new Promise(function(response, reject){
            fetch(mapPath).then(response=>response.json()).then(json=>{
                mapFile = json;
                response({});
            });
        })
    };
    let processMap = function () {
        //Build Tiles  :D
        for(let i = 0; i < mapFile.tilesets.length; i++){
            let spec = {
                cTileSize:canvasTileSize,
                tileSize: mapFile.tilesets[i].tileheight,
                src: mapFile.tilesets[i].image
            };
            tileSets[mapFile.tilesets[i].name] = draw.ImgTileset(spec);
            //Build tiles...
            let imgWidth = mapFile.tilesets[i].imagewidth - 2*mapFile.tilesets[i].margin;
            let imgHeight = mapFile.tilesets[i].imageheight - 2*mapFile.tilesets[i].margin;
            let tileSize = mapFile.tilesets[i].tilewidth;
            let tileCount = mapFile.tilesets[i].firstgid;
            for(let y = 0; y < imgHeight; y += tileSize + mapFile.tilesets[i].spacing){
                let x = 0;
                for(let c = 0; c < mapFile.tilesets[i].columns; c++){
                    tiles[tileCount] = {
                        x: mapFile.tilesets[i].margin + x,
                        y: mapFile.tilesets[i].margin + y,
                        img: mapFile.tilesets[i].name,
                        attr:{}
                    };
                    if(mapFile.tilesets[i].hasOwnProperty("tileproperties")){
                        let tileOffset = mapFile.tilesets[i].firstgid;
                        if(mapFile.tilesets[i].tileproperties.hasOwnProperty(tileCount-tileOffset)){
                            keys = Object.keys(mapFile.tilesets[i].tileproperties[tileCount-tileOffset]);
                            for(let j = 0; j < keys.length; j++){
                                tiles[tileCount].attr[keys[j]] = mapFile.tilesets[i].tileproperties[tileCount-tileOffset][keys[j]];
                            }
                        }
                    }
                    tileCount++;
                    x += tileSize + mapFile.tilesets[i].spacing
                }
            }
        }
        //See if you have new start pos
        if(mapFile.hasOwnProperty("properties")){
            if(mapFile.properties.hasOwnProperty("startX") && mapFile.properties.hasOwnProperty("startY")){
                startPos.x = mapFile.properties.startX;
                startPos.y = mapFile.properties.startY;
            }
        }

        //Build Master Map
        let mapHeight = mapFile.height;
        let mapWidth = mapFile.width;

        for(let i = 0; i < mapHeight; i++){
            masterMap.push([]);
            for(let j = 0; j < mapWidth; j++){
                masterMap[i].push({
                    drawStack:[],
                    walls:{
                        top: false,
                        bot: false,
                        left: false,
                        right: false
                    },
                    attribute:{}
                })
            }
        }

        //console.log(mapFile);
        //Load Layers onto map (bottom first for canvas draw)
        for(let x = 0; x < mapFile.layers.length; x++){
            let count = 0;
            for(let i = 0; i < mapHeight; i++){
                for(let j = 0; j < mapWidth; j++){
                    if(mapFile.layers[x].data[count] !== 0){
                        masterMap[i][j].drawStack.push(mapFile.layers[x].data[count]);
                        let keys = Object.keys(tiles[mapFile.layers[x].data[count]].attr);
                        //console.log(keys);
                        if(keys.length > 0){
                            for(let k = 0; k < keys.length; k++){
                                if(keys[k] === "wall"){
                                    masterMap[i][j].walls = {
                                        top: true,
                                        bot: true,
                                        left: true,
                                        right: true
                                    }
                                }
                                else if (keys[j] === "wall_top"){
                                    masterMap[i][j].walls.top = true;
                                }
                                else if (keys[j] === "wall_bot"){
                                    masterMap[i][j].walls.bot = true;
                                }
                                else if (keys[j] === "wall_right"){
                                    masterMap[i][j].walls.right = true;
                                }
                                else if (keys[j] === "wall_left"){
                                    masterMap[i][j].walls.left = true;
                                }
                                else{
                                    masterMap[i][j].attribute[keys[k]] = tiles[mapFile.layers[x].data[count]].attr[keys[k]];
                                }
                            }
                        }
                    }
                    count++;
                }
            }
        }

        //For some reason it does not quite read in the properties in the first copy... check 2...
        for(let i = 0; i < mapHeight; i++){
            for(let j = 0; j < mapWidth; j++){
                let atrKey = Object.keys(masterMap[i][j].attribute);
                //console.log(atrKey);
                for(let x = 0; x < atrKey.length; x++){
                    if(atrKey[x] === "wall_bot"){
                        masterMap[i][j].walls.bot = true;
                        delete masterMap[i][j].attribute[atrKey[x]];
                    }
                    else if(atrKey[x] === "wall_right"){
                        masterMap[i][j].walls.right = true;
                        delete masterMap[i][j].attribute[atrKey[x]];
                    }
                    else if(atrKey[x] === "wall_top"){
                        masterMap[i][j].walls.top = true;
                        delete masterMap[i][j].attribute[atrKey[x]];
                    }
                    if(atrKey[x] === "wall_right"){
                        masterMap[i][j].walls.right = true;
                        delete masterMap[i][j].attribute[atrKey[x]];
                    }
                    if(atrKey[x] === "bridge"){
                        masterMap[i][j].walls = {
                            top: false,
                            bot: false,
                            left: false,
                            right: false
                        }
                    }
                }
            }
        }

        //Indicate ready to draw/work with
        ready = true;
        if(onReadyFn) onReadyFn();
    };
    let initMap = function () {
        fetchMap().then(data=>{
            processMap();
        });
    };

    //Export Functions
    //Grids: {x1,x2,y1,y2}
    let drawMap = function (grids, offset) {
        if(ready){
            draw.beginRender();
            let ix = offset.x;
            let iy = offset.y;
            let height = mapFile.height;
            let width = mapFile.width;
            for(let i = grids.y1; i < grids.y2; i++){
                ix = offset.x;
                for(let j = grids.x1; j < grids.x2; j++){
                    let pos = {x:ix, y:iy};
                    //console.log(pos);
                    for(let x = 0; x < masterMap[i][j].drawStack.length; x++){
                        //masterMap[i][j].drawStack[x]
                        let tile = tiles[masterMap[i][j].drawStack[x]];
                        tileSets[tile.img].draw(tile, pos);
                    }
                    ix += canvasTileSize;
                }
                iy += canvasTileSize;
            }
            let keys = Object.keys(tileSets);
        }
    };
    let getStart = function (){
        return {x:startPos.x, y:startPos.y};
    };
    let onReady = function (fn) {
        onReadyFn = fn;
    };
    let getMapSize = function () {
        return {r:mapFile.height, c:mapFile.width}
    };

    let queryPos = function(pos){
        if(pos.x >= 0 && pos.y >=0 && pos.x < masterMap[0].length && pos.y < masterMap.length){
            let res = masterMap[pos.y][pos.x];
            res.pos = {x:(pos.x), y:(pos.y)};
            return res;
        }
        return null;
    };

    //Startup
    initMap();

    return{
        draw:drawMap,
        getStart:getStart,
        onReady:onReady,
        getMapSize:getMapSize,
        queryPos:queryPos,
    }
};