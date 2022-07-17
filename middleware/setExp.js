module.exports=async function(login,imp,returned = false){
	var config = require('config');
	var newExp=imp ? 5 : 3;
	var newCoin=imp ? 4 : 2;
	var sql=`UPDATE directory_workers SET ${ returned ? 'coins=coins-?, expiriens=expiriens-?' : 'coins=coins+?, expiriens=expiriens+?'} WHERE login=?`;
	//if(type==='return'){sql='UPDATE directory_workers SET coins=coins-?, expiriens=expiriens-? WHERE login=?';}
	await vdesk.mysql.query(sql,[newCoin,newExp,login])
	let [[results]] = await vdesk.mysql.query('SELECT level,coins,expiriens FROM directory_workers WHERE login=?', login)
	let exp=results.expiriens;
	let coins=results.coins;
	let minexp=config.get('workers:minexp');
	let factor=config.get('workers:factor');
	let lvlNew=Math.round(Math.log(exp/minexp)/Math.log(factor));
	let lvl= lvlNew>results.level ? lvlNew : results.level;
	let maxexplvl=Math.round(minexp*Math.pow(factor,lvl+1));
	if(lvl>1){
		await vdesk.mysql.query('UPDATE directory_workers SET level=? WHERE login=?', [lvl,login])
		exp=exp-Math.round(minexp*Math.pow(factor,lvl))
	};
	vdesk.io.to(`user:room:${login}`).emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl})
	/*if(post){
		
		/*var connectedSockets = io.of('/').in('user:room:'+login).connected;
		Object.keys(connectedSockets).forEach(function (socketId) {
			var socket = connectedSockets[socketId];
			if (socket.request.session.user.login === login) {
				socket.emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl});
			}
		});*
	}else{
		vdesk.io.sockets.to(`user:room:${login}`).emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl})
		//io.sockets.to('user:room:'+login).emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl});
	}
	
	/*vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query(sql, [newCoin,newExp,login], function(err, results) {
			if (err) throw err;
			connection.query('SELECT level,coins,expiriens FROM directory_workers WHERE login=?', login, function(err, results) {
				if (err) throw err;
				var exp=results[0].expiriens;
				var coins=results[0].coins;
				var minexp=config.get('workers:minexp');
				var factor=config.get('workers:factor');				
				var lvlNew=Math.round(Math.log(exp/minexp)/Math.log(factor));
				var lvl= lvlNew>results[0].level ? lvlNew : results[0].level;
				var maxexplvl=Math.round(minexp*Math.pow(factor,lvl+1));
				if(lvl>1){
					connection.query('UPDATE directory_workers SET level=? WHERE login=?', [lvl,login])
					exp=exp-Math.round(minexp*Math.pow(factor,lvl))
				};
				if(post){
					var connectedSockets = io.of('/').in('user:room:'+login).connected;
					Object.keys(connectedSockets).forEach(function (socketId) {
						var socket = connectedSockets[socketId];
						if (socket.request.session.user.login === login) {
							socket.emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl});
						}						
					});
				}else{
					io.sockets.to('user:room:'+login).emit('resetExpCoins',{coins:coins,exp:exp,lvl:lvl,maxexplvl:maxexplvl});
				}
				connection.release();
			});
		});
	});*/
}