exports.get=function(req,res){
	var sid=req.session.id;
	var io=req.app.get('io');
	var userRoom='user:room:'+req.session.user.login;
    var connectedSockets = io.of('/').in(userRoom).connected;
	req.session.destroy(function(err){
		Object.keys(connectedSockets).forEach(function (socketId) {
            var socket = connectedSockets[socketId];
			if (socket.request.session.id == sid) {
				socket.emit('closesession');
				socket.disconnect();
            }
        });
        if (err) return next(err);
		res.redirect('/');
	});
};