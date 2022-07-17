exports.get=function(req,res,next){
	var config = require('config');
	var lang = require('lang');
	var moment=require('moment');
	req.params.lefttipes={
		infotiketstitle:lang.get('clients:lefttipes:infotiketstitle'),
		infotiketsinput:lang.get('clients:lefttipes:infotiketsinput'),
		infotiketsbutton:lang.get('clients:lefttipes:infotiketsbutton'),
		newstitle:lang.get('clients:lefttipes:newstitle')
	};
	req.params.sections={
		tikets:lang.get('sections:tikets'),
		knowledgebase:lang.get('sections:knowledgebase'),
		links:lang.get('sections:links'),
		login:lang.get('sections:login'),
		logout:lang.get('sections:logout')//,			
		//vote:lang.get('sections:vote')
	};
	if(!req.session.user){req.params.auth=0;}
	else{req.params.auth=1;}
	req.params.siteName=config.get('siteName');
	next();
};