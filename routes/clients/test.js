exports.get=function(req,res){
	var lang = require('lang');
	var ldap = require('ldapjs');
	var users=[];
	var client = ldap.createClient({url: 'ldap://10.77.1.90'});
	client.bind('cn=ldapuser,ou=tyumen,dc=rgs.ru', 'loertfg', function(err) {
		//console.log(err)
		var opts = {scope: 'sub',attributes: ['telephoneNumber', 'givenName', 'mail']}
		client.search('ou=tyumen,dc=rgs.ru', opts, function(err, resp) {
			/*console.log(err)
			console.log(resp)*/
			resp.on('searchEntry', function(entry) {
				if(!!entry.object.givenName){
					var userArray=entry.object.givenName.split(' ');
					var phoneArray=entry.object.telephoneNumber.split(' ext. ');
					var data={senderphone:phoneArray[0],sendername:userArray[1],senderpatronymic:userArray[2],sendersurname:userArray[0],sendermail:entry.object.mail};
					if(phoneArray[1].length>1){data.senderphone=phoneArray[1];}
					users.push(data);
				}
			});
			resp.on('searchReference', function(referral) {console.log('referral: ' + referral.uris.join());});
			resp.on('error', function(err) {console.error('error: ' + err.message);});
			resp.on('end', function(result) {
				vdesk.mysqlPool.getConnection(function(err,connection){
					connection.query("SELECT id, name, icon, description FROM directory_topics WHERE visibility=true ORDER BY orders ASC", function(err, rows) {
						if (err) throw err;
						var data={users:users,params:req.params,title:lang.get('sections:tikets'),data:rows};
						connection.release();
						res.render('test', data);
					});
				});
			});
		});
	});
	
	
	
};