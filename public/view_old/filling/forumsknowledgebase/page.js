(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Порядок', field: 'orders', width:'10%'},
		{ title: 'Наименование', field: 'name', width:'80%'}
	]];
	mainGrid.createGrid();
})();