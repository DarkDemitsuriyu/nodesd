var dataOneMy=require('middleware/scripts/tikets/my/dataOne');
var dataOneAll=require('middleware/scripts/tikets/all/dataOne');
var xmppSend=require('middleware/xmppSend');
var mailSend=require('middleware/mailSend');
var moment=require('moment');
var async=require('async');
module.exports=function(data,worker,clbk){
	var workerFio=worker.surname+' '+worker.name.charAt(0)+'.'+worker.patronymic.charAt(0)+'.';
	var date=moment();
	var clbdata={};
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('SELECT COUNT(*) AS w FROM tikets_main,directory_workers WHERE directory_workers.status>1 AND directory_workers.login=tikets_main.worker AND tikets_main.status>2 AND tikets_main.id = ?', data.id, function(err, results) {
			if (err) throw err;
			if(results[0].w){
				var msgArray=[{date:date,worker:workerFio,text:'<b>Принял заявку в работу</b>'}];
				async.parallel([
					function(callback){
						connection.query('UPDATE tikets_main SET worker=? WHERE id = ?', [worker.login,data.id], function(err, results) {
							if (err) throw err;
							callback(null);
						});
					},
					function(callback){
						var datalogs={tiket:data.id,worker:worker.login,date:date.format('YYYY-MM-DD HH:mm:ss'),text:'<b>Принял заявку в работу</b>'};
						connection.query('INSERT INTO tikets_logs SET ?', datalogs, function(err, results) {if (err) throw err;	});
						callback(null);
					},
					function(callback){
						var sql="SELECT directory_workers.jabber FROM directory_workers,directory_workers_in_group WHERE directory_workers_in_group.group=2 AND directory_workers_in_group.worker=directory_workers.login AND directory_workers.division=(SELECT division FROM directory_workers WHERE login=?)";
						connection.query(sql,worker.login, function(err, results) {
							if (err) throw err;
							for(var i=0;i<results.length;i++){xmppSend(results[i].jabber,'Ваш сотрудник '+workerFio+' принял в работу заявку №'+data.id);}
						});
						callback(null);
					},
					function(callback){
						var bodyMail='<b>У вашей заявки сменился исполнитель!</b><br><b>Заявленная проблема: </b>'+data.description+'<br><b>Дата подачи заявки: </b>'+data.datestart+'<br><b>Исполнитель: </b>'+worker.surname+' '+worker.name+' '+worker.patronymic+'<br><b>Контактная информация</b><br><b>Телефон: </b> Городской: '+worker.cityphone+', Внутренний телефон: '+worker.internalphone+'<br><b>E-mail: </b>'+worker.email+'<br>';
						mailSend(data.id,data.topicname,data.sendermail,worker.email,bodyMail,null);
						callback(null);
					},
					function(callback){
						dataOneMy(data.id,function(obj){
							clbdata.data=obj;
						});
						dataOneAll(data.id,function(obj){
							clbdata.dataall=obj;
						});
						callback(null);
					}
				], function (err) {
					connection.release();
					clbdata.msgArray=msgArray;
					clbk(clbdata);
				});
			}else{
				clbk('Другой сотрудник уже принял эту заявку в работу или же заявка закрыта!');
			}
		});
	});
};