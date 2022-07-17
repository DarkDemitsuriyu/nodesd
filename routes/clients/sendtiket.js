exports.post=async function(req,res,next){
	const tiketsGets=require('middleware/scripts/tikets/tikets_gets');
	const mailSend=require('middleware/mailSend');
	const util = require('util');
	const moment = require('moment');
	const config = require('config');
	const path = require('path');
	const dns = require('dns');	
	const reverseDNS = util.promisify(dns.reverse);
	const fs = require('fs');
	
	let body=req.body;
	let file=req.file || null;
	console.log('body - ',body)
	body.senderip=req.ip.replace('::ffff:','');
	body.importance=0;
	body.senderfullname = `${body.sendersurname} ${body.sendername} ${body.senderpatronymic}`
	body.startdate=moment().format();
	switch(moment().day()){
		case 5: body.deadline=moment().add(3, 'days').format(); break;
		case 6: body.deadline=moment().add(2, 'days').format(); break;
		default: body.deadline=moment().add(1, 'days').format(); break;
	}
	if(file){
		body.attachment=`${file.filename}_${moment().format('DD.MM.YYYY')}.${path.extname(file.originalname)}`
		fs.renameSync(file.path,`documents/tiketsAttachment/${body.attachment}`);
	}
	dns.setServers(config.get('dns'));
	try{		
		[body.sendercompname]=await reverseDNS(body.senderip)//'10.72.60.7'
	} catch(e){
		body.sendercompname=e.hostname
		console.log('e',e)
	}
	
	let [[department]]=await vdesk.mysql.query('SELECT name,sid FROM directory_departments WHERE ip = ?', `10.72.${body.senderip.split('.')[2]}.0`)
	let [[[worker]]]=(await vdesk.mysql.query('CALL selectWorker(?)',body.topicid))

	body.depname=(department && department.name) || "Неизвестно" ;
	body.department=department.sid || "Неизвестно" ;
	body.worker=worker.login	

	let [rows]=await vdesk.mysql.query('SELECT directory_workers_in_group.group FROM directory_workers_in_group WHERE worker=?',body.worker)
	worker.groups=rows.map(el => el.group)

	let [insertData]=await vdesk.mysql.query('INSERT INTO tikets_main SET ?', body)
	let msg= worker.jabber==='нет' ? '' : `У вас новая заявка №${insertData.insertId}!\nТема: ${body.topicname}\nОтправитель: ${body.sendersurname} ${body.sendername} ${body.senderpatronymic}`

	let sendMail=async function(){
	let bodyMail=`<b>Ваша проблема: </b>${body.description}<br><b>Дата подачи заявки: </b>${moment(body.startdate).format('DD.MM.YYYY HH:mm:ss')}<br><b>Исполнитель: </b>${vdesk.getFullName(worker)}<br><b>Контактная информация</b><br><b>Телефон: </b> Городской: ${worker.cityphone}, Внутренний телефон: ${worker.internalphone}<br><b>E-mail: </b>${worker.email}<br>`;
		mailSend(insertData.insertId,body.topicname,body.sendermail,worker.email,bodyMail,null);
	}	
	let sendMessageForWorker=async function(){
		await vdesk.xmpp.send(worker.jabber,msg)
	}
	let sendTiketRow=async function(){
		let tiketData = await tiketsGets.getOneTiket(insertData.insertId)
		vdesk.io.to(`user:room:${worker.login}`).emit('tiketUpgrade',{data:tiketData,action:'new'});
		if(!worker.groups.includes(2)){
			console.log('!worker.groups.includes(2)')
			vdesk.io.to(`division:room:${worker.division}:2`).emit('tiketUpgrade',{data:tiketData,action:'new'});
		}
		vdesk.io.to(`user:room:${worker.login}`).emit('notify',{tiket:tiketData.id,date:moment(),text:`У вас новая заяка №${tiketData.id}. Отправитель - ${tiketData.sendersurname} ${tiketData.sendername} ${tiketData.senderpatronymic}`,ruk:false});
	}
	let sendTiketInfoForSender=async function(){
		let returnData={id:insertData.insertId,surname:worker.surname,patronymic:worker.patronymic,name:worker.name,cityphone:worker.cityphone,internalphone:worker.internalphone,email:worker.email}
		console.log('returnData',returnData)
		res.set('Content-Type','text/plain')
		res.send(returnData)
	}
	
	Promise.all([
		sendMail(),
		sendMessageForWorker(),
		sendTiketRow(),
		sendTiketInfoForSender()
	]).catch(function(error){
		console.log(error)
	})
}