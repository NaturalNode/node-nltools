var tokenizer = require('../lib/token/simple');

var spaceToken = new tokenizer.SpaceTokenizer()

exports.SpaceToken = function(test) {
	test.expect(5);
	
	var tok = spaceToken.tokenize("Elizabeth is hungry");
	test.equal(3, tok.length, "Number of Tokens");		

	var tok = spaceToken.tokenize("He saw the frog with the telescope.");
	test.equal(7, tok.length, "Number of Tokens");		

	var tok = spaceToken.tokenize("Airplanes fly.");
	test.equal(2, tok.length, "Number of Tokens");		

	var tok = spaceToken.tokenize("Stand   on   your   head!", false);
	test.equal(10, tok.length, "Number of Tokens with extra spaces.");		

	var tok = spaceToken.tokenize("Stand   on   your   head!", true );
	test.equal(4, tok.length, "Number of Tokens with spaces removed.");		

	test.done();		

};

var tabToken = new tokenizer.TabTokenizer()

exports.TabToken = function(test) {
	test.expect(4);
	
	var tok = tabToken.tokenize("Elizabeth \tis hungry");
	test.equal(2, tok.length, "Number of Tokens");		
	test.equal("Elizabeth ", tok[0], "Number of Tokens");			
	
	var tok = tabToken.tokenize("Elizabeth	is 		hungry");
	test.equal(4, tok.length, "Number of Tokens with extra tabs");		
	
	var tok = tabToken.tokenize("Elizabeth \tis \t\thungry",true);
	test.equal(3, tok.length, "Number of Tokens with extras removed");		

	test.done();
}
