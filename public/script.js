$(() => {
	$('.js-insert').click((e) => {
		e.preventDefault();

		Mixmax.done({
			text: $('#email-text').val()
		});
	});
})
