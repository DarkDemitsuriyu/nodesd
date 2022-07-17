(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Логин', field:'worker', hidden:true},
		{ title: 'Сотрудник', field: 'workername', width:'45%'},
		{ title: 'Код группы', field:'group', hidden:true},
		{ title: 'Группы', field: 'groupname', width:'45%'}
	]];
	mainGrid.createGrid();
})();