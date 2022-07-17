(function (){
	var Form=new FormWindow();
	Form.title='Меню: '+formsObj.data.name;
	Form.titleNew='Добавление нового основного меню';
	Form.fields=[
		{options:{require:false},name:'orders',label:'Порядок',type:'text'},
		{name:'name',label:'Наименование',type:'text'},
		{name:'nameeng',label:'Ссылка',type:'text'}
	];
	Form.createWindow();
})();