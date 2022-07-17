exports.getData=async function(login,req){
	let [data] = await vdesk.mysql.query('SELECT * FROM menu_secondary')
	return data
}
/*
var async=require('async');
module.exports=function (req,res,next){
	var data=req.body;
	var io=req.app.get('io');
	var type=data.type;
	var url=data.url;
	var callback=data.callback;
	delete data.type;
	delete data.url;
	delete data.callback;
	
	this.getData=function(){
		vdesk.mysqlPool.getConnection(function(err,connection){
			async.parallel([
				function(callback){
					var sql='SELECT DISTINCT CONCAT("123456789",menu_main.id) AS id,false AS isItem, menu_main.name, IF(menu_main.id IN (SELECT DISTINCT mainmenu FROM menu_secondary),"closed",null) AS state FROM menu_main,menu_secondary ORDER BY menu_main.orders';
					connection.query(sql, function(err, results) {
						if (err) throw err;
						callback(null,results);
					});
				},
				function(callback){
					var sql='SELECT menu_secondary.*, true AS isItem, CONCAT("123456789",menu_main.id) AS _parentId FROM menu_main,menu_secondary WHERE menu_secondary.mainmenu = menu_main.id ORDER BY menu_secondary.orders';
					connection.query(sql, function(err, results) {
						if (err) throw err;
						callback(null,results);
					});
				},
			],function(err,result){
				var result=result[0].concat(result[1]);
				result.forEach(function(item){
					item._parentId*=1;
					item.id*=1;
				});
				connection.release();
				res.send({rows:result});
			});
		});
	};
	
	this.setData=function(){
		vdesk.mysqlPool.getConnection(function(err,connection){
			switch(type){
				case 'new':
					delete data.id;
					connection.query('INSERT INTO menu_secondary SET ?', data, function(err, results) {
						if (err) throw err;
						data._parentId='123456789'+data.mainmenu;
						data.id=results.insertId;
						data.type=type;
						data.isItem=true;
						connection.release();
						callback(url,data,type);
					});
				break;
				case 'edit':
					connection.query('UPDATE menu_secondary SET name=?,link=?,orders=?,mainmenu=? WHERE id = ? ', [data.name,data.link,data.orders,data.mainmenu,data.id], function(err, results) {
						if (err) throw err;
						data._parentId='123456789'+data.mainmenu;
						data.isItem=true;
						connection.release();
						callback(url,data,type);
					});
				break;
				case 'delete':
					connection.query('DELETE FROM menu_secondary WHERE id = ?', data.id , function(err, results) {
						if (err) throw err;
						connection.release();
						callback(url,data,type);
					});
				break;
			}
		});
		res.end();
	}
};*/