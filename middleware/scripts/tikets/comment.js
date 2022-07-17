var moment=require('moment');
module.exports=function(data,callback,user){
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('INSERT INTO tikets_logs SET ?', data, function(err, results) {
			if (err) throw err;
			var sql="SELECT CONCAT(surname,' ',LEFT(name,1),'.',LEFT(patronymic,1),'.') AS worker FROM directory_workers WHERE login=?";
			connection.query(sql,data.worker, function(err, results) {
				if (err) throw err;
				var msg='<i>'+moment(data.date).format('DD.MM.YYYY HH:mm:ss')+'</i>-&gt;<span>'+results[0].worker+'</span>'+data.text+'<br>';
				connection.release();
				callback(msg);
			});
		});
	});
};