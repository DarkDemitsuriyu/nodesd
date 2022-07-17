(function () {
	TreeMainGrid.prototype=new MainGrid();
	var mainGrid=new TreeMainGrid(true);
	mainGrid.options.treeField='name';
	mainGrid.options.columns=[[
		{ title: 'Код', field: 'id', width:'50', hidden:true},
		{ title: 'Наименование', field:'name', width:'300'},
		{ title: 'Содержит', field:'count', width:''},
		{ title: 'Оборудование ли', field:'isItem', hidden:true}
	]];
	mainGrid.options.onLoadSuccess=function(row){$(this).treegrid('enableDnd', row?row.id:null);};
	mainGrid.options.onDrop=function(targetRow,sourceRow,point){
		if(!targetRow.isItem){
			if(sourceRow._parentId){
				targetRow.count=targetRow.children.length;
				mainGrid.tblgrid.treegrid('update',{id:targetRow.id,row:targetRow});	
			}
			if(mainGrid.forDrop.oldParent!==sourceRow._parentId){
				var row=mainGrid.forDrop.oldRow;
				if(row){
					if(row.children){
						if(row.children.length){row.count=row.children.length;}
						else{row.count="";}
					}
					mainGrid.tblgrid.treegrid('update',{id:row.id,row:row});
				}
				sourceRow.type='edit';
				sourceRow.url=mainGrid.type.replace('-','/');
				socket.emit('form-update',sourceRow);
			}
		}
		else{
			return false;
		}
	};
	mainGrid.options.onBeforeDrop=function(targetRow,sourceRow,point){
		mainGrid.forDrop={oldParent:sourceRow._parentId,oldRow:mainGrid.tblgrid.treegrid('find',sourceRow._parentId)};
	};
	mainGrid.createGrid();
})();