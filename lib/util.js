var _ = require("underscore")._;

var Util = function() {
}

Util.bigrams = function(sequence){
	return ngrams(sequence, 2);
}

Util.trigrams = function(sequence){
	return ngrams(sequence, 3);
}

exports.Util = Util;


var ngrams = function(sequence, n) {
	var result = [];
	if (!_(sequence).isArray()) {
		return result;
	}

	var count = _.max([0, sequence.length - n + 1]);
	for (var i = 0; i < count; i++) {
		result.push(sequence.slice(i,i+n));
	}
	return result;
}
