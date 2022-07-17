(function (){
	var Form=new FormWindow();
	Form.titleNew='Создание новой обязанности';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{name:'topic',label:'Связано с',type:'select',typedir:'directorys-topics'}
	];
	Form.createWindow();
})();