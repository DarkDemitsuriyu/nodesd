module.exports=function(callback){
	var moment = require('moment');
	vdesk.mysqlPool.getConnection(function(err,connection){
		var sql="SELECT COUNT(*) AS count FROM tikets_main WHERE statusconfirm IS NOT NULL AND statusconfirm!=1";
		connection.query(sql,function(err, results) {
			if (err) throw err;
			connection.release();
			callback(results[0].count);
		});
	});
};