(function (){
	var Form=new FormWindow({'enctype':'multipart/form-data'});
	Form.options.title='Документ:'+formsObj.data.name;
	Form.titleNew='Добавление документа в Базу знаний';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{name:'file',label:'Файл',type:'file',dataType:'knowledgeBase',title:formsObj.data.name},
		{name:'forum',label:'Раздел',type:'select'}
	];
	Form.createWindow();
})();