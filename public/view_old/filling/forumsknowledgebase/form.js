(function (){
	var Form=new FormWindow();
	Form.options.title='Раздел'+formsObj.data.name;
	Form.titleNew='Добавление раздела Базы Знаний';
	Form.fields=[
		{options:{require:false},name:'orders',label:'Порядок',type:'text'},
		{name:'name',label:'Наименование',type:'text'}		
	];
	Form.createWindow();
})();