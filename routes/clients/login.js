var lang = require('lang');
exports.get=function(req,res){
	var data={
		params:req.params,
		title: lang.get('sections:login'),
		username: lang.get('fields:username'),
		password: lang.get('fields:password'),
		button: lang.get('buttons:login')
	}
	res.render('login', data);
};
exports.post=async function({body:{saveMe,vDeskSave,password, ...body}, ...req},res,next){
	const criptPass=require('lib/criptPass');
	let find = vDeskSave || criptPass.createPassHash(password)
	let status = 3
	let sql = vDeskSave ? 'SELECT * FROM views_workers WHERE login = ? AND status<?' : 'SELECT vw.* FROM views_workers vw, directory_workers dw WHERE vw.login = dw.login AND dw.password = ? AND dw.status<?'
	let [[worker]] = await vdesk.mysql.query(sql,[find,status])//login = ? username
	if(!worker){
		res.send({status:false,field:'password',msg:lang.get('messages:passwordfaild')});
		return next()
	}
	let [groups] = await vdesk.mysql.query('SELECT directory_workers_in_group.group AS groups FROM directory_workers_in_group WHERE worker = ?', worker.login)
	//let [mainMenus] = await vdesk.mysql.query('SELECT nameeng AS id, name FROM views_menu_main WHERE login = ? ORDER BY orders ASC',worker.login)
	//let [secondMenus] = await vdesk.mysql.query('SELECT id, name, mainmenu FROM views_menu_secondary WHERE login = ? ORDER BY orders ASC',worker.login)
	worker.groups=groups.map( group => group.groups )
	/*worker.sideMenu=mainMenus.map( menu => {
		menu.submenu=secondMenus.filter( el => el.mainmenu === menu.id )
		return menu
	})*/
	req.session.user=worker;
	res.send({status:true,vDeskSave:saveMe ? worker.login : null,worker:req.session.user});//,sid:req.session.id

	//let username=req.body.username;
	/*let qwe = await criptPass.createSaltHash(password)
	console.log('createSaltHash',qwe)	
	console.log('checkSaltHash',await criptPass.checkSaltHash(password,qwe.salt,qwe.hash))*/

	//res.set('Content-Type', 'text/plain');
	/*
	let [[{count:isWorker}]] = await vdesk.mysql.query('SELECT COUNT(*) AS count FROM directory_workers WHERE login=? AND status<?', [username,3])
	if(!isWorker){
		res.send({status:false,field:'username',msg:lang.get('messages:loginfaild')});
		next()
	}	
	let [[{count:isPassword}]] = await vdesk.mysql.query('SELECT COUNT(*) AS count FROM directory_workers WHERE login = ? AND password = ? AND status<?', [username,password,3])
	if(!isPassword){
		res.send({status:false,field:'password',msg:lang.get('messages:passwordfaild')});
		next()
	}*/

}