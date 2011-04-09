var tfiObj = require('../lib/tfidf/tfidf').TfIdf;

var get_exected_idf = function(num_docs_total, num_docs_term){
   return Math.log(parseFloat(1 + num_docs_total) / (1 + num_docs_term))
}

var DEFAULT_IDF_UNITTEST = 1.5;

exports.testGetIdf = function(test) {	
	
	new tfiObj(
		'/Users/ironman/projects/node_projects/node-nltools/lib/tfidf/tfidf_testcorpus.txt',
		null,
		DEFAULT_IDF_UNITTEST,
		function(my_tfidf) {	

			test.expect(4);
			test.equal(my_tfidf.get_idf("THE"),DEFAULT_IDF_UNITTEST,"Non Existant words should return the default value.");
			test.equal(my_tfidf.get_idf("nonexistent"),DEFAULT_IDF_UNITTEST,"Non Existant words should return the default value.");
			test.ok(my_tfidf.get_idf("a") > my_tfidf.get_idf("the"),"A is greater then the");
			test.equal(my_tfidf.get_idf("girl"), my_tfidf.get_idf("moon"),"Amost Equal");
			test.done();
		}
	);			
}


// Test retrieving keywords from a document, ordered by tf-idf.
exports.testKeywords = function(test) {	
	
	new tfiObj(
		'/Users/ironman/projects/node_projects/node-nltools/lib/tfidf/tfidf_testcorpus.txt',
		'/Users/ironman/projects/node_projects/node-nltools/lib/tfidf/tfidf_teststopwords.txt',
		0.01,
		function(my_tfidf) {	

			test.expect(5);
			
			// Test retrieving keywords when there is only one keyword.
 			keywords = my_tfidf.get_doc_keywords("the spoon and the fork");
			test.equal("the", keywords[0][0]);

			// Test retrieving multiple keywords.
			keywords = my_tfidf.get_doc_keywords("the girl said hello over the phone")
		  test.equal("girl", keywords[0][0])
			test.equal("phone", keywords[1][0])
			test.equal("said", keywords[2][0])
			test.equal("the", keywords[3][0])
		  
			test.done();
		}
	);			
}

exports.testAddCorpus = function(test) {	
	
	new tfiObj(
		'/Users/ironman/projects/node_projects/node-nltools/lib/tfidf/tfidf_testcorpus.txt',
		null,
		1,
		function(my_tfidf) {	

			test.expect(7);
			test.ok(get_exected_idf(my_tfidf.get_num_docs(), 1));
			test.ok(DEFAULT_IDF_UNITTEST,my_tfidf.get_idf("water"));
			
			test.equal(get_exected_idf(my_tfidf.get_num_docs(), 1), my_tfidf.get_idf("moon"));
			test.equal(get_exected_idf(my_tfidf.get_num_docs(), 5), my_tfidf.get_idf("said"));
			
			my_tfidf.add_input_document("water, moon")

			test.equal(get_exected_idf(my_tfidf.get_num_docs(), 1),my_tfidf.get_idf("water"))
			test.equal(get_exected_idf(my_tfidf.get_num_docs(), 2),my_tfidf.get_idf("moon"))
			test.equal(get_exected_idf(my_tfidf.get_num_docs(), 5),my_tfidf.get_idf("said"))
			
			test.done();
		}
	);			
}





