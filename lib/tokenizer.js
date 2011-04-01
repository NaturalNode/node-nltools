var util = require("util");
var _ = require('underscore')._;

// Base Class for String Splitting
StringTokenizer = function() {
}

StringTokenizer.prototype.tokenize = function(string,discardEmpty) {
	var results;
	results = string.split(this._string);
  return (discardEmpty) ? _.without(results,''): results;
}

SpaceTokenizer = function() {
  this._string = ' ';
}

util.inherits(SpaceTokenizer, StringTokenizer);
exports.SpaceTokenizer = SpaceTokenizer;

CharTokenizer = function(character) {
  this._string = character;
}

util.inherits(CharTokenizer, StringTokenizer);
exports.CharTokenizer = CharTokenizer;


TabTokenizer = function() {
  this._string = /\t/;
}

util.inherits(TabTokenizer, SpaceTokenizer);
exports.TabTokenizer = TabTokenizer;





// Base Class for RegExp Matching
RegexpTokenizer = function(options) {
	var options = options || {};
	this._pattern = options.pattern || this._pattern;
	this.discardEmpty = options.discardEmpty || true;
}

RegexpTokenizer.prototype.tokenize = function(s) {
	var results;
	results = s.split(this._pattern);
	return (this.discardEmpty) ? _.without(results,'',' ') : results;
}
exports.RegexpTokenizer = RegexpTokenizer;

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordTokenizer().tokenize("She said 'hello'.")
 *      ['She', 'said', 'hello']
 * 
 */
WordTokenizer = function(options) {
  this._pattern = /\W+/;
	RegexpTokenizer.call(this,options)
}

util.inherits(WordTokenizer, RegexpTokenizer);
exports.WordTokenizer = WordTokenizer;

/***
 * A tokenizer that divides a text into sequences of alphabetic and
 * non-alphabetic characters.  E.g.:
 *
 *      >>> WordPunctTokenizer().tokenize("She said 'hello'.")
 *      ['She', 'said', "'", 'hello', "'."]
 * 
 */
WordPunctTokenizer = function(options) {
	RegexpTokenizer.call(this,options)
  // this._pattern = new RegExp(/(\w+|,|\+|-|\*)/);
  this._pattern = new RegExp(/(\w+|\!|\'|\"")/i);

}

util.inherits(WordPunctTokenizer, RegexpTokenizer);
exports.WordPunctTokenizer = WordPunctTokenizer;
