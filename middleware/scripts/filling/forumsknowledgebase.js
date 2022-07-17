exports.getData=async function(login,req){
	let [data] = await vdesk.mysql.query('SELECT * FROM clients_forums_knowledge_base')
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
	
	this.getData=function(){getSql('SELECT * FROM clients_forums_knowledge_base',null,function(data){res.send(data);});};
	
	this.setData=function(){
		switch(type){
			case 'new':
				delete data.id;
				getSql('INSERT INTO clients_forums_knowledge_base SET ?',data,function(results){
					data.id=results.insertId;
					data.type=type;
					callback(url,data,type);
				});
			break;
			case 'edit': getSql('UPDATE clients_forums_knowledge_base SET name=?, orders=? WHERE id = ? ',[data.name,data.orders,data.id],function(results){callback(url,data,type);}); break;
			case 'delete': getSql('DELETE FROM clients_forums_knowledge_base WHERE id = ?',data.id,function(results){callback(url,data,type);}); break;
		}
		res.end();
	}
};*/