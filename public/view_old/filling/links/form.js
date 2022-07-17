;(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Назначение обязанности сотруднику';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{name:'link',label:'Ссылка',type:'text'},
		{name:'screen-img',label:'Скриншот',type:'img',path:'/images/linksScreens/',src:formsObj.data.screen},
		{name:'screen',type:'hidden'}
	];
	Form.createWindow();
})();