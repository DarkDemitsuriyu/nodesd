exports.post=function(req,res,next){
	var nodemailer = require('nodemailer');
	var config = require('config');
	var transporter = nodemailer.createTransport(config.get('mail'));
	var moment = require('moment');	
	var body=req.body;
	console.log(body)
	console.log(body.datetime)
	console.log(typeof body.datetime)
	let data = moment(body.datetime, "DD-MM-YYYY HH:mm").format('DD.MM.YYYY HH:mm')
	
	console.log(data)
	
	var mailOptions = {
		from: body.mail, // sender address
		to: 'aho_1@tyumen.rgs.ru, gvdrozdovskiy@tyumen.rgs.ru', // list of receivers   
		subject: body.topicname, // Subject line
		html: `<html><head><title>${body.title}</title></head><body>
		Добрый день.<br>
		Я ${body.sendersurname} ${body.sendername} ${body.senderpatronymic}, прошу вас ${data} заказать мне такси по следующему маршруту:<br>
		Адрес(а) отправления: ${body.depaddresses_1}, ${body.depaddresses_2}, ${body.depaddresses_3}<br>
		Адрес(а) прибытия: ${body.arrivaladdresses_1}, ${body.arrivaladdresses_2}, ${body.arrivaladdresses_3}<br>
		<br>
		Мой контактный номер телефона - ${body.phone}
		</body></html>`
	};
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});
	res.set('Content-Type','text/plain')
	res.send('taxi');
}