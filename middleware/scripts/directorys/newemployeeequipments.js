exports.getData=async function(login,req){
	let data = await vdesk.mysql.query('SELECT tikets_new_employee_equipments.*,directory_topics.name AS topicname FROM directory_topics,tikets_new_employee_equipments WHERE tikets_new_employee_equipments.topic = directory_topics.id')
	return data
}

exports.setData=async function(req,res,next){
	/*let data = await vdesk.mysql.query('SELECT * FROM clients_forums_knowledge_base')
	res.send(data)*/
}

/*
module.exports=function (req,res,next){
	var data=req.body;
	var io=req.app.get('io');
	var type=data.type;
	var url=data.url;
	var callback=data.callback;
	delete data.type;
	delete data.url;
	delete data.callback;
	var getSql=function(query,adds,callback){
		vdesk.mysqlPool.getConnection(function(err,connection){
			connection.query(query,adds,function(err,results) {
				if (err) throw err;
				connection.release();
				callback(results);
			});
		});
	};
	
	this.getData=function(){getSql('SELECT tikets_new_employee_equipments.*,directory_topics.name AS topicname FROM directory_topics,tikets_new_employee_equipments WHERE tikets_new_employee_equipments.topic = directory_topics.id',null,function(data){res.send(data);});};
	
	this.setData=function(){
		switch(type){
			case 'new':
				delete data.id;
				getSql('INSERT INTO directory_jobtitle SET ?',data,function(results){
					var topicname=results[0].name;
					vdesk.mysqlPool.getConnection(function(err,connection){
						connection.query('INSERT INTO tikets_new_employee_equipments SET ?', data, function(err, results) {
							if (err) throw err;
								data.topicname=topicname;
								data.id=results.insertId;
								data.type=type;
								connection.release();
								callback(url,data,type);							
						});
					});
					callback(url,data,type);
				});
			break;
			case 'edit': getSql('UPDATE tikets_new_employee_equipments SET name=?,topic=? WHERE id = ? ',[data.name,data.topic,data.id],function(results){
				vdesk.mysqlPool.getConnection(function(err,connection){
					connection.query('SELECT name FROM directory_topics WHERE id = ?', data.topic, function(err, results) {
						data.topicname=results[0].name;
						connection.release();
						callback(url,data,type);
					});
				});
			}); break;
			case 'delete': getSql('DELETE FROM tikets_new_employee_equipments WHERE id = ?',data.id,function(results){callback(url,data,type);}); break;
		}
		res.end();
	}
};*/