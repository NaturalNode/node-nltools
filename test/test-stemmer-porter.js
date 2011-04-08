var porter = require('../lib/stem/porter');


var stemmer = new porter.PorterStemmer();
console.log(stemmer.stem("ponies"));
console.log(stemmer.stem("caresses"));


exports.ends = function(test) {

	test.expect(3);
	stemmer.b = "word";
	test.equal(	stemmer.ends("rd"), true," word ends in rd");

	stemmer.b = "laughing";
	test.equal(	stemmer.ends("ing"), true," laughing ends in ing");

	stemmer.b = "laughing";
	test.equal(	stemmer.ends("ion"), false," laughing ends in ion === false");
	
	test.done();
}

exports.cons = function(test) {
	var stemmer = new porter.PorterStemmer();
	stemmer.b = "querty";
	
	test.expect(6);	
	test.equal(	stemmer.cons(0), true,"  querty[0] const");
	test.equal(	stemmer.cons(1), false," querty[1] const");
	test.equal(	stemmer.cons(2), false," querty[2] const");
	test.equal(	stemmer.cons(3), true,"  querty[3] const");
	test.equal(	stemmer.cons(4), true,"  querty[4] const");
	test.equal(	stemmer.cons(5), false," querty[5] const");	
	
	test.done();
}

exports.step1ab = function(test) {
	var stemmer = new porter.PorterStemmer();

	test.expect(1);		
	stemmer.b = "caresses";
	stemmer.step1ab();
	test.equal(	stemmer.b, "caress", "Stemmed word");

	// stemmer.b = "ponies";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "poni","Stemmed word");
	// 
	// stemmer.b = "sties";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "sti","Stemmed word");
	// 
	// stemmer.b = "tie";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "tie","Stemmed word");
	// 
	// stemmer.b = "caress";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "caress","Stemmed word");
	// 
	// stemmer.b = "cats";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "cat","Stemmed word");
	// 
	// stemmer.b = "feed";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "feed","Stemmed word");
	// 
	// stemmer.b = "agreed";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "agree","Stemmed word");
	// 
	// stemmer.b = "disabled";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "disable","Stemmed word");
	// 
	// stemmer.b = "matting";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "mat","Stemmed word");
	// 
	// stemmer.b = "mating";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "mate","Stemmed word");
	// 
	// stemmer.b = "meeting";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "meet","Stemmed word");
	// 
	// stemmer.b = "milling";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "mill","Stemmed word");
	// 
	// stemmer.b = "messing";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "mess","Stemmed word");
	// 
	// stemmer.b = "meetings";
	// stemmer.step1ab();
	// test.equal(	stemmer.b, "meet","Stemmed word");
	// 	
	test.done();
}

     
