(function (){
	var Form=new FormWindow();
	Form.title='Группа: '+formsObj.data.name;
	Form.titleNew='Добавление новой группы доступа';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'}
	];
	Form.createWindow();
})();