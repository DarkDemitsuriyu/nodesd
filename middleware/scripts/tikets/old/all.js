var moment = require('moment');
var compareTiket=require('lib/compareTiket');

exports.getData=async function (login,req){
	let division = req.session.user.division	
	return await Promise.all([
		vdesk.mysql.query("SELECT * FROM (SELECT vtia.*, IF(vtia.newworker = true AND ? IN (SELECT worker FROM views_tikets_info_all WHERE id = vtia.id ),IF(vtia.newworker = true AND vtia.worker = ?,true,false),true) AS isValid FROM views_tikets_info_all vtia WHERE vtia.archive=false AND vtia.workerdivision=? ORDER BY vtia.status DESC) AS ts WHERE ts.isValid = true GROUP BY ts.id ORDER BY ts.id ASC",[login,login,division]),
		vdesk.mysql.query("SELECT DISTINCT views_tikets_logs.* FROM views_tikets_logs,views_tikets_info_all WHERE views_tikets_info_all.archive=false AND views_tikets_logs.tiket = views_tikets_info_all.id AND views_tikets_info_all.workerdivision=? ORDER BY id ASC",division),
		vdesk.mysql.query("SELECT DISTINCT view_tikets_new_employee_conformity.* FROM views_tikets_info_new_workers,directory_workers,view_tikets_new_employee_conformity WHERE views_tikets_info_new_workers.archive=false AND directory_workers.division=? AND directory_workers.login=view_tikets_new_employee_conformity.worker AND view_tikets_new_employee_conformity.tiket=views_tikets_info_new_workers.id",division)
	]).then(async ([[tikets],[logs],[confirmitys]]) => {
		//tikets=tikets.concat(tiketsNew);
		//logs=logs.concat(logsNew);
		tikets.sort(compareTiket)
		tikets.forEach( tiket => {
			tiket.logs = logs.filter( log => log.tiket===tiket.id*1 )
			tiket.confirmity = confirmitys.filter( confirmity => confirmity.tiket===tiket.id*1 )
		})
		return tikets
	}).catch(error => {
		console.log(error)
	})
}