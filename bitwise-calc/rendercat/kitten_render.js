const ROOT 		= "/bitwise-calc/rendercat";
const SPRITES 	= ROOT + "/sprites";

const KITTEN_SPRITES = {};

const KITTEN_PATTERNS = {
	KITTEN_PALLETE: 		SPRITES + "/cat-pallete-new.png",
	KITTEN_BACKGROUND: 		SPRITES + "/bg2.png",
	KITTEN_HEAD_STRIPES: 	SPRITES + "/cat-pattern-head-stripes-multi.png",
	KITTEN_HEAD: 		 	SPRITES + "/cat-pattern-head-multi.png",
	KITTEN_TAIL_STRIPES: 	SPRITES + "/cat-pattern-tail-stripes.png",
	KITTEN_TAIL: 		 	SPRITES + "/cat-pattern-tail.png",
	KITTEN_BACK_STRIPES: 	SPRITES + "/cat-pattern-body-stripes.png",
	KITTEN_BACK: 		 	SPRITES + "/cat-pattern-body.png",
};

const KITTEN_COLORS = ["REFERENCE", "DEVIL", "BLACK", "WHITE", "GRAY", "GINGER"];
const KITTEN_HUMAN_COLORS = {
	devil: 		"DEVIL",
	black: 		"BLACK",
	white: 		"WHITE",
	gray:  		"GRAY",
	ginger: 	"GINGER"
};

const KITTEN_COLORS_RGBA = {};

function __kitten_preload(game) {
	for(let key in KITTEN_PATTERNS) {
		game.load.image(key, KITTEN_PATTERNS[key]);
	}
}

function __kitten_create(game) {
	game.stage.smoothed = false;

	for(let key in KITTEN_PATTERNS) {
		KITTEN_PATTERNS[key] = game.make.bitmapData();
		KITTEN_PATTERNS[key].load(key);
	}

	__nextPosition = game.world.centerX + 280;	

	__kitten_prepare_palletes(game);

	const bg = KITTEN_PATTERNS.KITTEN_BACKGROUND.addToWorld(
		(Math.floor(game.world.centerX / 5) * 5) - 2, 
		400, 0.5, 1, 5, 5);
	//sprite.smoothed = false;
}

function __kitten_prepare_palletes(game) {
	const pallete = KITTEN_PATTERNS.KITTEN_PALLETE;
	let pixel;
	for(let i in KITTEN_COLORS) {
		const colorCode = KITTEN_COLORS[i];
		KITTEN_COLORS_RGBA[colorCode] = [];

		for(let x = 0; x < pallete._size.x; x++) {
			KITTEN_COLORS_RGBA[colorCode][x] = pallete.getPixelRGB(x, i);
		}
	}
}

function __kitten_get_color_code(humanCode) {
	return KITTEN_HUMAN_COLORS[humanCode];
}

function __kitten_create_sprite(game, data) {
	const kitten = game.add.bitmapData(28, 16);
	const patterns = {
		tail: data.tailStripes ? KITTEN_PATTERNS.KITTEN_TAIL_STRIPES : KITTEN_PATTERNS.KITTEN_TAIL,
		back: data.backStripes ? KITTEN_PATTERNS.KITTEN_BACK_STRIPES : KITTEN_PATTERNS.KITTEN_BACK,
		face: data.faceStripes ? KITTEN_PATTERNS.KITTEN_HEAD_STRIPES : KITTEN_PATTERNS.KITTEN_HEAD,
	}
	engine_combine_bitmaps(kitten, patterns.tail, 0, 2, patterns.tail.width + Math.min(0, data.age - 3));
	engine_combine_bitmaps(kitten, patterns.back, 6, 6);

  	for(let a = 0; a < data.age / 2; a++) {
		engine_combine_bitmaps(kitten, patterns.back, 8 + a * 2, 6);
	}

	engine_combine_bitmaps(kitten, patterns.face, 8 + data.age, 0);

	kitten.update();

	if(typeof data.faceColor === "undefined" || data.faceColor === data.color) {
		engine_apply_pallete(kitten, KITTEN_COLORS_RGBA["REFERENCE"], KITTEN_COLORS_RGBA[__kitten_get_color_code(data.color)]);
	}
	else {
		engine_apply_pallete(
			kitten, 
			KITTEN_COLORS_RGBA["REFERENCE"],
			KITTEN_COLORS_RGBA[__kitten_get_color_code(data.color)],
			0, 0, 9 + data.age, 16);

		engine_apply_pallete(
			kitten, 
			KITTEN_COLORS_RGBA["REFERENCE"],
			KITTEN_COLORS_RGBA[__kitten_get_color_code(data.color)],
			9 + data.age, 11);

		engine_apply_pallete(
			kitten, 
			KITTEN_COLORS_RGBA["REFERENCE"],
			KITTEN_COLORS_RGBA[__kitten_get_color_code(data.faceColor)],
			9 + data.age, 0, 28, 11);
	}

	return kitten;
}

let __kittenRenderQueue = [];
let __labelRenderQueue = [];
let __nextPosition;

const __kittens = [];
const __labels  = [];

let debug_label;
let debug_kitten;
function __kitten_loop(game) {
	if(__labelRenderQueue.length > 0) {
		debug_label = engine_create_label(__labelRenderQueue.shift(), { font: "22px Arial", fill: "#000000"});
		__labels.push(debug_label);
		debug_label.x = __nextPosition - 30;
		debug_label.y = 95;

		// label.addToWorld();
	}

	if(__kittenRenderQueue.length > 0) {
		debug_kitten = __kitten_create_sprite(game, __kittenRenderQueue.shift()).addToWorld(Math.floor(__nextPosition / 5) * 5, 210, 0.5, 1, 5, 5);
		__kittens.push(debug_kitten);
		__nextPosition -= (25 + Math.random() * 10) * 5;
	}
}

function __kitten_debug(game) {
	// body...
}

function kitten_render_immediately(kitten) {
	return __kitten_create_sprite(engine_game, kitten).addToWorld(Math.floor(__nextPosition / 5) * 5, 210, 0.5, 1, 5, 5);
}

function kitten_render(kitten) {
	__kittenRenderQueue.push(kitten);
}

function kitten_with_label_render(kitten, label) {
	__kittenRenderQueue.push(kitten);
	__labelRenderQueue.push(label);
}

function kitten_run() {
	engine_add_preload(__kitten_preload);
	engine_add_start(__kitten_create);
	engine_add_loop(__kitten_loop);
	engine_add_render(__kitten_debug);
}