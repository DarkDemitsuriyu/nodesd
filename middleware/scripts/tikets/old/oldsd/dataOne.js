module.exports=function(id,callback){
	var moment = require('moment');
	vdesk.mysqlPool.getConnection(function(err,connection){
		var sql="SELECT LPAD(tikets.id_tiket,6,0) AS id,tikets.ID_topic AS topicid  ,CONCAT (tikets.sender_surname, ' ', SUBSTRING(tikets.sender_name, 1, 1),'.', SUBSTRING(tikets.sender_middlename, 1, 1), '.') AS sender,tikets.other_topic AS topicname,tikets.tiket_deadline AS deadline,tikets.importance,tikets.tiket_status_for_admin AS statusconfirm,tiket_statuses.name_tstatus AS status,tikets.tiket_new AS new,tikets.screenshot AS attachment,tikets.description,department.dep_name AS department,CONCAT (workers.w_surname, ' ', SUBSTRING(workers.w_name, 1, 1),'.', SUBSTRING(workers.w_middlename, 1, 1), '.') AS worker FROM tikets, workers, tiket_statuses, department WHERE workers.login=tikets.login AND tikets.tiket_status_internal=tiket_statuses.id_tstatus AND department.ID_department=tikets.ID_department AND workers.ID_section = 2 AND workers.activity='yes' WHERE tikets.id_tiket=? ORDER BY id ASC";
		connection.query(sql,id, function(err, results) {
			if (err) throw err;
			connection.release();
			callback(results[0]);
		});
	});
};