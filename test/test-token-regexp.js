var tokenizer = require('../lib/tokenizer');

var wordTok = new tokenizer.WordTokenizer()

exports.wordToken = function(test) {
	test.expect(2);
	var tok = wordTok.tokenize("This is all a dream.");
	test.equal(5,tok.length,"This is all a dream. - should have 5 words");

	// Quotes removed
	var tok = wordTok.tokenize("She said 'hello'");
	test.equal(3,tok.length,"She said 'hello'. - should have 3 words");
	test.done();
	
}

var wordPunct = new tokenizer.WordPunctTokenizer();
exports.wordPunctToken = function(test) {
	var tok = wordPunct.tokenize("She said 'hello'!");
	test.expect(1);
	test.equal(6,tok.length,'She said "hello". - should have 6 tokens');
	test.done();
}


// Split on Matches
var regexpTok1 = new tokenizer.RegexpTokenizer({pattern:/someword/g,gaps:false});
exports.regexpToken = function(test) {
	test.expect(1);
	var tok = regexpTok1.tokenize("somewordAAAsomewordAAAsomeword");
	test.equal(3,tok.length,'somewordAAAsomewordAAAsomeword - should have 3 words');	
	test.done();
}

// Split on GAPS
var regexpTok2 = new tokenizer.RegexpTokenizer({pattern:/AAA/});
exports.regexpGapsToken = function(test) {
	test.expect(1);
	var tok = regexpTok2.tokenize("somewordAAAsomewordAAAsomeword");
	test.equal(3,tok.length,'somewordAAAsomewordAAAsomeword - should have 3 words');	
	
	test.done();
}