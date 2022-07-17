exports.post=async function(req,res,next){
	const tiketsGets=require('middleware/scripts/tikets/tikets_gets');
	const util = require('util');
	const moment = require('moment');
	const config = require('config');
	const path = require('path');
	const dns = require('dns');	
	const reverseDNS = util.promisify(dns.reverse);
	const fs = require('fs');
	
	let body=req.body;
	console.log(body)
	let file=req.file || null;
	let self = body.sender.login === body.worker
	delete body.sender
	
	body.senderfullname = `${body.sendersurname} ${body.sendername} ${body.senderpatronymic}`
	body.senderip=req.ip.replace('::ffff:','');
	body.importance=0;
	body.startdate=moment().format();
	console.log(body)
	/*if(file){
		body.attachment=`${file.filename}_${moment().format('DD.MM.YYYY')}.${path.extname(file.originalname)}`
		fs.renameSync(file.path,`documents/tiketsAttachment/${body.attachment}`);
	}*/
	dns.setServers(config.get('dns'));
	try{		
		[body.sendercompname]=await reverseDNS(body.senderip)//'10.72.60.7'
	} catch(e){
		body.sendercompname=e.hostname
		console.log('e',e)
	}
	
	let [[department]]=await vdesk.mysql.query('SELECT name, sid FROM directory_departments WHERE ip = ?', `10.72.${body.senderip.split('.')[2]}.0`)
	
	body.depname=department.name || "Неизвестно" ;
	body.department=department.sid || "Неизвестно" ;

	if(body.status === 1){
		body.enddate = moment().format('YYYY-MM-DD HH:mm:ss');
	}
		

	let [insertData]=await vdesk.mysql.query('INSERT INTO tikets_main SET ?', body)
	let tiketData = await tiketsGets.getOneTiket(insertData.insertId)
	
	let sendMessagesForNotSelf=async function(){
		if(!self){
			let [[worker]] = await vdesk.mysql.query('SELECT jabber,division FROM directory_workers WHERE login=?',body.worker)
			let [rows] = await vdesk.mysql.query('SELECT directory_workers_in_group.group FROM directory_workers_in_group WHERE worker=?',body.worker)
			worker.groups=rows.map(el => el.group)
			
			console.log('worker',worker)
			
			if(!worker.groups.includes(2)){
				console.log('!worker.groups.includes(2)')
				vdesk.io.to(`division:room:${worker.division}:2`).emit('tiketUpgrade',{data:tiketData,action:'new'});
			}
			let msg= worker.jabber==='нет' ? '' : `У вас новая заявка №${insertData.insertId}!\nТема: ${body.topicname}\nОтправитель: ${body.sendersurname} ${body.sendername} ${body.senderpatronymic}`
			await vdesk.xmpp.send(worker.jabber,msg)	
		}	
	}
	let sendTiketRow=async function(){		
		vdesk.io.to(`user:room:${body.worker}`).emit('tiketUpgrade',{data:tiketData,action:'new'});		
		vdesk.io.to(`user:room:${body.worker}`).emit('notify',{tiket:tiketData.id,date:moment(),text:`У вас новая заяка №${tiketData.id}. Отправитель - ${tiketData.sendersurname} ${tiketData.sendername} ${tiketData.senderpatronymic}`,ruk:false});
	}
	let sendTiketInfoForSender=async function(){
		//let returnData={id:insertData.insertId,surname:worker.surname,patronymic:worker.patronymic,name:worker.name,cityphone:worker.cityphone,internalphone:worker.internalphone,email:worker.email}
		//console.log('returnData',returnData)
		res.set('Content-Type','text/plain')
		res.send({id:insertData.insertId})
	}
	
	Promise.all([
		sendMessagesForNotSelf(),
		sendTiketRow(),
		sendTiketInfoForSender()
	]).catch(function(error){
		console.log(error)
	})
}