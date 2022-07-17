exports.getData=async function(login,req){
	let preparation=function(main,searched,parentId,depth=0){
		searched.forEach((el,idx) => {
			let item=Object.assign({},el)
			delete el
			item.depth=depth
			item.expanded=false
			if(!item.isItem && !item._parentId && !parentId){
				item.children=[]				
				main.push(item)
				preparation(item.children,searched,item.id,depth+1)
			} else if(item._parentId===parentId){
				if(item.isItem){
					main.push(item)
				} else {
					item.children=[]
					main.push(item)
					preparation(item.children,searched,item.id,depth+1)
				}
			}
		})
	}
	let [data] = await vdesk.mysql.query('SELECT @id:=id AS id,name,isItem,_parentId, (SELECT COUNT(*) FROM directory_list_of_equipment WHERE _parentId=@id) AS count FROM directory_list_of_equipment')
	let totalCount=data.reduce((previousValue, currentValue, idx) => {
		previousValue=previousValue.hasOwnProperty('count') ? previousValue.count : previousValue
		return !currentValue.isItem ? previousValue + currentValue.count : previousValue
	})
	let main=[]
	preparation(main,data,false)
	return main
}

exports.setData=async function(data,type,req){
	switch(type){
		case 'new':
			let [insertData] = await vdesk.mysql.query('INSERT INTO directory_list_of_equipment SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE directory_list_of_equipment SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM directory_list_of_equipment WHERE id = ?', data.id)
			break;
	}	
	return data
}