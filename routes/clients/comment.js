exports.get=function(req,res){
	var lang = require('lang');
	var data={
		params:req.params,
		title: lang.get('sections:comment'),
		tiket:req.query.id,
		button:lang.get('buttons:send'),
		commentSend:false
	};
	res.render('comment', data);
};
exports.post=function(req,res){
	var moment=require('moment');
	var lang = require('lang');		
	var sqldata={tiket:req.body.id,worker:'admin',date:moment().format('YYYY-MM-DD HH:mm:ss'),text:'Комментарий от заявителя: <b>'+req.body.comment+'</b>'};
	var data={params:req.params,title: lang.get('sections:comment'),button:lang.get('buttons:send')};
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query("INSERT INTO tikets_logs SET ?",sqldata, function(err, results) {
			if (err) throw err;
			data.commentSend=true;
			connection.release();
			res.render('comment', data);
		});
	});
};