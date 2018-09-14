(function($) {
	var i = 1;
	$(window).on(
		'load',
		setTimeout(function timer() {
			$preloader = $('.loader');
			$loader = $preloader.find('.loader__percent');
			if (i < 101 && document.readyState !== 'complete') {
				$loader.text(i);
				i++;
				setTimeout(timer, 10);
			} else {
				$loader.fadeOut();
				$preloader.delay(350).fadeOut('slow');
			}
		}, 10)
	);
})(jQuery);
