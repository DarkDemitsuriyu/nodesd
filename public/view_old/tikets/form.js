(function (){
	var id=formsObj.data.id;
	var topicname=formsObj.data.topicname;
	var tiketAll=function(){
		console.log($('#dialog-tiket-'+id))
		if(!$('#dialog-tiket-'+id).length){
			$.messager.progress({});
			console.log(id)
			socket.emit('tiketinfo',id);
			socket.on('tiketinfo'+id,function(data){
				console.log(data)

				
				var type=formsObj.type;				
				var worker=JSON.parse(localStorage.getItem('user'));
				var dialog=$('<div>').attr('id','dialog-tiket-'+data.id);
				
				var editTopic=function(){
					alert(123)
				}
				
				var disableTabs=function(j){
					var tabs=tiketTabs.tabs('tabs');
					for(var i=j;i<tabs.length;i++){tiketTabs.tabs('disableTab', i);}
				};
				var enableTabs=function(){
					var tabs=tiketTabs.tabs('tabs');
					for(var i=0;i<tabs.length;i++){tiketTabs.tabs('enableTab', i);}
				};
				var checkStatus=function(){
					if(3>data.status>0){
						toolbar[0].disabled=toolbar[1].disabled=toolbar[5].disabled=true;
						toolbar[4].disabled=false;
						$('#btn-compleet').linkbutton('disable');
						$('#btn-failure').linkbutton('disable');
						$('#btn-editor').linkbutton('disable');
						$('#btn-rettowork').linkbutton('enable');					
						disableTabs(2);
					} else {
						$('#btn-compleet').linkbutton('enable');
						$('#btn-failure').linkbutton('enable');
						$('#btn-editor').linkbutton('enable');
						$('#btn-rettowork').linkbutton('disable');					
						toolbar[0].disabled=toolbar[1].disabled=false;
						toolbar[4].disabled=true;
						enableTabs();
					}
				};
				var getTiket=function(){
					$.messager.progress({});
					var data=dialog.data();
					var dt={type:type,id:data.id,topicname:data.topicname,sendermail:data.sendermail,description:data.description,datestart:data.startdate} 
					socket.emit('gettiket',dt);
					socket.on('gettiket'+data.id,function(msg){
						$.messager.progress('close');
						if((typeof msg)!=='string'){
							$('#btn-compleet').linkbutton('enable');
							$('#btn-failure').linkbutton('enable');
							$('#btn-print').linkbutton('enable');
							$('#btn-gettiket').linkbutton('disable');
							logsAppend.call(dialog,msg.msgArray);
						}else{
							$.messager.alert('Внимание!',msg,'error')
						}
						socket.removeListener('gettiket'+data.id);						
					});
				};
				var editTiketStatus=function(newStatus){
					$.messager.progress({});
					var dt=dialog.data();;
					dt.type=type;
					dt.status=newStatus;
					dt.solution=tiketSolution.textbox('getValue');
					socket.emit('edittiketstatus',dt);
				};
				var attachFiles=function(layout,field){
					var target=layout.layout('panel','east');
					target.html('');
					var tbl=$('<table>');
					var attachsum=0;
					var data=[];
					for(var i=0;i<field.files.length;i++){
						var file = field.files[i];
						var size=((file.size/1024).toFixed(2))*1;
						attachsum+=size;
						if(size>1000){						
							size=((size/1024).toFixed(2))*1;
							size+='Mб';
						}
						else{size+='Кб'}
						var fname=file.name;
						data.push({name:'<div title="'+file.name+'" class="easyui-tooltip">'+file.name+'</div>',value:size});
					}
					if(attachsum>1000){						
						attachsum=((attachsum/1024).toFixed(2))*1;
						attachsum+='Mб';
					}else{attachsum+='Кб';}
					var title='Вложений - '+field.files.length+'<div style="float:right;">'+attachsum+'</div>';
					target.append(tbl);
					layout.layout('expand','east');
					tbl.propertygrid({
						fit:true,
						style:{border:0},
						showFooter:true,
						title:title,
						data:data,
						showHeader:false,
						scrollbarSize:0,
						columns:[[{field:'name',width:'60%'},{field:'value',align:'right',width:'31%'}]]
					});
					//target.panel('resize',{width: 200});
					
				};
				var postpone=function(){
					var data=dialog.data();
					var date=data.deadline;
					if(data.postpone){date=data.postpone;}
					return moment(date).format('DD.MM.YYYY HH:mm:ss');
				};
				var openEditor=function(target){
					var data=dialog.data();
					console.log(!!$('#dialog-tiket-editor-'+data.id).length)
					console.log(~$('#dialog-tiket-editor-'+data.id).length)
					console.log($('#dialog-tiket-editor-'+data.id).length)
					if(!$('#dialog-tiket-editor-'+data.id).length){
						var height=220;
						var dialogEditor=$('<div>').addClass('tiket-editor');
						var form=$('<form>').attr({'method':'post'});
						var tbl=$('<table>');
						var topicinput=$('<input>').attr({'id':'topic','name':'topic','type':'text'});
						var topicrow=$('<tr>').append($('<td>').append('Тема:')).append($('<td>').append(topicinput));
						var workerinput=$('<input>').attr({'id':'worker','name':'worker'});
						var workerrow=$('<tr>').append($('<td>').append('Сотрудник:')).append($('<td>').append(workerinput));
						var postponeinput=$('<input>').attr({'id':'postpone','name':'postpone','type':'text'});
						var postponerow=$('<tr>').append($('<td>').append('Отложить до:')).append($('<td>').append(postponeinput));
						var reasoninput=$('<input>').attr({'id':'reason','name':'reason','type':'text'});
						var reasonrow=$('<tr>').append($('<td>').append('Причина:')).append($('<td>').append(reasoninput));
						var workerchk=false;
						var importancecheck=false;
						var importance;
						var date=postpone();
						tbl.append(topicrow).append(workerrow).append(postponerow).append(reasonrow);
						form.append(tbl)
						dialogEditor.append(form);
						target.append(dialogEditor);
						target.data('editor',dialogEditor);
						
						topicinput.textbox({value:data.topicname,width:250});
						workerinput.combobox({valueField:'id',textField:'name',value:data.worker,data:data.listworkers,width:250});
						postponeinput.datetimebox({
							value:date,width:250,
							formatter: function(value){
								return moment(value).format('DD.MM.YYYY HH:mm:ss');
							},
							parser: function(value){
								var t = moment(value,'DD.MM.YYYY HH:mm:ss');
								if (!isNaN(t)){return new Date(t);}
								else {return new Date();}
							}
						});
						reasoninput.textbox({multiline:true,width:250,height:66});
						
						if(isRuk()){
							height=255;
							var importanceinput=$('<input>').attr({'id':'importance','name':'importance','type':'text'});
							var importancerow=$('<tr>').append($('<td>').append('Повышенная важность:')).append($('<td>').append(importanceinput));
							tbl.append(importancerow)
							importanceinput.switchbutton({
								checked: data.importance,
								onText:'Да',
								offText:'Нет',
								onChange: function(checked){
									if(checked!==Boolean(data.importance)){
										importancecheck=true;
										importance=checked;
									}
									else{
										importancecheck=false;
									}
								}
							});
						}
						
						dialogEditor.dialog({
							title:'Редактор заявки №'+data.id,
							toolbar:[{text:'Применить и закрыть',iconCls:'icon-button-achieved-tikets-16',handler:function(){
								var dataSend={};
								var topic=topicinput.textbox('getText');
								var newWorker=workerinput.combobox('getValue');
								var postpone=moment(postponeinput.datetimebox('getValue'),'DD.MM.YYYY HH:mm:ss');
								if(topic!==data.topicname){data.topicname=dataSend.topic=topic;}
								if(newWorker!==data.worker){
									var workerinputData=workerinput.combobox('getData');
									workerchk=true;
									dataSend.workerNew=newWorker;
									dataSend.newWorkerFio=workerinput.combobox('getText');
									$.each(workerinputData,function(i,e){
										if(e.id===data.worker){dataSend.workerOldFio=e.name;}
									})
								}
								if(importancecheck){
									dataSend.importancecheck=importancecheck;
									data.importance=dataSend.importance=importance;
								}
								if(postpone.diff(moment(data.deadline))){
									reasoninput.textbox({required:true});
									if(isRuk()){reasoninput.textbox({required:false});}
									if(form.form('validate')){
										dataSend.reason=reasoninput.textbox('getText');
										dataSend.postpone=postpone.format('YYYY-MM-DD HH:mm:ss');
										data.reason=dataSend.postpone;
										if(isRuk()){data.deadline=dataSend.postpone;}
									}
								}
								if(!$.isEmptyObject(dataSend)){
									console.log(111111)
									console.log(data)
									console.log(111111)
									$.extend(dataSend,{tiket:data.id,workerOld:data.worker});
									console.log(dataSend)
									$.messager.progress({});
									socket.emit('edittiket',dataSend);
									
								}
							}}],
							height:height,
							width:354,
							onClose:function(){
								console.log('-----')
								console.log(this)
								console.log(workerchk)
								console.log('-----')
								$(this).dialog('destroy');
								if(workerchk){
									console.log(1123123)
									$(target).dialog('close');
								}
							}
						});					
					}
				};
				var checkStatusForAdmin=function(){
					var data=dialog.data();
					if(isRuk() && worker.login!==data.worker){
						if(data.statusconfirm){
							if(!dialog.find('#footerDialg').length){
								var okBtn=$('<a>');
								var cancelBtn=$('<a>');
								var leftDiv=$('<div>').css({'float':'left','padding':'4px 10px'});
								var rightDiv=$('<div>').css('float','right');
								var footer=$('<div>').attr('id','footerDialg');
								rightDiv.append(okBtn).append(cancelBtn)
								footer.append(leftDiv).append(rightDiv)
								dialog.append(footer)
								dialog.dialog({footer:'#footerDialg'});
								dialog.data('footer',footer);
								switch(data.statusconfirm){
									case 5:
										leftDiv.text('Сотрудник хочет отложить эту заявку до '+moment(data.postpone).format('DD.MM.YYYY HH:mm:ss'));
										okBtn.linkbutton({text:'Согласен',onClick:function(){
											$.messager.progress({});
											socket.emit('edittiket',{tiket:data.id,workerOld:data.worker,confirm:true,confirmchk:true,postp:data.postpone});
										}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){
											$.messager.progress({});
											socket.emit('edittiket',{tiket:data.id,workerOld:data.worker,confirm:false,confirmchk:true,postp:data.postpone});
										}});
									break;
									case 1:
										leftDiv.text('Заявлено выполнение этой заявки.')
										okBtn.linkbutton({text:'Согласен',onClick:function(){editTiketStatus('confirmcomplete');}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){editTiketStatus('noconfirmcomplete');}});
									break;
									case 2:
										leftDiv.text('Заявлен отказ в этой заявке.')
										okBtn.linkbutton({text:'Согласен',onClick:function(){editTiketStatus('confirmrefuse');}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){editTiketStatus('noconfirmrefuse');}});
									break;
								}
							}
						}else{
							dialog.dialog({footer:null});
						}
					}
				};
				/*var checkImportance=function(){
					if(data.importance){
						dialog.parent().css('border','3px solid red');
					} else {
						dialog.parent().css('border','0px solid red');
					}
				}*/
				var createInfoGrid=function(panel){
					var infoGrid=$('<table>').addClass('info-grid');
					var btnTopic='<a href="#" class="easyui-linkbutton editTopic" onclick="editTopic()">easyui</a>';
					$('<a>').attr('href',"#").text('Открыть');
					panel.layout('panel','west').append(infoGrid)
					infoGrid.propertygrid({
						fit:true,
						style:{border:0},
						data:[
							{name:"Фамилия",value:data.sendersurname,group:"Информация о заявителе"},
							{name:"Имя",value:data.sendername,group:"Информация о заявителе"},
							{name:"Отчество",value:data.senderpatronymic,group:"Информация о заявителе"},
							{name:"Телефон",value:data.senderphone,group:"Информация о заявителе"},
							{name:"E-Mail",value:data.sendermail,group:"Информация о заявителе"},
							{name:"IP адрес",value:`<a href='radmin:\/\/${data.senderip}'>${data.senderip}</a>`,group:"Информация о заявителе"},
							{name:"Имя компьютера",value:`<a href='radmin:\/\/${data.sendercompname}'>${data.sendercompname}</a>`,group:"Информация о заявителе"},
							{name:"Подразделение",value:data.depname,group:"Информация о заявителе"},
							{name:"Дата заявки",value:moment(data.startdate).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"},
							{name:"Выполнить до",value:moment(data.deadline).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"},
							{name:"Сменить тему",value:btnTopic,group:"Редактор"}
						],
						showGroup:true,
						showHeader:false,
						scrollbarSize:0,
						columns:[[
							{field:'name',width:115,align:'right',styler:function(value,row,index){return {style:'font-weight:bolder'}}},
							{field:'value',width:185,formatter:function(v,r,i){
								switch(v){
									case 'editTopic':
										return btnTopic;
									break;
									default:
										return '<div title="'+v+'" class="easyui-tooltip">'+v+'</div>';
									break;
								}								
							}}]]
					});
var dt=["8(3452)28-99-55","8(3452)28-99-50","8(3452)28-99-51","8(3452)28-99-52"];
for(var i=0;i<dt.length;i++){
	infoGrid.propertygrid('appendRow',{name:"Телефон",value:dt[i],group:"Дополнительная информация"});
}
infoGrid.propertygrid('collapseGroup',1);
infoGrid.propertygrid('collapseGroup',2);
infoGrid.propertygrid('collapseGroup',3);					
				};
				
				
				var mainPanel=$('<div>').attr('id','tiket-main-layout');
				var tiketTabs=$('<div>');
				var tiketSolution=$('<input>');
				var tiketChatEnter=$('<input>');
				var logsPanel=$('<div>');
				var commentPanel=$('<div>');
				var commentLayout=$('<div>');
				var divLogs=$('<div>').addClass('tiket-logs');
				var twinmax=localStorage.getItem('tiketwindmax');
				var formComment=$('<form>').attr({'enctype':'multipart/form-data','method':'post'}).width('100%').height('100%');
				var btnSend=$('<a>');
				var btnFile=$('<a>');
				var textSend=$('<input>').attr({name:'mail_msg'});
				var fileSend=$('<input>').attr({type:'file',name:'mail_file[]',multiple:true}).css('visibility','hidden');
				var toolbar=[
					{id:'btn-compleet',text:getTranslate(['tikets','form','btns','compleet']),iconCls:'icon-checkmark',handler: function(){editTiketStatus('complete');}},
					{id:'btn-failure',text:getTranslate(['tikets','form','btns','failure']),iconCls:'icon-cross',handler: function(){
						if(tiketSolution.textbox('getValue')){editTiketStatus('refuse');}
						else{$.messager.alert('Внимание!','Не заполнено <b>Решение</b>!','error');}
					}},
					{id:'btn-print',text:getTranslate(['tikets','form','btns','print']),iconCls:'icon-print',handler: function(){printTiket(data);}},
					{id:'btn-attach',text:getTranslate(['tikets','form','btns','attach']),iconCls:'icon-attachment',disabled:true,handler: function(){window.open('/getFile?type=tiketsAttachment&file='+data.attachment+'&newname='+data.id,'attachment','menubar =no,toolbar=no,location =no,status =no')}},
					{id:'btn-rettowork',text:getTranslate(['tikets','form','btns','rettowork']),iconCls:'icon-undo2',disabled:true,handler: function(){editTiketStatus('return');}},
					{id:'btn-editor',text:getTranslate(['tikets','form','btns','editor']),iconCls:'icon-undo2',disabled:false,handler: function(){openEditor(dialog);}}
				];

				if(data.attachment){toolbar[3].disabled=false;}

				dialog.append(mainPanel)
				$('body').append(dialog);
				//logsAppend.call(dialog,data.logs)
				
				dialog.data(data)
				
				formComment.append(textSend).append(fileSend);
	
				mainPanel.layout({fit:true,style:{padding:0}})
				mainPanel.layout('add',{region:'west',style:{border:0},width:300,split:true})
				mainPanel.layout('add',{region:'center',style:{border:0},split:true})
				mainPanel.layout('add',{region:'south',style:{border:0},height:130,split:true})
				
				mainPanel.layout('panel','center').append(tiketTabs);
				mainPanel.layout('panel','south').append(logsPanel);
	
				logsPanel.layout({fit:true,style:{padding:0,border:0}});
				logsPanel.layout('add',{region:'center'});
				logsPanel.layout('add',{region:'south',height:25});
				logsPanel.layout('panel','center').append(divLogs);
				logsPanel.layout('panel','south').append(tiketChatEnter);
	
				tiketTabs.tabs({fit:true,height:200});
				tiketTabs.tabs('add',{iconCls:'icon-description',title:'Описание',style:{padding:10},fit:true,content:data.description});
				tiketTabs.tabs('add',{iconCls:'icon-info',title:'Решение',fit:true,content:tiketSolution});
				tiketTabs.tabs('add',{iconCls:'icon-bubble',title:'Комментарий',fit:true,content:commentLayout});
//tiketTabs.tabs('add',{title:'Вложения',fit:true,content:''});
				tiketTabs.tabs('select','Описание');
	
				commentLayout.layout({fit:true,style:{padding:0}})
				commentLayout.layout('add',{region:'north'});
				commentLayout.layout('add',{region:'east',width:200,split:true,hideExpandTool:true,collapsedSize:0})
				commentLayout.layout('add',{region:'center',split:true})
				commentLayout.layout('collapse','east')
				
				commentLayout.layout('panel','north').append(btnSend).append(btnFile).append(commentPanel);
				commentLayout.layout('panel','center').append(formComment);
				
				commentPanel.panel({height:19,width:'100%',content:'<b style="margin:5px">Кому:</b> <i>'+data.sendersurname+' '+data.sendername+' '+data.senderpatronymic+' &lt;'+data.sendermail+'&gt;</i>'});
			
			if(topicname==='Новый сотрудник'){
				toolbar.splice(3, 1);
				var dataInfo=[
					{name:"Телефон",value:data.senderphone,group:"Информация о заявителе"},
					{name:"E-Mail",value:data.sendermail,group:"Информация о заявителе"},
					{name:"Фамилия",value:data.sendersurname,group:"Информация о новом сотруднике"},
					{name:"Имя",value:data.sendername,group:"Информация о новом сотруднике"},
					{name:"Отчество",value:data.senderpatronymic,group:"Информация о новом сотруднике"},
					{name:"Вместо",value:data.insteadof,group:"Информация о новом сотруднике"},
					{name:"IP адрес",value:data.senderip,group:"Информация о новом сотруднике"},
					{name:"Имя компьютера",value:data.sendercompname,group:"Информация о новом сотруднике"},
					{name:"Подразделение",value:data.depname,group:"Информация о новом сотруднике"},
					{name:"Отдел",value:data.divisionname,group:"Информация о новом сотруднике"},
					{name:"Должность",value:data.jobtitlename,group:"Информация о новом сотруднике"},
					{name:"Гор.телефон",value:data.cityphone,group:"Информация о новом сотруднике"},
					{name:"Вн.телефон",value:data.internalphone,group:"Информация о новом сотруднике"},
					{name:"Дата заявки",value:moment(data.startdate).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"},
					{name:"Выполнить до",value:moment(data.deadline).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"}
				];
				var tab=tiketTabs.tabs('getTab','Описание');
				var dirtable=$('<table>').css('width','99%');
				$.each(data.equipments,function(index,element){
					var obj={require:true,name:'worker',label:element.eqipname,type:'select',typedir:'directorys-users'};
					createFormField({target:dirtable,data:element.worker,obj:obj},type);
					dirtable.find('tr:eq('+index+')').append($('<td>').text('123'))
				})
				tiketTabs.tabs('update', {
					tab: tab,
					options: {
						title: 'Все',
						content:dirtable
						//href: 'get_content.php'  // the new content URL
					}
				});
				console.log(tab)
				
			}
			
				
				
				createInfoGrid(mainPanel);
				tiketChatEnter.textbox({fit:true,buttonText:'Отправить',onClickButton:function(){
					var text=$(this).textbox('getValue');
					if(text){
						$.messager.progress({});
						socket.emit('tiketcomment',{text:text,tiket:data.id,date:moment()});
						socket.on('tiketcomment'+data.id,function(msg){
							divLogs.prepend(msg);
							$.messager.progress('close');
							socket.removeListener('tiketcomment'+data.id);						
						});
						console.log($(this))
						$(this).textbox('setValue','');
					}
				}});
				textSend.textbox({multiline:true,fit:true});
				tiketSolution.textbox({multiline:true,fit:true,value:data.solution});
				fileSend.change(function(){attachFiles(commentLayout,this)});
				btnFile.linkbutton({iconCls: 'icon-attachment',text:'Прикрепить',onClick:function(){fileSend.click();}});
				btnSend.linkbutton({iconCls: 'icon-email',text:'Отправить',
					onClick:function(){
						if(textSend.textbox('getValue')){
							var workerMail=localStorage.getItem('user');
							$.messager.progress({});
							formComment.form('submit',{
								url:'tiketSendMail',
								queryParams:{id:data.id,topic:data.topicname,sendermail:data.sendermail,worker:workerMail,description:data.description,datestart:moment(data.startdate).format('DD.MM.YYYY HH:mm:ss')},
								success: function(msg){
									$.messager.progress('close');
									logsAppend.call(dialog,JSON.parse(msg));
									goMessage();
									commentLayout.layout('panel','east').html('');
									textSend.textbox('setValue','');
									fileSend.val('');
								}
							});
						}
						else{
							$.messager.alert('Внимание!','Не заполнено тело письма!','error');
						}
					}
				});
				checkStatus();
				if(data.workerstatus>1 && data.status>2){
					for(var i=0;i<toolbar.length;i++){if(i!==3){toolbar[i].disabled=true;}}
					if($.inArray(2, worker.groups)>=0){toolbar[5].disabled=false;}
					toolbar.unshift({id:'btn-gettiket',text:getTranslate(['tikets','form','btns','getTiket']),iconCls:'icon-checkmark',handler: function(){getTiket();}})
					disableTabs(1);
					tiketChatEnter.textbox('disable');
				}
				dialog.dialog({
					minimizable:false,
					maximizable:true,
					title:'Заявка №'+data.id+' / Тема:'+data.topicname,
					toolbar:toolbar,
					height:500,
					width:800,
					onBeforeClose:function(){
						localStorage.setItem('tiketwindmax', dialog.dialog('options').maximized);
						if($('#dialog-tiket-editor-'+data.id).length){
							$('#dialog-tiket-editor-'+data.id).dialog('close');
						}
					},
					onClose:function(){
						socket.removeListener('chattiket'+data.id);
						//socket.removeListener('edittiket'+data.id);
						socket.removeListener('edittiketstatus'+data.id);
						$(this).dialog('destroy');
					}
				});
				checkStatusForAdmin();
				if(twinmax==='true'){dialog.dialog('maximize');}
				checkImportance(data.importance,dialog);
				logsAppend.call(dialog,data.logs);
				
				socket.on('chattiket'+id,function(msg){logsAppend.call(dialog,msg);});
				socket.on('edittiketstatus'+id,function(msg){
					console.log(msg.st)
					data.status=msg.st;
					data.statusconfirm=msg.stc;
					checkStatus();
					logsAppend.call(dialog,msg.msgArray);
					//checkStatusForAdmin();
					$.messager.progress('close');
					if(data.status!==3){
						dialog.dialog('close');
					}
				});
				/*socket.on('edittiket'+id,function(msg){
					//console.log(msg)
					for(var key in msg.data){
						data[key]=msg.data[key];
						switch(key){
							case 'topicname':
								dialog.dialog({title:'Заявка №'+data.id+' / Тема:'+data.topicname});
							break;
							case 'deadline':
								infoGrid.datagrid('getRows').forEach(function(element){
									if(element.name==='Выполнить до'){
										var index=infoGrid.datagrid('getRowIndex',element);
										infoGrid.datagrid('updateRow',{
											index: index,
											row: {name:"Выполнить до",value:moment(data.deadline).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявителе"}
										});
									}
								});
							break;
						}
					}
					checkImportance(data.importance,dialog);
					logsAppend.call(dialog,msg.msg);
					//checkStatusForAdmin();
					goMessage();
					$.messager.progress('close');
					$('#dialog-tiket-editor-'+id).dialog('close');
				});*/
				$.messager.progress('close');
				socket.removeListener('tiketinfo'+data.id);
			});
		}
	};
	var tiketNewEmployee=function(){
		if(!$('#dialog-tiket-'+id).length){
			$.messager.progress({});
			socket.emit('tiketinfo',id,topicname);
			socket.on('tiketinfo'+id,function(data){
				data.id=formsObj.data.id;
				var type=formsObj.type;				
				var worker=JSON.parse(localStorage.getItem('user'));			
				var disableTabs=function(j){
					var tabs=tiketTabs.tabs('tabs');
					for(var i=j;i<tabs.length;i++){tiketTabs.tabs('disableTab', i);}
				};
				var enableTabs=function(){
					var tabs=tiketTabs.tabs('tabs');
					for(var i=0;i<tabs.length;i++){tiketTabs.tabs('enableTab', i);}
				};
				var checkStatus=function(){
					if(3>data.status>0){
						toolbar[0].disabled=toolbar[1].disabled=true;
						/*toolbar[4].disabled=false;*/
						$('#btn-failure').linkbutton('disable');
						$('#btn-editor').linkbutton('disable');
						disableTabs(2);
						tiketChatEnter.textbox('disable');
					} else {						
						$('#btn-failure').linkbutton('enable');
						$('#btn-editor').linkbutton('enable');
						toolbar[0].disabled=toolbar[1].disabled=false;
						/*toolbar[4].disabled=true;*/
						enableTabs();
						tiketChatEnter.textbox('enable');
					}
				};
			/*	var getTiket=function(){
					$.messager.progress({});
					var dt={type:type,id:data.id,topicname:data.topicname,sendermail:data.sendermail,description:data.description,datestart:data.startdate} 
					socket.emit('gettiket',dt);
					socket.on('gettiket'+data.id,function(msg){
						$.messager.progress('close');
						if((typeof msg)!=='string'){
							$('#btn-compleet').linkbutton('enable');
							$('#btn-failure').linkbutton('enable');
							$('#btn-print').linkbutton('enable');
							$('#btn-gettiket').linkbutton('disable');
							logsAppend(msg.msgArray);
						}else{
							$.messager.alert('Внимание!',msg,'error')
						}
						socket.removeListener('gettiket'+data.id);
					});
				};*/
				var editTiketStatus=function(newStatus,inData){
					var outData=$.extend({type:type,status:newStatus,tiket:data.id},inData)
					$.messager.progress({});
					outData.solution=tiketSolution.textbox('getValue');
					socket.emit('editnewtiketstatus',outData);
				};
				var attachFiles=function(target,field){
					target.html('');
					var tbl=$('<table>');
					var attachsum=0;
					var data=[];
					for(var i=0;i<field.files.length;i++){
						var file = field.files[i];
						var size=((file.size/1024).toFixed(2))*1;
						attachsum+=size;
						if(size>1000){						
							size=((size/1024).toFixed(2))*1;
							size+='Mб';
						}
						else{size+='Кб'}
						var fname=file.name;
						data.push({name:'<div title="'+file.name+'" class="easyui-tooltip">'+file.name+'</div>',value:size});
					}
					if(attachsum>1000){						
						attachsum=((attachsum/1024).toFixed(2))*1;
						attachsum+='Mб';
					}else{attachsum+='Кб';}
					var title='Вложений - '+field.files.length+'<div style="float:right;">'+attachsum+'</div>';
					target.append(tbl);
					tbl.propertygrid({
						fit:true,
						style:{border:0},
						showFooter:true,
						title:title,
						data:data,
						showHeader:false,
						scrollbarSize:0,
						columns:[[{field:'name',width:'60%'},{field:'value',align:'right',width:'31%'}]]
					});
				};
				var postpone=function(){
					var date=data.deadline;
					if(data.postpone){date=data.postpone;}
					return moment(date).format('DD.MM.YYYY HH:mm:ss');
				};
				/*var logsAppend=function(msg){
					for(var i=0;i<msg.length;i++){
						var logs=msg[i];
						var date=$('<i>').text(moment(logs.date).format('DD.MM.YYYY HH:mm:ss'));
						var worker=$('<span>').text(logs.worker);
						divLogs.prepend('<br>').prepend(logs.text).prepend(' : ').prepend(worker).prepend('-&gt;').prepend(date)
					}
				};*/
				var openEditor=function(data,target){
					if(!$('#dialog-tiket-editor-'+data.id).length){
						var dialogEditor=$('<div>').attr('id','dialog-tiket-editor-'+data.id);
						var form=$('<form>').attr({'method':'post'});
						var tbl=$('<table>');
						var postponeinput=$('<input>').attr({'id':'postpone','name':'postpone','type':'text'});
						var postponerow=$('<tr>').append($('<td>').append('Отложить до:')).append($('<td>').append(postponeinput));
						var reasoninput=$('<input>').attr({'id':'reason','name':'reason','type':'text'});
						var reasonrow=$('<tr>').append($('<td>').append('Причина:')).append($('<td>').append(reasoninput));
						var date=postpone();
						tbl.append(postponerow).append(reasonrow);
						form.append(tbl)
						dialogEditor.append(form);
						target.append(dialogEditor);
						
						postponeinput.datetimebox({
							value:date,width:250,
							formatter: function(value){
								return moment(value).format('DD.MM.YYYY HH:mm:ss');
							},
							parser: function(value){
								var t = moment(value,'DD.MM.YYYY HH:mm:ss');
								if (!isNaN(t)){return new Date(t);}
								else {return new Date();}
							}
						});
						reasoninput.textbox({multiline:true,width:250,height:66});
					
						dialogEditor.dialog({
							title:'Отложить заявку №'+data.id,
							toolbar:[{text:'Применить и закрыть',iconCls:'icon-button-achieved-tikets-16',handler:function(){
								var dataSend={};
								var postpone=moment(postponeinput.datetimebox('getValue'),'DD.MM.YYYY HH:mm:ss');
								if(postpone.diff(moment(data.deadline))){
									if($.inArray(2, worker.groups)<0){reasoninput.textbox({required:true});}
									else{reasoninput.textbox({required:false});}
									if(form.form('validate')){
										dataSend.reason=reasoninput.textbox('getText');
										dataSend.postpone=postpone.format('YYYY-MM-DD HH:mm:ss');
										if($.inArray(2, worker.groups)<0){data.reason=dataSend.postpone;}
										else{data.deadline=dataSend.postpone;}
									}
								}
								if(!$.isEmptyObject(dataSend)){
									$.extend(dataSend,{tiket:data.id});
									//$.messager.progress({});
									editTiketStatus('postpone',dataSend);
									//socket.emit('edittiket',dataSend);
									dialogEditor.dialog('close');
								}
							}}],
							height:166,
							width:354,
							onClose:function(){$(this).dialog('destroy');}
						});					
					}
				};
				var checkStatusForAdmin=function(){
					if($.inArray(2, worker.groups)>=0){
						var isValid=false;
						$.each(data.equipments,function(idx,elem){
							if(elem.worker!==worker.login){isValid=true;}
						});
						if(isValid && data.statusconfirm){
							if(!$('#footerDialg').length){
								var okBtn=$('<a>');
								var cancelBtn=$('<a>');
								var leftDiv=$('<div>').css({'float':'left','padding':'4px 10px'});
								var rightDiv=$('<div>').css('float','right');
								var footer=$('<div>').attr('id','footerDialg');
								rightDiv.append(okBtn).append(cancelBtn)
								footer.append(leftDiv).append(rightDiv)
								dialog.append(footer)
								dialog.dialog({footer:'#footerDialg'});
								switch(data.statusconfirm){
									case 5:
										var inData={postpone:moment(data.postpone).format('YYYY-MM-DD HH:mm:ss')}
										leftDiv.text('Один из сотрудников желает отложить эту заявку до '+moment(data.postpone).format('DD.MM.YYYY HH:mm:ss'));
										okBtn.linkbutton({text:'Согласен',onClick:function(){
											editTiketStatus('postponeconfirm',inData);
											//socket.emit('edittiket',{tiket:data.id,workerOld:data.worker,confirm:true,confirmchk:true,postp:data.postpone});
										}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){
											editTiketStatus('postponenotconfirm',{});
//											socket.emit('edittiket',{tiket:data.id,workerOld:data.worker,confirm:false,confirmchk:true,});
										}});
									break;
									case 2:
										leftDiv.text('Заявлен отказ в этой заявке.')
										okBtn.linkbutton({text:'Согласен',onClick:function(){editTiketStatus('confirmrefuse');}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){editTiketStatus('noconfirmrefuse');}});
										
										leftDiv.text('Заявлен отказ в этой заявке.')
										okBtn.linkbutton({text:'Согласен',onClick:function(){editTiketStatus('refuseconfirm');}});
										cancelBtn.linkbutton({text:'Не согласен',onClick:function(){editTiketStatus('refusenoconfirm');}});
									break;
								}
							}
						}else{
							dialog.dialog({footer:null});
						}
					}
				};
				var dialog=$('<div>').attr('id','dialog-tiket-'+data.id);
				var mainPanel=$('<div>').attr('id','tiket-main-layout');
				var infoGrid=$('<table>');
				var infoAccount=$('<div>');
				var tiketTabs=$('<div>');
				var tiketSolution=$('<input>');
				var tiketChatEnter=$('<input>');
				var centerPanel=$('<div>');
				var commentPanel=$('<div>');
				var commentLayout=$('<div>');
				var divLogs=$('<div>').addClass('tiket-logs');
				var twinmax=localStorage.getItem('tiketwindmax');
				var formComment=$('<form>').attr({'enctype':'multipart/form-data','method':'post'}).width('100%').height('100%');
				var btnSend=$('<a>');
				var btnFile=$('<a>');
				var textSend=$('<input>').attr({name:'mail_msg'});
				var fileSend=$('<input>').attr({type:'file',name:'mail_file[]',multiple:true}).css('visibility','hidden');
				var dirtable=$('<table>').css('width','99%');
				console.log(data)
				console.log(data.equipments)
				$.each(data.equipments,function(index,element){
					console.log(element)
					var goData={conformity:element.id,equipment:element.equipment,eqipname:element.eqipname}
					var btnCompleet=$('<a>').attr('id','btn-'+element.id);
					var textField=$('<input>').attr({'type':'text','name':'note','id':'note-'+element.id});
					var obj={target:dirtable,name:'worker',label:element.eqipname,type:'select',typedir:'directorys-users',options:{
							width:200,
							value:element.worker,
							icons:[{iconCls:'icon-add',handler: function(e){
								goData.worker=$(e.data.target).combobox('getValue');
								goData.workerFio=$(e.data.target).combobox('getText');
								if(goData.worker!==worker.login){editTiketStatus('edit',goData);}
							}}]
						}
					};
					if((element.worker!==worker.login && $.inArray(2, worker.groups)<0) || (element.status<3)){obj.disabled=true;}
					createFormField(obj,type);
					dirtable.find('tr:eq('+index+')').attr('id','worker-'+element.id);
					dirtable.find('tr:eq('+index+')').append($('<td>').width(150).append(textField)).append($('<td>').width(63).append(btnCompleet));
					textField.textbox({icons:[],width:150,disabled:obj.disabled});
					btnCompleet.linkbutton({disabled:obj.disabled,text:'Выполнено',onClick:function(){
						var goMes=function(msg){
							$.messager.prompt('Укажите данные', msg, function(r){
								if (r){
									var isValid=true;
									switch(element.equipment){
										case 1: 
											if(~r.indexOf("\\")){
												var arr=r.split('\\')
												goData.appendComp={senderip:arr[0],sendercompname:arr[1]};
											}else{
												isValid=false;
												goMes(msg);
											}												
										break;
										case 4: 
											if(~r.indexOf("\\")){
												var arr=r.split('\\')
												goData.appendPhone={cityphone:arr[0],internalphone:arr[1]};
											}else{
												isValid=false;
												goMes(msg);
											}
										break;
									}									
									if(isValid){
										editTiketStatus('complete',goData);
									}
								}
							});	
						};
						switch(element.equipment){
							case 1: goMes('Введите через "\\" актуальные IP адрес и имя компьютера'); break;
							case 4: goMes('Введите через "\\" актуальные Городской и внутренний номера телефонов');break;
							default: editTiketStatus('complete',goData); break;
						}											
					}});
				})
				var toolbar=[
					{id:'btn-failure',text:getTranslate(['tikets','form','btns','failure']),iconCls:'icon-cross',handler: function(){if(tiketSolution.textbox('getValue')){editTiketStatus('refuse',{solution:tiketSolution.textbox('getValue')});}else{$.messager.alert('Внимание!','Не заполнено <b>Решение</b>!','error');}}},
					{id:'btn-editor',text:getTranslate(['tikets','form','btns','refuse']),iconCls:'icon-undo2',disabled:false,handler: function(){openEditor(data,dialog);}},
					{id:'btn-print',text:getTranslate(['tikets','form','btns','print']),iconCls:'icon-print',handler: function(){printTiket(data);}}					
				];
				var dataInfo=[
					{name:"Дата заявки",value:moment(data.startdate).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"},
					{name:"Выполнить до",value:moment(data.deadline).format('DD.MM.YYYY HH:mm:ss'),group:"Информация о заявке"},
					{name:"Телефон",value:data.senderphone,group:"Информация о заявителе"},
					{name:"E-Mail",value:'<div title="'+data.sendermail+'" class="easyui-tooltip">'+data.sendermail.substr(0,15)+'...</div>',group:"Информация о заявителе"},
					//{name:"Фамилия",value:data.sendersurname,group:"Информация о новом сотруднике"},
					//{name:"Имя",value:data.sendername,group:"Информация о новом сотруднике"},
					//{name:"Отчество",value:data.senderpatronymic,group:"Информация о новом сотруднике"},
					//{name:"Вместо",value:data.insteadof,group:"Информация о новом сотруднике"},
					//{name:"IP адрес",value:data.senderip,group:"Информация о новом сотруднике"},
					//{name:"Имя компьютера",value:data.sendercompname,group:"Информация о новом сотруднике"},
					//{name:"Подразделение",value:data.depname,group:"Информация о новом сотруднике"},
					//{name:"Отдел",value:data.divisionname,group:"Информация о новом сотруднике"},
					//{name:"Должность",value:data.jobtitlename,group:"Информация о новом сотруднике"},
					//{name:"Гор.телефон",value:data.cityphone,group:"Информация о новом сотруднике"},
					//{name:"Вн.телефон",value:data.internalphone,group:"Информация о новом сотруднике"},
					//{name:"Примечание",value:`<div title="${data.note}" class="easyui-tooltip">${data.note.substr(0,15)}...</div>'`,group:"Информация о новом сотруднике"}
				];
				var dataAccount=[
					{group:"ФИО",text:`${data.sendersurname} ${data.sendername} ${data.senderpatronymic}`},
					{group:"Вместо",text:data.insteadof},
					{group:"Подразделение",text:data.depname},
					{group:"Отдел и Должность",text:`${data.divisionname} / ${data.jobtitlename}`},
					//{group:"Должность",text:data.jobtitlename},
					{group:"Телефонв",text:`${data.cityphone} /Вн. ${data.internalphone}`},
					//{group:"Вн.телефон",text:data.internalphone},
					{group:"IP адрес и Имя компьютера",text:`${data.senderip} / ${data.sendercompname}`},
					//{group:"Имя компьютера",text:data.sendercompname},
					{group:"Примечание",text:data.note ? `<div title="${data.note}" class="easyui-tooltip">${data.note.substr(0,15)}...</div>` : ''}
				];
				
var dt=["8(3452)28-99-55","8(3452)28-99-50","8(3452)28-99-51","8(3452)28-99-52"];
				//if(data.attachment){toolbar[3].disabled=false;}

				dialog.append(mainPanel);
				$('body').append(dialog);
				logsAppend.call(dialog,data.logs);
				formComment.append(textSend).append(fileSend);
	
				mainPanel.layout({fit:true,style:{padding:0}});
				mainPanel.layout('add',{region:'west',width:250,split:true});
				mainPanel.layout('add',{region:'east',split:true,width:250});
				mainPanel.layout('add',{region:'center',split:true});
				mainPanel.layout('panel','west').append(infoGrid);
				mainPanel.layout('panel','east').append(infoAccount);
				mainPanel.layout('panel','center').append(centerPanel);
	
				centerPanel.layout({fit:true,style:{padding:0,border:0}});
				centerPanel.layout('add',{region:'north',height:'70%'});
				centerPanel.layout('add',{region:'center'});
				centerPanel.layout('add',{region:'south',height:25});
				centerPanel.layout('panel','north').append(tiketTabs);
				centerPanel.layout('panel','center').append(divLogs);
				centerPanel.layout('panel','south').append(tiketChatEnter);
	
				tiketTabs.tabs({fit:true,height:200});
				tiketTabs.tabs('add',{iconCls:'icon-description',title:'Основное',style:{padding:10},fit:true,content:dirtable});
				tiketTabs.tabs('add',{iconCls:'icon-info',title:'Решение',fit:true,content:tiketSolution});
				tiketTabs.tabs('add',{iconCls:'icon-bubble',title:'Комментарий',fit:true,content:commentLayout});
//tiketTabs.tabs('add',{title:'Вложения',fit:true,content:''});
				tiketTabs.tabs('select','Основное');
	
				commentLayout.layout({fit:true,style:{padding:0}})
				commentLayout.layout('add',{region:'north'});
				commentLayout.layout('add',{region:'east',width:200,split:true})
				commentLayout.layout('add',{region:'center',split:true})
				commentLayout.layout('panel','north').append(btnSend).append(btnFile).append(commentPanel);
				commentLayout.layout('panel','center').append(formComment);
				commentPanel.panel({height:19,width:'100%',content:'<b style="margin:5px">Кому:</b> <i>'+data.sendersurname+' '+data.sendername+' '+data.senderpatronymic+' &lt;'+data.sendermail+'&gt;</i>'});
			
				infoGrid.propertygrid({
					fit:true,
					nowrap:false,
					style:{border:0},
					data:dataInfo,
					showGroup:true,
					showHeader:false,
					scrollbarSize:0,
					columns:[[{field:'name',width:'41%',align:'right',styler:function(value,row,index){return {style:'background:#E5E5E5;font-weight:bolder'}}},{field:'value',width:'55%',formatter:function(value,row){
						if(!!row.editor && row.editor.type==='combobox'){
							var data=row.editor.options.data;
							for(var i=0;i<data.length;i++){
								if(data[i].id===row.value){return data[i].name;}
							}
						}else{
							return value;
						}
					}}]]
				});
				infoAccount.datalist({
					/*toolbar:[{iconCls:'icon-print',text:'Печать',handler:function(e){
						var data={
							fio:dataAccount[0].text,
							login:dataAccount[1].text,
							password:dataAccount[2].text
						}
						printAccountInfo(data);
					}}],*/
					fit:true,
					lines: true,
					title:'Учетные данные',
					collapsible:true,
					data:dataAccount,
					groupField:'group'
				});
				if(!data.account){
					
				}
				tiketChatEnter.textbox({fit:true,buttonText:'Отправить',onClickButton:function(){
					var text=$(this).val();
					if(text){
						$.messager.progress({});
						socket.emit('tiketcomment',{text:text,tiket:data.id,date:moment()});
						socket.on('tiketcomment'+data.id,function(msg){
							divLogs.prepend(msg);
							$.messager.progress('close');
							socket.removeListener('tiketcomment'+data.id);						
						});
					}
				}});
				textSend.textbox({multiline:true,fit:true});
				tiketSolution.textbox({multiline:true,fit:true,value:data.solution});
				fileSend.change(function(){attachFiles(commentLayout.layout('panel','east'),this)});
				btnFile.linkbutton({iconCls: 'icon-attachment',text:'Прикрепить',onClick:function(){fileSend.click();}});
				btnSend.linkbutton({iconCls: 'icon-email',text:'Отправить',
					onClick:function(){
						if(textSend.textbox('getValue')){
							var workerMail=localStorage.getItem('user');
							$.messager.progress({});
							formComment.form('submit',{
								url:'tiketSendMail',
								queryParams:{id:data.id,topic:data.topicname,sendermail:data.sendermail,worker:workerMail,description:data.description,datestart:moment(data.startdate).format('DD.MM.YYYY HH:mm:ss')},
								success: function(msg){
									$.messager.progress('close');
									logsAppend.call(dialog,JSON.parse(msg));
									goMessage();
									commentLayout.layout('panel','east').html('');
									textSend.textbox('setValue','');
									fileSend.val('');
								}
							});
						}
						else{
							$.messager.alert('Внимание!','Не заполнено тело письма!','error');
						}
					}
				});
				checkStatus();
				/*if(data.workerstatus>1 && data.status>2){
					for(var i=0;i<toolbar.length;i++){if(i!==3){toolbar[i].disabled=true;}}
					if($.inArray(2, worker.groups)>=0){toolbar[5].disabled=false;}
					toolbar.unshift({id:'btn-gettiket',text:getTranslate(['tikets','form','btns','getTiket']),iconCls:'icon-checkmark',handler: function(){getTiket();}})
					disableTabs(1);
					tiketChatEnter.textbox('disable');
				}*/
				dialog.dialog({
					minimizable:false,
					maximizable:true,
					title:'Заявка №'+data.id+' / Тема:'+data.topicname,
					toolbar:toolbar,
					height:500,
					width:1100,
					onBeforeClose:function(){
						localStorage.setItem('tiketwindmax', dialog.dialog('options').maximized);
						if($('#dialog-tiket-editor-'+data.id).length){
							$('#dialog-tiket-editor-'+data.id).dialog('close');
						}
					},
					onClose:function(){
						socket.removeListener('chattiket'+data.id);
						socket.removeListener('edittiketstatus'+data.id);
						$(this).dialog('destroy');
					}
				});
				checkStatusForAdmin();
				if(twinmax==='true'){dialog.dialog('maximize');}
				checkImportance(data.importance,dialog);
			
			
for(var i=0;i<dt.length;i++){
	infoGrid.propertygrid('appendRow',{name:"Телефон",value:dt[i],group:"Дополнительная информация"});
}
//infoGrid.propertygrid('collapseGroup',0);
//infoGrid.propertygrid('collapseGroup',2);
//infoGrid.propertygrid('collapseGroup',3);
				
				logsAppend.call(dialog,data.logs);
				
				socket.on('chattiket'+id,function(msg){logsAppend.call(dialog,msg);});
				socket.on('edittiketstatus'+id,function(msg){
					$.extend(data,msg);
					console.log(msg)
					delete data.msgArray;
					var tr=$('#worker-'+msg.conformity)
					var disable=function(){
						tr.find('#worker').combobox('disable');
						tr.find('#btn-'+msg.conformity).linkbutton('disable');
						tr.find('#note-'+msg.conformity).textbox('disable');
					}
					if(!!msg.status && msg.status<3){disable();}
					if(!!msg.newWorker && msg.newWorker!==worker.login){
						tr.find('#worker').combobox('setValue',msg.newWorker);
						disable();
					}
					if(msg.tiketstatus){data.status=msg.tiketstatus;}
					if(!!msg.appendComp){
					//	infoGrid.propertygrid('updateRow',{index: 8,row: {value: msg.appendComp.senderip}})
					//	infoGrid.propertygrid('updateRow',{index: 9,row: {value: msg.appendComp.sendercompname}})
					
						infoAccount.propertygrid('updateRow',{index: 5,row: {value: `${msg.appendComp.senderip} / ${msg.appendComp.sendercompname}`}})
					}
					if(!!msg.appendPhone){
					//	infoGrid.propertygrid('updateRow',{index: 13,row: {value: msg.appendPhone.cityphone}})
					//	infoGrid.propertygrid('updateRow',{index: 14,row: {value: msg.appendPhone.internalphone}})
						infoAccount.propertygrid('updateRow',{index: 4,row: {value: `${msg.appendPhone.cityphone} / ${msg.appendPhone.internalphone}`}})
					}
					if(!!msg.deadline){
						infoGrid.propertygrid('updateRow',{index: 1,row: {value: moment(msg.deadline).format('DD.MM.YYYY HH:mm:ss')}})
					}
					checkStatusForAdmin();
					checkStatus();
					logsAppend.call(dialog,msg.msgArray);
					$.messager.progress('close');
				});
/*infoGrid.datagrid('getRows').forEach(function(element){
	if(element.name==='Выполнить до'){
		var index=infoGrid.datagrid('getRowIndex',element);
		infoGrid.datagrid('updateRow',{
			index: index,
			row: {value:moment(data.deadline).format('DD.MM.YYYY HH:mm:ss')}
		});
	}
});*/							
				$.messager.progress('close');
				socket.removeListener('tiketinfo'+data.id);
			});
		}
	};
	switch(topicname){
		case 'Новый сотрудник': tiketNewEmployee(); break;
		default: tiketAll(); break;
	}
})();