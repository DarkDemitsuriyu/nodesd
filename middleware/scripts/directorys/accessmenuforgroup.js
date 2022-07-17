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
					var sql='SELECT DISTINCT CONCAT("123456789",id) AS id,false AS isItem, name, IF(id IN (SELECT DISTINCT directory_access_menu_for_group.group FROM directory_access_menu_for_group),"closed",null) AS state FROM directory_workers_group ORDER BY name';
					connection.query(sql, function(err, results) {
						if (err) throw err;
						callback(null,results);
					});
				},
				function(callback){
					var sql='SELECT directory_access_menu_for_group.*,true AS isItem,menu_secondary.name, CONCAT("123456789",directory_workers_group.id) AS _parentId FROM directory_access_menu_for_group,menu_secondary,directory_workers_group WHERE directory_access_menu_for_group.group=directory_workers_group.id AND directory_access_menu_for_group.menu=menu_secondary.id';
					connection.query(sql, function(err, results) {
						if (err) throw err;
						callback(null,results);
					});
				}
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
					connection.query('SELECT menu_secondary.name FROM menu_secondary WHERE menu_secondary.id = ?', data.menu , function(err, results) {
						if (err) throw err;
						var name=results[0].name;
						connection.query('INSERT INTO directory_access_menu_for_group SET ?', data, function(err, results) {
							if (err) throw err;
							data._parentId='123456789'+data.group;
							data.isItem=true;
							data.name=name;
							data.id=results.insertId;
							connection.release();
							callback(url,data,type);
						});
					});
				break;
				case 'edit':
					connection.query('UPDATE directory_access_menu_for_group SET `group`=?,`menu`=? WHERE id = ? ', [data.group,data.menu,data.id], function(err, results) {
						if (err) throw err;
						connection.query('SELECT menu_secondary.name FROM menu_secondary WHERE menu_secondary.id = ?', data.menu, function(err, results) {
							data._parentId='123456789'+data.group;
							data.isItem=true;
							data.name=results[0].name;
							connection.release();
							callback(url,data,type);
						});
					});
				break;
				case 'delete':
					connection.query('DELETE FROM directory_access_menu_for_group WHERE id = ?', data.id , function(err, results) {
						if (err) throw err;
						connection.release();
						callback(url,data,type);
					});
				break;
			}
			res.end();
		});		
	}
};*/