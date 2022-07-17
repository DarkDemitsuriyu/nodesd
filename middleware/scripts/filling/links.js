/*var fs = require('fs');
var screenshot = require('screenshot-stream');
var genPass=require('lib/genPass');*/

exports.getData=async function(login,req){
	let [data] = await vdesk.mysql.query('SELECT * FROM clients_links ORDER BY name')
	return data
}

exports.setData=async function(data,type,req){
	console.log(data)
	switch(type){
		case 'new':
			data.screen=`${data.screen}.png'`;//genPass(32,false)
			/*let stream = screenshot(data.link,'1024x768', {crop: true});
			stream.pipe(fs.createWriteStream(`./public/images/linksScreens/${data.screen}`));*/
			let [insertData] = await vdesk.mysql.query('INSERT INTO clients_links SET ?', data)
			data.id=insertData.insertId
			break;
		case 'update':
			await vdesk.mysql.query('UPDATE clients_links SET ? WHERE id = ?', [data,data.id])
			break;
		case 'delete':
			/*let [link] = await vdesk.mysql.query('SELECT screen FROM clients_links WHERE id=?', data.id)
			fs.unlinkSync(`./public/images/linksScreens/${link.screen}`);*/
			await vdesk.mysql.query('DELETE FROM clients_links WHERE id = ?', data.id)
			break;
	}	
	return data
}



/*
module.exports=function (req,res,next){
	var data=req.body;
	var io=req.app.get('io');
	var type=data.type;
	var url=data.url;
	var callback=data.callback;
	delete data.type;
	delete data.url;
	delete data.callback;
	var getSql=function(query,adds,callback){
		vdesk.mysqlPool.getConnection(function(err,connection){
			connection.query(query,adds,function(err,results) {
				if (err) throw err;
				connection.release();
				callback(results);
			});
		});
	};
	
	this.getData=function(){getSql('SELECT * FROM clients_links ORDER BY name',null,function(data){res.send(data);});};
	
	this.setData=function(){
		switch(type){
			case 'new':
				delete data.id;
				data.screen=genPass(32,false)+'.png';
				var stream = screenshot(data.link,'1024x768', {crop: true});
				stream.pipe(fs.createWriteStream('./public/images/linksScreens/'+data.screen));
				getSql('INSERT INTO clients_links SET ?',data,function(results){
					data.id=results.insertId;
					data.type=type;
					callback(url,data,type);
				});
			break;
			case 'edit': getSql('UPDATE clients_links SET name=?,link=? WHERE id = ? ',[data.name,data.link,data.id],function(results){callback(url,data,type);}); break;
			case 'delete': 
				getSql('SELECT screen FROM clients_links WHERE id=?',data.id,function(results){
					var screen=results[0].screen;
					fs.unlinkSync('./public/images/linksScreens/'+screen);
					vdesk.mysqlPool.getConnection(function(err,connection){
						connection.query('DELETE FROM clients_links WHERE id = ?', data.id , function(err, results) {
							connection.release();
							callback(url,data,type);
						});
					});					
				});
			break;
		}
		res.end();
	}
};*/