(function (){
	var Form=new FormWindow();
	Form.title='Отдел: '+formsObj.data.name;
	Form.titleNew='Создание нового отдела';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'}
	];
	Form.createWindow();
})();