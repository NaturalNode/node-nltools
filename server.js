// var WordTokenizer = require('./lib/token/regexp').WordTokenizer;
// var NETagger = require('./lib/netagger').NETagger;
// var HunposTagger = require('./lib/tagger').HunposTagger;
// var NameTagger = require('./lib/tagger').NameTagger;
// var Sentences = require('./lib/analyser').Sentences;
// 
// 
// var sentence = "Jack and Jill went up the hill to fetch a pail of water."
// 
// var wordTok = new WordTokenizer();
// var tags = wordTok.tokenize(sentence);
// 
// new HunposTagger('./hunpos-1.0/en_wsj.model','./hunpos-1.0/hunpos-tag', function(pos){
// 	pos.tag(tags, function(posObj) {
// 		// new NETagger({port:8000},function(ner){
// 		// 	ner.tag(posObj,function(posObj){
// 				new Sentences(posObj, function(sen){
// 					sen.part(function(sen){
// 						
// 						console.log(sen.posObj.tags);
// 						
// 						console.log("Subject ", 	sen.subjectToString());
// 						console.log("Predicate ", sen.predicateToString());						
// 						console.log("\r\n");												
// 
// 						console.log("People ", 		sen.posObj.names());
// 						console.log("Location ",	sen.posObj.locations());
// 						console.log("Org ", 			sen.posObj.organizations());
// 						console.log("Misc ",			sen.posObj.misc());						
// 						
// 						sen.type(function(s){
// 							console.log("Sentence type:",s.senType);							
// 						});
// 
// 
// 					});
// 			// 	})						
// 			// });
// 		});
// 	});
// });



