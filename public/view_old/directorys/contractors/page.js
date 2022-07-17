(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Наименование', field: 'name', width:'45%'},
		{ title: 'ИНН', field: 'inn', width:'45%'}
	]];
	mainGrid.createGrid();
})();