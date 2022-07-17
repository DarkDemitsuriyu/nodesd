module.exports=async function(){
	console.log(4444)
	try {
		console.log(5555)
		const tiketsGets=require('middleware/scripts/tikets/tikets_gets')
		const moment=require('moment')
		const date=moment().format('YYYY-MM-DD HH:mm:ss')
		let fromTimeout = []
		let msgAdminPm = {
			active:false,
			text:'Просроченные заявки:\n'
		}
		let msgAdminNm = {
			active:false,
			text:'Новые заявки:\n'
		}
		await vdesk.mysql.query("UPDATE tikets_main SET archive=true WHERE DATEDIFF(NOW(),`enddate`)>14")
		let [[divisions]] = await vdesk.mysql.query("SELECT directory_workers.division FROM directory_workers, tikets_main WHERE directory_workers.status=1 AND tikets_main.worker = directory_workers.login AND tikets_main.status=3 AND (tikets_main.deadline<NOW() OR tikets_main.new = true) GROUP BY directory_workers.division")
		if(!!divisions){
			let [rJabbers] = await vdesk.mysql.query("SELECT dw.jabber FROM directory_workers dw,directory_workers_in_group dwg WHERE dwg.worker=dw.login AND dwg.group=2 AND division=?",divisions.division)
			let [workers] = await vdesk.mysql.query("SELECT @login:=directory_workers.login AS login, directory_workers.jabber, directory_workers.surname, directory_workers.name, directory_workers.patronymic, directory_workers.email, directory_workers.status, TIMESTAMPDIFF(MINUTE, directory_workers.timeout, NOW()) AS timeout, (SELECT COUNT(id) FROM views_tikets_info_all WHERE status=3 AND isNULL(statusconfirm) AND deadline<NOW() AND worker = @login) as pmess, (SELECT COUNT(id) FROM views_tikets_info_all WHERE new=true AND worker = @login) as nmess FROM directory_workers WHERE directory_workers.status!=3 AND directory_workers.division=?",divisions.division)
			let [confirms] = await vdesk.mysql.query("SELECT tikets_main.id, tikets_main.enddate, tikets_main.worker,tikets_main.importance, directory_workers.jabber, directory_workers.division FROM tikets_main,directory_workers WHERE statusconfirm=1 AND DATEDIFF(NOW(),enddate)>3 AND directory_workers.login=tikets_main.worker")
			for( let elem of workers){
				if(elem.pmess*1 > 0 && elem.status === 1){
					msgAdminPm.active = true
					msgAdminPm.text += `${elem.surname} ${elem.name} ${elem.patronymic} - ${elem.pmess};\n`
				}
				if(elem.nmess*1 > 0 && elem.status === 1){
					msgAdminNm.active = true
					msgAdminNm.text += `${elem.surname} ${elem.name} ${elem.patronymic} - ${elem.nmess};\n`
				}
				if((elem.pmess*1 > 0 || elem.nmess*1 > 0)  && elem.status === 1){
					await vdesk.xmpp.send(elem.jabber,`У вас:\n${elem.pmess*1 > 0 ? 'Просроченных заявок - '+elem.pmess+';' : ''}\n${elem.nmess*1 > 0 ? 'Новых заявок - '+elem.nmess+';' : ''}\n`)
				}
				if(elem.status === 2 && elem.timeout > 0){
					fromTimeout.push(`'${elem.login}'`)
				}
			}
			if(msgAdminPm.active || msgAdminNm.active){
				for( let jabber of rJabbers ){
					await vdesk.xmpp.send(jabber.jabber,`Информация о заявках:\n${msgAdminPm.active ? msgAdminPm.text : ''}${msgAdminNm.active ? msgAdminNm.text : ''}`)
				}
			}
			if(confirms.length>0){
				for(let tiket of confirms){
					await vdesk.mysql.query("INSERT INTO tikets_logs SET ?",{tiket:tiket.id,worker:tiket.worker,date:tiket.enddate,text:"<b>Заявка подтверждена системой!</b>"})
					await vdesk.mysql.query("UPDATE tikets_main SET ? WHERE id=?",[{status:1,statusconfirm:null},tiket.id])
					await vdesk.xmpp.send(tiket.jabber,`Система подтвердила выполнение вами заявки №${tiket.id}\n`)
					vdesk.setExp(tiket.worker,tiket.importance)
					let tiketData = await tiketsGets.getOneTiket(tiket.id)
					vdesk.io.to(`user:room:${tiket.worker}`).emit('tiketUpgrade',{data:tiketData,action:'update'})
					vdesk.io.to(`user:room:${tiket.worker}`).emit('notify',{tiket:tiketData.id,date:tiket.enddate,text:`Заявка №${tiketData.id} подтверждена системой`,ruk:false})
					vdesk.io.to(`division:room:${tiket.division}:2`).emit('tiketUpgrade',{data:tiketData,action:'update'})
				}
			}
		}
		console.log(6666)
		await vdesk.mysql.query('UPDATE directory_workers SET status = 1, timeout = NULL  WHERE status = 2 AND timeout < NOW()')
		console.log('fromTimeout',fromTimeout)
		if(fromTimeout.length>0){
			console.log('qwe',`SELECT login, division FROM directory_workers WHERE login IN (${fromTimeout.toString()})`)
			let [workers] = await vdesk.mysql.query(`SELECT login, division FROM directory_workers WHERE login IN (${fromTimeout.toString()})`)
			console.log('qwe',workers)
		}
	} catch (e) {
		console.log(666)
	}
}