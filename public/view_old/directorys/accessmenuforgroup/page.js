(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid();
	mainGrid.options.treeField='name';
	mainGrid.options.columns=[[
		{ title: 'Код группы', field:'group', hidden:true},
		{ title: 'Код меню', field:'menu', hidden:true},
		{ title: 'Наименование', field: 'name', width:'99%'}
	]];
	mainGrid.createGrid();
})();