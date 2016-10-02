const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

$.fn.bgimage = function(context) {
	console.log(this);
	$(this).each((index, el) => {
		const $image = $(el);
		const $parent = $image.parent();

		const colorA = $image.data('color');
		const tint = !!colorA;

		const colorB = $image.data('color-second') || colorA;
		const position = $image.data('color-second-pos') || "100%";
		const gradient = `linear-gradient(to top, ${colorA} 0%, ${colorB} ${position}),`;
		const src = $image.attr('src');

		const final = `${tint ? gradient : ""} url(${src})`;

		$parent.css('background-image', final).addClass("BackgroundImageHolder");
	})
};

$.fn.owlIt = function() {
	$(this).each((index, el) => {
		const $carousel = $(el);
		$carousel.owlCarousel({
			navigation: true,
			slideSpeed: 300,
			paginationSpeed : 400,
			singleItem:true
		});
	})
};


$.fn.stickIt = function () {
	$(this).each((index, el) => {
		const $sticky = $(el);
		const posY = $sticky.offset().top;
		const offset = +($sticky.data('offset') || 0);

		$(window).scroll(() => {
			const wh = $(window).height() - offset;
			const height = $sticky.height();
			const scroll = Math.min(0, height - wh);
			const space = $sticky.parent().height();
			const maxDelta = space - height;
			const y = $(window).scrollTop() + offset + scroll;
			const delta = Math.min(maxDelta, Math.max(0, y - posY));
			$sticky.css('transform', `translate3D(0, ${delta}px, 0)`);
		});
	});
};



$(document).ready(() => {
	console.log("test");
	$(".BackgroundImage").bgimage();

	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});


	// $(".owl-carousel").owlIt();

	// $(".-stick-in-parent").stickIt();
	// $(".-stick-in-parent").stick_in_parent();
})