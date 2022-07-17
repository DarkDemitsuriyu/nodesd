exports.getData=async function(login,req){
	let [data] = await vdesk.mysql.query('SELECT * FROM directory_divisions ORDER BY name')
	return data
}

exports.setData=async function(data,type,req){
	switch(type){
		case 'new':
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_divisions SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_divisions SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_divisions WHERE id = ?', data.id)
			break;
	}	
	return data
}