const moment = require('moment');
const XlsxPopulate = require('xlsx-populate');

module.exports={
	async getReport(type){
		let periodHeaders = ['Дата начала отчетного периода','Дата завершения отчетного периода','','','']
		let dateFormatRU = 'DD.MM.YYYY HH:mm:ss'
		let dateFormat = 'YYYY-MM-DD HH:mm:ss'
		let excelRows = 3
		let dateStart, dateEnd, sql,excelReportType
		switch(type){
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
		
		if(type.includes('A')){
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
		if(type.includes('B')){
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
		
		return XlsxPopulate.fromFileAsync("documents/report.xlsx").then(workbook => {
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
			return {   // binary buffer as an attachment
				filename: `report_${excelReportType}_from_${dateStart.format('DD.MM.YYYY')}-${dateEnd.format('DD.MM.YYYY')}.xlsx`,
				content: data
			}
			//return ;
			//res.attachment(`documents/report_${excelReportType}_from_${dateStart.format('DD.MM.YYYY')}-${dateEnd.format('DD.MM.YYYY')}.xlsx`);
			//res.send(data);
		})
		.catch( e => {
			console.log(e)
			next()
		})
		 
	}
}