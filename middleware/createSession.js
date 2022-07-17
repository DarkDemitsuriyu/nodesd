var async=require('async');

module.exports=function(session,callback){
	if('user' in session){
		var login=session.user.login
		vdesk.mysqlPool.getConnection(function(err,connection){
			async.parallel([
				function(callback){
					//var cols=['directory_workers.name','directory_workers.patronymic','directory_workers.surname','directory_workers.cityphone','directory_workers.internalphone','directory_workers.email','directory_workers.jabber','directory_workers.department','directory_workers.expiriens','directory_workers.coins','directory_workers.level','directory_workers.achivmentpoint','directory_workers.division'];
					//var tables=['directory_workers'];
					//connection.query('SELECT ?? FROM ?? WHERE login = ?', [cols,tables,login], function(err, results) {
						//if (err) throw err;
						//results[0].login=login;
						//session.user=results[0];
						callback(null)
					//});
				},
				function(callback){
					//var cols=['directory_workers_in_group.group'];
					//var tables=['directory_workers_in_group'];
					//connection.query('SELECT ?? FROM ?? WHERE worker = ?', [cols,tables,login], function(err, results) {
						//if (err) throw err;
						//session.user.groups=[];
						//for(var i=0;i<results.length;i++){session.user.groups.push(results[i].group);}
						callback(null);					
					//});
				}
			/*,
			function(callback){
				var mmenu=[];
				var tables=['menu_main','menu_secondary','directory_access_menu_for_division','directory_workers','directory_workers_in_division','directory_access_menu_for_group','directory_access_menu_for_workers'];
				var sql='SELECT DISTINCT menu_main.* FROM ?? '+
				'WHERE menu_main.id = menu_secondary.mainmenu '+
				'AND menu_secondary.id IN (directory_access_menu_for_division.menu,directory_access_menu_for_workers.menu,directory_access_menu_for_group.menu) '+
				'AND directory_access_menu_for_division.division=directory_workers_in_division.division '+
				'AND directory_workers_in_division.worker=directory_workers.login '+
				'AND directory_access_menu_for_workers.worker = directory_workers.login '+
				'AND directory_access_menu_for_group.group = directory_workers.group '+
				'AND directory_workers.login = ? ORDER BY menu_main.orders ASC';
				var query=connection.query(sql,[tables,login]);
				query.on('result',function(row){
					connection.pause();
					mysql.getConnection(function(err,connect){
						var tables=['menu_secondary','directory_access_menu_for_division','directory_workers','directory_workers_in_division','directory_access_menu_for_group','directory_access_menu_for_workers'];
						var sql='SELECT DISTINCT menu_secondary.* FROM ?? '+
						'WHERE menu_secondary.id IN (directory_access_menu_for_division.menu,directory_access_menu_for_workers.menu,directory_access_menu_for_group.menu) '+
						'AND directory_access_menu_for_division.division=directory_workers_in_division.division '+
						'AND directory_workers_in_division.worker=directory_workers.login '+
						'AND directory_access_menu_for_workers.worker = directory_workers.login '+
						'AND directory_access_menu_for_group.group = directory_workers.group '+
						'AND menu_secondary.mainmenu = ? '+
						'AND directory_workers.login = ? ORDER BY menu_secondary.orders ASC';
						connect.query(sql,[tables,row.id,login],function(err,results){
							if (err) throw err;
							row.submenu=results;
							mmenu.push(row)
							connection.resume();
						});
						connect.release();
					});
				}).on('end',function(){
					connection.release();
					resobj.mmenu=mmenu
					callback(null);
				});
			}*/
			],function(err){
				//if(!err){return callback(null,true);}			
				connection.release();
				callback(null,session);
			});
		});
	} else {
		callback(null,null);
	}
}