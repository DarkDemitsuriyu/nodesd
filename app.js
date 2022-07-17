const express = require('express'); 
const http = require('http');
const path = require('path');
const config = require('./config');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sessionStore=require('lib/sessionStore');
const xmpp=require('lib/xmpp');
const mail=require('lib/mail');
const ldap=require('lib/ldap');
const report=require('lib/report');
const moment = require('moment');
const compress = require('compression')
const schedule = require('node-schedule')
const forCron = require('middleware/forCron')
const mysql = require('mysql2/promise')
const setExp=require('middleware/setExp')
try{
	

var app = express()

global.vdesk={
	xmpp: xmpp,
	mail: mail,
	ldap:ldap,
	setExp: setExp,
	getFullName(data){
		if(data.hasOwnProperty('surname')){
			return `${data.surname} ${data.name} ${data.patronymic}`
		}
		if(Array.isArray(data)){
			return `${data[0]} ${data[1]} ${data[2]}`
		}
		return 	'error'
	},
	getFullNameMini({surname,name,patronymic}){
		return `${surname} ${name.charAt(0)}.${patronymic.charAt(0)}.`
	}
}

app.set('port', config.get('port'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(compress())
app.use(favicon(__dirname + '/public/favicon.ico'))

if (app.get('env') == 'development'){
	app.use(logger('dev'))
} else {
	app.use(logger('default'))
}

app.use(session({
	secret:config.get('session:secret'),
	key:config.get('session:key'),
	resave: config.get('session:resave'),
	saveUninitialized: config.get('session:saveUninitialized'),
	store:sessionStore,
	cookie:config.get('session:cookie')
}))

app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

var routes = require('./routes/index')

app.use('/', routes)

process.on('uncaughtException', function(err){
  console.log(err);
})

if (app.get('env') === 'development'){
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.use(express.static(path.join(__dirname, 'public')))

async function createMysql(){ 
	vdesk.mysql = await mysql.createPool(config.get('db'))
}
createMysql()
vdesk.mysqlPool=require('mysql').createPool(config.get('db'))

let cronAD = schedule.scheduleJob( '15 4 * * *', async function(){//'15 4 * * *'
	console.log('Time for tea! - Time for tea! - Time for tea!')
	console.time('checkFor')
	await ldap.personesToBase()
	console.timeEnd('checkFor')
})

let cronTikets = schedule.scheduleJob({ start: new Date(Date.now()+10000), rule: '*/20 9-19 * * 1-5' }, async function(){
	console.log('Time for tea1!') 
	await forCron() 
	console.log('Time for tea!')
})
let cronReportWeek = schedule.scheduleJob('30 18 * * 5', async function(){
	let reportWeekA = await report.getReport('weekA')
	let reportWeekB = await report.getReport('weekB')
	await mail.send({id:null,title:"Отчеты SD За неделю",sendermail:'',workermail:'',body:"Добрый день.<br>Отчеты за неделю.",attachments:[reportWeekA,reportWeekB]})
	await mail.send({id:null,title:"Отчеты SD За неделю",sendermail:'',workermail:'',body:"Добрый день.<br>Отчеты за неделю.",attachments:[reportWeekA,reportWeekB]})
	console.log('Time for report Week!')
})

let cronReportMonth = schedule.scheduleJob('30 18 * * *', async function(){
	let nowMonth = moment().month()
	let nextMont = moment().add(1, 'day').month()
	if(nowMonth !== nextMont){
		let reportMonthA = await report.getReport('monthA')
		let reportMonthB = await report.getReport('monthB')
		await mail.send({id:null,title:"Отчеты SD За месяц",sendermail:'',workermail:'',body:"Добрый день.<br>Отчеты за месяц.",attachments:[reportMonthA,reportMonthB]})
		await mail.send({id:null,title:"Отчет SD За месяц",sendermail:'',workermail:'',body:"Добрый день.<br>Отчеты за месяц.",attachments:[reportMonthA,reportMonthB]})
		console.log('Time for report Month!')
	}	
});

let server=http.createServer(app)
server.listen(config.get('port'), function(){
  console.log('Express server listening on port ' + config.get('port'))
})

let io=require('./socket')(server)
vdesk.io = io
app.set('io',io)
}  catch (e) {
		console.log('app.js', e) 
	}