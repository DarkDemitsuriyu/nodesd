const moment = require('moment');
const compareTiket=require('lib/compareTiket');

module.exports={
	async getListTiket(req){
		let division = req.session.user.division
		let login = req.session.user.login
		let tikets = {
			sql: "SELECT * FROM views_tikets_info_all WHERE worker=? AND archive=false GROUP BY id ORDER BY id ASC",
			data: login
		}
		let logs = { 
			sql: "SELECT vtl.* FROM views_tikets_info_all vta,views_tikets_logs vtl WHERE vta.id = vtl.tiket AND vta.archive=false AND vta.worker=? ORDER BY vtl.date ASC",
			data: login
		}
		let nw = {
			sql: "SELECT vtnec.* FROM views_tikets_info_new_workers vtinw, view_tikets_new_employee_conformity vtnec WHERE vtinw.archive=false AND vtnec.tiket=vtinw.id AND vtinw.worker=?",
			data: login
		}
		if(req.session.user.groups.includes(2)){
			tikets.sql = "SELECT * FROM (SELECT vtia.*, IF(vtia.newworker = true AND ? IN (SELECT worker FROM views_tikets_info_all WHERE id = vtia.id ),IF(vtia.newworker = true AND vtia.worker = ?,true,false),true) AS isValid FROM views_tikets_info_all vtia WHERE vtia.archive=false AND vtia.workerdivision=? ORDER BY vtia.status DESC) AS ts WHERE ts.isValid = true GROUP BY ts.id ORDER BY ts.id ASC"
			tikets.data = [login,login,division]
			logs.sql = "SELECT DISTINCT views_tikets_logs.* FROM views_tikets_logs,views_tikets_info_all WHERE views_tikets_info_all.archive=false AND views_tikets_logs.tiket = views_tikets_info_all.id AND views_tikets_info_all.workerdivision=? ORDER BY id ASC"
			logs.data = division
			nw.sql = "SELECT DISTINCT view_tikets_new_employee_conformity.* FROM views_tikets_info_new_workers,directory_workers,view_tikets_new_employee_conformity WHERE views_tikets_info_new_workers.archive=false AND directory_workers.division=? AND directory_workers.login=view_tikets_new_employee_conformity.worker AND view_tikets_new_employee_conformity.tiket=views_tikets_info_new_workers.id"
			nw.data = division
		}
		return await Promise.all([
				vdesk.mysql.query(tikets.sql, tikets.data),
				vdesk.mysql.query(logs.sql,   logs.data),
				vdesk.mysql.query(nw.sql,     nw.data)
		]).then(async function([[tikets],[logs],[confirmitys]]) {
			tikets.sort(compareTiket)
			tikets.forEach( tiket => {
				tiket.logs = logs.filter( log => log.tiket===tiket.id*1 )
				tiket.confirmity = confirmitys.filter( confirmity => confirmity.tiket===tiket.id*1 )
			})
			return tikets
		}).catch(error => {
			console.log(error)
		})		
	},
	async getOneTiket(id,login){
		console.log('getOneTiket',id,login)
		let sql = "SELECT * FROM views_tikets_info_all WHERE id=? AND worker = ?"
		let data = [id,login]
		if(!login){
			sql = "SELECT * FROM (SELECT * FROM views_tikets_info_all WHERE id=? ORDER BY status DESC) AS tmp GROUP BY id"
			data = id
		}
		let [[tiketInfo]] = await vdesk.mysql.query(sql,data)
		let [tiketLogs] = await vdesk.mysql.query("SELECT * FROM views_tikets_logs WHERE tiket=? ORDER BY date DESC",id)
		tiketInfo.logs=tiketLogs
		if(tiketInfo.newworker){
			let [tiketConformity] = await vdesk.mysql.query("SELECT * FROM view_tikets_new_employee_conformity WHERE tiket=?",id)
			tiketInfo.confirmity=tiketConformity
		}
		return tiketInfo
	},
	async getOneTiketConfirmation(id,tiket){
		let [confirmity] = await vdesk.mysql.query("SELECT * FROM view_tikets_new_employee_conformity WHERE id=?",id)
		return {confirmity:confirmity}
	},
	async getOneTiketInfo(id){
		let [tiketInfo] = await vdesk.mysql.query("SELECT vta.sendersurname,vta.sendername,vta.senderpatronymic,vta.workerFullName,vta.topicname,DATE_FORMAT(vta.startdate,'%d.%m.%Y %H:%i:%s') AS startdate,vta.description,DATE_FORMAT(vta.enddate,'%d.%m.%Y %H:%i:%s') AS enddate,vta.tiketstatusname,dw.email,dw.cityphone,dw.internalphone FROM views_tikets_info_all vta,directory_workers dw WHERE dw.login=vta.worker AND vta.id = ?",id*1)
		return tiketInfo
	}
};	