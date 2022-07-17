module.exports={
	async getAll(login){
		return await Promise.all([
			vdesk.mysql.query("SELECT login AS id, if(login='admin','Система',CONCAT(directory_workers.surname, ' ', directory_workers.name,' ', directory_workers.patronymic)) AS name FROM directory_workers WHERE status != 3 AND division=(SELECT division FROM directory_workers WHERE login=?)", login),
			vdesk.mysql.query("SELECT id,name FROM directory_topics WHERE id != 5"),
			vdesk.mysql.query("SELECT id,name FROM directory_workers_status"),
			vdesk.mysql.query("SELECT id,name FROM directory_jobtitle"),
			vdesk.mysql.query("SELECT id,name FROM menu_secondary"),
			vdesk.mysql.query("SELECT id,name FROM menu_main"),
			vdesk.mysql.query("SELECT id,name FROM directory_list_of_equipment WHERE isItem=true ORDER BY name"),
			vdesk.mysql.query("SELECT id,name FROM directory_workers_group"),
			vdesk.mysql.query("SELECT id,name FROM clients_forums_knowledge_base"),
			vdesk.mysql.query("SELECT id,name FROM directory_divisions"),
			vdesk.mysql.query("SELECT sid AS id,name FROM directory_departments"),
			vdesk.mysql.query("SELECT id,name FROM directory_contractors"),
			vdesk.mysql.query("SELECT id,name FROM directory_list_of_equipment WHERE isItem=false ORDER BY name")
		]).then(async function([[workers],[topic],[statusworkers],[jobtitle],[menu],[mainmenu],[hardwareitems],[group],[forum],[division],[department],[contractor],[hardwaresections]]) {
			return {workers,topic,statusworkers,jobtitle,menu,mainmenu,hardwareitems,group,forum,division,department,contractor,hardwaresections}
		}).catch(error => {
			console.log(error)
		})
	}
};