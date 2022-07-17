const moment=require('moment');
moment.locale('ru-RU')

exports.getData=async function(login,req){
	return await Promise.all([
		vdesk.mysql.query('SELECT DISTINCT YEAR(shared_invoices.date) AS id, 0 AS depth, false AS isItem,YEAR(shared_invoices.date) AS date FROM shared_invoices WHERE division=(SELECT division FROM directory_workers WHERE login=?) ORDER BY date',login),
		vdesk.mysql.query('SELECT DISTINCT CONCAT(YEAR(shared_invoices.date), DATE_FORMAT(shared_invoices.date,"%m")) AS id, 1 AS depth, false AS isItem,MONTHNAME(shared_invoices.date) AS date, YEAR(shared_invoices.date) AS _parentId FROM shared_invoices WHERE division=(SELECT division FROM directory_workers WHERE login=?) ORDER BY DATE_FORMAT(shared_invoices.date,"%m")',login),
		vdesk.mysql.query('SELECT shared_invoices.*, DATE_FORMAT(shared_invoices.date, "%Y-%m-%d") AS date, 2 AS depth, true AS isItem, directory_departments.name AS departmentname, directory_contractors.name AS contractorname, CONCAT(YEAR(shared_invoices.date),DATE_FORMAT(shared_invoices.date,"%m")) AS _parentId FROM shared_invoices,directory_departments,directory_contractors WHERE shared_invoices.department=directory_departments.id AND shared_invoices.contractor=directory_contractors.id AND shared_invoices.division=(SELECT division FROM directory_workers WHERE login=?) ORDER BY date',login),
		vdesk.mysql.query('SELECT directory_list_of_equipment.name,shared_invoices_equipments.equipment, shared_invoices_equipments.quantity, shared_invoices_equipments.invoice, shared_invoices_equipments.price, ROUND(shared_invoices_equipments.price/1.18,2) AS withoutVAT, shared_invoices_equipments.price*shared_invoices_equipments.quantity AS total FROM directory_list_of_equipment,shared_invoices_equipments,shared_invoices WHERE shared_invoices_equipments.invoice=shared_invoices.id AND shared_invoices_equipments.equipment=directory_list_of_equipment.id')
	]).then(async function([[years],[months],[invoices],[equipments]]) {
		invoices.forEach((el)=>{
			el.equipments=[]
			equipments.forEach((item)=>{
				if(item.invoice===el.id){
					el.equipments.push(item)
				}
			})
		})
		months.forEach((month,idx)=>{
			month.children=[];
			invoices.forEach((item)=>{
				if(item._parentId===month.id){
					month.children.push(item)
				}
			})
		})
		years.forEach((year,idx)=>{
			year.children=[];				
			months.forEach((month)=>{
				if(month._parentId===year.id){
					year.children.push(month)
				}
			})
		})
		return years
	}).catch(error => {
		console.log(error)
	})
};

exports.setData=async function(data,type,req){
	console.log(data)
	let equipments=data.equipments;
	let returnData={
		id:moment(data.date).year(),
		isItem:false,
		date:moment(data.date).year(),
		children:[
			{
				id:moment(data.date).format('YYYYMM'),
				isItem:false,
				date:moment(data.date).format('MMMM'),
				_parentId:moment(data.date).year(),
				children:[
					{
						_parentId:moment(data.date).format('YYYYMM'),
						isItem:true
					}
				]
			}
		]			
	};
	data.total_count = equipments.reduce( (acc, el) => acc + el.quantity , 0 )
	data.total_sum = equipments.reduce( (acc, el) => acc + el.total , 0 )
	delete data.equipments;
	delete data.depth;
	delete data.isItem
	delete data.departmentname
	delete data.contractorname
	delete data._parentId
	switch(type){
		case 'new':
			data.division=req.session.user.division;
			let [insertData]=await vdesk.mysql.query('INSERT INTO shared_invoices SET ?',data)
			let [[invoice]]=await vdesk.mysql.query('SELECT shared_invoices.*, DATE_FORMAT(shared_invoices.date, "%Y-%m-%d") AS date, 2 AS depth, true AS isItem, directory_departments.name AS departmentname, directory_contractors.name AS contractorname, CONCAT(YEAR(shared_invoices.date),DATE_FORMAT(shared_invoices.date,"%m")) AS _parentId FROM shared_invoices,directory_departments,directory_contractors WHERE shared_invoices.department=directory_departments.id AND shared_invoices.contractor=directory_contractors.id AND shared_invoices.id=?',insertData.insertId)

			data = invoice
			data.equipments=[]
			for(let equipment of equipments){
				let [insertData]=await vdesk.mysql.query('INSERT INTO shared_invoices_equipments SET ?',{invoice:data.id,equipment:equipment.equipment,quantity:equipment.quantity,price:equipment.total/equipment.quantity,total:equipment.total})
				
				equipment.id=insertData.insertId
				equipment.invoice=data.id
				data.equipments.push(equipment)
			}
			Object.assign(returnData.children[0].children[0], data)
			break;
		case 'update': 
			await vdesk.mysql.query('UPDATE shared_invoices SET ? WHERE id = ? ',[data,data.id])
			await vdesk.mysql.query('DELETE FROM shared_invoices_equipments WHERE invoice = ?', data.id)
			for(let equipment of equipments){
				await vdesk.mysql.query('INSERT INTO shared_invoices_equipments SET ?', {invoice:data.id,equipment:equipment.equipment,quantity:equipment.quantity,price:equipment.total/equipment.quantity,total:equipment.total})
			}
		break;
		case 'delete':
			await vdesk.mysql.query('DELETE FROM shared_invoices WHERE id = ?', data.id)
			await vdesk.mysql.query('DELETE FROM shared_invoices_equipments WHERE invoice = ?', data.id)
		break;
	}
	return returnData
}