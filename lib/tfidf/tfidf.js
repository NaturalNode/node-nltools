//  This is a simple Tf-idf library.  The algorithm is described in
//  http://en.wikipedia.org/wiki/Tf-idf

var _ = require("underscore")._;
var fs = require('fs');
var tokenizer = require('../token/regexp');

// TODO, change these args to options {}
var TfIdf = function(corpus_filename, stopword_filename, DEFAULT_IDF,cb) {
	var corpus_filename = corpus_filename || null;
	var stopword_filename = stopword_filename || null;
	
	this.num_docs = 0;
	this.term_num_docs = {};     // term : num_docs_containing_term
	this.stopwords = [];
	this.idf_default = DEFAULT_IDF || 1.5;
	var _this = this;
	
	var stopWord = function() {
		if (stopword_filename != null) {
			stopword_file = fs.readFile(stopword_filename,function(err,data) {
				_this.stopwords = data.toString().split("\n");
				cb(_this);
			})
		} else {
			cb(_this);
		}		
	}
	
	if (corpus_filename != null) {
	  // fs.open(corpus_filename, "r",function(err, corpus_file) {
			var cf = fs.createReadStream(corpus_filename);
			var data = "";

			cf.on('data',function(corpus_file){
				data += corpus_file.toString();				
			});

			cf.on('end',function(){
				var lines = data.split(/\n/);
				// Load number of documents.
				_this.num_docs = parseInt(lines[0]);

				// Reads "term:frequency" from each subsequent line in the file.
				for (var i = 1; i < lines.length; i++) {
					tokens = lines[i].split(":");
					term = tokens[0];
					frequency = parseInt(tokens[1]);
					_this.term_num_docs[term] = frequency;
				}
				
				stopWord();
				
			});
	}
	

}

TfIdf.prototype.get_tokens = function(str) {
	var wordTok = new tokenizer.WordTokenizer();
	return wordTok.tokenize(str.toLowerCase());
}

/*  Add terms in the specified document to the idf dictionary. */
TfIdf.prototype.add_input_document = function(input) {
  this.num_docs += 1;
	var _this = this;
	words = _.uniq(this.get_tokens(input));
  _.each(words,function(word){
		if (_this.term_num_docs[word]){
      _this.term_num_docs[word] += 1;
    } else {
      _this.term_num_docs[word] = 1;
		}
	});
}

/* Save the idf dictionary and stopword list to the specified file. */
TfIdf.prototype.save_corpus_to_file = function(idf_filename, stopword_filename, STOPWORD_PERCENTAGE_THRESHOLD) {
  var STOPWORD_PERCENTAGE_THRESHOLD = STOPWORD_PERCENTAGE_THRESHOLD || 0.01;
  output_file = open(idf_filename, "w");

  output_file.write(str(this.num_docs) + "\n");
  for (term, num_docs in this.term_num_docs.items()) {
    output_file.write(term + ": " + str(num_docs) + "\n");
	}

  sorted_terms = sorted(self.term_num_docs.items(), key=itemgetter(1), reverse=True);
  stopword_file = open(stopword_filename, "w");
  for (term, num_docs in sorted_terms) {
    if (num_docs < STOPWORD_PERCENTAGE_THRESHOLD * this.num_docs){
      break;
		}

    stopword_file.write(term + "\n")
	}
}

/* Return the total number of documents in the IDF corpus. */
TfIdf.prototype.get_num_docs = function() {
	return this.num_docs;
}

/*
	Retrieve the IDF for the specified term. 
	This is computed by taking the logarithm of ( 
		(number of documents in corpus) divided by (number of documents containing this term) 
	).
*/
TfIdf.prototype.get_idf = function(term) {
  if (_.include(this.stopwords,term)) return 0;

  if (this.term_num_docs[term] == undefined){
    return this.idf_default;
	}

  return Math.log(parseFloat(1 + this.get_num_docs()) / (1 + this.term_num_docs[term]))	
}

/*
	Retrieve terms and corresponding tf-idf for the specified document.
	The returned terms are ordered by decreasing tf-idf.
*/
TfIdf.prototype.get_doc_keywords = function(curr_doc){
	var _this = this;
  tfidf = {}
	tokens = this.get_tokens(curr_doc)
	tokens_set = _.uniq(tokens);
 	_.each(tokens_set, function(word,i){
		var count = 0;
		_.each(tokens, function(term){
			if (word === term) count++;
		});
		
    mytf = parseFloat(count) / tokens_set.length;
    myidf = _this.get_idf(word);
    tfidf[word] = mytf * myidf;
	});
	
	var sortable = [];
	for (var term in tfidf) {
		sortable.push([term, tfidf[term]]);
	}

	return sortable.sort(function(a, b) {return b[1] - a[1]})
}
exports.TfIdf = TfIdf;