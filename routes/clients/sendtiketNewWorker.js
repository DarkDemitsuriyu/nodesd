exports.post=async function(req,res,next){
	const tiketsGets=require('middleware/scripts/tikets/tikets_gets');
	const moment = require('moment');
	
	let sendAdminsDivisions=[]	
	let ioWorkersList = {}
	let body=req.body;
	let senderFullName=`${body.sendersurname} ${body.sendername} ${body.senderpatronymic}`
	let returnDataWorkers=[]
	let getWorkers=[]
	let dataTiketMain={
		sendername:body.sendername,
		senderpatronymic:body.senderpatronymic,
		sendersurname:body.sendersurname,
		senderfullname:senderFullName,
		sendermail:body.sendermail,
		senderphone:body.senderphone,
		topicname:body.topicname,
		topicid:body.topicid,
		department:body.department,
		startdate:moment().format(),
		importance:false,
		newworker:true,
		description:'Новый сотрудник'
	}
	
	let bodyMail=`<b>Сотрудник: </b>${senderFullName}<br><b>Дата подачи заявки: </b>${moment(dataTiketMain.startdate).format('DD.MM.YYYY HH:mm:ss')}<br><b>Исполнители: </b><ul>`
	switch(moment().day()){
		case 5: dataTiketMain.deadline=moment().add(5, 'days').format(); break;
		case 6: dataTiketMain.deadline=moment().add(4, 'days').format(); break;
		default: dataTiketMain.deadline=moment().add(3, 'days').format(); break;
	}
	
	let [insertDataMain] = await vdesk.mysql.query("INSERT INTO tikets_main SET ?", dataTiketMain)
	let [insertDataAdds] = await vdesk.mysql.query("INSERT INTO tikets_new_employee_adds SET ?", {tiket:insertDataMain.insertId,division:body.division,jobtitle:body.jobtitle,insteadof:body.insteadof,cityphone:body.cityphone,internalphone:body.internalphone,note:body.note})
	let [topics] = await vdesk.mysql.query("SELECT DISTINCT topic FROM tikets_new_employee_equipments")
	
	for(let topic of topics){
		let [[[worker]]]=(await vdesk.mysql.query('CALL selectWorker(?)',topic.topic))
		let [groups] = await vdesk.mysql.query('SELECT directory_workers_in_group.group FROM directory_workers_in_group WHERE worker = ?',worker.login)
		let [equipments] = await vdesk.mysql.query("SELECT DISTINCT id FROM tikets_new_employee_equipments WHERE topic=?",topic.topic)
		worker.groups=groups

		for(let equipment of equipments){
			let [insertDataEmployee] = await vdesk.mysql.query("INSERT INTO tikets_new_employee_conformity SET ?", {tiket:insertDataMain.insertId,equipment:equipment.id,status:3,worker:worker.login})
		}
		if(!getWorkers.includes(worker.login)){
			returnDataWorkers.push({surname:worker.surname,patronymic:worker.patronymic,name:worker.name,cityphone:worker.cityphone,internalphone:worker.internalphone,email:worker.email});
			bodyMail+=`<li>${vdesk.getFullName(worker)}<br><b>Контактная информация</b><br><b>Телефон: </b> Городской: ${worker.cityphone}, Внутренний телефон: ${worker.internalphone}<br><b>E-mail: </b>${worker.email}</li>'`
			getWorkers.push(worker.login)
		}
		
		if(!ioWorkersList.hasOwnProperty(worker.login)){
			ioWorkersList[worker.login] = worker
			
		}
	}
	for(let key in ioWorkersList){
		let tiketData = await tiketsGets.getOneTiket(insertDataMain.insertId,key)
		let worker = ioWorkersList[key]
		await vdesk.xmpp.send(worker.jabber,`У вас новая заявка!\nТема:Новый сотрудник\nСотрудник: ${senderFullName}`);
		
		vdesk.io.to(`user:room:${worker.login}`).emit('tiketUpgrade',{data:tiketData,action:'new'});
		vdesk.io.to(`user:room:${worker.login}`).emit('notify',{tiket:tiketData.id,date:moment(),text:`У вас новая заяка №${tiketData.id}. Отправитель - ${tiketData.sendersurname} ${tiketData.sendername} ${tiketData.senderpatronymic}`,ruk:false});
		
		console.log('sendAdminsDivisions',worker.groups)
		console.log('sendAdminsDivisions',worker.groups.includes(2))
		
		if(!sendAdminsDivisions.includes(worker.division) && !worker.groups.includes(2)){
			sendAdminsDivisions.push(worker.division)			
			vdesk.io.to(`division:room:${worker.division}:2`).emit('tiketUpgrade',{data:tiketData,action:'new'});
		}
	}
	
	
	
	bodyMail+='</ul>';
	await vdesk.mail.send({id:insertDataMain.insertId,title:body.topicname,sendermail:body.sendermail,workermail:'s.desk@tyumen.rgs.ru',body:bodyMail});
	res.set('Content-Type','text/plain')
	res.send({id:insertDataMain.insertId,workers:returnDataWorkers})
};