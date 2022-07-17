(function () {
	TiketsGrid.prototype=new MainGrid();
	var mainGrid=new TiketsGrid();
	/*mainGrid.filter.status={
	/	field:'iconstatus',
		type:'combobox',
		options:{
			panelHeight:'auto',
			panelWidth:'auto',
			data:[
				{value:'',text:'Все1'},
				{value:1,text:'Выполненые'},
				{value:2,text:'Отказанные'},
				{value:3,text:'На выполнении'},
				{value:4,text:'На подтверждении'},
				{value:5,text:'Отсрочка'},
				{value:6,text:'Просроченные'},
				{value:7,text:'На подтверждении:Выполнено'},
				{value:8,text:'На подтверждении:Отказано'}
			],
			onChange:function(value){
				mainGrid.tblgrid.datagrid('removeFilterRule', 'statusconfirm');
				mainGrid.tblgrid.datagrid('removeFilterRule', 'deadline');
				switch(value){
					case '': mainGrid.tblgrid.datagrid('removeFilterRule', 'status'); break;
					case 3:
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'status',op: 'greaterorequal',value: 3});
					break;
					case 5:
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'status',op: 'equal',value: 4});
						mainGrid.tblgrid.datagrid('addFilterRule', {field: 'statusconfirm',op: 'equal',value: 5});
					break;
					case 6: 
						mainGrid.tblgrid.datagrid('addFilterRule', {field: 'status',op: 'equal',value: 3});
						mainGrid.tblgrid.datagrid('addFilterRule', {field: 'deadline',op: 'lessorequal',value: new Date()});//moment().format('DD.MM.YYYY HH:mm:ss')
					break;
					case 7: 
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'status',op: 'equal',value: 4});
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'statusconfirm',op: 'equal',value: 1})
					break;
					case 8: 
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'status',op: 'equal',value: 4})
						mainGrid.tblgrid.datagrid('addFilterRule',{field: 'statusconfirm',op: 'equal',value: 2})
					break;
					default: mainGrid.tblgrid.datagrid('addFilterRule', {field: 'status',op: 'equal',value: value}); break;
				}
				mainGrid.tblgrid.datagrid('doFilter');
			}
		}
	};*/	
	mainGrid.options.columns[0][5].hidden=false;
	mainGrid.options.columns[0].splice(5, 0,
		{title: 'Исполнитель', field: 'workerfio', width:150 },
		{title: 'Отправитель', field: 'sender', width:150 },
		{title: 'Подразделение', field: 'department',width:100},
		{title: 'Дата заявки', field:'startdate',width:120,formatter: function(value){return moment(value).format('DD.MM.YYYY HH:mm:ss');}});
	mainGrid.createGrid();
})();