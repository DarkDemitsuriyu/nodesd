exports.get=function(req,res){
	var lang = require('lang');
	var data={
		params:req.params,
		lang:lang.get('workers')
	}
	res.render('workers', data);
};