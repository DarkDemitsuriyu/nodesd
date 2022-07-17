(function (){
	var type=formsObj.type;
	var data=formsObj.data;
	var eqid;
	var dialog;
	var listeqip;
	var worker=JSON.parse(localStorage.getItem('user'));
	var formdata=$('<form>').attr({/*'id':'form-data',*/'method':'post'}).css('width','100%');
	var mainPanel=$('<div>');
	var dirtableLeft=$('<table>').css({'width':'49%','float':'left'});
	var dirtableRight=$('<table>').css({'width':'49%','float':'left'});
	var dirtableBottom=$('<table>').css({'width':'100%','clear':'both'});
	var addBody=function(){
		eqid=$('div.dialog-'+type).length;
		dialog=$('<div>').attr('id','dialog-'+type+'-'+eqid).addClass('dialog-'+type);
		$('body').append(dialog);
		dialog.append(mainPanel);
		mainPanel.layout({fit:true,style:{padding:0}});
		mainPanel.layout('add',{region:'north',height:110})
		mainPanel.layout('add',{region:'center'})
		var panelNorth=mainPanel.layout('panel','north');
		var panelCenter=mainPanel.layout('panel','center');

		formdata.append(dirtableLeft).append(dirtableRight);
		panelNorth.append(formdata);
		panelCenter.append(dirtableBottom);
		window.dialogs[type]=dialog;
	};
	if(data.type==='new' && worker.division===21){
		data.released_jobtitle=18;
		data.received_jobtitle=8;
		data.released_fio='Дмитриев Александр Николаевич';
		data.received_fio='Волхонцев Дмитрий Александрович';
	}
	console.log(data.released_jobtitle)
	console.log(data.received_jobtitle)
	var createGrid=function(){
		var editIndex = undefined;
        $.ajax({
			url: '/dropdowns?type=listofequipment',
			type:'POST',
			async:false,
			success: function(data){
				listeqip=data;
			}
		});
		dirtableBottom.datagrid({
			fit:true,//развернуть на весь контейнер
			//width:400,
			//heigth:200,
			url:'dataload',
			queryParams:{url:'shared/invoicesequipment',id:data.id},
			showFooter:true,
			striped:true,//чередование подсветки строк
			fitColumns:true,//растянуть/сузить колонки по ширине экрана
			pagination:false,//панель навигации
			rownumbers:true,//включить нумерацию строк
			singleSelect:true,//выделять только по одной строке
			pageSize:20,//строк на странице
			toolbar:[{text:'Добавить',iconCls:'',handler:function(){
				dirtableBottom.datagrid('appendRow',{})
			}},{text:'Редактировать',iconCls:'',handler:function(){}},{text:'Удалить',iconCls:'',handler:function(){}}],//тулбар
			/*onCellEdit:function(index,field,value){
				var ed = $(this).datagrid('getEditor', {
					index: index,
					field: field
				});
				row.name = $(ed.target).combobox('getText');
			},
			onEndEdit:function(index, row){
				var ed = $(this).datagrid('getEditor', {
					index: index,
					field: 'equipment'
				});
				row.name = $(ed.target).combobox('getText');
			},*/
			columns: [[
				{title:'Наименование',field:'equipment',width:'45%',
				formatter:function(value,row,rowIndex){
					for(var i=0; i<listeqip.length; i++){if (listeqip[i].id*1===value*1){value=listeqip[i].name;}}
					return value;
				},		
				editor:{type:'combobox',options:{
					//url:'/dropdowns?type=listofequipment',
					valueField:'id',
					textField:'name',
					buttonText:'...',
					/*formatter: function(row){
						console.log(row)
						//var opts = $(this).combobox('options');*
						return row.id;
					},*/
					data:listeqip,
					required:true,
					onClickButton:function(){
						selectBtnClick('Оборудование',$(this),'directorys-listofequipment');
					}
				}}},
				{title:'Количество',field:'quantity',width:'12%',editor:{type:'numberbox'}},
				{title:'Цена без НДС',field:'withoutVAT',width:'13%'},
				{title:'Цена',field:'price',width:'10%'},
				{title:'Сумма',field:'total',width:'15%',editor:{type:'numberbox',options:{min:0,precision:2}}},
			]],
			onEndEdit:function(index,row,changes){
				if(!!row.quantity){row.quantity=parseInt(row.quantity)+' шт.';}
				if(!!row.total){row.total=parseFloat(row.total).toFixed(2)+' руб.';}
				if(!!row.total && !!row.quantity){
					var rows = dirtableBottom.datagrid('getFooterRows');
					var dataGrid = dirtableBottom.datagrid('getData').rows;
					var price=parseFloat(row.total)/parseInt(row.quantity);
					var withoutVAT=price/1.18;
					row.quantity=parseInt(row.quantity)+' шт.';
					row.total=parseFloat(row.total).toFixed(2)+' руб.';
					rows[0].quantity=rows[0].total=0;
					dataGrid.forEach(function(item){
						rows[0].quantity+=parseInt(item.quantity);
						rows[0].total+=parseFloat(parseFloat(item.total).toFixed(2));
					})
					rows[0].quantity+=' шт.';
					rows[0].total+=' руб.';
					row.price=(price.toFixed(2))+' руб.';
					row.withoutVAT=(withoutVAT.toFixed(2))+' руб.';
					dirtableBottom.datagrid('reloadFooter');
				}
			}
		}).datagrid('enableCellEditing').datagrid('gotoCell', 'up')
	}
	var fieldsLeft=[
		{name:'date',label:'Дата',type:'date'},
		{name:'department',label:'Подразделение',type:'select',typedir:'directorys-departments'},
		{name:'released_jobtitle',label:'Выдал должность',type:'select',typedir:'directorys-jobtitle'},
		{name:'released_fio',label:'Выдал',type:'text'},
	];
	var fieldsRight=[
		{name:'reason',label:'Товарная накладная №',type:'text'},
		{name:'contractor',label:'Контрагент',type:'select',typedir:'directorys-contractors'},
		{name:'received_jobtitle',label:'Получил должность',type:'select',typedir:'directorys-jobtitle'},
		{name:'received_fio',label:'Получил',type:'text'},
	];	

	var createFields=function(indx,obj){
		if(obj.options===undefined){obj.options={};}
		obj.options.value=data[obj.name];
		createFormField(obj,type);
	}
	fieldsLeft.push({name:'id',type:'hidden'},{name:'type',type:'hidden'});
	$.each(fieldsLeft,function(indx,obj){
		obj.target=dirtableLeft;
		createFields(indx,obj)
	});
	$.each(fieldsRight,function(indx,obj){
		obj.target=dirtableRight;
		createFields(indx,obj)
	});
	var send=function(){
		/*sendDataUpdate({
			window:dialog,
			form:formdata,
			//target:data.target,
			//qp:{type:this.data.type,id:this.data.id},
			url:
		});*/
		var rows=dirtableBottom.datagrid('getRows');
		console.log(rows)
		var footer=dirtableBottom.datagrid('getFooterRows')[0];
		var equipments=$.map(rows,function(elem,idx){
			var obj=$.extend({},elem)
			obj.price=parseFloat(elem.price);
			obj.quantity=parseInt(elem.quantity);
			delete obj.total;
			delete obj.withoutVAT;
			delete obj.name;
			return obj;
		});
		console.log(equipments)
	
		formdata.form('submit', {
			url:'form-update',
			queryParams:{url:type.replace('-','/'),equipments:JSON.stringify(equipments),total_count:parseInt(footer.quantity),total_sum:parseFloat(footer.total)},		
			onSubmit:function(params){
				var isValid=$(this).form('validate');
				if(equipments.length<1){isValid=false;}
				if (isValid){$.messager.progress();}
				return isValid;
			},
			success:function(data){
				//alert(data)
				$.messager.progress("close");
			}
		});
		
		/*formdata.submit(function(){
			//$.messager.progress({});
			var isValid=$(this).form('validate');
			
			//form-update
			if (!isValid){$.messager.progress('close');}
			else{
				var data={};
				$.each($(this).serializeArray(),function(indx,obj){data[obj.name]=obj.value;});
				data.url=type.replace('-','/');
				console.log(data)
				//socket.emit('form-update',data);
			}
			return false;
		});
		formdata.submit();*/
	};
	var print=function(){
		var data={};
		$.each($(formdata).serializeArray(),function(indx,obj){
			data[obj.name]=obj.value;
		});
		var rows=dirtableBottom.datagrid('getRows');
		var footer=dirtableBottom.datagrid('getFooterRows')[0];
		var released_jobtitle=$('#released_jobtitle').combobox('getText');
		var received_jobtitle=$('#received_jobtitle').combobox('getText');
		var department=$('#department').combobox('getText');
		//var contractor=$('#contractor').combobox('getText');
		console.log('----')
		console.log(rows)
		console.log('----')
		/*var number=$('#dialog-'+typeform+' #'+typeform+'-number').val();
		var date=formatdate($('#dialog-'+typeform+' #'+typeform+'-date').jqxDateTimeInput('getDate'),'ntru');
		var reason=$('#dialog-'+typeform+' #'+typeform+'-reason').val();
		var depname=$('#'+typeform+'-dep-i').val();
		var namecp=$('#'+typeform+'-cp-list').jqxComboBox('getSelectedItem').value;
		var releasedi=$('#'+typeform+'-releasedl-i').val();
		var releasedp=$('#'+typeform+'-releasedp').val();
		var receivedi=$('#'+typeform+'-receivedl-i').val();
		var receivedp=$('#'+typeform+'-receivedp').val();
		var totalpos = $('#dialog-'+typeform+' #'+typeform+'-invoiceequipment-table').jqxGrid('getcolumnaggregateddata', 'total_pos', ['sum']);
		var totalamount = $('#dialog-'+typeform+' #'+typeform+'-invoiceequipment-table').jqxGrid('getcolumnaggregateddata', 'amount', ['sum']);
		var dateq=$('#dialog-'+typeform+' #'+typeform+'-invoiceequipment-table').jqxGrid('getrows');
		
		var datinf=data.inf;*/
		var len=20;
		var newWindow = window.open('', '', 'width=800, height=600');
		var document = newWindow.document.open();
		var pageContent =
				'<!DOCTYPE html>'+
				'<html>'+
				'<head>'+
					'<meta charset="utf-8"/>'+
					'<title>Печать</title>'+
					'<style>'+
						'.post{text-align:left;padding-left:50px; font-size:16px; font-weight:bold;}'+
						'body{text-align:justify; font-size:13px;}'+
						'#header-mini{font-size:10px; text-align:left;}'+
						'#header{font-weight:bold;font-size:25px;}'+
						'.data-user{width:100%; border: 1px solid black; border-collapse:collapse;}'+
						'.data-user td{text-align:center; border: 1px solid black;}'+
						'div{width:100%; text-align:center;}'+
						'ol{margin:0px;}'+
						'.signature{width:100%; border: 0px solid black; border-collapse:collapse;}'+
						'.signature td:eq(0){text-align:left; border: 0px solid black;}'+
						'.signature td:eq(1){text-align:right; border: 0px solid black;}'+
					'</style>'+
				'</head>'+
				'<body>'+
					'<div id="header-mini">ПАО СК &#8243;Росгосстрах&#8243;</div>'+
					'<div style="height:20px"></div>'+
					'<div id="header">Расходная накладная №'+data.id+' от '+data.date+'</div>'+
					'<div style="height:10px"></div>'+
					'<div style="float:left; width:49%;"><b>Основание:</b> Товарная накладная №'+data.reason+'</div>'+
				//'<div style="height:10px"></div>'+
					'<div style="float:right; width:49%;"><b>Подразделение:</b> '+department+'</div>'+
					'<div style="height:10px; clear:both;"></div>'+
					'<table class="data-user">'+
					'<tr><td>№</td><td>Наименование</td><td>Количество</td><td>Цена за единицу</td><td>Сумма</td></tr>';
		if(rows.length>20){len=rows.length;}
		for(var i=0;i<len;i++){
			if(rows[i]!=undefined && rows[i]!='undefined'){
				pageContent +='<tr><td>'+(i+1)+'</td><td>'+rows[i].name+'</td><td>'+rows[i].quantity+'</td><td>'+rows[i].price+'</td><td>'+rows[i].total+'</td></tr>';
			}
			else{
				pageContent +='<tr><td>'+(i+1)+'</td><td></td><td></td><td></td><td></td></tr>';
			}
		}	
		pageContent +='<tr><td></td><td style="font-weight:bold; font-size:14px;">Итого</td><td>'+footer.quantity+'</td><td></td><td>'+footer.total+'</td></tr>'+
					'</table>'+
					'<div style="height:20px"></div>'+
					'<div class="post"><i>Выдал:</i> '+released_jobtitle+'____________'+data.released_fio+'</div>'+
					'<div style="height:20px"></div>'+
					'<div class="post"><i>Получил:</i> '+received_jobtitle+'____________'+data.received_fio+'</div>'+
					'<div style="height:20px"></div>'+
				'</body></html>';
		document.write(pageContent);
		document.close();
		newWindow.print();
	}
	var tollbar=[
		{text:'Сохранить и закрыть',iconCls:'icon-button-achieved-tikets-16',handler:function(){send();}},
		{text:'Сохранить',iconCls:'icon-button-achieved-tikets-16',handler:function(){send();}},
		{text:'Печать',iconCls:'icon-button-achieved-tikets-16',handler:function(){print();}}
	];
	this.title='Расходная накладная №'+data.id;
	this.titleNew='Создание расходной накладной';
	this.createWindow=function (){
		addBody();
		//createFields(this.fields);
		if(data.type=='new' && !data.copy){this.title=this.titleNew;}
		createGrid()
		dialog.dialog({
			minimizable:false,
			width:800,
			height:500,
			title:this.title,
			toolbar:tollbar,
			onClose:function(){
				delete window.dialogs[type];
				$(this).dialog('destroy');
			}
		});
		//dialog.dialog('resize',{width:dialog.width()+15});		
	};
	this.createWindow();
})();