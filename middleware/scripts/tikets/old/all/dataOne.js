module.exports=function(id,callback){
	var moment = require('moment');
	vdesk.mysqlPool.getConnection(function(err,connection){
		var sql="SELECT LPAD(tikets_main.id,6,0) AS id,tikets_main.topicid, CONCAT(tikets_main.sendersurname,' ',LEFT(tikets_main.sendername,1),'.',LEFT(tikets_main.senderpatronymic,1),'.') AS sender, tikets_main.topicname,tikets_main.deadline,tikets_main.importance,tikets_main.statusconfirm,tikets_main.status, tikets_main.new,tikets_main.attachment, tikets_main.description,directory_departments.name AS department, CONCAT(directory_workers.surname,' ',LEFT(directory_workers.name,1),'.',LEFT(directory_workers.patronymic,1),'.') AS worker FROM tikets_main,directory_workers,directory_departments WHERE directory_workers.login=tikets_main.worker AND tikets_main.id=?";
		connection.query(sql,id, function(err, results) {
			if (err) throw err;
			connection.release();
			callback(results[0]); 
		});
	});
};