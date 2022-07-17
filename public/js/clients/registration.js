$(function(){
	$.material.init();
	$('#cityphone').inputmask("+7(9{4,5})9{1,2}-99-99");
	$('#internalphone').inputmask("099-9999");
	$('#visible-password').click(function(){
		var type = $('#password').attr('type') == "text" ? "password" : 'text';
		var btn = $(this).html() == '<i class="mdi-action-visibility-off"></i>' ? '<i class="mdi-action-visibility"></i>' : '<i class="mdi-action-visibility-off"></i>';
		$(this).html(btn);
		$('#password').attr('type',type);
	})
	$('#submit').click(function(){
		var login=$('#login').val();
		if(login){
			$.ajax("/checkUser",{async:false,data:{login:login},success:function(error){
				if(error){
					$('#error-field').text('Пользователь с таким логином уже существует');
					$('#login').parent().addClass('bg-danger').focus();
					setTimeout(function() {
						$('#error-field').text('');
						$('#login').parent().removeClass('bg-danger', 2500)
					}, 2500 );
					$('#form-registration').submit(function(){return false;})
				}else{$('#form-registration').submit();}
			}
			});
		}
		
	});
});