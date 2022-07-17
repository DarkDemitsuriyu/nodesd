exports.get=async function(req,res){
	let [users]=await vdesk.mysql.execute('SELECT fullname, extphone, outphone, mail, department, jobtitle FROM _internal_ldap_personlist ORDER BY fullname ASC')
	let [tikets]=await vdesk.mysql.execute('SELECT id, name, icon, description FROM directory_topics WHERE visibility=true ORDER BY orders ASC')
	
	let [departments]=await vdesk.mysql.execute('SELECT id, name FROM directory_departments ORDER BY name ASC')
	let [divisions]=await vdesk.mysql.execute('SELECT id, name FROM directory_divisions ORDER BY name ASC')
	let [jobtitle]=await vdesk.mysql.execute('SELECT id, name FROM directory_jobtitle ORDER BY name ASC')
	
	let [links]=await vdesk.mysql.query("SELECT * FROM clients_links")
	
	let [knowledges]=await vdesk.mysql.query("SELECT * FROM clients_forums_knowledge_base ORDER BY orders ASC")
	let [items]=await vdesk.mysql.query("SELECT clients_knowledge_base.* FROM clients_knowledge_base ORDER BY name ASC")	
	knowledges.forEach(forum => {
		forum.items=[]
		items.forEach(item => {
			if(item.forum===forum.id){
				forum.items.push(item)
				delete item;
			}
		})
	})
	var data={
		users:users,
		tikets:tikets,
		knowledges:knowledges,
		links:links,
		departments:departments,
		divisions:divisions,
		jobtitle:jobtitle
	}
	res.send(data);
};