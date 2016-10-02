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
}


const STEP_START = (game) => {

    for(let i = 0; i < 5; i++) {
        let k = new Kitten(
            KITTEN_COLOR_NAMES[i],  // цвета от Devil до Ginger
            i + 2,      // возраст от 2 до 6
            i % 2 != 0, // каждый второй котенок без полосок на хвосте
            i % 3 == 0, // каждый третий котенок с полосками на спинке
            i % 2 == 0  // каждый второй котенок с полосками на мордочке
        );

        kitten_with_label_render(k, k.pack());
    }
};