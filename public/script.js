$(() => {
	$('.js-insert').click((e) => {
		e.preventDefault();

		console.log('inserting',$('#email-text').val())
		debugger

		Mixmax.done({
			text: $('#email-text').val()
		});
	});
})
