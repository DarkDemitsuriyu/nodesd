$(document).ready(function(){
	var href = document.URL.substr(document.URL.lastIndexOf("/")+1);
	$("li.nav-item [href='"+(href === "tikets" ? "/" : href)+"']").parent().addClass("active");
	console.log($("li.nav-item [href='"+(href === "tikets" ? "/" : href)+"']"))
	var ua = detect.parse(navigator.userAgent);
	console.log('ua.browser.family',ua.browser.family+ua.browser.version)
	console.log('ua.browser.version',ua.browser.version)
	if(ua.browser.family === 'IE' && ua.browser.version*1<11){
		if (confirm("ВНИМАНИЕ! Ваш браузер устарел! Для того, чтобы отправить заявку на обновление версии браузера, нажмите кнопку 'ОК'")) {
			modalAll('Компьютер и другие устройства',1,'Прошу обновить браузер Internet Explorer до версии 11');
		}
	}
	$('#tiket-info-btn').click(function(){
		var tiketNumber=$('#tikets-info-input').val();
		$.post('/dataload',{id:tiketNumber,url:'tikets/getInfo'},function(data){
			console.log(data) 
			var mainModal=$('<div>').addClass('modal').attr({'id':'modal-tiket-info','tabindex':'-1','role':'dialog'});
			var modalDialog=$('<div>').addClass('modal-dialog');
			var modalContent=$('<div>').addClass('modal-content');
			var modalBody=$('<div>').addClass('modal-body').css({'padding':'0px'});
			var mainPanel=$('<div>').addClass('panel panel-primary').css({'margin':'0px'});
			var panelHeading=$('<div>').addClass('panel-heading clearfix');
			var panelTitle=$('<h2>').addClass('panel-title pull-left').attr({'id':'header-tikets-info'}).text('Информаци о заявке №'+tiketNumber);	
			var panelClose=$('<button>').addClass('pull-right close').attr({'type':'button','data-dismiss':'modal','aria-hidden':true}).text('×');
			var panelBody=$('<div>').addClass('panel-body');
			switch(data.length){
				case 0:
					panelBody.append($('<h2>').css('text-align','center').text('К сожалению, такой заявки не существует!'))
				break;
				case 1:
					data = data[0]
					var list=$('<dl>').addClass('dl-horizontal');
					var sender='<dt>Отправитель:</dt><dd>'+data.sendersurname+' '+data.sendername+' '+data.senderpatronymic+'</dd>';
					var topic='<dt>Тема:</dt><dd>'+data.topicname+'</dd>';
					var startDate='<dt>Дата подачи заявки:</dt><dd>'+data. startdate+'</dd>';
					var discription='<dt>Проблема:</dt><dd>'+data.description+'</dd>';
					var status='<dt>Статус заявки:</dt><dd class="text-success">'+data.tiketstatusname+' '+ (!!data.enddate ? data.enddate : '') +'</dd>';
					var worker='<dt>Исполнитель:</dt><dd class="text-primary">'+data.workerFullName+'</dd>';
					var email='<dt>E-Mail:</dt><dd class="text-primary">'+data.email+'</dd>';
					var cityphone='<dt>Городской номер телефона:</dt><dd class="text-primary">'+data.cityphone+'</dd>';
					var internalphone='<dt>Внутренний номер телефона:</dt><dd class="text-primary">'+data.internalphone+'</dd>';
					list.append(sender).append(topic).append(startDate).append(discription).append(status).append(worker).append(email).append(cityphone).append(internalphone);
					panelBody.append(list);
				break;
				default:
					var list=$('<dl>').addClass('dl-horizontal');
					var textPerf = $('<h5>').addClass('text-center text-danger').text('Исполнители:')
					var listWorkers=$('<dl>').addClass('dl-horizontal');
					data.forEach(function(el,idx){
						if(idx === 0){
							var sender='<dt>Отправитель:</dt><dd>'+el.sendersurname+' '+el.sendername+' '+el.senderpatronymic+'</dd>';
							var topic='<dt>Тема:</dt><dd>'+el.topicname+'</dd>';
							var startDate='<dt>Дата подачи заявки:</dt><dd>'+el. startdate+'</dd>';
							var discription='<dt>Проблема:</dt><dd>'+el.description+'</dd>';
							var status='<dt>Статус заявки:</dt><dd class="text-success">'+el.tiketstatusname+' '+ (!!el.enddate ? el.enddate : '') +'</dd>';
							list.append(sender).append(topic).append(startDate).append(discription).append(status)
						}
						var worker='<dt>'+ (idx*1+1) +'</dt><dd class="text-primary">'+el.workerFullName+'</dd>';
						var email='<dt>E-Mail:</dt><dd class="text-primary">'+el.email+'</dd>';
						var cityphone='<dt>Городской номер телефона:</dt><dd class="text-primary">'+el.cityphone+'</dd>';
						var internalphone='<dt>Внутренний номер телефона:</dt><dd class="text-primary">'+el.internalphone+'</dd>';
						listWorkers.append(worker).append(email).append(cityphone).append(internalphone);
					})
					panelBody.append(list).append(textPerf).append(listWorkers);
				break;
			}
			if(data.length>0){
				if(data.length === 1){
					
				} else {
					
				}
			} else {
				
			}
			panelHeading.append(panelTitle).append(panelClose);
			mainPanel.append(panelHeading).append(panelBody);
			modalBody.append(mainPanel);
			modalContent.append(modalBody);
			modalDialog.append(modalContent);
			mainModal.append(modalDialog);
			$('body').append(mainModal);
			mainModal.modal();			
		});
	});
	$('#send-tiket-to-co').click(function(){
		modalCO("Заявка в ЦО",0);
	})
	$('#send-tiket-taxi').click(function(){
		modalTaxi("Заявка на такси",0);
	})
});
var createModal=function(rows,url,name,id){
	var mainModal=$('<div>').addClass('modal').attr({'id':'modal-tiket','tabindex':'-1','role':'dialog'});
	var modalDialog=$('<div>').addClass('modal-dialog');
	var modalContent=$('<div>').addClass('modal-content');
	var modalHeader=$('<div>').addClass('modal-header bg-primary');
	var modalTitle=$('<h5>').addClass('modal-title text-white').attr({'id':'header-tikets'}).text(name);	
	var modalCloseSpan=$('<span>').attr({'aria-hidden':true}).text('×');//'×''&times;'
	var modalClose=$('<button>').addClass('close text-white').attr({'type':'button','data-dismiss':'modal','aria-label':"Close"}).append(modalCloseSpan)	
	var modalBody=$('<div>').addClass('modal-body');
	var modalFooter=$('<div>').addClass('modal-footer');
	var form=$('<form>').attr({'id':'tiket-form','method':'POST','enctype':'multipart/form-data'})
	var idTopic=$('<input>').attr({'type':'hidden','name':'topicid'}).val(id);
	var nameTopic=$('<input>').attr({'type':'hidden','name':'topicname'}).val(name);
	var panelFooter=$('<div>').addClass('card-footer clearfix');
	var btnSend=$('<button>').addClass('pull-right btn btn-primary').attr({'id':'send-tiket-btn','type':'button'}).text('Отправить заявку');
	form.append(idTopic).append(nameTopic)//'onclick':'sendTiket('+id+',"'+url+'")',
	for(var i=0;i<rows.length;i++){
		var rowData=rows[i];
		var row=$('<div>').addClass('row');
		if(!!rowData.css){row.css(rowData.css);}
		for(var j=0;j<rowData.fields.length;j++){row.append(rowData.fields[j])}
		form.append(row)
	}
	modalFooter.append(btnSend);
	modalBody.append(form);
	modalHeader.append(modalTitle).append(modalClose)
	modalContent.append(modalHeader).append(modalBody).append(modalFooter);
	modalDialog.append(modalContent);
	mainModal.append(modalDialog);
	$('body').append(mainModal);
	mainModal.modal();
	mainModal.on('hidden.bs.modal', function (e) {$(e.currentTarget).remove();})
	btnSend.click(function(){
		sendTiket(id,url)
	})
};
var createField=function(dataField){
	var required=dataField.required || false;
	var otherfield=dataField.otherfield;
	var selectData=dataField.selectData;
	var type=dataField.type || 'text';
	var name=dataField.name;
	var field=dataField.field;
	var label=$('<label>').attr('for',field).css('left','25px').text(name);
	var input=$('<div>').css('margin-top','10px').addClass('form-group');	
	if(type!=='select'){
		switch(field){
			case 'datetime':
				input.addClass(dataField.cls || 'col-md-6').append($('<input>').addClass('form-control floating-label').attr({'id':field,'type':'text','name':field,'required':required,'data-field':"datetime",readonly:true})); break;
			case 'note':
			case 'description': input.addClass('col-md-12').append($('<textarea>').css('height','70px').addClass('form-control').attr({'id':field,'type':type,'name':field,'required':required}).val(dataField.text)); break;
			case 'attachment': 
				//input.find('label').remove()
				input.addClass('col-md-6').append($('<input>').addClass('form-control').attr({'id':field,'type':type,'name':field})); break;
			case 'dateaccess': input.addClass('col-md-6').append($('<input>').addClass('form-control').attr({'id':field,'type':type,'name':field})); break;
			case 'sendermail':
			case 'mail':
				var data=$.map(users,function(elem){return elem.sendermail;});
				var ipt=$('<input>').addClass('form-control').attr({'autocomplete':'off','id':field,'type':type,'name':field,'required':required,'data-provide':"typeahead"}).typeahead({source:data}).change(function() {getData(ipt.typeahead("getActive"));});
				 /*ipt.bind('paste', function(e) {
					//alert('Вставили текст.');
				});*/
				input.addClass(dataField.cls || 'col-md-6').append(ipt)
			break;
			default: 
				var colength=dataField.cls || 'col-md-6';
				if(otherfield){colength='col-md-12';}
				if(field==='insteadof'){colength='col-md-12';}
				input.addClass(colength).append($('<input>').addClass('form-control floating-label').attr({'id':field,'type':type,'name':field,'required':required}));
			break;
		}
		if(field !== 'attachment'){
			input.append(label)
		}		
		
	} 
	else {
		var select=$('<select>').addClass('chosen-select').attr({'data-live-search':true,'id':field,'name':field,'placeholder':'','required':required});

		input.removeClass('form-group').addClass('col-md-6').append(select);
		
		select.append($('<option>').val('').append($("<p>").text('Выберите '+name)).attr({'selected':true}));
		console.log(selectData);
		
		
		$.each(selectData,function(index,item){
			select.append($('<option>').val(item.id).text(item.name));
		});
		select.selectpicker()
	}
	if(dataField.help){
		var helpGield=$('<span>').addClass('hint').text(dataField.help)
		input.append(helpGield).focusin(function(){helpGield.show();}).focusout(function(){helpGield.hide();});
	}
	$("#dtBox").DateTimePicker();
	return input;
}
var modalCO=function(name,id){
	console.log(3,name,id)
	var rows=[
		{fields:[
			createField({field:'mail',name:'Адрес электронной почты',type:'email',help:'Формат: xxx@tyumen.rgs.ru',required:true}),
			createField({field:'title',name:'Тема',type:'text',help:false,required:true})			
		]},
		{fields:[
			createField({field:'attachment',name:'Скриншот',type:'file',help:'Сюда вы можете прикрепить скриншот ошибки',required:false})
		]},
		{fields:[
			createField({field:'description',name:'Описание проблемы',type:'text',help:'Чем подробнее будет описана проблема, тем бысрее и точнее будет выполнена ваша заявка.',required:true})
		]}
	];
	createModal(rows,'/sendtiketCO',name,id)
};
var modalTaxi=function(name,id){
	var rows=[
		{fields:[
			createField({field:'mail',name:'Адрес электронной почты',type:'email',help:'Формат: xxx@tyumen.rgs.ru',required:true}),
			createField({field:'phone',name:'Контактный номер телефона',type:'tel',required:true})
		]},
		{fields:[
			createField({field:'sendersurname',cls:'col-md-4',name:'Фамилия',required:true}),
			createField({field:'sendername',cls:'col-md-4',name:'Имя',required:true}),
			createField({field:'senderpatronymic',cls:'col-md-4',name:'Отчество',required:true})
		]},
		{fields:[
			createField({field:'datetime',cls:'col-md-12',type:'date',name:'Дата отправления',required:true})
		]},
		{fields:[
			createField({field:'depaddresses_1',name:'Адрес отправления',required:true}),
			createField({field:'arrivaladdresses_1',name:'Адрес прибытия',required:true})
		]},
		{fields:[
			createField({field:'depaddresses_2',name:'Адрес отправления(доп.)',help:'Если есть',required:false}),
			createField({field:'arrivaladdresses_2',name:'Адрес прибытия(доп.)',help:'Если есть',required:false})
		]},
		{fields:[
			createField({field:'depaddresses_3',name:'Адрес отправления(доп. 2)',help:'Если есть',required:false}),
			createField({field:'arrivaladdresses_3',name:'Адрес прибытия(доп. 2)',help:'Если есть',required:false})
		]}
	];
	createModal(rows,'/sendtikettaxi',name,id)
};
var sendTiket=function (id,url){
	var prog=0;
	var progInt;
	var modal=$('#modal-tiket');
	console.log(id,url)
	$('#tiket-form').form('submit',{
		url:url,
		onSubmit:function(params){
			var bValid=true;
			$('[required]').each(function(indx, element){
				//console.log(element,checkLength($(element)))
				bValid=bValid && checkLength($(element));
				console.log('bValid',$(element),bValid,checkLength($(element)))
				if($(element).attr('name')==='other'){bValid=bValid && checkOther(id,$(element));}
				
			});
			console.log(111)
			if($('#insteadof').length>0){bValid=bValid && checkInsteadOf($('#insteadof'));}
			console.log($('#insteadof').val())
			console.log(checkInsteadOf($('#insteadof')))
			console.log(bValid)
			console.log(112)
			if(bValid){
				console.log(13)
				modal.find('.modal-footer').remove();
				modal.find('.modal-body #tiket-form').css('display','none');
				modal.find('.modal-body').append('<h1 class="text-center">Отправка!</h1><h3 class="text-center">Дождитесь номера вашей заявки...</h3><div class="progress progress-striped active"><div class="progress-bar" style="width: 0%"></div></div>');
				console.log(114)
				progInt=setInterval(function(){$("#modal-tiket .modal-body .progress-bar").width((prog++)+'%');}, 100);
			}else{return false;}
			console.log(115)
		},
		success:function(data){
			console.log(data)
			var msg;
			switch(data){
				case "CO":
					msg='<div><h2 class="text-center text-danger">Ваша заявка отпарвлена в ЦО</h2><h3 class="text-center">Подтверждение придет к вам на электронную почту</h3></div>';
				break;
				case "taxi":
					msg='<div><h2 class="text-center text-danger">Ваша заявка отпарвлена</h2></div>';
				break;
				default:
					data=$.parseJSON(data);
					msg='<div><h3 class="text-center">Ваша заявка зарегистрирована под номером</h3><h2 class="text-center text-danger">'+data.id+'</h2></div><div class="panel panel-success"><div class="panel-heading"><h4>Об исполнителе(ях)</h4></div><div class="panel-body">';
					if(!!data.workers){
						$.each(data.workers,function(index,element){
							msg+='<dl class="dl-horizontal"><dt>Номер:</dt><dd>'+(index+1)+'</dd><dt>ФИО:</dt><dd>'+element.surname+' '+element.name+' '+element.patronymic+'</dd><dt>E-mail:</dt><dd>'+element.email+'</dd><dt>Телефон гор.:</dt><dd>'+element.cityphone+'</dd><dt>Внутренний номер телефона:</dt><dd>'+element.internalphone+'</dd></dl>';
						});
						msg+='</div>';
					} else {
						msg+='<dl class="dl-horizontal"><dt>ФИО:</dt><dd>'+data.surname+' '+data.name+' '+data.patronymic+'</dd><dt>E-mail:</dt><dd>'+data.email+'</dd><dt>Телефон гор.:</dt><dd>'+data.cityphone+'</dd><dt>Внутренний номер телефона:</dt><dd>'+data.internalphone+'</dd></dl></div>';
					}
					msg+='<div class="panel-footer"><h4 class="text-center">Подробное сообщение отправленно вам на электронную почту!</h4></div></div>';
					if(id===000){msg='';}
				break;
			}
			modal.find('.modal-body').html(msg);
			clearInterval(progInt);
			$("#modal-tiket .modal-body .progress-bar").width('100%');
		}
	});
};
