var config = require('config');
var nconf=require('nconf');
nconf.argv()
	.env()
	.add('lang',{type:'file',file:'lang/'+config.get('lang')+'.json'});
module.exports=nconf;