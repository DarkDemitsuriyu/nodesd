$(document).ready(function(){
	var prog=0;
	var progInt;
	var form=$('#login-form');
	var textbtn=$('button',form).text();
	$('input',form).val('');
	form.form({
		url:"/login",
		onSubmit:function(params){
			$('button',form).text('');
			progInt=setInterval(function(){
				if(prog===3){
					prog=0;
					$('button',form).text('');
				} else {
					prog++;
					$('button',form).append('.');
				}
			}, 100);
		},
		success:function(data){
			clearInterval(progInt);
			data=JSON.parse(data);
			if(data.status){window.location.href='/workers?t='+Math.random();}
			else {
				var input=$('#'+data.field)
				var hint=input.parent().find('.hint');
				input.focus()
				hint.text(data.msg);
				input.parent().addClass('has-error');
				setTimeout(function(){
					hint.text('');
					input.parent().removeClass('has-error', 2500);
				}, 2000)
			}
			$('button',form).text(textbtn)
		}
	});
});