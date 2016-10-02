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

const KITTEN_TAIL_OFFSET  = 0;
const KITTEN_FACE_OFFSET  = 1;
const KITTEN_BACK_OFFSET  = 2;
const KITTEN_COLOR_OFFSET = 3;
const KITTEN_AGE_OFFSET   = 7;

const KITTEN_TAIL_MASK    = bitMask(1, KITTEN_TAIL_OFFSET);
const KITTEN_FACE_MASK    = bitMask(1, KITTEN_FACE_OFFSET);
const KITTEN_BACK_MASK    = bitMask(1, KITTEN_BACK_OFFSET);
const KITTEN_COLOR_MASK   = bitMask(4, KITTEN_COLOR_OFFSET);
const KITTEN_AGE_MASK     = bitMask(3, KITTEN_AGE_OFFSET);

class Kitten 
{
    constructor(color, age, tailStripes, backStripes, faceStripes) {
        this.color = color;
        this.age   = age;
        this.tailStripes = tailStripes;
        this.backStripes = backStripes;
        this.faceStripes = faceStripes;
    }
    
    // ZZZYYYYХХХ                      10 bits
    // └┬┘└─┬┘││└ Tail stripes flag     1 bit
    //  │   │ │└─ Face stripes flag     1 bit
    //  │   │ └── Back stripes flag     1 bit
    //  │   └──── Color data            4 bits
    //  └──────── Age data              3 bit
    pack() {

        const tailData  = this.tailStripes               << KITTEN_TAIL_OFFSET;
        const faceData  = this.faceStripes               << KITTEN_FACE_OFFSET; 
        const backData  = this.backStripes               << KITTEN_BACK_OFFSET;
        const ageData   = this.age                       << KITTEN_AGE_OFFSET;
        const colorData = KITTEN_COLOR_CODES[this.color] << KITTEN_COLOR_OFFSET;

        return tailData | backData | faceData | colorData | ageData;
    }

    static unpack(data) {
        let instance = new Kitten();

        instance.tailStripes =            !!bitData(data, KITTEN_TAIL_MASK,  KITTEN_TAIL_OFFSET);
        instance.faceStripes =            !!bitData(data, KITTEN_FACE_MASK,  KITTEN_FACE_OFFSET);
        instance.backStripes =            !!bitData(data, KITTEN_BACK_MASK,  KITTEN_BACK_OFFSET);
        instance.color = KITTEN_COLOR_NAMES[bitData(data, KITTEN_COLOR_MASK, KITTEN_COLOR_OFFSET)];
        instance.age =                      bitData(data, KITTEN_AGE_MASK,   KITTEN_AGE_OFFSET);

        return instance;
    }
}

const STEP_START = (game) => {
    const kittenPack = [791, 540, 135, 288, 0];
    for(let data of kittenPack) {
        const k = Kitten.unpack(data);
        kitten_with_label_render(k, data);
    }
};