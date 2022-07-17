(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Назначение обязанности сотруднику';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{options:{height:44},name:'address',label:'Адрес',type:'textarea'},
		{name:'ip',label:'Подсеть',type:'text'}
	];
	Form.createWindow();
})();