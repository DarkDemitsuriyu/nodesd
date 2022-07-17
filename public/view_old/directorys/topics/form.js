(function (){
	var Form=new FormWindow();
	Form.title='Обязанность: '+formsObj.data.name;
	Form.titleNew='Добавление новой обязанности';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{options:{require:false},name:'orders',label:'Порядок',type:'text'},
		{name:'visibility',label:'Отображение',type:'switch'},
		{options:{require:false,multiple:true,singleSelect:false},name:'worker',label:'Сотрудник',type:'select',typedir:'directorys-users'},
		{name:'description',label:'Описание',type:'textarea'},
		{options:{require:false},name:'icon',label:'Значек',type:'textarea'}
	];
	Form.createWindow();
})();