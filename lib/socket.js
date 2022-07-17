//var log = require('libs/log')(module);
const tiketsGets=require('middleware/scripts/tikets/tikets_gets');
var config = require('config');
//var connect=require('connect');
var async = require('async');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
//var session = require('express-session')(config.get('session'));
var sessionStore=require('lib/sessionStore');
var HttpError=require('error').HttpError;
let dropdowns=require('middleware/scripts/dropdowns')//'middleware/dropdowns/dropdowns.json'
//var User = require('models/user').User;
 
//var clients=[];

function loadSession(sid, callback){
	//console.log('sess sid',sid)
	sessionStore.load(sid, function(err, session){
		//console.log('err',err)
		//console.log('arguments',arguments.length)
		if(arguments.length==0){
			return callback(null, null);
		} else {
			session.sid=sid;
			return callback(null,session);
		}
	});
}
function loadUser(session, callback){
	if(!session){
		//log.debug("Session %s is anonymous", session.id);
		return callback(null,null);
	}
	//log.debug("retrieving user",session.user);
	if('user' in session){
		callback(null,session);
	}else{
		callback(null,null);
	}
	//require('middleware/createSession')(session,callback);
}

let joinToGroups = (socket,worker) => {
	console.time('Join group rooms OK!')
	let userRoom = `user:room:${worker.login}`
	let divisionRoom = `division:room:${worker.division}`
	socket.join(userRoom);
	socket.join(divisionRoom);
	worker.groups.forEach( group => {
		socket.join(`${divisionRoom}:${group}`);
		socket.join(`groups:room:${group}`);
	})
	//console.log('Join group rooms OK!')
	console.timeEnd('Join group rooms OK!')
}
let startData = async function(socket,worker) {
	console.time('startData1')
	let isGetTiket = false
	let menu = await require('middleware/scripts/directorys/menu').getData(worker.login,null)
	let [addressbook] = await vdesk.mysql.execute('SELECT fullname, extphone, outphone, mail, department, jobtitle FROM _internal_ldap_personlist ORDER BY fullname ASC')
	let returned = { dropdowns: {}, worker, menu, addressbook, tikets:null }
	console.timeEnd('startData1')
	console.time('startData2')
	for(let item of menu){
		switch(item.link){
			case 'tikets':
			//console.log(socket.request)
				returned.tikets = await tiketsGets.getListTiket(socket.request)			
				/*if(!isGetTiket){
					
					isGetTiket = true
				}*/
				break
			case 'links': break
			default:
				returned[item.link] = {}
				for(let child of item.children){
					returned[item.link][child.link] = await require(`middleware/scripts/${item.link}/${child.link}`).getData(worker.login,socket.request)
				}
			break
		}
	}
	console.timeEnd('startData2')
	console.time('startData3')
	returned.dropdowns = await dropdowns.getAll(worker.login)
	/*for(let key in dropdowns){
		let [data] = await vdesk.mysql.query(dropdowns[key],worker.login)
		returned.dropdowns[key] = data
	}*/
	console.timeEnd('startData3')
	socket.emit('returned',returned);
	socket.emit('start_data',returned);
}
module.exports=function(server){
	var io=require('socket.io').listen(server);
	io.origins('10.72.*.*:*');
	io.use(function(socket,next){
		var handshake=socket.request;
		//console.log('handshake',socket.handshake)
		async.waterfall([
			function(callback){
				var sid;
				if(socket.handshake.query.desktopClient){
					sid=handshake.cookies=socket.handshake.query.ssid;
				} else {
					handshake.cookies=cookie.parse(handshake.headers.cookie || '');
					var sidCookie=handshake.cookies[config.get('session:key')] || '';
					sid=cookieParser.signedCookie(sidCookie,config.get('session:secret')) || null
				}
				//console.log('handshake',handshake.headers)
				//console.log('handshake',socket.handshake)				
				//console.log('sid',sid)
				loadSession(sid,callback);
			},
			function(session,callback){
				//console.log('session',session)
				if(!session){
					//console.log(401,"No session")
					callback("No session");
				}
				handshake.session=session;
				loadUser(session,callback)
			},
			function(data,callback){
				if(!data){
					callback("Anonymous session may not connect");
				} else{
					handshake.session=data;
					callback(null);
				}				
			}
		], function(err){
			//console.log('err',err)
			if(err){
				next(new Error(err));
			} else {
				next();
			}			
		});
	});
	
	/*io.sockets.on('session:reload',function(sid){
		console.log(1)
		var clients = io.sockets.clients();
		clients.forEach(function(client){
			if(client.handshake.session.id!=sid) return;
			loadSession(sid,function(err,session){
				if(err){
					client.emit("error","server error");
					client.disconnect();
					return;
				}				
				if(!session){
					client.emit("error","handshake unauthorizad");
					client.disconnect();
					return;
				}
				console.log(session)
				client.handshake.session=session;
			});
		})
	});*/
	
	io.on('q',function(){
		//console.log('qqq')  
	})
	
	io.on('connection',function(socket){
		console.time('socket')
		socket.emit('isConnected');
		console.log('socket Connection') 
		//console.log('session',socket.request.session)
		if(!socket.request.session || !socket.request.session.user){
			console.log('socket Close session')
			socket.emit('closesession');
		} 
		else {
			console.log('socket go go go')
			let worker = socket.request.session.user
			let userRoom = `user:room:${worker.login}`
			let divisionRoom = `division:room:${worker.division}`
			
			joinToGroups(socket,worker)
			startData(socket,worker)
			
			socket.on('adddata',async function(){
				//let menu = await require('middleware/createAddons')(worker.login)
				let menu = await require('middleware/scripts/directorys/menu').getData(worker.login,null)
				//console.log('addonsdata',menu[5])
				socket.emit('addonsdata',{menu:menu,worker:worker});
			});
			
			socket.on('data_update',async function(component,type,data){
				console.log(123)
				//console.log(component)
				//console.log(type)
				//console.log(data)
				let [main,second] = component.split('-')
				//console.log(main)
				//console.log(second)
				let received = await require(`middleware/scripts/${main}/${second}`).setData(data,type,socket.request)
				switch(second){
					case 'archive':
						//res.send(data)
						break;
					case 'invoices':
						vdesk.io.to(`division:room:${worker.division}`).emit('dataload',{
							header:component,
							data:received,
							status:type
						});
						//res.send({id:data.children[0].children[0].id})
						break;
					default:
						vdesk.io.to(`division:room:${worker.division}`).emit('dataload',{
							header:component,
							data:received,
							status:type
						});
						
						//res.end()
						break;
				}
			});
			
			socket.on('countTikets',function(){require('middleware/countTikets')(worker.login,function(obj){socket.emit('countTikets',obj);});});
			
			socket.on('dataload',function(data,header){
				require('middleware/scripts/'+data+'/data')(worker.login,function(obj,type){
					socket.emit('dataload',{header:header,data:obj,status:type});
				});
			});
			
			socket.on('tiketinfo',async function(id,topicname){
				let updateData = await vdesk.mysql.query('UPDATE tikets_main SET new=false WHERE id = ?',id)
				let tiketData = await tiketsGets.getOneTiket(id)
				io.to(`${divisionRoom}:2`).emit('tiketUpgrade',{data:tiketData,action:'edit'});
				if(!worker.groups.includes(2)){
					io.to(userRoom).emit('tiketUpgrade',{data:tiketData,action:'edit'});
				}				
				/*switch(topicname){
					case 'Новый сотрудник':require('middleware/scripts/tikets/infoNewEqip')(login,id,socket,io,divisionRoom);break;
					default:require('middleware/scripts/tikets/info')(login,id,socket,io,divisionRoom);break;
				}				*/
			});
			
			socket.on('oldtiketinfo',function(id,topicname){
				switch(topicname){
					case 'Новый сотрудник':require('middleware/scripts/tikets/oldInfoNewEqip')(worker.login,id,socket,io,divisionRoom);break;
					default:require('middleware/scripts/tikets/oldInfo')(worker.login,id,socket,io,divisionRoom);break;
				}				
			});
			
			socket.on('send_tiket_chat',(data)=>{
				require('middleware/scripts/tikets/sendTiketChat')(data,io,divisionRoom)
			});
			
			socket.on('tiketcomment',function(data){
				data.worker=worker.login;
				require('middleware/scripts/tikets/comment')(data,function(obj){socket.emit('tiketcomment'+data.tiket,obj);});
			});			
			socket.on('edittiket',function(data){ 
				require('middleware/scripts/tikets/tiketedit')(data,socket.request.session.user,io,function(obj){
					socket.emit('edittiket',{header:data.tiket,data:obj});
					socket.broadcast.to(divisionRoom+':2').emit('edittiket',{header:data.tiket,data:obj});
					console.log(obj.notify)
					obj.notify.forEach((el,idx)=>{
						if(el.ruk){
							io.to(divisionRoom+':2').emit('notify',el);							
						} else {
							io.to('user:room:'+obj.data.worker).emit('notify',el);
						}
					})
					//if(socket.request.session.user.login!==obj.worker){io.to('user:room:'+obj.worker).emit('edittiket'+data.tiket,obj.data);}
				});
			});
			
			socket.on('tiket_edit',function(data){ 
				require('middleware/scripts/tikets/tiket_edit')(data,socket.request.session.user,io);
			});
			
			socket.on('edittiketstatus',function(data){require('middleware/scripts/tikets/statusedit')(data,socket.request.session.user,function(obj){
				//console.log(obj)
				io.to(divisionRoom).emit('edittiketstatus'+data.id,obj.msg);
				io.to('user:room:'+obj.data.worker).emit('dataload',{header:'tikets-my',data:obj.data,status:'edit'});
				io.to(divisionRoom+':2').emit('dataload',{header:'tikets-all',data:obj.dataall,status:'edit'});
				console.log(obj)
				if(obj.notify.ruk){
					io.to('user:room:'+obj.data.worker).emit('notify',obj.notify);
				} else {
					io.to(divisionRoom+':2').emit('notify',obj.notify);
				}
				if(obj.refuse){
					io.to(divisionRoom).emit('forRukQuestion',obj.refusedata);
				}
			},io);});
			socket.on('editnewtiketstatus',function(data){require('middleware/scripts/tikets/statuseditnew')(data,socket.request.session.user,function(obj){
				io.to(divisionRoom).emit('edittiketstatus'+data.tiket,obj.msg);
				if(!!obj.data){
					obj.data.workers.forEach(function(item){io.to('user:room:'+item.worker).emit('dataload',{header:'tikets-my',data:obj.data,status:'edit'});});
					io.to(divisionRoom+':2').emit('dataload',{header:'tikets-all',data:obj.dataall,status:'edit'});
				}
			},io);});
			
			socket.on('gettiket',function(data){require('middleware/scripts/tikets/gettiket')(data,socket.request.session.user,function(obj){
				socket.emit('gettiket'+data.id,obj);
				if((typeof obj)!=='string'){
					socket.emit('dataload'+data.type,obj.data,'edit');
					socket.broadcast.to(divisionRoom).emit('dataload'+data.type,obj.data,'delete');
					io.to(divisionRoom).emit('dataloadtikets-all',obj.dataall,'edit');
				}				
			});});
			
			socket.on('dropdawn',function(data){require('middleware/scripts/dropdown/'+data)(worker.login,function(obj){socket.emit('dropdawn'+data,obj);});});
			
			socket.on('form-update',function(data){
				require('middleware/scripts/'+data.url+'/update')(data,function(url,obj,type){ 
					if(data.url==='tikets/create'){socket.emit('dataload'+url.replace('/','-'),obj,type);}
					else{io.to(divisionRoom).emit('dataload'+url.replace('/','-'),obj,type);}					
				},socket.request.session.user,socket);
			});
			
			socket.on('load-file',function(data){
				var fs = require('fs');
				fs.writeFile(data.path, data.file, function (err) {
					if (err) throw err;
					console.log('It\'s saved!');
				});
			});

			socket.on('disconnect', function () {
				console.log('disconnect - '+worker.login);
				//for(var i=0;i<clients.length;i++){if(clients[i].login===login){clients.splice(i, 1);}}
			});
			
			console.timeEnd('socket')
		}		
	});	
	return io;
};