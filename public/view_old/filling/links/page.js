(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Наименование', field: 'name', width:'25%'},
		{ title: 'Ссылка', field: 'link', width:'35%'},
		{ title: 'Скриншот', field:'screen', width:'30%'}
	]];
	mainGrid.createGrid();
})();