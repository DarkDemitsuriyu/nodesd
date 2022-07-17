const XlsxPopulate = require('xlsx-populate');
const tiketsSend=require('middleware/scripts/tikets/tikets_send');
const setWorkerSettings=require('middleware/set_worker_settings');
const forCron = require('middleware/forCron'); 
var express = require('express');
var router = express.Router();
var addParams=require('middleware/addParams.js').get;
var checkAuth=require('middleware/checkAuth.js');
var multer  = require('multer');
var moment  = require('moment');
var upload = multer({dest:'tmp/'});
const ldap=require('../lib/ldap');
const report=require('../lib/report');
const fs = require('fs');

let url=''
let getReportsValues = async function(type,val){
	let sqlReq = "SELECT "
	let sqlGroupping = "GROUP BY "
	let data = {}
	switch(type){
		case "co":
			let period = (typeof val.period === 'string') ? val.period.split(/,[a-zA-Z]/) : val.period
			let showDates = (typeof val.showDates === 'string') ? val.showDates === 'true' : val.showDates
			if(showDates){
				sqlReq += 'DATE_FORMAT(enddate,"%d.%m.%Y") AS date, '
				sqlGroupping += 'DATE_FORMAT(enddate,"%d.%m.%Y"), '
			}
			switch(val.type){
				case "c":
					sqlReq += 'classifiername, '
					sqlGroupping += 'classifier'
				break;
				case "w":
					sqlReq += 'workerFullName, '
					sqlGroupping += 'worker'
				break;
				case "cw":
					sqlReq += 'classifiername, workerFullName, '
					sqlGroupping += 'classifier, worker'
				break;
			}
			console.log(period)
			let start = moment(period[0]).toISOString()
			let end = moment(period[1]).toISOString()
			sqlReq += `COUNT(*) AS count, SUM(laborexpenditures) AS laborexpenditures FROM views_tikets_info_all WHERE classifier IS NOT NULL AND enddate BETWEEN '${start}' AND '${end}' ${sqlGroupping}`
			console.log(sqlReq)
			break;
	}
	let [results] = (await vdesk.mysql.query(sqlReq,data))
	return results
}

/* GET pages. */  
router.get('/', function(req, res, next) {res.redirect('/tikets');});
router.get('/login', function(req, res, next) {res.redirect('/workers/');});
router.get('/workersold', function(req, res, next) {res.redirect('/workers_old/');});

router.get('/test',addParams,require('./clients/test').get);

router.get('/main',addParams,require('./clients/getMainData').get);

router.get('/tikets',addParams,require('./clients/tikets').get);
router.get('/help',addParams,require('./clients/help').get);
router.get('/knowledgebase',addParams,require('./clients/knowledgebase').get);
router.get('/links',addParams,require('./clients/links').get);
router.get('/vote',addParams,require('./clients/vote').get);
router.post('/vote',addParams,require('./clients/vote').post);
router.get('/registration',addParams,require('./registration').get);
router.post('/registration',addParams,require('./registration').post);
router.get('/checkUser',addParams,require('./registration').checkUser);
router.get('/comment',addParams,require('./clients/comment').get);
router.post('/comment',addParams,require('./clients/comment').post);

router.post('/sendtiket',addParams,upload.single('attachment'),require('./clients/sendtiket').post);
router.post('/sendtiketself',addParams,upload.single('attachment'),require('middleware/scripts/tikets/sendtiketself').post);
//router.get('/sendtiket11',addParams,upload.single('attachment'),require('./clients/sendtiket').post);
router.post('/sendtiketCO',addParams,upload.single('attachment'),require('./clients/sendtiketCO').post);
router.post('/sendtikettaxi',addParams,upload.single('attachment'),require('./clients/sendtikettaxi').post);
router.post('/sendtiketNewWorker',upload.single('attachment'),require('./clients/sendtiketNewWorker').post);

router.get('/login11',addParams,require('./clients/login').get);
router.post('/login',require('./clients/login').post);
router.get('/workers',checkAuth,addParams,require('./workers').get);
router.get('/logout',require('./logout').get);
router.get('/sendTiketInfo',require('./clients/sendtiketinfo').get);
router.post('/tiketSendMail',upload.array('mail_file[]'),require('middleware/scripts/tikets/sendmail').post);
//router.post('/tiketEdit',require('middleware/scripts/tikets/tiketedit').post);
router.get('/getFile',require('middleware/getFile').get);
router.get('/confirmTiket',addParams,require('middleware/scripts/tikets/confirmtiket').get);
router.post('/confirmTiket',addParams,require('middleware/scripts/tikets/confirmtiket').post);
router.get('/getForNewWorkerDropdawn',addParams,require('middleware/getForNewWorkerDropdawn').get);

router.get('/qwe',async function(req,res,next){
	console.time('personesToBase');
	await ldap.personesToBase()
	console.timeEnd('personesToBase');
	res.send('Ok');
});

router.post('/asd',async function(req,res,next){
	console.log(req.body)
	//let workersGets = require('middleware/scripts/directorys/workers');
	//forCron()
	/*console.time('personesToLDAP');
	await ldap.personesToLDAP()
	console.timeEnd('personesToLDAP');*/
	//let w = await workersGets.getOne('DarkDD')
	
	res.send('OK');
});

router.post('/counts',async function(req,res,next){
	console.log("2325345345345345")
	let login=req.session.user.login;
	console.log(req.body)
	let sql='';
	let where = ''
	switch(req.body.type){
		case 'tikets-my':
			sql="SELECT tikets_statuses.name AS name, count(tikets_main.status) AS y FROM tikets_main,tikets_statuses WHERE tikets_main.worker = ? and tikets_main.status = tikets_statuses.id group by tikets_statuses.name ORDER BY y";
		break;
		case 'tikets-all-workers':
			sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login and directory_workers.status < 3 group by directory_workers.login ORDER BY y";
		break;
		case 'tikets-all-themes':
			sql="SELECT name, SUM(y) AS y FROM (SELECT IF(COUNT(tikets_main.status)<5,'Другие',topicname) AS name, COUNT(tikets_main.status) AS y FROM tikets_main GROUP BY topicname) AS counting GROUP BY name ORDER BY y"
		break;
		case 'tikets-all-deps':
			sql="SELECT directory_departments.name AS name, COUNT(tikets_main.status) AS y, FORMAT(COUNT(tikets_main.status)/((SELECT COUNT(tikets_main.status) FROM tikets_main)/100), 2) AS percent, 1 AS z FROM tikets_main, directory_departments WHERE directory_departments.id = tikets_main.department GROUP BY directory_departments.name ORDER BY y DESC"
		break;
		case 'tikets-trend-workers-years':
			if(req.body.filter){
				where = `AND startdate BETWEEN '${req.body.date[0]}' AND '${req.body.date[1]}' `
				console.log(where)// ${where}
			}
			sql=`SELECT name, SUM(y) AS y, x,year,month  FROM ((SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, UNIX_TIMESTAMP(DATE_FORMAT(startdate, '%Y-%m-1 %H:%m:%s'))*1000 AS x,YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login ${where} AND directory_workers.status < 3 GROUP BY year,month,directory_workers.login) UNION (SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, UNIX_TIMESTAMP(DATE_FORMAT(startdate, '%Y-%m-1 %H:%m:%s'))*1000 AS x, YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers, tikets_new_employee_conformity WHERE tikets_new_employee_conformity.worker = directory_workers.login ${where} AND tikets_new_employee_conformity.tiket = tikets_main.id AND directory_workers.status < 3 GROUP BY year,month,directory_workers.login)) AS allcounts GROUP BY year,month,name`
			//sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login AND directory_workers.status < 3 GROUP BY directory_workers.login,year,month"
			//sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, DATE(startdate) AS x FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login AND directory_workers.status < 3 GROUP BY x,directory_workers.login"
		break;
		case 'tikets-time-execution':
			if(req.body.filter){
				where = `AND startdate BETWEEN '${req.body.date[0]}' AND '${req.body.date[1]}' `
				console.log(where)// ${where}
			}
			//sql = "select worker, workerfio, min( timestampdiff( MICROSECOND , startdate, enddate )) AS min, avg( timestampdiff( MICROSECOND , startdate, enddate )) AS avg, max( timestampdiff( MICROSECOND , startdate, enddate )) AS max from views_tikets_info where status in(1,2) and workerstatus < 3 group by worker"
			//sql = "SELECT *FROM views_tikets_execution_standard_a"
			sql = `SELECT worker, workerfio,
    min( timestampdiff( SECOND, startdate,( DATE_ADD(enddate,INTERVAL -countWeekendsOnInterval(startdate, enddate) DAY) ) ) ) AS min,
    avg( timestampdiff( SECOND, startdate,( DATE_ADD(enddate,INTERVAL -countWeekendsOnInterval(startdate, enddate) DAY) ) ) ) AS avg,
    max( timestampdiff( SECOND, startdate,( DATE_ADD(enddate,INTERVAL -countWeekendsOnInterval(startdate, enddate) DAY) ) ) ) AS max
FROM
    views_tikets_info
WHERE status in(1,2) AND workerstatus < 3 AND id not in(847,853,916,749,846,845,850,851,856)
${where}
GROUP BY worker`
console.log(sql)
		break;
		case 'tikets-all-senders':
			if(req.body.filter){
				where = `WHERE startdate BETWEEN '${req.body.date[0]}' AND '${req.body.date[1]}' `
				console.log(where)
			}
			sql=`SELECT CONCAT(sendersurname, ' ', sendername) AS name, COUNT(sendersurname) AS y, FORMAT(COUNT(sendersurname)/((SELECT COUNT(sendersurname) FROM views_tikets_info_all)/100), 2) AS percent, 1 AS z FROM views_tikets_info_all ${where} GROUP BY sendersurname, sendername ORDER BY y DESC`
			console.log(sql)
		break;
	}
	let [results] = await vdesk.mysql.query(sql,login)
	//console.log(req.query.type,results)
	res.send(results);
});

router.get('/counts',addParams,async function(req,res,next){
	let results = false
	if(req.session.user){
		let login=req.session.user.login;	
		let sql='';
		switch(req.query.type){
			case 'tikets-my':
				sql="SELECT tikets_statuses.name AS name, count(tikets_main.status) AS y FROM tikets_main,tikets_statuses WHERE tikets_main.worker = ? and tikets_main.status = tikets_statuses.id group by tikets_statuses.name ORDER BY y";
			break;
			case 'tikets-all-workers':
				sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login and directory_workers.status < 3 group by directory_workers.login ORDER BY y";
			break;
			case 'tikets-all-themes':
				sql="SELECT name, SUM(y) AS y FROM (SELECT IF(COUNT(tikets_main.status)<5,'Другие',topicname) AS name, COUNT(tikets_main.status) AS y FROM tikets_main GROUP BY topicname) AS counting GROUP BY name ORDER BY y"
			break;
			case 'tikets-all-deps':
				sql="SELECT directory_departments.name AS name, COUNT(tikets_main.status) AS y, FORMAT(COUNT(tikets_main.status)/((SELECT COUNT(tikets_main.status) FROM tikets_main)/100), 2) AS percent, 1 AS z FROM tikets_main, directory_departments WHERE directory_departments.id = tikets_main.department GROUP BY directory_departments.name ORDER BY y DESC"
			break;
			case 'tikets-trend-workers-years':
				sql="SELECT name, SUM(y) AS y, x,year,month  FROM ((SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, UNIX_TIMESTAMP(DATE_FORMAT(startdate, '%Y-%m-1 %H:%m:%s'))*1000 AS x,YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login AND directory_workers.status < 3 GROUP BY year,month,directory_workers.login) UNION (SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, UNIX_TIMESTAMP(DATE_FORMAT(startdate, '%Y-%m-1 %H:%m:%s'))*1000 AS x, YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers, tikets_new_employee_conformity WHERE tikets_new_employee_conformity.worker = directory_workers.login AND tikets_new_employee_conformity.tiket = tikets_main.id AND directory_workers.status < 3 GROUP BY year,month,directory_workers.login)) AS allcounts GROUP BY year,month,name"
				//sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, YEAR(startdate) AS year, MONTH(startdate) AS month FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login AND directory_workers.status < 3 GROUP BY directory_workers.login,year,month"
				//sql="SELECT directory_workers.surname AS name, count(tikets_main.status) AS y, DATE(startdate) AS x FROM tikets_main, directory_workers WHERE tikets_main.worker = directory_workers.login AND directory_workers.status < 3 GROUP BY x,directory_workers.login"
			break;
			case 'tikets-time-execution':
				//sql = "select worker, workerfio, min( timestampdiff( MICROSECOND , startdate, enddate )) AS min, avg( timestampdiff( MICROSECOND , startdate, enddate )) AS avg, max( timestampdiff( MICROSECOND , startdate, enddate )) AS max from views_tikets_info where status in(1,2) and workerstatus < 3 group by worker"
				sql = "SELECT * FROM views_tikets_execution_standard_a"
			break;
			case 'tikets-all-senders':
				sql="SELECT CONCAT(sendersurname, ' ', sendername) AS name, COUNT(sendersurname) AS y, FORMAT(COUNT(sendersurname)/((SELECT COUNT(sendersurname) FROM views_tikets_info_all)/100), 2) AS percent, 1 AS z FROM views_tikets_info_all GROUP BY sendersurname, sendername ORDER BY y DESC"
			break;
		}
		results = (await vdesk.mysql.query(sql,login))[0]
		//console.log(req.query.type,results)
	}
	console.log(results)
	res.send(results);
});

router.get('/reports/xlsx/:type',async function(req,res,next){
	let body = req.query
	let periodHeaders = ['Дата начала отчетного периода','Дата завершения отчетного периода','','','']
	let dateFormatRU = 'DD.MM.YYYY HH:mm:ss'
	let dateFormat = 'YYYY-MM-DD HH:mm:ss'
	let excelRows = 3
	let dateStart, dateEnd, sql,excelReportType
	console.log(req.params.type)
	switch(req.params.type){
		case 'weekA':
		case 'weekB':
			if( moment().day() < 5 ){
				console.log(1)
				dateStart = moment().add(-1, 'week').day(1).set('hour', 1).set('minute', 0)
				dateEnd = moment().add(-1, 'week').day(7).set('hour', 23).set('minute', 59)
			} else {
				console.log(2)
				dateStart = moment().day(1).set('hour', 1).set('minute', 0)				
				dateEnd = moment().day(7).set('hour', 23).set('minute', 59)
			}
		break;
		case 'monthA':
		case 'monthB':
			if( moment().date() < 16 ){
				console.log(3)
				dateStart = moment().add(-1, 'month').set('date', 1).set('hour', 1).set('minute', 0)
				dateEnd = moment().set('date', 1).add(-1, 'date').set('hour', 23).set('minute', 59)
			} else {
				console.log(4)
				dateStart = moment().set('date', 1).set('hour', 1).set('minute', 0)
				dateEnd = moment().add(1, 'month').set('date', 1).date(-1).set('hour', 23).set('minute', 59)
			}
		break;		
	}
	console.log('dateStart', dateStart)
	let periodDataRU = [dateStart.format(dateFormatRU),dateEnd.format(dateFormatRU),'','','']
	let periodData = [dateStart.format(dateFormat),dateEnd.format(dateFormat)]
	let reportHeaders = ['Название сервиса (класса заявки)', 'Количество поступивших заявок по сервису', 'Количество выполненных заявок по сервису', 'Средние трудозатраты по 1-й выполненной  заявке по сервису (человеко-часы)', 'Средняя длительность выполнения 1-й заявки (часы)']
	let dataExcel = [periodHeaders,periodDataRU,reportHeaders]	
	
	if(req.params.type.includes('A')){
		excelReportType = 'A'
		sql = `SELECT CONCAT("Регионы_",classifiername), 
				v2.count2, COUNT(*) AS count, 
				TIME_FORMAT(sec_to_time(ROUND(AVG(laborexpenditures*60),2)),'%Hч %iм') AS laborexpenditures,
				TIME_FORMAT(sec_to_time(ROUND(AVG(numberOfActualWorkingHours(startdate,enddate)),2)*60),'%Hч %iм') AS zxc
			FROM views_tikets_info_all v1
			LEFT OUTER JOIN (SELECT classifiername AS cname, COUNT(*) AS count2 FROM views_tikets_info_all WHERE classifier IS NOT NULL AND startdate BETWEEN '${periodData[0]}' AND '${periodData[1]}' GROUP BY classifier) v2
			ON v1.classifiername = v2.cname
			WHERE classifier IS NOT NULL AND startdate BETWEEN '${periodData[0]}' AND '${periodData[1]}' AND enddate BETWEEN '${periodData[0]}' AND '${periodData[1]}'
			GROUP BY classifier`
	}
	if(req.params.type.includes('B')){
		excelReportType = 'B'
		sql = `SELECT CONCAT("Регионы_",classifiername), 
				v2.count2, COUNT(*) AS count, 
				TIME_FORMAT(sec_to_time(ROUND(AVG(laborexpenditures*60),2)),'%Hч %iм') AS laborexpenditures,
				TIME_FORMAT(sec_to_time(ROUND(AVG(numberOfActualWorkingHours(startdate,enddate)),2)*60),'%Hч %iм') AS zxc
			FROM views_tikets_info_all v1
			LEFT OUTER JOIN (SELECT classifiername AS cname, COUNT(*) AS count2 FROM views_tikets_info_all WHERE classifier IS NOT NULL AND startdate BETWEEN '${periodData[0]}' AND '${periodData[1]}' GROUP BY classifier) v2
			ON v1.classifiername = v2.cname
			WHERE classifier IS NOT NULL AND enddate BETWEEN '${periodData[0]}' AND '${periodData[1]}'
			GROUP BY classifier`
	}

	let [results] = (await vdesk.mysql.query(sql))
	excelRows += results.length
	results.forEach( el => dataExcel.push(Object.values(el)) )
	
	/*data.push(value)
	results.forEach( el => data.push( el.map( el => Object.values(el)) ) )
	let data = await getReportsValues(req.params.type,body)
	let value = data.map( el => Object.values(el))
	let headers = []
	switch(req.params.type){
		case 'co':
			if(body.showDates === 'true'){ headers.push("Дата") }
			if(body.type.includes('c')){ headers.push("Классификатор") }
			if(body.type.includes('w')){ headers.push("Сотрудник") }
			headers.push("Количество")
			headers.push("Трудозатраты(Мин.)")
			break;		
	}
    value.unshift(headers)*/
	XlsxPopulate.fromFileAsync("documents/report.xlsx").then(workbook => {
		workbook.sheet(0).cell("A1").value(dataExcel);
		workbook.sheet(0).column("A").width(31)
		workbook.sheet(0).column("B").width(35)
		workbook.sheet(0).column("C").width(25)
		workbook.sheet(0).column("D").width(25)
		workbook.sheet(0).column("E").width(25)
		workbook.sheet(0).range("A1:B1").style({bold:true,wrapText:true,fill:'bde2aa',border:true,verticalAlignment:'top'});
		workbook.sheet(0).range("A3:E3").style({bold:true,fontSize:10,wrapText:true,fill:'b3d5f9',border:true,verticalAlignment:'top'});
		workbook.sheet(0).range(`A4:E${excelRows}`).style({fontSize:9,wrapText:true,border:true});
		workbook.sheet(0).range(`A4:A${excelRows}`).style({verticalAlignment:'top'})
        return workbook.outputAsync();
	})
	.then(data => {
		res.attachment(`documents/report_${excelReportType}_from_${dateStart.format('DD.MM.YYYY')}-${dateEnd.format('DD.MM.YYYY')}.xlsx`);
		res.send(data);
	})
	.catch( e => {
		console.log(e)
		next()
	})
})
 
router.get('/getMail',addParams,require('middleware/getMail').get);
   
//router.post('/dropdowns',require('middleware/dropdowns').post);

router.post('/tested',tiketsSend.send_one);

router.get('/topics',async function(req,res,next){
	let data = await vdesk.mysql.query("SELECT id,name FROM directory_topics WHERE id != 5 AND visibility=true")
	let stringId = ""
	let stringName = ""
	data[0].forEach( el => {
		stringId += `${el.id}|`
		stringName += `${el.name}|`
	})
	console.log(`${stringId}<split>${stringName}`)
	res.send(`${stringId}<split>${stringName}`);
	
});

router.post('/reports/:type',async function(req,res,next){
	let data = await getReportsValues(req.params.type,req.body)
	res.send(data)
});

router.post('/dataload',async function(req,res,next){
	url=req.body.url
	console.log('/dataload',url)
	let login = req.session.user ? req.session.user.login : null
	let data = await require(`middleware/scripts/${url}`).getData(login,req)
	//console.log('data',data)
	res.send(data)
	
	//console.log('url',url)
	//require(`middleware/scripts/${url}`).getData(req,res,next)
	//console.log(url, require(`middleware/scripts/${url}`))
	//console.log('url',url)
	//console.log(req.body.url)
	/*var dataLoad=require('middleware/scripts/'+req.body.url+'/data').getData();
	new dataLoad(req,res,next).getData();*/
});
router.get('/dataload',function(req,res,next){
	const config = require('./../config');
	const dns = require('dns');
	console.log(config.get('dns'))
	//console.log(dns.getServers())
	dns.setServers(config.get('dns'));
	//console.log(dns.getServers())
	//console.log(dns)
	var senderIp=req.ip.replace('::ffff:','');
	dns.reverse(senderIp, function(err, hostnames){
	//	console.log(hostnames)
	//	console.log(err)
		if(!!!hostnames || err){hostnames=['Неизвестен'];}
		res.send([senderIp,hostnames]);
		//resolve(hostnames[0]);
	});
	
	
	
	//res.set('Access-Control-Allow-Origin', '*');
	//console.log(req.query.url)
	//req.session.user.login='DarkDD';
	//var dataLoad=require('middleware/scripts/'+req.query.url+'/data');
	//new dataLoad(req,res,next).getData();
});

router.post('/form-update',upload.single('file'),function(req,res,next){
	console.log(req.body)
	let dataLoad=require('middleware/scripts/'+req.body.url+'/data');
	req.body.callback=function(data){
		vdesk.io.to(`division:room:${req.session.user.division}`).emit('dataload',{
			header:req.body.url.replace('/','-'),
			data:data,
			status:req.body.type
		});
	};
	new dataLoad(req,res,next).setData();
});	//if(data.url==='tikets/create'){socket.emit('dataload'+url.replace('/','-'),obj,type);}

router.post('/update/:main/:second/:type',async function(req,res,next){
	//console.log(0)
	let data = await require(`middleware/scripts/${req.params.main}/${req.params.second}`).setData(req.body,req.params.type,req)
	//console.log(5)
	switch(req.params.second){
		case 'archive':
			res.send(data)
			break;
		case 'invoices':
			vdesk.io.to(`division:room:${req.session.user.division}`).emit('dataload',{
				header:`${req.params.main}-${req.params.second}`,
				data:data,
				status:req.params.type
			});
			res.send({id:data.children[0].children[0].id})
			break;
		default:
			vdesk.io.to(`division:room:${req.session.user.division}`).emit('dataload',{
				header:`${req.params.main}-${req.params.second}`,
				data:data,
				status:req.params.type
			});
			
			res.end()
			break;
	}
})

router.post('/setWorkerSettings',function(req,res,next){//'/workers/:worker/settings/set/:key-:value'
	//console.log(req.body)
	//console.log(req.session.user)
	switch(req.body.key){
		case 'color':
			setWorkerSettings.setColor(req.body.value,req.body.login)
		break;
		case 'theme':
			setWorkerSettings.setTheme(req.body.value,req.body.login)
		break;
		case 'tiketsview':
			setWorkerSettings.setView(req.body.value,req.body.login)
		break;
	}
	req.session.user[req.body.key]=req.body.value
	res.send(true);
});
module.exports = router;