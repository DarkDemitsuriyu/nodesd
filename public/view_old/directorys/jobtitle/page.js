(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Наименование', field: 'name', width:'90%'}
	]];
	mainGrid.createGrid();
})();