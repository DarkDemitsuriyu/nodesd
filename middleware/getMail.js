exports.get=function(req,res,next){
	var Client = require('node-poplib-gowhich').Client;
	var client = new Client({
		hostname: '',
		port:  110,
		tls: false,
		mailparser: true,
		username: '',
		password: ''
	});
	client.connect(function() {
		client.retrieveAll(function(err, messages) {
			console.log(err)
			console.log(messages)
			messages.forEach(function(message) {
				console.log(message)				
				console.log(message.subject);
			});
			client.quit();
		})
	});	
};