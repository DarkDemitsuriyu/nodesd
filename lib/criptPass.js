const crypto=require('crypto')
const config = require('config');
const util = require('util');
const cryptoPbkdf2 = util.promisify(crypto.pbkdf2);

let hashLength = 64;
let iterations = 10000;
 
//const hash = crypto.createHash('sha512');
//const key = crypto.pbkdf2Sync(password, config.get('criptokey'), 100000, 64, 'sha512')
exports.createSaltHash = async function(email) {
    let salt = crypto.randomBytes(hashLength).toString('base64');
    let hash = (await cryptoPbkdf2(email, salt, iterations, hashLength, 'sha512')).toString();
    return { salt, hash }
};
exports.checkSaltHash = async function(email, salt, hash) {
    if (!email || !hash || !salt) return false;
    let userHash = (await cryptoPbkdf2(email, salt, iterations, hashLength, 'sha512')).toString();
    let check = userHash == hash;
    return check;
};
exports.createPassHash=function (password){	
	//hash2.update(password);
	//return hash3.digest('hex')

	for(var i=0;i<3;i++){		
		let hash = crypto.createHash('sha512');
		hash.update(password);
		password = hash.digest('hex')
		if(i<2){
			password+=config.get('criptokey');
		}
	}
	console.log('passwordHash10',password)
	return password
}