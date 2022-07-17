exports.getData=async function(login,req){
	let [topics]=await vdesk.mysql.query("SELECT directory_topics.* FROM directory_topics,directory_workers WHERE directory_workers.division=directory_topics.division AND directory_workers.login=?",login)
	return topics
}

exports.setData=async function(data,type,req){
	switch(type){
		case 'new':
		data.division = req.session.user.division
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_topics SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_topics SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_topics WHERE id = ?', data.id)
			break;
	}	
	return data
}