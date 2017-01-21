$(() => {
	$('.js-insert').click((e) => {
		e.preventDefault();

		console.log('inserting')

		Mixmax.done({
			text: $('#email-text').val()
		});
	});
})