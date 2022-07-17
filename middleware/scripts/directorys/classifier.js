exports.getData=async function(login,req){
	let [groups] = await vdesk.mysql.query('SELECT * FROM directory_classifier WHERE _parentId IS NUll')
	let [inserts] = await vdesk.mysql.query('SELECT * FROM directory_classifier WHERE _parentId IS NOT NUll')
	groups.forEach( el => {
		el.children = inserts.filter( item => el.id === item._parentId )
		if(el.children.length < 1){
			delete el.children
		}
	})
	return groups
}

exports.setData=async function(data,type,req){
	switch(type){
		case 'new':
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_classifier SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_classifier SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_classifier WHERE id = ?', data.id)
			break;
	}
	return data
}