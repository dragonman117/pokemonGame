/**
 * Created by timothyferrell on 4/22/17.
 */

let Conversation = function (file, draw, controlKeys, callback) {
    let rawSpec = NaN;
    let finishedFn = callback;

    let currentIndex = 1;
    let last = false;
    let start = 0;
    let aBtnBlock = false;

    let ready = false;

    let bg = draw.ImgStatic({
        center:{x: 104, y: 184},
        width: 208,
        height: 48,
        rotation:0,
        source:"/img/convBar.png"
    });

    let line1 = draw.Text({
        pos:{x:13, y:173},
        font:"6pt Pokemon GB",
        fill:"white",
        stroke:"transparent",
        rotation:0,
        text:""});
    let line2 = draw.Text({
        pos:{x:13, y:187},
        font:"6pt Pokemon GB",
        fill:"white",
        stroke:"transparent",
        rotation:0,
        text:""});

    let dwnArrowCener = { x:185, y:176 };
    let dwnArrow = draw.ImgStatic({
        center: dwnArrowCener,
        width: 10,
        height: 10,
        rotation: 0,
        source:"/img/dwnArrow.png"
    });

    let fetchSpec = function () {
        return new Promise(function (res, err) {
            //forgot exact link but found on stack overflow somewhere...
            fetch(file).then(response=>response.json()).then(json=>{
                rawSpec = json;
                res();
            })
        })
    };
    let processSpec = function () {
        ready = true;
    };
    let initPokemon = function () {
        fetchSpec().then(res=>processSpec());
    };


    let drawConv = function () {
        bg.draw();
        line1.draw();
        line2.draw();
        dwnArrow.draw();
    };
    
    let update = function (time, inputs) {
        if(ready){
            if(currentIndex === rawSpec.frames)last = true;
            if(start === 0) start = time;
            let dif = time - start;
            if(dif%500 > 250){
                dwnArrowCener.y  = 178;
            }else{
                dwnArrowCener.y = 176;
            }
            line1.update(rawSpec.set[currentIndex]["1"]);
            line2.update(rawSpec.set[currentIndex]["2"]);
            if(inputs[KeyEvent[controlKeys.a.key]]){
                if(!aBtnBlock){
                    if(!last)currentIndex += 1;
                    else finishedFn();
                    aBtnBlock = true;
                }
            }else{
                aBtnBlock = false;
            }
        }
    };

    //Startup
    initPokemon();

    return {
        draw:drawConv,
        update:update
    }
};