(function($) {
	$(document).ready(function() {
		$('#go-to-menu').click(function() {
			$('.main').hide('fade', 200);
			$('.navigation')
				.delay(500)
				.hide('fade', 400);
			$('.menu')
				.delay(300)
				.show('drop', 300);
		});
		$('#back-to-home').click(function() {
			$('.menu').hide('drop', 300);
			$('.navigation')
				.delay(200)
				.show('fade', 400);
			$('.main')
				.delay(400)
				.show('fade', 300);
		});
		$('.component').on('click', '.button-book-room', function() {
			$componentRoom = $(this).parents('.component');
			$componentRoom.hide('fade', 200);
			$('.booking-workspace')
				.delay(300)
				.show('drop', 400);
			$('.bw-button-back').click(function() {
				$('.booking-workspace').hide('drop', 400);
				$componentRoom.delay(400).show('fade', 300);
			});
		});
		$('.previewResidentCard').click(function(event) {
			event.preventDefault();
			$componentResident = $(this).parents('.component');
			$('.resident-card').show('fade', 400);
			$('.rc-close').click(function() {
				$('.resident-card').hide('fade', 400);
				$componentResident.delay(400).show('fade', 300);
			});
		});
	});
})(jQuery);
