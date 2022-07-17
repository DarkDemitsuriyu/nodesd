module.exports=function(id,callback){
	var moment = require('moment');
	vdesk.mysqlPool.getConnection(function(err,connection){
		console.log(id)
		//var sql="SELECT LPAD(tikets_main.id,6,0) AS id,tikets_main.topicid, CONCAT(tikets_main.sendersurname,' ',LEFT(tikets_main.sendername,1),'.',LEFT(tikets_main.senderpatronymic,1),'.') AS sender,tikets_main.topicname,tikets_main.deadline,tikets_main.importance,tikets_main.statusconfirm,tikets_main.status,tikets_main.new,tikets_main.attachment,tikets_main.description, tikets_main.worker FROM tikets_main WHERE id=?";
		var sql="SELECT * FROM views_tikets_info WHERE id=?";
		connection.query(sql,id, function(err, results) {
			console.log('dataOne',1)
			if (err) throw err;
			let send=results[0];
			var sql="SELECT * FROM views_tikets_logs WHERE tiket=? ORDER BY date DESC";
			connection.query(sql,id, function(err, results) {
				console.log('dataOne',2)
				if (err) throw err;
				send.logs=results;
				connection.release();
				callback(send);
			});			
		});
	});
};