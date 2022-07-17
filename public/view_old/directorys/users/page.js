(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Логин', field: 'id', hidden:true},
		{ title: 'Фамилия', field: 'surname', width:'8%'},
		{ title: 'Имя', field: 'name', width:'9%'},
		{ title: 'Отчество', field: 'patronymic', width:'9%'},
		{ title: 'Городской тел.', field: 'cityphone', width:'9%'},
		{ title: 'Внутренний тел.', field: 'internalphone', width:'9%'},
		{ title: 'E-Mail', field: 'email', width:'16%'},
		{ title: 'Jabber', field: 'jabber', width:'5%'},
		{ title: 'Код статуса', field: 'status', hidden:true},
		{ title: 'Статус', field: 'statusname', width:'9%'},
		{ title: 'Код подразделения', field: 'department', hidden:true},
		{ title: 'Подразделение', field: 'departmentname', width:'10%'},
		{ title: 'Код отдела', field: 'division', hidden:true},
		{ title: 'Отдел', field: 'divisionname', width:'15%'}
	]];
	for(var i=0;i<mainGrid.options.toolbar.length;i++){
		switch(mainGrid.options.toolbar[i].iconCls){
			case 'icon-add-circle':
			case 'icon-content-copy':
			case 'icon-remove-circle':
				mainGrid.options.toolbar[i].disabled=true;
			break;
		}
	}
	mainGrid.options.rowStyler=function(index,row){
		if (row.status===2){
			return 'background-color:#6293BB;color:#fff;'; // return inline style
			// the function can return predefined css class and inline style
			// return {class:'r1', style:{'color:#fff'}};	
		}
		if (row.status===3){
			return 'background-color:red;color:#fff;'; // return inline style
			// the function can return predefined css class and inline style
			// return {class:'r1', style:{'color:#fff'}};	
		}
	};
	mainGrid.createGrid();
})();






