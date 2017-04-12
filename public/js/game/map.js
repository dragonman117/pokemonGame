/**
 * Created by timothyferrell on 4/10/17.
 */

let Map = function(mapPath, draw, canvasTileSize){
    let tiles = {}; // object of each tile and it's properties
    let tileSets = {}; // array of tile sets (actual image)
    let mapFile = {};
    let masterMap = [];
    let ready = false;


    //Helper Functions
    fetchMap = function () {
        return new Promise(function(response, reject){
            fetch(mapPath).then(response=>response.json()).then(json=>{
                mapFile = json;
                response({});
            });
        })
    };
    processMap = function () {
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
            for(let y = 0; y < imgHeight-tileSize; y += tileSize + mapFile.tilesets[i].margin){
                for(let x = 0; x < imgWidth; x += tileSize + mapFile.tilesets[i].margin){
                    tiles[tileCount] = {
                        x: mapFile.tilesets[i].margin + x,
                        y: mapFile.tilesets[i].margin + y,
                        img: mapFile.tilesets[i].name,
                        attr:{}
                    };
                    if(mapFile.tilesets[i].hasOwnProperty("tileproperties")){
                        if(mapFile.tilesets[i].tileproperties.hasOwnProperty(tileCount)){
                            keys = Object.keys(mapFile.tilesets[i].tileproperties[tileCount]);
                            for(let j = 0; j < keys.length; j++){
                                tiles[tileCount].attr[keys[j]] = mapFile.tilesets[i].tileproperties[tileCount][keys[j]];
                            }
                        }
                    }
                    tileCount++;
                }
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

        //Load Layers onto map (bottom first for canvas draw)
        for(let x = 0; x < mapFile.layers.length; x++){
            let count = 0;
            for(let i = 0; i < mapHeight; i++){
                for(let j = 0; j < mapWidth; j++){
                    if(mapFile.layers[x].data[count] !== 0){
                        masterMap[i][j].drawStack.push(mapFile.layers[x].data[count]);
                        let keys = Object.keys(tiles[mapFile.layers[x].data[count]].attr);
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

        console.log(masterMap);
        console.log(tiles);

        //Indicate ready to draw/work with
        ready = true;
    };
    initMap = function () {
        fetchMap().then(data=>{
            processMap();
        })
    };

    //Export Functions
    //Grids: {x1,x2,y1,y2}
    drawMap = function (grids) {
        if(ready){
            let ix = 0;
            let iy = 0;
            let height = mapFile.height;
            let width = mapFile.width;
            for(let i = grids.y1; i < grids.y2; i++){
                ix = 0;
                for(let j = grids.x1; j < grids.x2; j++){
                    let pos = {x:ix, y:iy};
                    for(let x = 0; x < masterMap[i][j].drawStack.length; x++){
                        //masterMap[i][j].drawStack[x]
                        let tile = tiles[masterMap[i][j].drawStack[x]];
                        tileSets[tile.img].draw(tile, pos);
                    }
                    ix += canvasTileSize;
                }
                iy += canvasTileSize;
            }
        }
    };

    //Startup
    initMap();

    return{
        draw:drawMap
    }
};