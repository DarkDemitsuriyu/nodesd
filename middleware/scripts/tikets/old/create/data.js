module.exports=function(req,res,next){//data,callback,login,socket
	var data=req.body;
	console.log(data);
	var type=data.type;
	var url=data.url;
	var division=data.division;
	var io=req.app.get('io');
	delete data.type;
	delete data.url;
	delete data.id;
	delete data.division;
	delete data.callback
	var dataOneAll=require('middleware/scripts/tikets/all/dataOne');
	var dataOneMy=require('middleware/scripts/tikets/my/dataOne');	
	var mailSend=require('middleware/mailSend');
	var xmppSend=require('middleware/xmppSend');
	var moment = require('moment');
	var config = require('config');
	var async = require('async');
	var dns = require('dns');
	var returnData;
	var senderIp=req.ip.replace('::ffff:','');	
	data.importance=0;
	data.senderip=senderIp;
	data.startdate=moment().format();	
	switch(moment().day()){
		case 5: data.deadline=moment().add(3, 'days').format(); break;
		case 6: data.deadline=moment().add(2, 'days').format(); break;
		default: data.deadline=moment().add(1, 'days').format(); break;
	}
	this.setData=function(){
		vdesk.mysqlPool.getConnection(function(err,connection){
			async.waterfall([
				function(callback){
					dns.setServers(config.get('dns'));
					dns.reverse(senderIp, function(err, hostnames){
						if(!!!hostnames){hostnames=['Неизвестен'];}
						data.sendercompname=hostnames[0];
						callback(null);
					});
				},
				function(callback){
					connection.query('INSERT INTO tikets_main SET ?', data, function(err, results) {
						if (err) throw err;
						callback(null,results.insertId);
					});
			}], function(err,id){
				async.parallel([
					function(callback){
						dataOneAll(id,function(obj){
							io.sockets.in('division:room:'+division+':2').emit('dataloadtikets-all',obj, 'new');
						});
						callback(null);
					},
					function(callback){
						dataOneMy(id,function(obj){
							io.sockets.in('user:room:'+data.worker).emit('dataloadtikets-my',obj, 'new');
						});
						callback(null);
					},
					function(callback){
						connection.query('SELECT jabber FROM directory_workers WHERE login=?',data.worker,function(err, results) {
							var msg='У вас новая заявка!\nТема: '+data.topicname+'\nОтправитель: '+data.sendersurname+' '+data.sendername+' '+data.senderpatronymic;
							xmppSend(results[0].jabber,msg);
						});
						callback(null);
					}],function(err){
						connection.release();
						res.end();
						//callback(url,returnData,type);
				});
			});	
		});
	};
};