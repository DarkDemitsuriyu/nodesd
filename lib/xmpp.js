const config = require('config');
const XMPP = require('stanza.io');
const tiketsGets=require('middleware/scripts/tikets/tikets_gets');

let client = XMPP.createClient({
    jid: `${config.get('xmpp:jid')}@${config.get('xmpp:sufix')}`,
    password: config.get('xmpp:password'),
	transport: 'bosh',
    boshURL: `http://${config.get('xmpp:host')}:7070/http-bind`
});

client.on('chat:state', function (a,b,c) {
    //console.log('chat:state')
});
client.on('connected', function (a,b,c) {
    //console.log('connected')
});
client.on('disconnected', function (a) {
    //console.log('disconnected')
	client.connect();
});
client.on('presence', function (a,b,c) {
    //console.log('message',a)
});
/*
client.on('stream:data', function ({xml}) {
	console.log('stream:data',xml)
});
client.on('stanza', function (a,b,c) {
    console.log('stanza',a)

});*/


client.on('session:started', function (a,b,c) {
	//console.log('ss-a',a)
    client.getRoster();
    client.sendPresence({
		status:'Я тут'
	});
	client.sendMessage({
		to: `davolkhontsev@${config.get('xmpp:sufix')}`,
		body: '[b]test[/b]'
	});
	client.enableKeepAlive()
});

client.on('chat:state', function (a,b,c) {
    //console.log('chat:state')
});

client.on('chat', async function (msg) {
	let bodyArray = msg.body.split(' ')
	if(bodyArray[0] === 'get'){
		let data = await tiketsGets.getOneTiketInfo(bodyArray[1]*1)
		let body = `Информация по заявке №:${bodyArray[1]}\n`
		switch(data.length){
			case 0:
				body='К сожалению, такой заявки не существует!'
			break;
			/*case 1:
				body += `Отправитель - ${data[0].sendersurname} ${data[0].sendername} ${data[0].senderpatronymic}\nТема - ${data.topicname}\nДата подачи заявки - ${data. startdate}\nПроблема - ${data. description}\nСтатус заявки - ${data.tiketstatusname} ${(!!data.enddate ? data.enddate : '')}\nИсполнитель - ${data.workerFullName}\nE-Mail - ${data.email}\nГородской номер телефона - ${data.cityphone}\nВнутренний номер телефона - ${data.internalphone}\n`
			break;*/
			default:
				data.forEach(function(el,idx){
					if(idx === 0){
						body += `Отправитель - ${el.sendersurname} ${el.sendername} ${el.senderpatronymic}\nТема - ${el.topicname}\nДата подачи заявки - ${el. startdate}\nПроблема - ${el. description}\nСтатус заявки - ${el.tiketstatusname} ${(!!el.enddate ? el.enddate : '')}\nИсполнители: \n`
					}
					body += `${idx*1+1} - ${el.workerFullName}\nE-Mail - ${el.email}\nГородской номер телефона - ${el.cityphone}\nВнутренний номер телефона - ${el.internalphone}\n`
				})
			break;
		}
		console.log(data)
		
		client.sendMessage({
		  to: msg.from,
		  body:  body
		});
	} else {
		client.sendMessage({
		  to: msg.from,
		  body: 'You sent: ' + msg.body
		});
	}
	console.log(msg)
    
});

client.connect();
let xmpp={
	async send(jabber,msg){
		client.sendMessage({
		  to: `${jabber}@${config.get('xmpp:sufix')}`,
		  body: msg
		});
		return true
	}
}
module.exports=xmpp;