$(() => {
	$('.js-insert').click((e) => {
		e.preventDefault();

		Mixmax.done({
			text: $('#email-text').val()
		});
	});
})
		
		
var isMixmax = !!window.opener;
console.log(isMixmax);	
		if(!isMixmax) {

			$(".js-insert").hide();
		}