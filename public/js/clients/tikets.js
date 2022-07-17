var getData=function(sendermail){
	var setVal=function(elem){
		var isNew=$('#sendermail').parent().parent().parent().find('h4');
		$('#senderphone').val(elem.senderphone).focus();
		if(isNew.length===0){
			$('#sendername').val(elem.sendername).focus();
			$('#senderpatronymic').val(elem.senderpatronymic).focus();
			$('#sendersurname').val(elem.sendersurname).focus();
		}
	}
	$.each(users,function(idx,elem){
		if(elem.sendermail===sendermail){
			setVal(elem)
		}
	})
};
var checkLength=function(element){
	console.log(element)
	if (element.val().length < 1 ) {
		if(element.hasClass('selectpicker')){
			console.log(element)
			element.parent().find("button").addClass('btn-danger');
			element.selectpicker('toggle')
			setTimeout(function() {
				element.parent().find("button").removeClass('btn-danger', 2500);
			}, 2500 );
		} else {
			element.parent().addClass('has-error');
			element.focus();
			setTimeout(function() {
				element.parent().removeClass('has-error', 2500);
			}, 2500 );
		}
		
		return false;
	} else {return true;}
};
var checkInsteadOf=function(element){
	var value=element.val()
	if(value && value.split(' ').length<3){
		element.parent().addClass('has-error');
		element.focus();
		setTimeout(function() {
			element.parent().removeClass('has-error', 2500);
		}, 2500 );
		return false;
	} else {return true;}
}
var checkOther=function(id,element){
	console.log(id)
	if(id===6){
		
	}
	if (element.val().length < 1 ) {
		element.parent().addClass('bg-danger');
		setTimeout(function() {
			element.parent().removeClass('bg-danger', 2500);
		}, 2500 );
		return false;
	} else {return true;}
	
	
};
var openTiketForm=function(name,id){
	console.log(name,id)
	switch(name){
		case 'Новый сотрудник': modalNewWorker(name,id); break;
		default:
			if(id===16){
				if (confirm("Если вы уверены что ваша проблема не связана с Компьютером, Програмным обеспечением на нем или оргтехникой, нажмите кнопку ОК. В противном случае пишите заявку в соответствующую тему(скорее всего в компьютер и другие устройства).")) {
					modalAll(name,id);
				}
			} else {
				modalAll(name,id);
			}
		break;
	}
};
var modalNewWorker=function(name,id){
	console.log(1,name,id)
	$.get('getForNewWorkerDropdawn?t='+Math.random(),function(data){
		var listOfDepartments=data[0];
		var listOfDivisions=data[1];
		var listOfJobtitles=data[2];
		var infoPanel=$('<div>').css({margin:'5px',height:'100%','position':'absolute','z-index':9999}).addClass('alert alert-warning').html('<h2>Внимание!</h2><p>При выполнении данной заявки по умолчанию проивзодятся следующие действия: <ul><li>Настраивается компьютер(в частности переименовывается в сети)</li><li>Настраивается электронная почта</li><li>Настраивается внутренняя ICQ</li><li>Настраивается запись в системе интранет и высылается логин и пароль от неё</li><li>Настраивается телефонный аппарат(не всегда)</li></ul></p><p>Доступ к следующим программа и ресурсам производиться по специальным заявкам через Центральный Офис:<ul><li>ARM3</li><li>Navision</li><li>Контрактс</li><li>ГУРУ</li><li>FTP-Сервер</li></ul>Бланки заявок для этих ресурсов можете взять на данном портале в разделе <a href="knowledgebase">"База знаний"</a></p>');
		var closeInfoPanelBtnX=$('<button>').addClass('close').attr({'type':'button','aria-label':"Close",'aria-hidden':true}).text('×').click(function(){infoPanel.remove();});
		var closeInfoPanelBtn=$('<a>').addClass('btn btn-primary btn-lg').text('Закрыть информационное окно').click(function(){infoPanel.remove();})
		var senderHeader=$('<h4>').addClass('text-primary text-center').text('Введите данные отправителя заявки(Свои).');
		var newWorkerHeader=$('<h4>').addClass('text-primary text-center').text('Введите данные нового сотрудника.');		
		infoPanel.prepend($('<p>').addClass('text-center').append(closeInfoPanelBtn).append(closeInfoPanelBtnX));
		var rows=[
			{fields:[infoPanel]},
			{fields:[senderHeader]},
			{fields:[
				createField({field:'sendermail',name:'Контактный E-Mail',type:'email',help:'Указываеся в формате xxx@tyumen.rgs.ru',required:true}),
				createField({field:'senderphone',name:'Контактный номер телефона',type:'tel',help:'Укажите ваш внутренний номер телефона',required:true})
			]},
			{fields:[newWorkerHeader]},
			{fields:[
				createField({field:'sendersurname',name:'Фамилия',type:'text',help:false,required:true}),
				createField({field:'department',name:'Подразделение',type:'select',help:false,required:true,selectData:listOfDepartments})
			]},
			{fields:[
				createField({field:'sendername',name:'Имя',type:'text',help:false,required:true}),
				createField({field:'division',name:'Отдел',type:'select',help:false,required:true,selectData:listOfDivisions})
			]},
			{fields:[
				createField({field:'senderpatronymic',name:'Отчество',type:'text',help:false,required:true}),
				createField({field:'jobtitle',name:'Должность',type:'select',help:false,required:true,selectData:listOfJobtitles})
			]},
			{fields:[
				createField({field:'cityphone',name:'Городской номе телефона',type:'text',help:'Укажите желаемый городской номер номер телефона нового сотрудника',required:true}),
				createField({field:'internalphone',name:'Внутренний номе телефона',type:'text',help:'Укажите желаемый внутренний номер номер телефона нового сотрудника',required:true})
			]},
			{fields:[
				/*createField({field:'senderip',name:'IP адрес(кроме дирекции)',type:'text',help:'IP адрес компьютера за которым будет сидеть новый сотрудник',required:true}),*/
				createField({field:'insteadof',name:'Вместо',type:'text',help:'Заполните данное поле, если сотрудник не новая штатная единица(формат заполнения: Фамилия Имя Отчество)'})
			]},
			{fields:[
				createField({field:'note',name:'Примечания',type:'textarea',help:false,required:false})
			]}
		];
		createModal(rows,'/sendtiketNewWorker',name,id);
		$('#tiket-form').find('.row:eq(1)').addClass('bg-success');
		$('#tiket-form').find('.row:eq(2)').addClass('bg-success');
		$('#senderip').inputmask('10.72.9{1,2}.9{1,3}'); //третее число ограничено 2мя цифрами, так как нет пока 3х значных подсетей у нас
		$('#cityphone').inputmask('+7 (9{4}) 9{1,2}-99-99');
		$('#internalphone').inputmask('(072) 9999');
		//$('#insteadof').inputmask('*{0,999999}');
		$('#department').on('changed.bs.select', function (e,val) {
			if(val===17){
				$('#senderip').attr({'required':false});
			}
		});
	});
};
var modalAll=function(name,id,text){
	console.log(2,name,id)
	var rows=[
		{fields:[
			createField({field:'sendermail',name:'Адрес электронной почты',type:'email',help:'Формат: xxx@tyumen.rgs.ru',required:true}),
			createField({field:'sendersurname',name:'Фамилия',type:'text',help:false,required:true})
		]},
		{fields:[
			createField({field:'sendername',name:'Имя',type:'text',help:false,required:true}),
			createField({field:'senderpatronymic',name:'Отчество',type:'text',help:'Поле не обязательно для заполнения',required:false})
		]},
		{fields:[
			createField({field:'senderphone',name:'Контактный телефон',type:'tel',help:'Указывайте номер телефона FMC(Termit) или внутренний номер дирекции',required:true}),
			createField({field:'attachment',name:'Скриншот',type:'file',help:'Сюда вы можете прикрепить скриншот ошибки',required:false})
		]},
		{fields:[
			createField({field:'description',text:text || '',name:'Описание проблемы',type:'text',help:'Чем подробнее будет описана проблема, тем бысрее и точнее будет выполнена ваша заявка.',required:true})
		]}
	];
	createModal(rows,'/sendtiket',name,id)
};