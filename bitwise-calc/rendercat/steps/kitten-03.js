function bitMask(bitCount, offset) {
    return ((1 << bitCount) - 1) << offset;
}

function bitData(value, mask, offset) {
    return (value & mask) >> offset;
}

const KITTEN_COLOR_CODES = {
    devil:      0,
    black:      1,
    white:      2,
    gray:       3,
    ginger:     4
};

const KITTEN_COLOR_NAMES = [
    "devil",
    "black",
    "white",
    "gray",
    "ginger"     
];

const KITTEN_TAIL_OFFSET   = 0;
const KITTEN_FACE_OFFSET   = 1;
const KITTEN_BACK_OFFSET   = 2;
const KITTEN_COLOR_OFFSET  = 3;
const KITTEN_AGE_OFFSET    = 6;
const KITTEN_FCOLOR_OFFSET = 9;

const KITTEN_TAIL_MASK   = bitMask(1, KITTEN_TAIL_OFFSET);
const KITTEN_FACE_MASK   = bitMask(1, KITTEN_FACE_OFFSET);
const KITTEN_BACK_MASK   = bitMask(1, KITTEN_BACK_OFFSET);
const KITTEN_COLOR_MASK  = bitMask(3, KITTEN_COLOR_OFFSET);
const KITTEN_AGE_MASK    = bitMask(3, KITTEN_AGE_OFFSET);
const KITTEN_FCOLOR_MASK = bitMask(3, KITTEN_FCOLOR_OFFSET);

class Kitten 
{
    constructor(color, age, tailStripes, backStripes, faceStripes, faceColor) {
        this.color = color;
        this.faceColor = faceColor;
        this.age = age;        
        this.tailStripes = tailStripes;
        this.backStripes = backStripes;
        this.faceStripes = faceStripes;
    }
    
    // FFFZZZYYYXХХ                      12 bits
    // └┬┘└┬┘└┬┘││└ Tail stripes flag     1 bit
    //  │  │  │ │└─ Face stripes flag     1 bit
    //  │  │  │ └── Back stripes flag     1 bit
    //  │  │  └──── Color data            3 bits
    //  │  └─────── Age data              3 bits
    //  └────────── Face color data       3 bits
    pack() {

        const tailData   = this.tailStripes                   << KITTEN_TAIL_OFFSET;
        const faceData   = this.faceStripes                   << KITTEN_FACE_OFFSET; 
        const backData   = this.backStripes                   << KITTEN_BACK_OFFSET;
        const ageData    = this.age                           << KITTEN_AGE_OFFSET;
        const colorData  = KITTEN_COLOR_CODES[this.color]     << KITTEN_COLOR_OFFSET;
        const fcolorData = KITTEN_COLOR_CODES[this.faceColor] << KITTEN_FCOLOR_OFFSET;

        return tailData | backData | faceData | colorData | ageData | fcolorData;
    }

    static unpack(data) {
        let instance = new Kitten();

        instance.tailStripes =                !!bitData(data, KITTEN_TAIL_MASK,   KITTEN_TAIL_OFFSET);
        instance.faceStripes =                !!bitData(data, KITTEN_FACE_MASK,   KITTEN_FACE_OFFSET);
        instance.backStripes =                !!bitData(data, KITTEN_BACK_MASK,   KITTEN_BACK_OFFSET);
        instance.color     = KITTEN_COLOR_NAMES[bitData(data, KITTEN_COLOR_MASK,  KITTEN_COLOR_OFFSET)];
        instance.faceColor = KITTEN_COLOR_NAMES[bitData(data, KITTEN_FCOLOR_MASK, KITTEN_FCOLOR_OFFSET)];
        instance.age =                          bitData(data, KITTEN_AGE_MASK,    KITTEN_AGE_OFFSET);

        return instance;
    }
}

function __render(kitten) {
    kitten_with_label_render(kitten, kitten.pack());
}

let __curentKitten;
let __sprite = null;

function update_kitten(kitten) {
    if(__sprite != null)
        __sprite.destroy();
    __currentKitten = kitten;//new Kitten("black",  6, false, true, true, "gray");
    __sprite = kitten_render_immediately(__currentKitten);
    __sprite.x = engine_game.world.centerX - 120;
}

const STEP_START = (game) => {
};

