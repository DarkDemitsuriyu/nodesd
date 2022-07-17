var transliteration = require('lib/tramsliterator');
var config = require('config');
var arrayfio;
var result;
function loginGenerator(fio,rules){
	if(fio){
		if(!!!rules){rules=config.get('loginRule')}
		arrayfio=fio.trim().split(' ').map(function(word,i){
			var rule=rules[i];
			word.toLowerCase().replace(word[0],word[0].toUpperCase());
			if((typeof rule)==='number'){word=word.substr(0,rule);}
			else if(rule!=='*'){word=rule;}
			return word;
		});
		if(arrayfio.length<3){
			result=null;
		} else {
			result = arrayfio[1].concat(arrayfio[2],arrayfio[0]);
		}
		
	}
	return transliteration(result)
}
module.exports=loginGenerator;