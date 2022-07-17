(function () {
	var mainGrid=new MainGrid();
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'10%'},
		{ title: 'Наименование', field: 'name', width:'79%'},
		{ title: 'Заблокировано', field:'const', width:'10%', formatter: function(value,row,index){
			if (value){
				return 'Да';
			} else {
				return 'Нет';
			}
		}}
	]];
	mainGrid.options.onDblClickRow=function (index,row){			
		if(row.const){
			$.messager.alert('Внимание!','Данный пункт нельзя редактировать!','warning');
		}else{
			row.type='edit';
			row.target={trg:mainGrid.tblgrid};
			if(mainGrid.window==='window'){selectVal(mainGrid.toolbarsetts)}
			else{formsLoad(mainGrid.type,row);}
		}		
	};
	mainGrid.createGrid();
})();