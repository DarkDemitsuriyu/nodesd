const moment = require('moment');
//const Buffer = require('Buffer');
const config = require('config');
const LdapClient = require('ldapjs-client');
const client = new LdapClient({ url: config.get('ldap:url') });

let createUD = async function(user){
	user.telephoneNumber += ''
	let extphone = user.telephoneNumber.startsWith("(0") || user.telephoneNumber.startsWith("0") || user.telephoneNumber.startsWith("7") ? user.telephoneNumber : ""
	let outphone = user.otherTelephone ? user.otherTelephone : !user.telephoneNumber.startsWith("(0") && !user.telephoneNumber.startsWith("0") && !user.telephoneNumber.startsWith("7") && user.telephoneNumber!=='undefined' ? user.telephoneNumber : ""
	let [department] = user.distinguishedName.match(/(?<=CN=.*?,OU=)(.*?(?=,OU=Филиал))|(?<=CN=.*?,OU=)(.*?(?=,OU=Блок))/);
	if(department.search(/,OU=/) != -1){///(Группа\s+[А-ЯЁа-яё]+\s+продаж)/
		department = department.replace(/(^.*?),OU=(.*?$)/, "$2 - $1")
	}
	
	return {
		fullname: `'${user.cn.split("(", 1)[0].trim() || ""}'`,
		login: `'${user.sAMAccountName || ""}'`,
		extphone: `'${extphone || ""}'`,
		outphone: `'${outphone || ""}'`,
		personeid: `'${user.employeeNumber || ""}'`,
		mail: `'${user.mail || ""}'`,
		department: `'${department || ""}'`,
		departmentid: `'${user.departmentNumber || ""}'`,
		jobtitle: `'${user.title || ""}'`//,
		//images: `'${user.thumbnailPhoto || ""}'`
	}
}

module.exports={
	async personesToBase(){
		try {
			await client.bind(config.get('ldap:username'), config.get('ldap:password'));
		} catch (e) {
			console.log('Bind failed');
		}
		let dataToSqlCreated = []
		const connections = config.get('ldap:connections')
		for(let conn of connections){
			let options = {
				scope: 'sub',
				attributes: conn.attribs || config.get('ldap:attribsGeneral'),
				filter: `(&${config.get('ldap:filterUsers')}${config.get('ldap:filterUsersEnabled')}${conn.filter || config.get('ldap:filterGeneral')})`
			};
			let ldapUsers = await client.search(conn.base, options);
			for(let user of ldapUsers){
				if(!!user.cn){
					let uData = await createUD(user)
					//console.log(uData)
					//console.log(`INSERT INTO _internal_ldap_personlist (fullname, login, extphone, outphone, personeid, mail, department, departmentid, jobtitle, images) VALUES ${Object.values(uData).toString()}`)
					//await vdesk.mysql.query(`INSERT INTO _internal_ldap_personlist (fullname, login, extphone, outphone, personeid, mail, department, departmentid, jobtitle, images) VALUES ${Object.values(uData).toString()}`)
					dataToSqlCreated.push(`(${Object.values(uData).toString()})`)
				}
			}
		}
		//await client.unbind();
		await vdesk.mysql.query("TRUNCATE TABLE _internal_ldap_personlist;")
		if(dataToSqlCreated.length>0){
			//console.log(`INSERT INTO _internal_ldap_personlist (fullname, login, extphone, outphone, personeid, mail, department, departmentid, jobtitle, images) VALUES ${dataToSqlCreated.toString()}`)
			await vdesk.mysql.query(`INSERT INTO _internal_ldap_personlist (fullname, login, extphone, outphone, personeid, mail, department, departmentid, jobtitle) VALUES ${dataToSqlCreated.toString()}`)
		}
	},
	async personesToLDAP(){
		try {
			await client.bind('', '');
		} catch (e) {
		  console.log('Bind failed');
		}
		
		try{
			let ldapData = await client.search('', {scope: 'sub',filter:'(objectClass=contact)',attributes: ['dn', 'sn', 'cn']});
			for(let i=0;i<ldapData.length;i++){
				await client.del(ldapData[i].dn);
			}
		} catch (e){
			console.log('catchDel',e)
		}

		let [users] = await vdesk.mysql.query('SELECT * FROM _internal_ldap_personlist')
		
		for(let i=0; i<users.length;i++){
			if(users[i].mail){
				let user = users[i]
				let fullname = user.fullname.trim()
			
				let dn = `cn=${fullname},`
				let atrributes = {
					objectclass: ['top','organizationalPerson','person','contact'],
					cn: fullname,
					mail: user.mail,
					displayName: fullname,
					sn: fullname.split(' ')[0],
					givenName: fullname.split(' ')[1]
				}
				if(user.extphone) {atrributes.telephoneNumber = user.extphone; }
				if(user.jobtitle) {atrributes.title = user.jobtitle; }
				if(user.department) {atrributes.department = user.department; }
				if(user.images) {attributes.thumbnailPhoto = user.images}
				try{
					let ldapData = await client.add(dn, atrributes);
				} catch (e){
					console.log('catchAdd',fullname,e)
				}
			}			
		}
		
		let list = [
			
		]
		for(let i=0; i<list.length;i++){
			let elem = list[i]
			let dn = `cn=${elem.cn}`
			try{
				let ldapData = await client.add(dn, elem);
			} catch (e){
				console.log('catchAdd',elem.cn,e)
			}
		}
		
	}
}