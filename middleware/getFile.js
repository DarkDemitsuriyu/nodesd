exports.get=function(req,res,next){
	var type=req.query.type;
	var file=req.query.file;
	var newname=req.query.newname;
	var fileExt=file.split(".").pop();
	res.download('documents/'+type+'/'+file, newname+'.'+fileExt);
};