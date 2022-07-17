exports.getData=async function(login,req){
	let sql = login && !req ? 'SELECT * FROM views_menu WHERE (login=? OR login IS NULL) ORDER BY views_menu.order ASC' : 'SELECT * FROM directory_menu'
	let [data] = await vdesk.mysql.query(sql,login)
	let [groups] = await vdesk.mysql.query('SELECT * FROM directory_access_menu_group')
	data.forEach( el => {
		el.groups = groups.filter( item => item.menu===el.id).map( item => item.group)
	})
	let main=data.filter( menu => !menu._parentId )
	main.forEach( gmenu => {
		gmenu.depth=0
		gmenu.expanded=false
		if(gmenu.type==='directory'){
			gmenu.children=data.filter( menu => menu._parentId === gmenu.id )
		}
	})
	return main
}

exports.setData=async function(data,type,req){
	let groups = data.groups
	delete data.groups
	if(data.type === 'link' && !data._parentId){
		data.icon = 'link'
	}
	switch(type){
		case 'new':
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_menu SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_menu SET ? WHERE id = ?', [data,data.id])
			await vdesk.mysql.query('DELETE FROM directory_access_menu_group WHERE menu = ?', data.id)
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_menu WHERE id = ?', data.id)
			break;
	}
	if(type!=='delete'){
		for(group of groups){
			await vdesk.mysql.query('INSERT INTO directory_access_menu_group SET ?', {group:group,menu:data.id})
		}
	}
	data.groups = groups
	return data
}