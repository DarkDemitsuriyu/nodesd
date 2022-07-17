(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Расположение сотрудника в группе';
	Form.fields=[
		{name:'worker',label:'Сотрудник',type:'select',typedir:'directorys-users'},
		{name:'group',label:'Группа',type:'select',typedir:'directorys-accessgroups'}
	];
	Form.createWindow();
})();