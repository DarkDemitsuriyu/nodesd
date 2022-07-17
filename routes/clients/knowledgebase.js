exports.get=async function(req,res){
	const lang = require('lang');
	let [forums]=await vdesk.mysql.query("SELECT * FROM clients_forums_knowledge_base ORDER BY orders ASC")
	let [items]=await vdesk.mysql.query("SELECT clients_knowledge_base.* FROM clients_knowledge_base ORDER BY name ASC")	
	forums.forEach(forum => {
		forum.items=[]
		items.forEach(item => {
			if(item.forum===forum.id){
				forum.items.push(item)
				delete item;
			}
		})
	})
	var data={
		params:req.params,
		title: lang.get('sections:knowledgebase'),
		data:forums
	}
	res.render('knowledgebase', data);	
};