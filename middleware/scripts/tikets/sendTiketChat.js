var moment=require('moment');
module.exports=function(data,io,divisionRoom){
	vdesk.mysqlPool.getConnection((err,connection) => {
		connection.query('INSERT INTO tikets_logs SET ?', data, (err, results) => {
			if (err) throw err;
			var sql="SELECT CONCAT(surname,' ',LEFT(name,1),'.',LEFT(patronymic,1),'.') AS who FROM directory_workers WHERE login=?";
			connection.query(sql,data.worker, (err, results) => {
				if (err) throw err;
				data.who=results[0].who
				connection.release();
				console.log({header:data.tiket,data:{logs:data}})
				io.to(divisionRoom).emit('sendtiketchat',{header:data.tiket,data:{data:{logs:data}}})				
			});
		});
	});
}; 