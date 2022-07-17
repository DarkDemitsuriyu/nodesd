(function (){
	FormTiketCreate.prototype=new FormWindow();
	var Form=new FormTiketCreate();
	var user=JSON.parse(localStorage.getItem('user'));
	console.log(user)
	Form.options.title=Form.options.titleNew='Создание заявки';	
	Form.fields=[
		{require:true,name:'division',label:'Отдел',type:'select',typedir:'directorys-divisions'},
		{require:true,name:'worker',label:'Исполнитель',type:'select',typedir:'directorys-workers'},
		{require:true,name:'deadline',label:'Выполнить до',type:'date'},
		{require:true,name:'topicname',label:'Тема',type:'text'},		
		{require:true,name:'description',label:'Описание',type:'textarea',width:250},
		{name:'senderpatronymic',type:'hidden'},
		{name:'sendersurname',type:'hidden'},
		{name:'sendername',type:'hidden'},
		{name:'sendermail',type:'hidden'},
		{name:'senderphone',type:'hidden'},
		{name:'department',type:'hidden'}		
	];
	Form.createWindow();
})();