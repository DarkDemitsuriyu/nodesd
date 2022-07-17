(function (){
	var Form=new FormWindow();
	Form.title=Form.titleNew='Аккаунт сотрудника';
	Form.fields=[
		{name:'switch',label:'Отредактировать',type:'switch',onChange:function(checked){
			var tbl=$(this).parent().parent().parent();
			tbl.find('#login').textbox('readonly',!checked);
			tbl.find('#loginMail').textbox('readonly',!checked);
			tbl.find('#jabber').textbox('readonly',!checked);
			tbl.find('#password').textbox('readonly',!checked);
			tbl.find('#passwordMail').textbox('readonly',!checked);
			tbl.find('#passwordJabber').textbox('readonly',!checked);
		}},
		{require:true,name:'fio',label:'Фамилия',type:'text',onChange:function(newValue){
			var tbl=$(this).parent().parent().parent().parent();
			var pasRule={length:8,special:false};
			var loginRule=["*",1,1];
			var id=tbl.find('#id').val()*1;
			var login=loginGenerator(newValue,loginRule);
			var fioArray=newValue.split(' ');
			var dataGrid=$('#tabcontent-shared-usersaccounts').treegrid('getData');
			var i=0;
			var loginGen=function(){
				var isValid=true;
				var validateLogin=function(data,login){
					$.each(data,function(indx,obj){
						if(obj.login===login && obj.id!==id){isValid=false;}
						if(obj.children){validateLogin(obj.children,login);}
					});
				};
				validateLogin(dataGrid,login)
				if(!isValid){
					if(fioArray[2].length>loginRule[2] && (loginRule[2]<=loginRule[1] && fioArray[2].length-loginRule[2]>0)){
						loginRule[2]++;
						login=loginGenerator(newValue,loginRule);
					}else if(fioArray[1].length>loginRule[1] && (loginRule[2]>=loginRule[1] && fioArray[1].length-loginRule[1]>0)){
						loginRule[1]++
						login=loginGenerator(newValue,loginRule);
					}else if(~login.indexOf("_")){
						var position=loginRule[1]+1+loginRule[2]
						var name=login.substr(0,position);
						var next=login.substr(position);						
						login=name+'_'+next;
					} else {
						var name=login.substr(0,loginRule[1]);
						var next=login.substr(loginRule[1]);						
						login=name+'_'+next;
					}
					loginGen();
				}else{
					return false;
				}
			}			
			loginGen();
			tbl.find('#login').textbox('setValue',login);
			tbl.find('#loginMail').textbox('setValue',login.toLowerCase()+'@tyumen.rgs.ru');
			tbl.find('#jabber').textbox('setValue',login.toLowerCase());
			tbl.find('#password').textbox('setValue',customPassword(pasRule));
			tbl.find('#passwordMail').textbox('setValue',customPassword(pasRule));
			tbl.find('#passwordJabber').textbox('setValue',123);
		}},
		{require:true,readonly:true,name:'login',label:'Логин от компьютера',type:'text'},
		{require:true,readonly:true,name:'password',label:'Пароль от компьютера',type:'passGen'},
		{require:true,readonly:true,name:'loginMail',label:'Почта',type:'text'},
		{require:true,readonly:true,name:'passwordMail',label:'Пароль почты',type:'passGen'},
		{require:true,readonly:true,name:'jabber',label:'Jabber',type:'text'},
		{require:true,readonly:true,name:'passwordJabber',label:'Пароль jabber',type:'passGen'},
		{require:true,name:'department',label:'Подразделение',type:'select',typedir:'directorys-departments'},
		{require:true,name:'division',label:'Отдел',type:'select',typedir:'directorys-divisions'},
		{require:false,name:'note',label:'Комментарий',type:'textarea',width:200,height:60}
	];
	Form.createWindow();
})();