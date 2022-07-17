exports.getData=async function(login,req){
	return await Promise.all([
		vdesk.mysql.query('SELECT DISTINCT clients_forums_knowledge_base.id, null AS _parentId, false AS isItem, clients_forums_knowledge_base.name, IF(clients_forums_knowledge_base.id IN (SELECT DISTINCT forum FROM clients_knowledge_base),"closed",null) AS state FROM clients_forums_knowledge_base,clients_knowledge_base ORDER BY clients_forums_knowledge_base.orders'),
		vdesk.mysql.query('SELECT clients_knowledge_base.forum AS _parentId, clients_knowledge_base.*, true AS isItem FROM clients_knowledge_base,clients_forums_knowledge_base WHERE clients_forums_knowledge_base.id=clients_knowledge_base.forum AND division=(SELECT division FROM directory_workers WHERE login=?)',login)
	]).then(async function([[forums],[knowledges]]) {
		forums.forEach( forum => {
			forum.depth=0
			forum.expanded=false
			forum.children=[]
			knowledges.forEach(knowledge => {
				knowledge.depth=1
				knowledge.expanded=false
				if(knowledge._parentId===forum.id){
					knowledge.id = `${forum.id}-${knowledge.id}`
					forum.children.push(knowledge)
				}
			})
		})
		return forums
	}).catch(error => {
		console.log(error)
	})
}

exports.setData=async function(req,res,next){
	/*let data = await vdesk.mysql.query('SELECT * FROM clients_forums_knowledge_base')
	res.send(data)*/
}