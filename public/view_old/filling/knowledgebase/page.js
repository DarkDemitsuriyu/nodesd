(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid();
	mainGrid.options.treeField='name';
	mainGrid.options.columns=[[
		{ title: 'Наименование', field:'name', width:'50%'},
		{ title: 'Код раздела', field:'forum', hidden:true},
		{ title: 'Файл', field: 'file', width:'49%'}
	]];
	mainGrid.options.toolbar.unshift({iconCls:'icon-add-circle',text:'Добавить раздел',handler: function(){formsLoad('filling-forumsknowledgebase',{type:'new',target:mainGrid.tblgrid});}});
	mainGrid.options.toolbar[2].handler=function(){
		var data=mainGrid.tblgrid.datagrid('getSelected');
		if(data){
			data.target=mainGrid.tblgrid;
			data.type='new';
			if(!data._parentId){
				formsLoad('filling-forumsknowledgebase',data);
			} else {formsLoad(mainGrid.type,data);}
		}else{goMessage('Строка не выбрана.')}
	};
	mainGrid.options.toolbar[3].handler=function(){
		var data=mainGrid.tblgrid.datagrid('getSelected');
		if(data){
			data.target=mainGrid.tblgrid;
			data.type='edit';
			if(!data._parentId){
				formsLoad('filling-forumsknowledgebase',data);
			} else {formsLoad(mainGrid.type,data);}
		}else{goMessage('Строка не выбрана.')}
	};
	/*mainGrid.options.toolbar[4].handler=function(){
		var data=mainGrid.tblgrid.datagrid('getSelected');
		if(data){
			data.target=mainGrid.tblgrid;
			data.type='edit';
			if(!data._parentId){
				formsLoad('filling-forumsknowledgebase',data);
			} else {formsLoad(mainGrid.type,data);}
		}else{goMessage('Строка не выбрана.')}
	};*/
	mainGrid.createGrid();
})();
		if(data){
				$.messager.confirm('Подтверждение удаления', 'Вы уверены что хотите удалить выделенную запись?', function(r){
					if (r){
						sendDataDelete({type:'delete',id:data.id,url:obj.type.replace('-','/')});
					}
				});
			}else{goMessage('Строка не выбрана.')}