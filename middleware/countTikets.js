var async=require('async');
var config = require('config');

module.exports=function(login,callback){
	var resobj={};
	vdesk.mysqlPool.getConnection(function(err,connection){
		async.parallel([
			function(callback){
				var tables=['tikets_main'];
				connection.query('SELECT COUNT(*) AS cnt FROM ?? WHERE worker=? AND (status=? OR status=?)',[tables,login,'1','2'],function(err,results){
					resobj.compleeted=results[0].cnt;
					callback(null);
				});
			},
			function(callback){
				var tables=['tikets_main'];
				connection.query('SELECT COUNT(*) AS cnt FROM ?? WHERE worker=?',[tables,login],function(err,results){
					resobj.all=results[0].cnt;
					callback(null);
				});
			},
			function(callback){
				var tables=['tikets_main'];
				connection.query('SELECT COUNT(*) AS cnt FROM ?? WHERE worker=? AND (status=? OR status=?)',[tables,login,'3','5'],function(err,results){
					resobj.performed=results[0].cnt;
					callback(null);
				});
			},
			function(callback){
				var tables=['tikets_main'];
				connection.query('SELECT COUNT(*) AS cnt FROM ?? WHERE worker=? AND status=?',[tables,login,'4'],function(err,results){
					resobj.confirmation=results[0].cnt;
					callback(null);
				});
			},
			function(callback){
				var tables=['tikets_main'];
				connection.query('SELECT COUNT(*) AS cnt FROM ?? WHERE worker=? AND new=?',[tables,login,'1'],function(err,results){
					resobj.tnew=results[0].cnt;
					callback(null);
				});
			},
			function(callback){
				var tables=['directory_workers'];
				connection.query('SELECT level,expiriens,achivmentpoint,coins FROM ?? WHERE login=?',[tables,login],function(err,results){
					var lvl=results[0].level;
					var exp=results[0].expiriens;
					var minexp=config.get('workers:minexp');
					var factor=config.get('workers:factor');
					//if(config.get('workers:lvlstart')){
						if(lvl>1){exp=exp-Math.round(minexp*Math.pow(factor,lvl))};				
					//}
					resobj.maxexplvl=Math.round(minexp*Math.pow(factor,lvl+1));
					resobj.achp=results[0].achivmentpoint;
					resobj.exp=exp;
					resobj.lvl=lvl;
					resobj.coins=results[0].coins;
					callback(null);
				});
			}
		],function(err){
			callback(resobj);
		});
		connection.release();
	});
}		