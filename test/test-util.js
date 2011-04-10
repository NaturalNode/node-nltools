var Util = require('../lib/util').Util;

exports.bigram = function(test) {
	test.expect(3);
	test.deepEqual(Util.bigrams(),[],"No Bigram");		
	test.deepEqual(Util.bigrams([1]),[],"No Bigram");	
	test.deepEqual(Util.bigrams([1,2]),[[1,2]],"Bigrams");

	test.done();
}

exports.trigram = function(test) {
	
	test.expect(3);
	test.deepEqual(Util.trigrams(),[],"No trigrams");		
	test.deepEqual(Util.trigrams([1]),[],"No trigrams");	
	test.deepEqual(Util.trigrams([1,2,3,4,5]),[[1,2,3],[2,3,4],[3,4,5]],"trigrams");
	test.done();
	
}