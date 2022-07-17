const moment = require('moment')
const tiketsGets = require('middleware/scripts/tikets/tikets_gets')
const workersGets = require('middleware/scripts/directorys/workers')
//let async=require('async');

module.exports=async function(dataIn,worker){
	console.time('tEdit1')
	//let xmppMsg;
	let newWorker
	let oldWorker
	let mailAction='';
	let statusForMail='';	
	let workerFio=vdesk.getFullNameMini(worker);	
	let date=moment().format('YYYY-MM-DD HH:mm:ss')
	let data = {}
	let logs = []
	let logObj = {date:date, tiket:dataIn.tiket, worker:worker.login, who:workerFio}
	let notify = []
	let notifyObj = {date:date, tiket:dataIn.tiket, ruk:true, xmpp:true}
	let exp=false;
	let solutionForMail=''
	let isAdmin=worker.groups.includes(2)
	let tiketWorker=dataIn.newWorkerLogin || dataIn.worker
	//let [tiketData] =
	
	console.log('dataIn - ',dataIn)	
	console.timeEnd('tEdit1')
	console.time('tEdit2')
	if(dataIn.conformity){
		if(dataIn.hasOwnProperty('note')){
			data.note = dataIn.note
			logs.push(Object.assign({},logObj,{text:`<b>Добавил заметку в пункт - ${dataIn.equipmentname}:</b> ${dataIn.note}`}))			
		}
		if(dataIn.newWorkerConfirmation){
			tiketWorker=data.worker=dataIn.newWorkerConfirmation
			notify.push(Object.assign({},notifyObj,{text:`${workerFio} назначил вас исполнителем пункта ${dataIn.equipmentname} в заявке №${dataIn.tiket}`,ruk:false}))
			notify.push(Object.assign({},notifyObj,{text:`<b>${workerFio}</b> сменил исполнителя пункта ${dataIn.equipmentname} в заявке №${dataIn.tiket} на ${dataIn.newWorkerFullname}`,xmpp:false}))
			logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> cменил исполнителя пункта ${dataIn.equipmentname}. Новый исполнитель - <b>${dataIn.newWorkerFullname}</b>. Предыдущий исполнитель - <b>${dataIn.oldWorkerFullname}</b>`}))
		}
		if(dataIn.compleet){
			let text=`<b>${workerFio}</b> выполнил пункт ${dataIn.equipmentname}`
			Object.assign(data,{status:1})			
			notify.push(Object.assign({},notifyObj,{text:`${text} в заявке №${dataIn.tiket}`, xmpp:false}))
			logs.push(Object.assign({},logObj,{text:`${text}`}))
		}
		if(dataIn.refuse){
			let text=`<b>${workerFio}</b> вернул в работу пункт ${dataIn.equipmentname}`			
			Object.assign(data,{status:3})
			notify.push(Object.assign({},notifyObj,{text:`${text} в заявке №${dataIn.tiket}`, xmpp:false}))
			logs.push(Object.assign({},logObj,{text:`${text}`}))
		}
	}
	if(dataIn.newWorkerLogin){
		newWorker = await workersGets.getOne(dataIn.newWorkerLogin)
		oldWorker = await workersGets.getOne(dataIn.oldWorkerLogin)
		Object.assign(data,{new:(worker.login !== dataIn.newWorkerLogin && !isAdmin), worker:dataIn.newWorkerLogin})
		notify.push(Object.assign({},notifyObj,{text:`${workerFio} назначил вас исполнителем заявки №${dataIn.tiket}`,ruk:false}))
		notify.push(Object.assign({},notifyObj,{text:`${workerFio} сменил исполнителя заявки №${dataIn.tiket} на ${newWorker.fullname}`, xmpp:false}))
		logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> сменил исполнителя. Новый исполнитель - <b>${newWorker.fullname}</b>. Предыдущий исполнитель - <b>${oldWorker.fullname}</b>`}))
	}
	if(dataIn.postpone){
		let formatted = moment(dataIn.postpone).format('DD.MM.YYYY HH:mm:ss')
		if(isAdmin){
			Object.assign(data,{ deadline:dataIn.postpone })
			logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> отложил заявку до <span class='orange--text'>${formatted}</span> ${dataIn.reason ? 'по причине - <i>'+dataIn.reason+'</i>' : ''}`}))
		} else {
			Object.assign(data,{ postpone:dataIn.postpone, postponereason:dataIn.reason, statusconfirm:5 })
			notify.push(Object.assign({},notifyObj,{text:`${workerFio} пожелал отложить заявку №${dataIn.tiket} до ${formatted}. Причина: ${dataIn.reason}`}))
			logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> пожелал отложить заявку до <span class='orange--text'>${formatted}</span> по причине - <i>${dataIn.reason}</i>`}))
		}
	}	
	if(dataIn.hasOwnProperty('importance')){
		let msgText=`${ dataIn.importance ? 'повысил важность заявки.' : 'понизил важность заявки.' }`;
		Object.assign(data,{ importance:dataIn.importance })
		notify.push(Object.assign({},notifyObj,{text:`${workerFio} ${msgText} №${dataIn.tiket}`,ruk:false}))
		logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> ${msgText}`}))
	}
	if(dataIn.hasOwnProperty('confirm')){
		Object.assign(data,{ postpone:null, postponereason:null, statusconfirm:null })
		let chk=dataIn.confirm ? '' : 'не ' ;
		let prefix=`подтвердил отсрочку заявки`
		let sufix=moment(dataIn.postpone).format('DD.MM.YYYY HH:mm:ss')
		if(dataIn.confirm){
			Object.assign(data,{ deadline:dataIn.postpone })
		}
		notify.push(Object.assign({},notifyObj,{text:`${workerFio} ${chk}${prefix.toLowerCase()} №${dataIn.tiket} до ${sufix}`,ruk:false}))
		logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> ${chk}${prefix} до <span class="orange--text">${sufix}</span>`}))
	}
	if(dataIn.classifier){
		Object.assign(data,{ classifier:dataIn.classifier })
	}
	if(dataIn.status){
		let href=`http://10.72.1.253/confirmTiket?id=${dataIn.tiket}&confirm=`;
		let setVar=function(status,statusconfirm,logMsg,statusformail){
			Object.assign(data,{ status:status, statusconfirm:statusconfirm })
			logs.push(Object.assign({},logObj,{text:`<b>${workerFio}</b> ${logMsg}. ${dataIn.solution ? '<b>Решение:</b>' : ''} <i>${dataIn.solution || ''}</i>}`}))
			statusForMail=statusformail || '';			
		}
		switch(dataIn.status){
			case 'complete':
				Object.assign(data,{ solution:dataIn.solution, laborexpenditures:dataIn.laborexpenditures })
				if(dataIn.isMine){
					setVar(1,null,'Выполненил заявку','выполнена');
				} else {
					setVar(4,1,'Заявил о выполнении заявки','выполнена');
					mailAction=`Пожалуйста подтвердите выполнение заявки!<ul><li><a href="${href}true">Подтверждаю</a></li><li><a href="${href}false">Не подтверждаю</a></li></ul>`;
					solutionForMail=dataIn.solution ? `<b>Решение:</b><pre>${dataIn.solution}</pre><br>` : '';
				}
			break;
			case 'refuse':
				Object.assign(data,{ solution:dataIn.solution, laborexpenditures:dataIn.laborexpenditures })
				if(isAdmin){
					setVar(2,null,'Отказал в заявке','отклонена');
					exp=true;
					solutionForMail=dataIn.solution ? `<b>Решение:</b><pre>${dataIn.solution}</pre><br>` : '';
				}
				else{
					setVar(3,2,'Заявил об отказе в заявке');
					notify.push(Object.assign({},notifyObj,{text:`${workerFio} заявил об отказе в выполнении заявки №${dataIn.tiket}`}))
				}
			break;
			case 'confirmrefuse':
				notify.push(Object.assign({},notifyObj,{text:`${workerFio} подтвердил отказ в заявке №${dataIn.tiket}`, ruk:false}))
				setVar(2,null,'подтвердил отказ в заявке','отклонена');
				solutionForMail=dataIn.solution ? `<b>Решение:</b><pre>${dataIn.solution}</pre><br>` : '';
				exp=true;
			break;
			case 'noconfirmrefuse':
				notify.push(Object.assign({},notifyObj,{text:`${workerFio} не подтвердил отказ в заявке №${dataIn.tiket}`, ruk:false}))
				setVar(3,null,'не подтвердил отказ в заявке')
			break;
			case 'return':
				notify.push(Object.assign({},notifyObj,{text:`${workerFio} вернул в работу заявку №${dataIn.tiket}`, ruk:false}))
				setVar(3,null,'Вернул заявку в работу','возвращена в работу');
				switch(moment().day()){
					case 5: data.deadline=moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss'); break;
					case 6: data.deadline=moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss'); break;
					default: data.deadline=moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'); break;
				}
				exp=true
			break;
		}
	}
	
	console.log('data',data)
	console.timeEnd('tEdit2')
	console.time('tEdit3')
	let sql= dataIn.conformity ? 'UPDATE tikets_new_employee_conformity SET ? WHERE id = ?' : 'UPDATE tikets_main SET ? WHERE id = ?'
	let sqlID= dataIn.conformity ? dataIn.conformity : dataIn.tiket
	let [insertData] = await vdesk.mysql.query(sql, [data,sqlID])
	console.timeEnd('tEdit3')
	
	let socket = async function(){
		console.time('tEdit_socket')
		console.time('tEdit_socket1')
		let workerLogin=dataIn.newWorkerConfirmation ? dataIn.newWorkerConfirmation : dataIn.newWorkerLogin ? dataIn.newWorkerLogin : dataIn.worker
		console.timeEnd('tEdit_socket1')
		console.time('tEdit_socket2')
		console.log('socket2',dataIn.tiket, (isAdmin && (!dataIn.newWorkerConfirmation || !dataIn.newWorkerLogin)) ? null : workerLogin)
		let tiketData = await tiketsGets.getOneTiket(dataIn.tiket, (isAdmin && !(dataIn.newWorkerConfirmation || dataIn.newWorkerLogin)) ? null : workerLogin)
		console.timeEnd('tEdit_socket2')
		console.time('tEdit_socket3')
		if(dataIn.conformity){
			vdesk.io.to(`user:room:${workerLogin}`).emit('tiketUpgrade',{data:tiketData,action:'edit'});
		} else {
			if(dataIn.newWorkerLogin){
				if(!oldWorker.groups.includes(2)){
					vdesk.io.to(`user:room:${dataIn.oldWorkerLogin}`).emit('tiketUpgrade',{id:dataIn.tiket,action:'delete'});
				}
				if(!newWorker.groups.includes(2)){
					vdesk.io.to(`user:room:${dataIn.newWorkerLogin}`).emit('tiketUpgrade',{data:tiketData,action:'new'});
				}				
			} else {
				if(tiketData.newworker){
					let listWorkers = new Set()
					if(tiketData.status<3){
						vdesk.io.to(`user:room:${dataIn.oldWorkerLogin}`).emit('tiketUpgrade',{id:dataIn.tiket,action:'delete'});
					} else {
						vdesk.io.to(`user:room:${worker.login}`).emit('tiketUpgrade',{data:tiketData,action:'edit'});
					}
					tiketData.confirmity.forEach( el => {
						if(el.worker !== tiketData.worker){
							listWorkers.add(el)
						}
					})
					console.log('listWorkers',listWorkers)
					for(let item of listWorkers){
						let worker = await workersGets.getOne(item.worker)
						if(!worker.groups.includes(2)){
							vdesk.io.to(`user:room:${worker.login}`).emit('tiketUpgrade',{data:tiketData,action:'edit'});
						}
					}
				} else {
					let worker = await workersGets.getOne(tiketData.worker)
					if(!worker.groups.includes(2)){
						vdesk.io.to(`user:room:${worker.login}`).emit('tiketUpgrade',{data:tiketData,action:'edit'});
					}					
				}
			}			
		}
		vdesk.io.to(`division:room:${worker.division}:2`).emit('tiketUpgrade',{data:tiketData,action:'edit'})
		console.timeEnd('tEdit_socket3')
		console.timeEnd('tEdit_socket')
	}
	
	let setLogs = async function(){
		console.time('tEdit_log')
		for(let log of logs){
			await vdesk.mysql.query('INSERT INTO tikets_logs SET ?', log)
		}
		console.timeEnd('tEdit_log')
	}
	let sendXMPP = async function(){
		console.time('tEdit_xmpp')
		for(let noty of notify){
			if(noty.xmpp){
				let sql = { query:'SELECT jabber FROM directory_workers WHERE login=?', data:tiketWorker }
				if(noty.ruk){
					sql.query = "SELECT directory_workers.jabber FROM directory_workers,directory_workers_in_group WHERE directory_workers_in_group.group=2 AND directory_workers_in_group.worker=directory_workers.login AND directory_workers.division=?"
					sql.data = worker.division
				}
				let [jabbers] = await vdesk.mysql.query(sql.query, sql.data)
				for(let item of jabbers){
					await vdesk.xmpp.send(item.jabber,noty.text);
				}
			}
		}
		console.timeEnd('tEdit_xmpp')
	}
	let sendMail = async function(){
		console.time('tEdit_mail')
		if(['complete','confirmrefuse','return'].includes(dataIn.status) || dataIn.newWorkerLogin || (dataIn.status === 'refuse' && isAdmin)){
			console.time('tEdit_mail1')
			let sql='SELECT vtia.isMine, vtia.description, vtia.sendermail, DATE_FORMAT(vtia.startdate, "%d.%m.%Y %H:%i") AS startdate, vtia.workerFullName, dw.cityphone, dw.internalphone, dw.email FROM views_tikets_info_all vtia,directory_workers dw WHERE vtia.worker=dw.login AND id=?';
			let [[data]] = await vdesk.mysql.query(sql, dataIn.tiket)
			console.timeEnd('tEdit_mail1')
			console.time('tEdit_mail2')
			if(!data.isMine){
				let textMail = dataIn.newWorkerLogin ? `<b>У вашей заявки сменился исполнитель!</b><br>` : `<b>Ваша заявка ${statusForMail}!</b><br>${solutionForMail}<br>${mailAction}`
				let bodyMail=`${textMail}<br><b>Дата подачи заявки: </b>${data.startdate}<br><b>Заявленная проблема: </b>${data.description}<br><b>Исполнитель: </b>${data.workerFullName}<br><b>Контактная информация</b><br><b>Телефон: </b> Городской: ${data.cityphone}, Внутренний телефон: ${data.internalphone}<br><b>E-mail: </b>${data.email}<br>`
				await vdesk.mail.send({id:dataIn.tiket,sendermail:data.sendermail,workermail:data.email,body:bodyMail});
			}
			console.timeEnd('tEdit_mail2')
		}
		console.timeEnd('tEdit_mail')
	}
	console.time('tEdit4')
	Promise.all([
		socket(),
		setLogs(),
		sendXMPP(),
		sendMail()
	]).then( () => {
		console.timeEnd('tEdit4')
		console.time('tEdit5')
		if(exp){
			vdesk.setExp(dataIn.worker,dataIn.importance,data.status === 'return');
		}
		notify.forEach((el,idx)=>{
			let to = el.ruk ? `division:room:${worker.division}:2` : `user:room:${tiketWorker}` ;
			vdesk.io.to(to).emit('notify',el);
		})
		console.timeEnd('tEdit5')
	}).catch(function(error){
		console.log(error)
	})
};