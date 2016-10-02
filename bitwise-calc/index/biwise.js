class Bise {
	static mask(count, offset) {
		if(typeof offset === "undefined") {
			// offset only
			return 1 << count;
		} else {
			return ((1 << count) - 1) << offset;
		}
	}

	static all(value, mask) {
		return (value & mask) === mask;
	}

	static any(value, mask) {
		return (value & mask) > 0;
	}

	static none(value, mask) {
		return (value & mask) === 0;
	}

	static set(value, position, on) {
	    if (on)
	        return value | (1 << position);
	    else
	        return value & ~(1 << position);
	}
}

class BinaryData {
	constructor(initial, bitCount, options) {
		if(typeof initial 	 !== "number") initial = 7;
		if(typeof bitCount !== "number") bitCount = 8;

		this.options = {
			allowIndexes: true,
			indexesPer: 4
		}

		this.options = $.extend(this.options, options);
		this.__bitCount = Math.max(1, Math.min(32, Math.floor(bitCount)));
		this.__raw = initial;
		this.__cached = -1;
	}

	__clean() {
		if(this.__cached === this.__raw) return;
		this.__prepareBits();
		this.__prepareIndexes();
		this.__cached = this.__raw;
	}

	__prepareIndexes() {
		if(typeof this.__indexes === "undefined") this.__indexes = [];
		let index = 1;
		const per = this.options.indexesPer;
		const allow = this.options.allowIndexes;
		if(!allow && this.__cached !== -1) return;

		for (let i = this.__bitCount - 1; i >= 0; i--) {
			if(!allow) {
				this.__indexes[i] = 0;
				continue;
			}
			if(i % per === per - 1) index = 1;
			this.__indexes[i] = Bise.all(this.__raw, Bise.mask(1, i)) ? index++ : 0;
		}
	}

	__prepareBits() {
		if(typeof this.__bits === "undefined") this.__bits = [];
		for (let i = 0; i < this.__bitCount; i++) {
			this.__bits[i] = +Bise.all(this.__raw, Bise.mask(1, i));
		}
	}

	__normalize() {
		if(this.__bitCount >= 32) return;
		this.__raw = this.__raw & Bise.mask(this.__bitCount, 0);
	}

	get hash() {
		this.__clean();
		return this.__raw;
	}

	get bits() {
		this.__clean();
		return this.__bits;
	}

	get indexes() {
		this.__clean();
		return this.__indexes;
	}

	get decial() {
		return this.__raw;
	}

	get count() {
		return this.__bitCount;
	}

	change(raw) {
		this.__raw = raw;
		this.__normalize();
	}

	increment() {
		this.__raw++;
		this.__normalize();
	}

	decrement() {
		this.__raw--;
		this.__normalize();
	}

	left() {
		this.__raw = this.__raw << 1;
		this.__normalize();
	}

	right() {
		this.__raw = this.__raw >> 1;
		this.__normalize();
	}

	toggle(position) {
		const mask = Bise.mask(1, position);
		const flag = Bise.all(this.__raw, mask);
		this.__raw = Bise.set(this.__raw, position, !flag);
		this.__normalize();
	}
}

class BitRender {
	constructor($container, binary, renderer, position, opts) {
		this.options = {
			allowSet: true,
			showIndex: false,
			showPosition: true
		};
		this.options = $.extend(this.options, opts);

		this.__binary = binary;
		this.__renderer = renderer;
		this.$root = $container;
		this.__on    = false;
		this.__position = position;
		this.__index = -1;
		this.__init();
	}

	__init() {
		if(this.options.allowSet)
			this.$button = $('<a href="#" class="out out-bit" index="3"></a>').click(() => { this.__binary.toggle(this.__position); return false; });
		else
			this.$button = $('<div href="#" class="out out-bit disabled" index="3"></div>');

		if(this.options.showPosition)
			this.$button.append(this.__renderer.__makeHelpLabel(this.__position));

		this.$state  = $('<span></span>');
		this.$button.append(this.$state)

		if(this.options.showIndex) {
			this.$index  = $('<b class="index">1</b>');
			this.$button.append(this.$index);
		}

		this.$root.append(this.$button);
	}

	set on(value) {
		this.__on = !!value;
	}

	set index(index) {
		this.__index = +index;
	}

	update() {
		this.$button.attr("index", this.__index).toggleClass("active", this.__on);
		this.$state.text(+this.__on);
		if(this.options.showIndex) 
			this.$index.text(this.__index);
	}
}

class BinaryRenderer {
	constructor(container, binary, options) {
		if(!(binary instanceof BinaryData))
			throw "Incorrect incoming data";
		this.$root = container;
		this.__binary = binary;
		this.__cached = -1;

		this.options = {
			cols: 2,
			showMath: true,
			showByte: true,
			showDec: true,
		};

		this.options = $.extend(this.options, options || {});
		if(typeof this.options.groupBy === "undefined")
			this.options.groupBy = this.__binary.count / this.options.cols;

		this.__init();
	}

	__init() {
		this.$root.addClass(" -fl-row -ju-start");
		const $row = $("<div></div>").addClass("-fl-row -al-start out-row -grow");
		const $controls = $("<div></div>").addClass("-fl-col -al-stretch -ju-start -grow");
		const $output   = $("<div></div>").addClass("-fl-col out-bits");

		this.__makeControls($controls);
		this.__makeOutput($output);

		$row.append($output).append($controls);

		this.$root.append($row);
	}

	__makeControls($container) {
		if(this.options.showDec ) this.__makeDecField(this.__makeGroup($container));
		if(this.options.showMath) this.__makeMathCntl(this.__makeGroup($container));
		if(this.options.showByte) this.__makeByteCntl(this.__makeGroup($container));
	}

	__makeDecField($container) {
		this.$decField = $('<div href="#" class="out out-dec -grow" id="dec"></div>').click(() => { return false; });
		$container.append(this.$decField);
		this.__makeHelpLabel($container, "Decial value");
	}

	__makeMathCntl($container) {
		const $increment = $('<a href="#" class="out -grow">++</a>').click(() => { this.__binary.increment(); return false; });
		const $decrement = $('<a href="#" class="out -grow">--</a>').click(() => { this.__binary.decrement(); return false; });
		$container.append(this.__makeHelpLabel("Math"));
		$container.append(this.__makeRow().append($decrement).append($increment));
	}

	__makeByteCntl($container) {
		const $left  = $('<a href="#" class="out -grow">&lt;&lt;</a>').click(() => { this.__binary.left(); return false; });
		const $right = $('<a href="#" class="out -grow">&gt;&gt;</a>').click(() => { this.__binary.right(); return false; });
		$container.append(this.__makeHelpLabel("Shift"));
		$container.append(this.__makeRow().append($left).append($right));
	}

	__makeHelpLabel(label) {
		return $(`<span class="out-label">${label}</span>`);
	}

	__makeRow() {
		return $('<div class="-fl-row -grow"></div>')
	}

	__makeGroup($container) {
		const $grp = $('<div class="out-group -fl-row -grow"></div>');
		if($container) $container.append($grp);
		return $grp;
	}

	__makeOutput($container) {
		if(typeof this.__bits === "undefined") this.__bits = [];

		let $row, $group;

		for (var i = this.__binary.count; i > 0; i--) {
			if(i % (this.options.groupBy * this.options.cols) == 0) {
				$row = this.__makeRow();
				$container.append($row);
			}

			if(i % this.options.groupBy == 0) {
				$group = this.__makeGroup($row);
			}

			if(typeof this.__bits[i - 1] === "undefined")
				this.__bits[i - 1] = new BitRender($group, this.__binary, this, i - 1, this.options.bit);

		}
	}

	__clean() {
		if(this.__cached === this.__binary.hash) return;

		if(this.options.showDec ) this.$decField.text(this.__binary.decial);

		for (var i = 0; i < this.__binary.count; i++) {
			this.__bits[i].on = this.__binary.bits[i];
			this.__bits[i].index = this.__binary.indexes[i];
			this.__bits[i].update();
		}

		this.__cached = this.__binary.hash;
	}

	__update() {
		this.__clean();
	}

	loop() {
		this.__update();
		requestAnimationFrame(this.loop.bind(this));
	}
} 