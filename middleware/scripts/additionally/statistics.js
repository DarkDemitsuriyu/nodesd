exports.getData=async function(login,req){
	let [workers] = await vdesk.mysql.query('SELECT * FROM views_workers WHERE division=(SELECT division FROM directory_workers WHERE login=?)',login)
	for(let worker of workers){
		let [groups] = await vdesk.mysql.query('SELECT directory_workers_in_group.group AS groups FROM directory_workers_in_group WHERE worker = ?', worker.login)
		worker.groups=groups.map( group => group.groups )
		let [topics] = await vdesk.mysql.query('SELECT directory_connection_topics.topic AS topics FROM directory_connection_topics WHERE worker = ?', worker.login)
		worker.topics=topics.map( topic => topic.topics )
	}
	return workers
}

exports.setData=async function(data,type,req){
	const criptPass=require('lib/criptPass');
	const genPass=require('lib/genPass');
	const mailSend=require('middleware/mailSend');

	let sendPassword=function(text){
		let pass = genPass()
		let bodyMail = `${text} - ${pass}`
		mailSend(null,'Пароль для входа',data.email,'s.desk@tyumen.rgs.ru',bodyMail,null);
		return criptPass.createPassHash(pass)
	}
	let passgen = data.passgen
	let groups = data.groups
	let topics = data.topics
	delete data.passgen
	delete data.groups
	delete data.topics
	delete data.statusname
	delete data.departmentname
	delete data.divisionname	
	
	switch(type){
		case 'new':
			data.password=sendPassword('Для вас была создана учетная запись в системе "Служба заявок", пароль для входа')
			await vdesk.mysql.query('INSERT INTO directory_workers SET ?', data)
			break;
		case 'update':
			if(passgen){
				data.password=sendPassword('Ваш пароль для входа в систему "Служба заявок", был изменен. Новый пароль')
			}
			await vdesk.mysql.query('UPDATE directory_workers SET ? WHERE login = ?', [data,data.login])
			await vdesk.mysql.query('DELETE FROM directory_workers_in_group WHERE worker = ?', data.login)
			await vdesk.mysql.query('DELETE FROM directory_connection_topics WHERE worker = ?', data.login)			
			break;
	}
	for(let group of groups){
		await vdesk.mysql.query('INSERT INTO directory_workers_in_group SET ?', {worker: data.login,group: group})
	}
	for(let topic of topics){
		await vdesk.mysql.query('INSERT INTO directory_connection_topics SET ?', {worker: data.login,topic: topic})
	}
	if(data.password){
		delete data.password
	}
	data.groups = groups
	data.topics = topics
	return data
}