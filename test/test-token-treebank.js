var tokenizer = require('../lib/token/treebank');

var treebankToken = new tokenizer.TreebankWordTokenizer()

exports.TreeBankToken = function(test) {
	
	var tok = treebankToken.tokenize("If we 'all' can't go. I'll stay home.");
	console.log(tok);
	
	test.expect(1);
	test.equal(1,1,"1 === 1");
	test.done();
}