(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Доcтуп группы в меню';
	Form.fields=[
		{name:'group',label:'Группа',type:'select',typedir:'directorys-accessgroups'},
		{name:'menu',label:'Меню',type:'select',typedir:'directorys-secondarymenu'}
	];
	Form.createWindow();
})();