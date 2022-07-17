(function (){
	var Form=new FormWindow();
	Form.title='Раздел: '+formsObj.data.name;
	Form.titleNew='Добавление нового раздела меню';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{name:'link',label:'Ссылка',type:'text'},
		{options:{require:false},name:'orders',label:'Порядок',type:'text'},
		{name:'mainmenu',label:'Основное меню',type:'select',typedir:'directorys-mainmenu'}
	];
	Form.createWindow();
})();