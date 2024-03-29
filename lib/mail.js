const nodemailer = require('nodemailer');
const config = require('config');
const fs = require('fs');
const parse5 = require('parse5');
const transporter = nodemailer.createTransport(config.get('mail'));
const Client = require('yapople').Client;

let exclude = ['']

let client = new Client({
  hostname: config.get('mail:host'),
  port:  110,
  tls: false,
  mailparser: true,
  username: config.get('mail:auth:user'),
  password: config.get('mail:auth:pass')
});

client.connect(function() {
	client.count( (err,count) => {
		//console.log(count)
	})
  client.retrieveAll(function(err, messages) {
    messages.forEach(function( message, idx ) {
		let isValid = true;
		message.from.forEach( el => {
			if(el.address.includes('MAILER-DAEMON@')){
				isValid = false
			}
		})
		if(message.headers['return-path'].includes('MAILER-DAEMON@')){
			isValid = false
		}
		if(isValid){
			if(message.subject.includes('Заявка №')){
				let id = message.subject.slice(message.subject.indexOf('№')+1, message.subject.indexOf('/'));
				const document = parse5.parse(message.html, {
					treeAdapter: parse5.treeAdapters.default
				});
				//console.log('document',document)
				// Uses the htmlparser2 tree adapter with the SerializerStream.
				const serializer = new parse5.SerializerStream(message.html, {
					treeAdapter: parse5.treeAdapters.htmlparser2
				});
				//console.log('serializer',serializer)
				let body = message.html.slice(message.html.indexOf('<body '), message.html.indexOf('<div class="moz-signature">'));
				//console.log(id,body)
			}
		} else {
			client.delete(idx, (err,msg) => {
				//console.log(msg)
			})
			client.count( (err,count) => {
				//console.log(count)
			})
		}
    });
    client.quit();
  })
})

let mail = {
	async send({id,title,sendermail,workermail,body,attachments}){
		let mailOptions = {
			from: {
				name: 'Служба заявок ИТ',
				address: ''
			},
			to: sendermail,
			replyTo: workermail,
			subject: id ? `Заявка №${id}` : title,
			html: body,
			attachments:attachments
		}
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('Message sent:',info.response,'from',info.envelope.from,'to',info.envelope.to);
			if(attachments){
				for(var i=0;i<attachments.length;i++){
					fs.unlinkSync(attachments[i].path)
				}
			}
		});		
	},
	get(){
		
	}
	
}

module.exports=mail