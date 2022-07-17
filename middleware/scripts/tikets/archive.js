exports.getData=async function(login,req){
	return (await vdesk.mysql.query('SELECT COUNT(*) AS count FROM views_tikets_info_all WHERE archive = true'))[0][0]	
}

exports.setData=async function(data,type,req){
	console.log(data)
	let where = []
	for(let key in data){
		switch(key){
			case 'worker':
			case 'department':
			case 'status':
				if(data[key].length>0){
					where.push(`${key} IN ('${data[key].join("','")}')`)
				}				
				break;
			case 'id':
				let id = data.id.match(/(\d+)/gm)
				console.log(id)
				where.push(id.length > 1 ? `${key} BETWEEN ${id[0]} AND ${id[1]}` : `id = ${id[0]}`)
				break;
			case 'deadline':
			case 'startdate':
			case 'enddate':
				where.push(`${key} BETWEEN '${data[key].start}' AND '${data[key].end}'`)
				break;
			case 'attachment':
				where.push(`${key} IS NOT NULL`)
				break;
			case 'importance':
				where.push(`${key} = ${data[key]}`)
				break;
			case 'sendersurname':
			case 'topicname':
				if(data[key]){
					where.push(`${key} LIKE '%${data[key]}%'`)
				}
				break;
		}
	}
	
	console.log(`SELECT * FROM views_tikets_info_all WHERE ${where.join(' AND ')} GROUP BY id`)
	let [tikets] = await vdesk.mysql.query(`SELECT * FROM views_tikets_info_all WHERE ${where.join(' AND ')} GROUP BY id`)
	for(let tiket of tikets){
		tiket.logs = (await vdesk.mysql.query('SELECT * FROM views_tikets_logs WHERE tiket = ?',tiket.id))[0]
		if(tiket.newworker){
			tiket.confirmity = (await vdesk.mysql.query('SELECT * FROM view_tikets_new_employee_conformity WHERE tiket = ?',tiket.id))[0]
		}		
	}
	console.log(tikets.length)
	return tikets
}