(function (){
	var Form=new FormWindow();
	Form.title='Должность: '+formsObj.data.name;
	Form.titleNew='Создание новой должности';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'}
	];
	Form.createWindow();
})();