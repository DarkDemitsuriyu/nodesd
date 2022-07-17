exports.get=async function(req,res){
	const config = require('config');	
	const lang = require('lang');

	let [users]=await vdesk.mysql.execute('SELECT fullname, extphone, outphone, mail, department, jobtitle FROM _internal_ldap_personlist ORDER BY fullname ASC')
	let data={users:users,params:req.params,title:lang.get('sections:help')};
	res.render('help', data);
};