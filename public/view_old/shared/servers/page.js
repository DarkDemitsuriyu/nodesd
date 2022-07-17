(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid();
	mainGrid.options.treeField='date';
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', hidden:true},
		{ title: 'Дата', field:'date'},
		{ title: 'Онование', field:'reason'},
		{ title: 'Код контрагента', field:'contractor', hidden:true},
		{ title: 'Контрагент', field:'contractorname'},
		{ title: 'Код подразделение', field:'department', hidden:true},
		{ title: 'Подразделение', field:'departmentname'},
		{ title: 'Выдал должность', field:'released_jobtitle', hidden:true},
		{ title: 'Выдал', field:'released_fio'},
		{ title: 'Получил должность', field:'received_jobtitle', hidden:true},
		{ title: 'Получил', field:'received_fio'},
		{ title: 'Количество(шт.)', field:'total_count'},
		{ title: 'Сумма(руб.)', field:'total_sum'}
	]];
	mainGrid.createGrid();
})();