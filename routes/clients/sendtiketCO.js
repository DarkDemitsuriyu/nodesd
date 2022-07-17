exports.post=function(req,res,next){
	var nodemailer = require('nodemailer');
	var config = require('config');
	var transporter = nodemailer.createTransport(config.get('mail'));
	var moment = require('moment');	
	var fs = require('fs');
	var body=req.body;	
	var file=req.file;
	var attachment=null;
	if(!!file){
		attachment=[{filename:file.originalname,path:file.path}];
	}
	var mailOptions = {
		from: body.mail, // sender address
		to: '1111@rgs.ru', // list of receivers
		subject: body.title, // Subject line
		html: `'<html><head><title>${body.title}</title></head><body>${body.description}</body></html>`,// html body
		attachments:attachment
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
			if(body.attachment){
				fs.unlinkSync(body.attachment.path)
			}
		}
	});
	res.set('Content-Type','text/plain')
	res.send('CO');
}