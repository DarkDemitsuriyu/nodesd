(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{title: 'Код', field: 'id', width:'9%'},
		{title: 'Обязанность', field: 'name', width:'45%'},
		{title: 'Код связанной обязанности', field:'topic', hidden:true},
		{title: 'Связанная обязанность', field:'topicname', width:'45%'}
	]];
	mainGrid.createGrid();
})();