/**
 * Created by timothyferrell on 4/12/17.
 */


let Player = function (draw, canvasTileSize) {
    let pos = {};
    let spec = {
        index:{
            r: 0,
            c: 1
        },
        position:{
            x: 0,
            y: 0,
        },
        tileSize: 32,
        width:canvasTileSize,
        height: canvasTileSize,
        source: "/img/playerSheet.png"
    };
    let playerImg = draw.ImgSprite(spec);
    let ready = false;

    let playerDraw = function () {
        if(ready){
            playerImg.draw();
        }
    };

    let setStartPos = function(startPos){
        pos = startPos;
        spec.position.x = startPos.x;
        spec.position.y = startPos.y;
        ready = true;
    };

    return {
        draw:playerDraw,
        setStartPos:setStartPos
    }
};