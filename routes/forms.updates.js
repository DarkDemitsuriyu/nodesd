exports.post=function(req,res){
	var io=require('socket.io');
	//console.log(req.body)
	console.log(io)
	/*{ name: 'Разделы меню',
     link: 'secondarymenu',
     orders: '1',
     mainmenu: '4',
     id: '5',
     type: 'edit',
     url: 'directorys,secondarymenu' },*/
	
	/*var mysql=require('lib/mysql');
	mysql.query('SELECT menu_secondary.*,menu_main.name AS mainmenuname FROM menu_main,menu_secondary WHERE menu_secondary.mainmenu = menu_main.id', function(err, results) {
		if (err) throw err;
		res.send(results);
	});*/
};