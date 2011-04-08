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





