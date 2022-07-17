exports.post=async function(req,res,next){
	const moment = require('moment');
	console.log('1-',req.body)
	console.log('2-',req.files)
	let body=req.body;
	let worker=typeof body.worker==='string' ? JSON.parse(body.worker) : body.worker;	
	let files=req.files || body.files;
	let date=moment().format('YYYY-MM-DD HH:mm:ss');	
	let msg=`<b>Отправил сообщение инициатору заявки:</b>${body.mail_msg}`;
	let mailObj = {
		id:body.id,
		title:body.topic,
		sendermail:body.sendermail,
		workermail:worker.email,
		body:`<b>Получен комментарий от исполнителя!</b><br>Чтобы ответить на него нажмите <a href="http://10.72.1.253/comment?id=${body.id}">НА ЭТУ НАДПИСЬ</a><br><pre>${body.mail_msg}</pre><br><b>Ваша проблема: </b>${body.description}<br><b>Дата подачи заявки: </b>${body.datestart}<br><b>Исполнитель: </b>${vdesk.getFullName(worker)}<br><b>Контактная информация</b><br><b>Телефон: </b> Городской: ${worker.cityphone}, Внутренний телефон: ${worker.internalphone}<br><b>E-mail: </b>${worker.email}<br>`,
		attachments:[]
	}
	if(files && files.length>0){
		let fileSize = function(size,type){
			let sizes = { 1:'б', 2:'Кб', 3:'Мб' }
			if(size>1000){
				size=((size/1024).toFixed(2))*1;
				return fileSize(size,type+1)
			} else {
				return `${size}${sizes[type]}`
			}
		}
		msg+='<br><b>Приложил файл(ы):</b><ul>';
		files.forEach( file => {
			msg+=`<li>${file.originalname} - ${fileSize(file.size,1)}</li>`;
			mailObj.attachments.push({filename:file.originalname,path:file.path})
		})
		msg+='</ul>';
	}
	let msgSend={date:date,worker:vdesk.getFullNameMini(worker),text:msg}
	let datalogs={tiket:body.id,worker:worker.login,date:date,text:msg};
	await vdesk.mysql.query('INSERT INTO tikets_logs SET ?', datalogs)
	await vdesk.mail.send(mailObj);
	res.set('Content-Type','text/html');
	res.send([msgSend]);
}