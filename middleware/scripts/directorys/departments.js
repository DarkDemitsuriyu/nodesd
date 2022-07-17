exports.getData=async function(login,req){
	let [data] = await vdesk.mysql.query('SELECT * FROM directory_departments')
	return data
}

exports.setData=async function(data,type,req){
	switch(type){
		case 'new':
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_departments SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_departments SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_departments WHERE id = ?', data.id)
			break;
	}	
	return data
}