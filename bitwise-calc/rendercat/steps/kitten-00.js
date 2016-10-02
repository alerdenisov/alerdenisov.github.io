class Kitten 
{
    constructor(color, age, tailStripes, backStripes, faceStripes) {
        this.color = color;
        this.age   = age;
        this.tailStripes = tailStripes;
        this.backStripes = backStripes;
        this.faceStripes = faceStripes;
    }
}


const STEP_START = (game) => {
	const colors = ["devil","black","white","gray","ginger"];

	for(let i = 0; i < 5; i++) {
	    kitten_render(new Kitten(
	        colors[i],  // цвета от Devil до Ginger
	        i + 2,      // возраст от 2 до 6
	        i % 2 != 0, // каждый второй котенок без полосок на хвосте
	        i % 3 == 0, // каждый третий котенок с полосками на спинке
	        i % 2 == 0  // каждый второй котенок с полосками на мордочке
	    ));
	}
};