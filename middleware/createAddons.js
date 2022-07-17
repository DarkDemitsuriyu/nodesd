module.exports=async function(login){
	let preparation=function(main,searched,parentId,depth=0){
		searched.forEach( el => {
			let item=Object.assign({},el)
			delete el
			item.depth=depth
			item.expanded=false
			
			if(!item._parentId && !parentId){
				if(item.type!=='link'){
					item.children=[]
					preparation(item.children,searched,item.id,depth+1)
					if(item.children.length>0){
						main.push(item)
					}
				} else {
					main.push(item)
				}
				
			} else if(item._parentId===parentId){
				if(item.type!=='directory'){
					main.push(item)
				} else {
					item.children=[]
					preparation(item.children,searched,item.id,depth+1)
					if(item.children.length>0){
						main.push(item)
					}
				}
			}
		})
	}
	

	console.log('login',login)
	let [data] = await vdesk.mysql.query('SELECT * FROM views_menu WHERE login=? OR login IS NULL ORDER BY views_menu.order ASC',login)
	console.log('menu',data)
	let main=[]
	
	preparation(main,data,false)
	console.log('main',main)
	return main
	
	/*let [mainMenus] = await vdesk.mysql.query('SELECT nameeng AS id, name FROM views_menu_main WHERE login = ? ORDER BY orders ASC',login)
	let [secondMenus] = await vdesk.mysql.query('SELECT id, name, mainmenu FROM views_menu_secondary WHERE login = ? ORDER BY orders ASC',login)
	return mainMenus.map( menu => {
		menu.submenu=secondMenus.filter( el => el.mainmenu === menu.id )
		return menu
	})*/
	/*
	let [mainMenus] = await vdesk.mysql.query('SELECT * FROM views_menu_main WHERE login = ? ORDER BY orders ASC',login)
	for(let menu of mainMenus){
		let sqlSecond='(SELECT menu_secondary.name, menu_secondary.link AS id,menu_secondary.orders FROM menu_main,menu_secondary,directory_workers,directory_access_menu_for_workers WHERE menu_main.id = menu_secondary.mainmenu AND menu_secondary.id = directory_access_menu_for_workers.menu AND directory_access_menu_for_workers.worker = directory_workers.login AND directory_workers.login = ? AND menu_secondary.mainmenu = ?) UNION (SELECT menu_secondary.name, menu_secondary.link AS id,menu_secondary.orders FROM menu_main,menu_secondary,directory_workers_in_group,directory_workers,directory_access_menu_for_group WHERE menu_main.id = menu_secondary.mainmenu AND menu_secondary.id=directory_access_menu_for_group.menu AND directory_workers_in_group.worker = directory_workers.login AND directory_access_menu_for_group.group = directory_workers_in_group.group AND directory_workers.login = ? AND menu_secondary.mainmenu = ?) ORDER BY orders ASC';
		let [secondMenus] = await vdesk.mysql.query(sqlSecond,[login,menu.id,login,menu.id])
		secondMenus.forEach( item => {
			item.id=`${menu.nameeng}-${item.id}`
		});
		menu.submenu=secondMenus;
	}*/
	//return mainMenus
}