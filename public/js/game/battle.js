/**
 * Created by timothyferrell on 4/19/17.
 */

let Battle = function (draw) {
    let spec = {center:{x:104, y:104}, width:208, height:208, rotation:0, source:"/img/battleBg.png"};
    let bg = draw.ImgStatic(spec);

    let battleUpdate = function (time) {
        bg.update(spec.center);
    };

    let battleDraw = function () {
        bg.draw();
    };

    return {
        draw: battleDraw,
        update: battleUpdate
    }
};