exports.get=function(req,res){
	const config = require('config');
	var lang = require('lang');
	var ldap = require('ldapjs');
	var users=[];
	var client = ldap.createClient({url: `ldap://${config.get('ldap:host')}`});
	client.bind(config.get('ldap:user'), config.get('ldap:password'), function(err) {
		//console.log(config.get('ldap:filter'))
		var opts = {scope: 'sub',filter: config.get('ldap:filter'),attributes: ['cn', 'mail']}
		client.search(config.get('ldap:basedn'), opts, function(err, resp) {
			resp.on('searchEntry', function(entry) {
				if(!!entry.object.cn){
					let userFIO=entry.object.cn.split("(", 1)[0];
					let data={
						name:`${entry.object.mail}(${userFIO})`,
						id:entry.object.mail
					};
					users.push(data);
				}
			});
			resp.on('searchReference', function(referral) {console.log('referral: ' + referral.uris.join());});
			resp.on('error', function(err) {console.error('error: ' + err.message);});
			resp.on('end', function(result) {
				vdesk.mysqlPool.getConnection(function(err,connection){
					let vote=[];
					connection.query('SELECT * FROM clients_vote WHERE active=true').on('result',function(row){
						connection.pause();
						vdesk.mysqlPool.getConnection(function(err,connect){
							var sql='SELECT clients_vote_list.*, COUNT(client_vote_ok.id) AS count FROM client_vote_ok,clients_vote_list WHERE client_vote_ok.item=clients_vote_list.id AND clients_vote_list.vote = ? GROUP BY clients_vote_list.name ORDER BY clients_vote_list.id ASC';//select clients_vote.name AS section, clients_vote_list.name AS item, COUNT(client_vote_ok.id) AS count  from client_vote_ok,clients_vote_list,clients_vote  where clients_vote.id=clients_vote_list.vote  and client_vote_ok.item=clients_vote_list.id and clients_vote.id=? group by clients_vote_list.name order by clients_vote.name
							connect.query(sql,row.id,function(err,results){
								if (err) throw err;
								row.items=results;
								vote.push(row);
								connect.release();
								connection.resume();
							});						
						});
					}).on('end',function(){
						connection.release();
						var data={
							users:users,
							params:req.params,
							title: lang.get('sections:vote'),
							data:vote
						}
						res.render('vote', data);
					});
				});				
			});
		});
	});
};
exports.post=function(req,res){
	console.log(req.body)
	//let sender_vote=req.body.sender_vote;
	let vote=req.body.vote.split("-");
	let data={
		vote:vote[0],
		item:vote[1],
		mail:req.body.sender_vote.split("(", 1)[0]
	}
	vdesk.mysqlPool.getConnection(function(err,connection){
		connection.query('INSERT INTO client_vote_ok SET ?',data, function(err, results) {
			if(err){
				connection.release();
				res.set('Content-Type','text/plain')
				res.send({status:false});
			} else {
				connection.query('SELECT COUNT(*) AS count FROM client_vote_ok WHERE item=?',data.item, function(err, results) {
					connection.release();
					res.set('Content-Type','text/plain')
					res.send({status:true,count:results[0].count});
				});
			}
		});
	});
};