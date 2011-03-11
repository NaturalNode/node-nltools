
var util = require("util");

// Base Class for String Splitting
StringTokenizer = function() {
}

StringTokenizer.prototype.tokenize = function(s) {
  return s.split(this._string)
}

SpaceTokenizer = function() {
  this._string = ' ';
}
util.inherits(SpaceTokenizer, StringTokenizer);
exports.SpaceTokenizer = SpaceTokenizer;


TabTokenizer = function() {
  this._string = new RegExp(/\t/);
}
util.inherits(TabTokenizer, StringTokenizer);
exports.TabTokenizer = TabTokenizer;


// Base Class for RegExp Matching
RegexpTokenizer = function(options) {
	var options = options || {};
	this.discardEmpty = options.discardEmpty || true;
}

RegexpTokenizer.prototype.tokenize = function(s) {
	if (this.discardEmpty) {
		var m = s.split(this._pattern);
		var token = [];
		for (var i = 0;i < m.length; i++) {
			if (m[i].match(/(\s+)/) || m[i] == "") {
				continue;
			} else {
				token.push(m[i]);
			}
		}
		return token;
	} else {
		return s.split(this._pattern);
	}
}

WordTokenizer = function(options) {
	RegexpTokenizer.call(this,options)
  this._pattern = new RegExp(/(\w+|,|\+|-|\*)/);
}

util.inherits(WordTokenizer, RegexpTokenizer);
exports.WordTokenizer = WordTokenizer;
