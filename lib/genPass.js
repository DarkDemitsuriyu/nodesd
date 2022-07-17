var generatePassword = require('password-generator');

var uppercaseMinCount = 1;
var lowercaseMinCount = 1;
var numberMinCount = 1;
var specialMinCount = 1;
var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-])/g;
var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password,special) {
  var uc = password.match(UPPERCASE_RE);
  var lc = password.match(LOWERCASE_RE);
  var n = password.match(NUMBER_RE);
  var sc=true;
  if(special){sc= password.match(SPECIAL_CHAR_RE);}
  var nr = password.match(NON_REPEATING_CHAR_RE);
  return /*!nr && */uc && uc.length >= uppercaseMinCount &&
    lc && lc.length >= lowercaseMinCount &&
    n && n.length >= numberMinCount && sc;
}

function customPassword(length,special) {
  var password = "";
  var rule=/[\d\w]/;
  if(special){rule=/[\w\d\W]/;}
  while (!isStrongEnough(password,special)) {
    password = generatePassword(length, false, rule);
  }
  return password;
}

module.exports=customPassword;