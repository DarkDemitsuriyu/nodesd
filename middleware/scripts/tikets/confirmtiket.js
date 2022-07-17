const tiketsGets=require('middleware/scripts/tikets/tikets_gets');
const moment=require('moment');	
const lang = require('lang');

exports.get=async function(req,res,next){
	let date=moment().format('YYYY-MM-DD HH:mm:ss');
	console.log("confirmDate = ", date)
	let confirm=req.query.confirm;
	let id=req.query.id;	
	let text=`Выполнение заявки №${id} подтверждено заявителем.`;
	let data={
		params:req.params,
		title: lang.get('sections:confirmtrue'),
		lang:lang.get('workers'),
		confirm:confirm
	}
	if(confirm==='true'){
		data.msg=`Выполнение вашей заявки успешно подтверждено!<br>
			Благодарим вас за использование системы заявок!<br>
			Помните! Пользуясь нашей системой вы гарантируете себе, что:<br>
			<b><ul>
				<li>О вас никогда не забудут и обязательно выполнят вашу заявку!</li>
				<li>Вы всегда сможете узнать, кто выполняет вашу заявку и получите обратную связь от исполнителя!</li>
			</ul></b>`;
		await vdesk.mysql.query("UPDATE tikets_main SET status=1, statusconfirm=null WHERE id=?",id)
		let [returned] = await vdesk.mysql.query("INSERT INTO tikets_logs SET worker = 'admin', date = NOW(), tiket = ?, text = ?",[ id , `<b>${text}</b>` ])
		console.log('confirmedNO - ' + returned)
		let [[getData]] = await vdesk.mysql.query("SELECT directory_workers.division,directory_workers.jabber,tikets_main.worker,tikets_main.importance FROM tikets_main,directory_workers WHERE tikets_main.worker=directory_workers.login AND id=?",id)
		let userRoom=`user:room:${getData.worker}`;
		let groupRoom=`division:room:${getData.division}:2`;
		let divisionRoom=`division:room:${getData.division}`;
		let tiketData = await tiketsGets.getOneTiket(id);
		vdesk.io.to(userRoom).emit('tiketUpgrade',{data:tiketData,action:'edit'});
		vdesk.io.to(groupRoom).emit('tiketUpgrade',{data:tiketData,action:'edit'});
			
		vdesk.io.to(divisionRoom).emit('chattiket'+id,[{date:date,worker:'Система',text:`<b>${text}</b>`}],'edit');						
		vdesk.io.to(userRoom).emit( 'notify',{tiket:id,date:date,text:text,ruk:false});
		vdesk.io.to(groupRoom).emit('notify',{tiket:id,date:date,text:text,ruk:true});
		await vdesk.xmpp.send(getData.jabber,text);
		vdesk.setExp(getData.worker,getData.importance);
	} else {
		data.comment=lang.get('sections:comment');
		data.button=lang.get('buttons:send');
		data.tiket=req.query.id;
	}
	res.render('confirmtiket', data);
};
exports.post=async function(req,res,next){
	let date=moment().format('YYYY-MM-DD HH:mm:ss');
	let confirm=req.query.confirm;
	let id=req.body.id;	
	let data={
		params:req.params,
		title: lang.get('sections:confirmtrue'),
		lang:lang.get('workers'),
		confirm:'true',
		msg:`Ваш отказ в подтверждении заявки успешно отправлен!<br>
			Благодарим вас за использование системы заявок!<br>
			Помните! Пользуясь нашей системой вы гарантируете себе, что:<br>
			<b><ul>
				<li>О вас никогда не забудут и обязательно выполнят вашу заявку!</li>
				<li>Вы всегда сможете узнать, кто выполняет вашу заявку и получите обратную связь от исполнителя!</li>
			</ul></b>`
	}
	let [[tiketStatus]] = await vdesk.mysql.query("SELECT status FROM tikets_main WHERE id=?",id)
	if(tiketStatus < 3){
		data.msg = `К сожалению, данная заявка уже закрыта!<br>
			Благодарим вас за использование системы заявок!<br>
			Помните! Пользуясь нашей системой вы гарантируете себе, что:<br>
			<b><ul>
				<li>О вас никогда не забудут и обязательно выполнят вашу заявку!</li>
				<li>Вы всегда сможете узнать, кто выполняет вашу заявку и получите обратную связь от исполнителя!</li>
			</ul></b>`
	} else {
		let text=`Выполнение заявки №${id} НЕ подтверждено заявителем. Причина:${req.body.comment}`;
		await vdesk.mysql.query("UPDATE tikets_main SET status=3, statusconfirm=null WHERE id=?", id)
		let [returned] = await vdesk.mysql.query("INSERT INTO tikets_logs SET worker = 'admin', date = NOW(), tiket = ?, text = ?",[ id , `<b>${text}</b>` ])
		console.log('confirmedNO - ' + returned)
		let [[getData]] = await vdesk.mysql.query("SELECT directory_workers.division,directory_workers.jabber,tikets_main.worker,tikets_main.importance FROM tikets_main,directory_workers WHERE tikets_main.worker=directory_workers.login AND id=?",id)
		let userRoom=`user:room:${getData.worker}`;
		let groupRoom=`division:room:${getData.division}:2`;
		let divisionRoom=`division:room:${getData.division}`;
		let tiketData = await tiketsGets.getOneTiket(id);
		vdesk.io.to(userRoom).emit('tiketUpgrade',{data:tiketData,action:'edit'});
		vdesk.io.to(groupRoom).emit('tiketUpgrade',{data:tiketData,action:'edit'});
		
		vdesk.io.to(divisionRoom).emit('chattiket'+id,[{date:date,worker:'Система',text:`<b>${text}</b>`}],'edit');
		vdesk.io.to(userRoom).emit( 'notify',{tiket:id,date:date,text:text,ruk:false});
		vdesk.io.to(groupRoom).emit('notify',{tiket:id,date:date,text:text,ruk:true});
		await vdesk.xmpp.send(getData.jabber,text);
	}	
	res.render('confirmtiket', data);
};