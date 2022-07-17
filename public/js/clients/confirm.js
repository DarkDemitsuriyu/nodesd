$(document).ready(function(){
	$('#confirm-false-form').submit(function(){		
		var comment=$("#comment");
		var hint=comment.parent().find(".hint")
		if(comment.val().length < 1 ){
			comment.parent().addClass('has-error');
			hint.text("Вы не заполнили комментарий!")
			comment.focus();
			setTimeout(function() {
				hint.text('');
				comment.parent().removeClass('has-error', 2500);
			}, 2500 );
			return false
		} else {
			return true;
		}
	});
});