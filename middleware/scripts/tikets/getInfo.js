exports.getData=async function(login,req){
	let tiketsGets=require('middleware/scripts/tikets/tikets_gets');
	return await tiketsGets.getOneTiketInfo(req.body.id)
}
