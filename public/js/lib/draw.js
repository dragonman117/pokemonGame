/**
 * Created by Timothy Ferrell on 2/4/17.
 */

let Graphics = function () {
    let context = null;
    let xmax = 0;
    let ymax = 0;

    function initalize(id, xSize, ySize){
        let canvas = document.getElementById(id);
        context = canvas.getContext('2d');
        xmax = xSize;
        ymax = ySize;
        CanvasRenderingContext2D.prototype.clear = function(){
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect( 0, 0, canvas.width, canvas.height);
            this.restore();
        };
    }

    function beginRender(){
        context.clear();
    }

    /*
    Takes a spec object. Rectangle spec has: { size:{h:val, w:val}, corner:{x:val, y:val}, rotation:val, fillstyle:val}
     */
    function Rectangle(spec, gradient = false) {
        let that = {};
        let gr = NaN;

        if(gradient){
            gr = context.createLinearGradient(spec.corner.x, spec.corner.y, spec.corner.x, spec.corner.y + spec.size.h);

            gr.addColorStop(0, spec.gradient.first);
            gr.addColorStop(.5, spec.gradient.second);
            gr.addColorStop(.51, spec.gradient.third);
            gr.addColorStop(1, spec.gradient.fourth);
            spec.fillStyle = gr;
        }

        that.update = function(){
            //todo here... not quite sure what I want this to do yet...
        };

        that.draw = function () {
            context.save();

            context.translate(spec.corner.x + spec.size.w / 2, spec.corner.y + spec.size.h / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.corner.x + spec.size.w /2), -(spec.corner.y + spec.size.h /2));

            context.fillStyle = spec.fillStyle;
            context.fillRect(spec.corner.x, spec.corner.y, spec.size.w, spec.size.h);

            context.restore();
        };

        return that;
    }

    /*
    Takes a spec object. Circle Spec has: { pos:{x:val, y:val}, radius:val, fillStyle:val}
     */
    function Circle(spec, gradient = false){
        let that = {};
        let gr = NaN;
        if(gradient){
            gr = context.createRadialGradient(spec.pos.x-5, spec.pos.y-5, 4, spec.pos.x, spec.pos.y, spec.radius);
            //Color stops
            gr.addColorStop(0, spec.gradient.one);
            gr.addColorStop(.2, spec.gradient.two);
            gr.addColorStop(1, spec.gradient.three);
            spec.fillStyle = gr;
        }
        //console.log(spec);
        that.draw = function () {
            context.save();

            context.beginPath();
            context.arc(spec.pos.x, spec.pos.y, spec.radius, 0, Math.PI*2, true);
            context.closePath();

            context.fillStyle = spec.fillStyle;
            context.fill();

            context.restore();
        };

        return that;
    }

    /*
    Takes a spec object. Line Spec:
        {sPos:{x:val, y:val}, ePos:{x:val, y:val}, strokeStyle:val, lineWidth:val, rotation:val}
     */
    function line(spec){
        let that = {};

        that.draw = function () {
            context.save();

            context.translate(spec.sPos.x + spec.lineWidth /2, spec.sPos.y);
            context.rotate(spec.rotation);
            context.translate(-(spec.sPos.x + spec.lineWidth/2), -(spec.sPos.y));

            context.beginPath();
            context.moveTo(spec.sPos.x, spec.sPos.y);
            context.lineTo(spec.ePos.x, spec.ePos.y);

            context.strokeStyle = spec.strokeStyle;
            context.lineWidth = spec.lineWidth;
            context.stroke();

            context.closePath();

            context.restore();
        };

        return that;
    }

    /*
    Takes spec object. Image spec: {center:{x:val, y:val}, width:val, height:val, rotation:val, source:val}
     */
    function imgStatic(spec){
        let that = {},
            ready = false,
            image = new Image();

        image.onload = function () {
            ready = true;
        };

        image.src = spec.source;

        that.update = function (center) {
            spec.center = center;
        };

        that.draw = function () {
            if(ready){
                context.save();

                context.translate(spec.center.x, spec.center.y);
                context.rotate(spec.rotation);
                context.translate(-spec.center.x, -spec.center.y);

                context.drawImage(
                    image,
                    spec.center.x - spec.width /2,
                    spec.center.y - spec.height/2,
                    spec.width, spec.height
                );

                context.restore();
            }
        };

        return that;
    }

    /*
    Takes spec object. Image Sprite spec: {index:{r:val, c:val}, position:{x:val, y:val}, tileSize:val, width:val, height:val, source:val}
     */
    function imgSprite(spec){
        let that = {},
            ready = false,
            image = new Image(),
            imgIndex = spec.index,
            position = spec.position;

        image.onload = function () {
            ready = true;
        };
        image.src = spec.source;

        that.update = function (location, index) {
            imgIndex = index;
            position = location;
        };

        that.draw = function () {
            if(ready){
                context.save();

                context.drawImage(
                    image,
                    imgIndex.c * spec.tileSize,
                    imgIndex.r * spec.tileSize,
                    spec.tileSize,
                    spec.tileSize,
                    position.x,
                    position.y,
                    spec.width,
                    spec.height
                );

                context.restore();
            }
        };

        return that;
    }

    /*
     Takes spec object. Image spec: { cTileSize: canvas tile size, src:val, tileSize:val }
     */
    function imgTileset(spec){
        let that = {},
            ready = false,
            image = new Image();

        image.onload = function () {
            ready = true;
            console.log("Image Ready: " + spec.src);
        };
        image.src = spec.src;

        // Tile: { x:top left x pixel, y: top left y pixel}, position:{x: canvas x, y: canvas y}
        that.draw = function (tile, position) {
            if(ready){
                context.save();

                context.drawImage(
                    image,
                    tile.x,
                    tile.y,
                    spec.tileSize,
                    spec.tileSize,
                    position.x,
                    position.y,
                    spec.cTileSize,
                    spec.cTileSize
                );

                context.restore();
            }
        };
        return that;
    }

    /*
    Takes a spec object. Text Sprite spec: {pos:{x:val, y:val}, font:val, fill: val, stroke:val, rotation:val, text: val}
     */
    function Text(spec){
        let that = {};

        that .updateRotation = function (angle) {
            spec.rotation += angle;
        };

        function measureTextHeight(spec){
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            let height = context.measureText('m').width;

            context.restore();
            return height;
        }

        function measureTextWidth(spec){
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;

            let width = context.measureText(spec.text).width;

            context.restore();
            return width;
        }

        that.draw = function () {
            context.save();

            context.font = spec.font;
            context.fillStyle = spec.fill;
            context.strokeStyle = spec.stroke;
            context.textBaseline = 'top';

            context.translate(spec.pos.x + that.width / 2, spec.pos.y + that.height / 2);
            context.rotate(spec.rotation);
            context.translate(-(spec.pos.x + that.width / 2), -(spec.pos.y + that.height / 2));

            context.fillText(spec.text, spec.pos.x, spec.pos.y);
            context.strokeText(spec.text, spec.pos.x, spec.pos.y);

            context.restore();
        };

        that.height = measureTextHeight(spec);
        that.width = measureTextWidth(spec);
        that.pos = spec.pos;

        return that;
    }

    /**
     * This will return the size of the canvas element.
     * @returns {{xSize: number, ySize: number}}
     */
    function getMaxSize() {
        return {xSize: xmax, ySize: ymax}
    }

    function particleDraw(spec){
        context.save();

        context.translate(spec.center.x, spec.center.y);
        context.rotate(spec.rotation);
        context.translate(-spec.center.x, -spec.center.y);

        context.drawImage(
            spec.image,
            spec.center.x - spec.size/2,
            spec.center.y - spec.size/2,
            spec.size, spec.size);

        context.restore();
    }

    return {
        initalize: initalize,
        beginRender: beginRender,
        Rectangle: Rectangle,
        Circle: Circle,
        Line: line,
        ImgStatic: imgStatic,
        ImgSprite: imgSprite,
        ImgTileset: imgTileset,
        Text: Text,
        particleDraw: particleDraw,
        getMaxSize: getMaxSize
    };
};