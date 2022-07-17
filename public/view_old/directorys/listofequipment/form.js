(function (){
	FormWindowListEquip.prototype=new FormWindow();
	var Form=new FormWindowListEquip();
	Form.title=Form.titleNew='Список техники';
	Form.fields=[
		{name:'name',label:'Наименование',type:'text'},
		{options:{readonly:true},name:'_parentId',label:'Выбранный раздел',type:'select',typedir:'directorys-listofequipment'},
		{name:'isItem',label:'Предмет',type:'switch'}
	];
	console.log(centerPageObj.type)
	Form.createWindow();
})();