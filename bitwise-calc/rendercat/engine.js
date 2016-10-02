let engine_game;
let __engine_preload_schedule = [];
let __engine_start_schedule = [];
let __engine_update_schedule = [];
let __engine_render_schedule = [];
let __engine_is_loaded = false;

function __engine_preload() {
    for(let preload of __engine_preload_schedule) {
        preload(engine_game);
    }
}

function __engine_create() {
    engine_game.stage.backgroundColor = "#fbfbfb";

    for(let start of __engine_start_schedule) {
        start(engine_game);
    }

    __engine_is_loaded = true;
}

function __engine_update() {
    for(let update of __engine_update_schedule) {
        update(engine_game);
    }
}

function __engine_render() {
    for(let render of __engine_render_schedule) {
        render(engine_game);
    }
}

function engine_add_start(start_func) {
    if(typeof start_func !== "function") return;
    if(__engine_is_loaded){
        start_func(engine_game);
        return;
    }
    __engine_start_schedule.push(start_func);
}

function engine_add_loop(loop_func) {
    if(typeof loop_func !== "function") return;
    __engine_update_schedule.push(loop_func);
}

function engine_add_render(render_func) {
    if(typeof render_func !== "function") return;
    __engine_render_schedule.push(render_func);
}

function engine_add_preload(preload_func) {
    if(typeof preload_func !== "function") return;
    if(__engine_is_loaded){
        preload_func(engine_game);
        return;
    }

    __engine_preload_schedule.push(preload_func);
}

function engine_run(options) {
    let opts = {
        width:      "100",
        height:     400    || options.height,
    }

    if(typeof STEP_START === "undefined")   
        STEP_START   = function() {};
    if(typeof STEP_EXECUTE === "undefined") 
        STEP_EXECUTE = function() {};
    if(typeof STEP_PRELOAD === "undefined") 
        STEP_PRELOAD = function() {};

    engine_add_start(STEP_START);
    engine_add_loop(STEP_EXECUTE);
    engine_add_preload(STEP_PRELOAD);


    engine_game = new Phaser.Game(
        opts.width, opts.height, 
        Phaser.CANVAS, "GAME", 
        { 
            create:  __engine_create, 
            update:  __engine_update,
            preload: __engine_preload,
            render:  __engine_render 
        });
}

function engine_combine_bitmaps(dest, source, ox, oy, sx, sy) {
    const size = {
        x: Math.min(sx || 9999, source.width),
        y: Math.min(sy || 9999, source.height)
    };

    dest.copyRect(source, new Phaser.Rectangle(0,0, size.x, size.y), ox, oy);
}

function engine_apply_pallete(dest, lookupPallete, targetPallete, x1, y1, x2, y2) {
    if(typeof x1 !== "number") x1 = 0;
    if(typeof y1 !== "number") y1 = 0;
    if(typeof x2 !== "number") x2 = dest.width;
    if(typeof y2 !== "number") y2 = dest.height;

    for(let i in lookupPallete) {
        dest.replaceRGB(
            lookupPallete[i].r, lookupPallete[i].g, lookupPallete[i].b, lookupPallete[i].a,
            targetPallete[i].r, targetPallete[i].g, targetPallete[i].b, targetPallete[i].a,
            new Phaser.Rectangle(x1, y1, x2, y2));
    }
}

function engine_create_label(text, opts) {
    let options = { 
        font:           "32px Arial", 
        fill:           "#ffffff", 
        wordWrap:       true, 
        width:          350,
        wordWrapWidth:  350, 
        align:          "center"
    };

    options = $.extend(options, opts || {});

    let bmd = engine_game.add.text(0, 0, text, options);
    return bmd;
}


$(document).ready(function() {
    const blury = $('<div class="-fl -al-center -ju-center game-blur -grow"><div class="game-description -display">Powered by <strong>Phaser.IO</strong></div>');
    const button = $('<a href="#" class="game-start"><span class="fa fa-plug"></span></a></div>').click(() => { EXECUTE(); return false; });

    $("#GAME").append(blury.append(button));
});