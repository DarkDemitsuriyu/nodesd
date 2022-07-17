(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'9%'},
		{ title: 'Наименование', field: 'name', width:'25%'},
		{ title: 'Адреса', field: 'address', width:'45%'},
		{ title: 'Подсеть', field:'ip', width:'20%'}		
	]];
	mainGrid.createGrid();
})();