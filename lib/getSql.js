var getSql=function(query,adds,callback){
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query(query,adds,function(err,results) {
			if (err) throw err;
			connection.release();
			callback(results);
		});
	});
};
module.exports=getSql;