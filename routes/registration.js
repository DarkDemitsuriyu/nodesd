var lang = require('lang');

exports.get=function(req,res){
	var data={params:req.params,title:lang.get('sections:registration')}
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('SELECT id,name FROM directory_departments ORDER BY name ASC', function(err, results) {
			if (err) throw err;
			data.dep=results;
			connection.query('SELECT id,name FROM directory_divisions ORDER BY name ASC', function(err, results) {
				if (err) throw err;
				data.div=results;
				connection.release();
				res.render('registration', data);
			});
		});
	});
};
exports.checkUser=function(req,res){
	var error=false;
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('SELECT COUNT(*) AS c FROM directory_workers WHERE login= ?',req.query.login, function(err, results) {
			if (err) throw err;
			if(results[0].c){error=true}
			connection.release();
			res.send(error)
		});
	});
}
exports.post=function(req,res){
	var data={params:req.params,title:lang.get('sections:registration')}
	var criptPass=require('lib/criptPass')
	req.body.password=criptPass(req.body.password);
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('INSERT INTO directory_workers SET ?',req.body, function(err, results) {
			data.registration=true;
			connection.release();
			res.render('registration', data);
		});
	});
};