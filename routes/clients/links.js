exports.get=async function(req,res){
	var lang = require('lang');
	let [rows]=await vdesk.mysql.query("SELECT * FROM clients_links")
	var data={
		params:req.params,
		title: lang.get('sections:links'),
		data:rows
	}
	res.render('links', data);
};