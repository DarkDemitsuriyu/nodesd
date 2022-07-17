module.exports={
	setColor(color,login){
		vdesk.mysqlPool.getConnection(function(err,connection){
			connection.query("UPDATE directory_workers SET ? WHERE login = ?",[{color:color},login], function(err, results) {
				if (err) throw err;
				connection.release();	
			});
		});
	},
	setTheme(theme,login){
		vdesk.mysqlPool.getConnection(function(err,connection){
			connection.query("UPDATE directory_workers SET ? WHERE login = ?",[{theme:theme},login], function(err, results) {
				if (err) throw err;
				connection.release();	
			});
		});
	},
	setView(view,login){
		vdesk.mysqlPool.getConnection(function(err,connection){
			connection.query("UPDATE directory_workers SET ? WHERE login = ?",[{tiketsview:view},login], function(err, results) {
				if (err) throw err;
				connection.release();	
			});
		});
	},
};


	