var nodemailer = require('nodemailer');
var config = require('config');
var fs = require('fs');
var transporter = nodemailer.createTransport(config.get('mail'));

module.exports=function(id,name,sendermail,workermail,body,attachments){

	var title=id ? 'Заявка №'+id : name
	var mailOptions = {
		from: `Служба заявок ИТ<${workermail}>`, // sender address
		to: sendermail, // list of receivers
		subject: title, // Subject line
		html: `<html><head><title>${title}</title></head><body>${body}</body></html>`,// html body
		attachments:attachments
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent:',info.response,'from',info.envelope.from,'to',info.envelope.to);
			if(attachments){
				for(var i=0;i<attachments.length;i++){
					fs.unlinkSync(attachments[i].path)
				}
			}
		}
	});
}