(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Назначение обязанности сотруднику';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{name:'inn',label:'ИНН',type:'text'}
	];
	Form.createWindow();
})();