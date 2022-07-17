(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'25'},
		{ title: 'Наименование', field: 'name', width:'200'},
		{ title: 'Логин', field:'worker', hidden:true},
		{ title: 'Назначенные сотрудники', field: 'nameworker', width:'300',formatter:function(v,r,i){return '<div title="'+v+'" class="description easyui-tooltip">'+v+'</div>';}},
		{ title: 'Описание', field: 'description', width:'200',formatter:function(v,r,i){return '<div title="'+v+'" class="description easyui-tooltip">'+v+'</div>';}},
		{ title: 'Порядок', field: 'orders', width:'70'},
		{ title: 'Видно клиентам', field: 'visibility', width:'110',formatter:function(value,row,index){if (value){return 'Да';}else {return 'Нет';}}},
		{ title: 'Значек', field: 'icon', width:'31'}
	]];
	mainGrid.createGrid();
})();






