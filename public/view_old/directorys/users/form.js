(function (){
	var Form=new FormWindow();
	Form.title='Сотрудник: '+formsObj.data.surname+' '+formsObj.data.name+' '+formsObj.data.patronymic;
	Form.titleNew='Назначение обязанности сотруднику';
	Form.fields=[
		{name:'status',label:'Статус',type:'select'},
		{name:'surname',label:'Фамилия',type:'text'},
		{name:'name',label:'Имя',type:'text'},
		{name:'patronymic',label:'Отчество',type:'text'},
		{name:'cityphone',label:'Городской тел.',type:'text'},
		{name:'internalphone',label:'Внутренний тел.',type:'text'},
		{name:'email',label:'E-Mail',type:'text'},
		{name:'jabber',label:'Jabber',type:'text'},
		{name:'departmentname',label:'Подразделение',type:'text'},
		{name:'divisionname',label:'Отдел',type:'text'},
		{name:'department',type:'hidden'},
		{name:'division',type:'hidden'}
	];
	Form.createWindow();
})();