exports.get=async function(req,res){
	const config = require('config');	
	const lang = require('lang');
	let [usersDB]=await vdesk.mysql.execute('SELECT fullname, extphone, outphone, mail FROM _internal_ldap_personlist ORDER BY fullname ASC')
	let users=usersDB.map(el => {
		let userArray=el.fullname.split(' ');
		return {
			senderphone:el.extphone || el.outphone,
			sendername:userArray[1],
			senderpatronymic:userArray[2],
			sendersurname:userArray[0],
			sendermail:el.mail
		};
	})
	let [rows]=await vdesk.mysql.execute('SELECT id, name, icon, description FROM directory_topics WHERE visibility=true ORDER BY orders ASC')
	let data={users:users,params:req.params,title:lang.get('sections:tikets'),data:rows};
	res.render('tikets', data);
};