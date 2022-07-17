exports.get=async function(req,res,next){
	//const moment = require('moment');	
	let [tiket] = await vdesk.mysql.query("SELECT vta.workerFullName,vta.topicname,DATE_FORMAT(vta.startdate,'%d.%m.%Y %H:%i:%s') AS startdate,vta.description,DATE_FORMAT(vta.enddate,'%d.%m.%Y %H:%i:%s') AS enddate,vta.tiketstatusname,dw.email,dw.cityphone,dw.internalphone FROM views_tikets_info_all vta,directory_workers dw WHERE dw.login=vta.worker AND vta.id=?",req.query.id)
	console.log('req.query.id',req.query.id,tiket)
	res.send(tiket);
	/*if(!!tiket){
		
		if(tiket.startdate){tiket.startdate=moment(tiket.startdate).format('DD.MM.YYYY HH:mm:ss');}
		if(tiket.enddate){tiket.enddate=moment(tiket.enddate).format('DD.MM.YYYY HH:mm:ss');}
				else{results[0].enddate='';}
	}*/
	/*vdesk.mysqlPool.getConnection(function(err,connection){
		
		connection.query(sql,req.query.id, function(err, results) {
			if(results[0]){
				if(results[0].startdate){results[0].startdate=moment(results[0].startdate).format('DD.MM.YYYY HH:mm:ss');}
				if(results[0].enddate){results[0].enddate=moment(results[0].enddate).format('DD.MM.YYYY HH:mm:ss');}
				else{results[0].enddate='';}
			}
			else{console.log(false)}
			console.log(results)
			res.set('Content-Type','text/plain');
			res.send(results[0]);
			
			//if (err) throw err;
			connection.release();
			//
			
		});
	});*/
}


