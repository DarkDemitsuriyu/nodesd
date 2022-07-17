(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid();
	mainGrid.options.treeField='fio';
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', hidden:true},
		{ title: 'ФИО', field:'fio'},
		{ title: 'Логин', field:'login'},
		{ title: 'Код отдела', field:'division', hidden:true},
		{ title: 'Пароль', field:'password'},
		{ title: 'Код подразделение', field:'depatment', hidden:true},
		{ title: 'Логин почты', field:'loginMail'},
		{ title: 'Пароль почты', field:'passwordMail'},
		{ title: 'Логин Jabber', field:'jabber'},
		{ title: 'Пароль Jabber', field:'passwordJabber'},
		{ title: 'Комментарий', field:'note'}
	]];
	mainGrid.createGrid();
})();