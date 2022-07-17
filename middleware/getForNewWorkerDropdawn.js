exports.get=function(req,res){
	var lang = require('lang');
	var async=require('async')
	vdesk.mysqlPool.getConnection(function(err,connection){
		async.parallel([
			function(callback){
				connection.query("SELECT sid AS id, name FROM directory_departments WHERE ip !='Закрыто' ORDER BY name ASC", function(err, results) {
					if (err) throw err;
					callback(null,results);
				});
			},
			function(callback){
				connection.query("SELECT id, name FROM directory_divisions ORDER BY name ASC", function(err, results) {
					if (err) throw err;
					callback(null,results);
				});
			},
			function(callback){
				connection.query("SELECT id, name FROM directory_jobtitle ORDER BY name ASC", function(err, results) {
					if (err) throw err;
					callback(null,results);
				});
			}
		], function (err,result) {
			connection.release();
			res.send(result);
		});
	});
};