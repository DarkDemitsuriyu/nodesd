(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid();
	mainGrid.options.treeField='name';
	mainGrid.options.columns=[[
		{ title: 'Наименование', field: 'name', width:'22%'},
		{ title: 'Ссылка', field: 'link', width:'23%'},
		{ title: 'Порядок', field: 'orders', width:'22%'},
		{ title: 'Код основного меню', field:'mainmenu', hidden:true}
	]];
	mainGrid.createGrid();
})();