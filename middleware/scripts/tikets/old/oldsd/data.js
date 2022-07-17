/*module.exports=function(login,clback){
	
	var moment = require('moment');
	var async=require('async');
	var compareTiket=require('lib/compareTiket');
	mysql.getConnection(function(err,connection){
		console.log(err)
		async.parallel([
			function(callback){
				var sql="SELECT LPAD(tikets.id_tiket,6,0) AS id,tikets.ID_topic AS topicid,CONCAT (tikets.sender_surname, ' ', SUBSTRING(tikets.sender_name, 1, 1),'.', SUBSTRING(tikets.sender_middlename, 1, 1), '.') AS sender,tikets.other_topic AS topicname,tikets.tiket_deadline AS deadline,tikets.importance,tikets.tiket_status_for_admin AS statusconfirm,tiket_statuses.name_tstatus AS status,tikets.tiket_new AS new,tikets.screenshot AS attachment,tikets.description,department.dep_name AS department,CONCAT (workers.w_surname, ' ', SUBSTRING(workers.w_name, 1, 1),'.', SUBSTRING(workers.w_middlename, 1, 1), '.') AS worker FROM tikets, workers, tiket_statuses, department WHERE workers.login=tikets.login AND tikets.tiket_status_internal=tiket_statuses.id_tstatus AND department.ID_department=tikets.ID_department AND workers.ID_section = 2 AND workers.activity='yes' ORDER BY id ASC";
				connection.query(sql,login, function(err, results) {
					if (err) throw err;
					callback(null,results);
				});
			},
			function(callback){
				var sql="SELECT DISTINCT LPAD(tikets.id_tiket,6,0) AS id,tikets.ID_topic AS topicid,CONCAT (tikets.sender_surname, ' ', SUBSTRING(tikets.sender_name, 1, 1),'.', SUBSTRING(tikets.sender_middlename, 1, 1), '.') AS sender,tikets.other_topic AS topicname,tikets.tiket_deadline AS deadline,tikets.importance,tikets.tiket_status_for_admin AS statusconfirm,tiket_statuses.name_tstatus AS status,tikets.tiket_new AS new,tikets.screenshot AS attachment,tikets.description,department.dep_name AS department,'Ответственные' AS worker FROM tikets,workers,tiket_statuses,new_user_orders,department WHERE tikets.id_tiket=new_user_orders.id_tiket AND tikets.tiket_status_internal=tiket_statuses.id_tstatus AND workers.ID_section = 2 AND department.ID_department=tikets.ID_department AND workers.activity='yes' ORDER BY id ASC";
				connection.query(sql,login, function(err, results) {
					if (err) throw err;
					callback(null,results);
				});
			}
		],function(err,result){
			var result=result[0].concat(result[1]);
			result.sort(compareTiket);
			connection.release();
			clback(result);
		})
	});
};
*/
var moment = require('moment');
var async=require('async');
var compareTiket=require('lib/compareTiket');
var mysql = require('mysql').createPool({
	"connectionLimit" 	: 10,
	"host"     			: "localhost",
	"user"    			: "sdesk",
	"password" 			: "r8wQa8MpFqKy4FfX",
	"database" 			: "sdesk",
	"debug"				: false
});
	
module.exports=function (req,res,next){
	var login=req.session.user.login;
	this.getData=function(){
		mysql.getConnection(function(err,connection){
			var getTiketsAll=function(){
				return new Promise(function(resolve, reject){
					var sql="SELECT LPAD(tikets.id_tiket,6,0) AS id,tikets.ID_topic AS topicid,CONCAT (tikets.sender_surname, ' ', SUBSTRING(tikets.sender_name, 1, 1),'.', SUBSTRING(tikets.sender_middlename, 1, 1), '.') AS sender,tikets.other_topic AS topicname,tikets.tiket_deadline AS deadline,tikets.importance,tikets.tiket_status_for_admin AS statusconfirm,tiket_statuses.name_tstatus AS status,tikets.tiket_new AS new,tikets.screenshot AS attachment,tikets.description,department.dep_name AS department,CONCAT (workers.w_surname, ' ', SUBSTRING(workers.w_name, 1, 1),'.', SUBSTRING(workers.w_middlename, 1, 1), '.') AS worker FROM tikets, workers, tiket_statuses, department WHERE workers.login=tikets.login AND tikets.tiket_status_internal=tiket_statuses.id_tstatus AND department.ID_department=tikets.ID_department AND workers.ID_section = 2 AND workers.activity='yes' ORDER BY id ASC";
					connection.query(sql,login, function(err, results) {
						if (err) throw err;
						resolve(results);
					});
				});
			};
			var getTiketsNewWorker=function(){
				return new Promise(function(resolve, reject){
					var sql="SELECT DISTINCT LPAD(tikets.id_tiket,6,0) AS id,tikets.ID_topic AS topicid,CONCAT (tikets.sender_surname, ' ', SUBSTRING(tikets.sender_name, 1, 1),'.', SUBSTRING(tikets.sender_middlename, 1, 1), '.') AS sender,tikets.other_topic AS topicname,tikets.tiket_deadline AS deadline,tikets.importance,tikets.tiket_status_for_admin AS statusconfirm,tiket_statuses.name_tstatus AS status,tikets.tiket_new AS new,tikets.screenshot AS attachment,tikets.description,department.dep_name AS department,'Ответственные' AS worker FROM tikets,workers,tiket_statuses,new_user_orders,department WHERE tikets.id_tiket=new_user_orders.id_tiket AND tikets.tiket_status_internal=tiket_statuses.id_tstatus AND workers.ID_section = 2 AND department.ID_department=tikets.ID_department AND workers.activity='yes' ORDER BY id ASC";
					connection.query(sql,login, function(err, results) {
						if (err) throw err;
						resolve(results);
					});
				});
			};
			Promise.all([
				getTiketsAll,
				getTiketsNewWorker()
			]).then(function(results){
				var result=result[0].concat(result[1]);
				result.sort(compareTiket);
				connection.release();
				res.send(result);
			});
		});
	};
};