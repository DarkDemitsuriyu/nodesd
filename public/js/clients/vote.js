if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
$(document).ready(function(){
	$('.sender-vote').typeahead({source:users});
});
function handlerVoteBtn(id){
	$("#senderVoteForm-"+id).form('submit',{
		url:'vote',
		onSubmit:function(params){
			var bValid=false;
			var Error='';
			var sender_vote=$('#senderVote-'+id).val();
			var inArray=users.find(function(el,idx){return el.id===sender_vote.split("(", 1)[0];});
			if($('.vote-'+id+':checked').val()  && sender_vote && inArray){
				bValid=true;
			} else {
				if(!sender_vote){
					Error="Не заполнено поле 'E-mail'";
				} else if(!$('.vote-'+id+':checked').val()){
					Error="Не выбран пункт за который вы хотите отдать свой голос";
				} else if(!inArray){
					Error="Такого адреса электронной почты не существует";
				}
				alert(Error)
			}
			return bValid;
		},
		success:function(data){
			data=JSON.parse(data);
			if(data.status){
				$('.vote-'+id+':checked').closest(".panel.panel-default").find('.panel-footer').text('Отдано голосов - '+data.count);
				alert('Ваш голос принят!');				
			} else {
				alert('Вы уже голосовали!');
			}		
		}
	});	
}