//var log = require('libs/log')(module);
var config = require('config');
//var connect=require('connect');
var async = require('async');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
//var session = require('express-session')(config.get('session'));
var sessionStore=require('lib/sessionStore');
var HttpError=require('error').HttpError;
//var User = require('models/user').User;

//var clients=[];

function loadSession(sid, callback){
	console.log('sess sid',sid)
	sessionStore.load(sid, function(err, session){
		console.log('err',err)
		console.log('arguments',arguments)
		if(arguments.length==0){
			return callback(null, null);
		} else {
			//session.sid=sid;
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
 
module.exports=function(server){
	var io=require('socket.io').listen(server);
	io.origins('10.72.*.*:*');
	io.use(function(socket,callback){
		var handshake=socket.request;
		async.waterfall([
			function(callback){
				var sid;
				if(socket.handshake.query.desktopClient){
					sid=handshake.cookies=socket.handshake.query.ssid;
				} else {
					handshake.cookies=cookie.parse(handshake.headers.cookie || '');
					var sidCookie=handshake.cookies[config.get('session:key')];
					sid=cookieParser.signedCookie(sidCookie,config.get('session:secret'))
				}
				console.log('handshake',handshake.headers)
				console.log('handshake',socket.handshake)				
				console.log('sid',sid)
				loadSession(sid,callback);
			},
			function(session,callback){
				if(!session){
					console.log(401,"No session")
					callback(new HttpError(401,"No session"));
				}
				handshake.session=session;
				loadUser(session,callback)
			},
			function(data,callback){
				if(!data){
					callback(new HttpError(403,"Anonymous session may not connect"));
				} else{
					handshake.session=data;
					callback(null);
				}				
			}
		], function(err){
			if(!err){
				return callback(null,true);
			}
			if(err instanceof HttpError){
				//console.log(123)
				return callback(null,false);
			}
			callback(err);
			
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

	io.on('connection',function(socket){
		console.log('socket Connection')
		console.log('session',socket.request.session)
		if(!socket.request.session || !socket.request.session.user){
			console.log('socket Close session')
			socket.emit('closesession');
		} 
		else {
			console.log('socket go go go')
			var login=socket.request.session.user.login;
			console.log('login', login)
			var groups=socket.request.session.user.groups;
			console.log('groups', groups)
			var userRoom = "user:room:"+login;
			console.log('userRoom', userRoom)
			var divisionRoom = "division:room:" + socket.request.session.user.division;
			console.log('divisionRoom', divisionRoom)
			socket.join(userRoom);
			socket.join(divisionRoom);
			console.log('join rooms OK!')
			groups.forEach(function(group){
				socket.join('division:room:'+socket.request.session.user.division+':'+group);
				socket.join('groups:room:'+group);
			})
			console.log('join group rooms OK!')
			socket.on('adddata',function(){
				console.log(666)
				require('middleware/createAddons')(login,function(obj){
					console.log('object',obj)
					console.log('session addonsdata1',socket.request.session)
					socket.emit('addonsdata',obj,socket.request.session);
				});
			});
			
			socket.on('countTikets',function(){require('middleware/countTikets')(login,function(obj){socket.emit('countTikets',obj);});});
			
			socket.on('dataload',function(data,header){
				require('middleware/scripts/'+data+'/data')(login,function(obj,type){
					socket.emit('dataload',header,obj,type);
				});
			});
			
			socket.on('tiketinfo',function(id,topicname){
				switch(topicname){
					case 'Новый сотрудник':require('middleware/scripts/tikets/infoNewEqip')(login,id,socket,io,divisionRoom);break;
					default:require('middleware/scripts/tikets/info')(login,id,socket,io,divisionRoom);break;
				}				
			});
			
			socket.on('oldtiketinfo',function(id,topicname){
				switch(topicname){
					case 'Новый сотрудник':require('middleware/scripts/tikets/oldInfoNewEqip')(login,id,socket,io,divisionRoom);break;
					default:require('middleware/scripts/tikets/oldInfo')(login,id,socket,io,divisionRoom);break;
				}				
			});
			
			socket.on('tiketcomment',function(data){
				data.worker=login;
				require('middleware/scripts/tikets/comment')(data,function(obj){socket.emit('tiketcomment'+data.tiket,obj);});
			});
			
			socket.on('edittiket',function(data){
				require('middleware/scripts/tikets/tiketedit')(data,socket.request.session.user,io,function(obj){
					socket.emit('edittiket',data.tiket,obj);
					socket.broadcast.to(divisionRoom+':2').emit('edittiket',data.tiket,obj);					
					//if(socket.request.session.user.login!==obj.worker){io.to('user:room:'+obj.worker).emit('edittiket'+data.tiket,obj.data);}
				});
			});
			
			socket.on('edittiketstatus',function(data){require('middleware/scripts/tikets/statusedit')(data,socket.request.session.user,function(obj){
				console.log(obj)
				io.to(divisionRoom).emit('edittiketstatus'+data.id,obj.msg);
				io.to('user:room:'+obj.data.worker).emit('dataload','tikets-my',obj.data,'edit');
				io.to(divisionRoom+':2').emit('dataload','tikets-all',obj.dataall,'edit');
				console.log(obj)
				if(obj.refuse){
					io.to(divisionRoom).emit('forRukQuestion',obj.refusedata);
				}
			},io);});
			socket.on('editnewtiketstatus',function(data){require('middleware/scripts/tikets/statuseditnew')(data,socket.request.session.user,function(obj){
				io.to(divisionRoom).emit('edittiketstatus'+data.tiket,obj.msg);
				if(!!obj.data){
					obj.data.workers.forEach(function(item){io.to('user:room:'+item.worker).emit('dataload','tikets-my',obj.data,'edit');});
					io.to(divisionRoom+':2').emit('dataload','tikets-all',obj.dataall,'edit');
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
			
			socket.on('dropdawn',function(data){require('middleware/scripts/dropdown/'+data)(login,function(obj){socket.emit('dropdawn'+data,obj);});});
			
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
				console.log('disconnect - '+login);
				//for(var i=0;i<clients.length;i++){if(clients[i].login===login){clients.splice(i, 1);}}
			});			
		}		
	});	
	return io;
};