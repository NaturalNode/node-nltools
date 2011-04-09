var porter = require('../lib/stem/porter');


var stemmer = new porter.PorterStemmer();

exports.ends = function(test) {

	test.expect(4);
	stemmer.b = "word";
	stemmer.k = stemmer.b.length - 1;
  stemmer.b.k0 = 0;
	test.equal(	stemmer.ends("rd"), true," word ends in rd");

	stemmer.b = "laughing";
	stemmer.k = stemmer.b.length - 1;
  stemmer.b.k0 = 0;	
	test.equal(	stemmer.ends("ing"), true," laughing ends in ing");

	stemmer.b = "laughing";
	stemmer.k = stemmer.b.length - 1;
  stemmer.b.k0 = 0;	
	test.equal(	stemmer.ends("ion"), false," laughing ends in ion === false");
	
	stemmer.b = "related";
	stemmer.k = stemmer.b.length - 2;
  stemmer.b.k0 = 0;
	test.equal(	stemmer.ends("ate"), true," rel'ate'-d ends in ate");
	
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

	test.expect(18);		
	test.equal(stemmer._testStem("caresses","step1ab"), "caress", "Stemmed word");
	test.equal(stemmer._testStem("ponies","step1ab"), "poni","Stemmed word");
	test.equal(stemmer._testStem("sties","step1ab"), "sti","Stemmed word");
	test.equal(stemmer._testStem("tie","step1ab"), "tie","Stemmed word");
	test.equal(stemmer._testStem("caress","step1ab"), "caress","Stemmed word");
	test.equal(stemmer._testStem("cats","step1ab"), "cat","Stemmed word");
	test.equal(stemmer._testStem("feed","step1ab"), "feed","Stemmed word");
	test.equal(stemmer._testStem("agreed","step1ab"), "agree","Stemmed word");
	test.equal(stemmer._testStem("disabled","step1ab"), "disable","Stemmed word");
	test.equal(stemmer._testStem("related","step1ab"), "relate","Stemmed word");	
	test.equal(stemmer._testStem("matting","step1ab"), "mat","Stemmed word");
	test.equal(stemmer._testStem("mating","step1ab"), "mate","Stemmed word");
	test.equal(stemmer._testStem("meeting","step1ab"), "meet","Stemmed word");	
	test.equal(stemmer._testStem("milling","step1ab"), "mill","Stemmed word");
	test.equal(stemmer._testStem("messing","step1ab"), "mess","Stemmed word");
	test.equal(stemmer._testStem("meetings","step1ab"), "meet","Stemmed word");
	test.equal(stemmer._testStem("died","step1ab"), "die","Stemmed word");	
	test.equal(stemmer._testStem("spied","step1ab"), "spi","Stemmed word");		
		
	test.done();
}

exports.step1c = function(test) {
	var stemmer = new porter.PorterStemmer();
	
	test.expect(2);			
	test.equal(stemmer._testStem('happy',"step1c"), 'happi',"Stemmed word");
	test.equal(stemmer._testStem('enjoy',"step1c"), 'enjoy',"Stemmed word");	
	
	test.done();
}

exports.step2 = function(test) {
	var stemmer = new porter.PorterStemmer();
	
	test.expect(22);			
	test.equal(stemmer._testStem('optimization',"step2"), 'optimize',"Stemmed word");
	test.equal(stemmer._testStem('relational',"step2"), 'relate',"Stemmed word");
	test.equal(stemmer._testStem('conditional',"step2"), 'condition',"Stemmed word");
	test.equal(stemmer._testStem('rational',"step2"), 'rational',"Stemmed word");
	test.equal(stemmer._testStem('valenci',"step2"), 'valence',"Stemmed word");
	test.equal(stemmer._testStem('hesitanci',"step2"), 'hesitance',"Stemmed word");
	test.equal(stemmer._testStem('digitizer',"step2"), 'digitize',"Stemmed word");
	test.equal(stemmer._testStem('conformabli',"step2"), 'conformable',"Stemmed word");
	test.equal(stemmer._testStem('radicalli',"step2"), 'radical',"Stemmed word");
	test.equal(stemmer._testStem('differentli',"step2"), 'different',"Stemmed word");
	test.equal(stemmer._testStem('vileli',"step2"), 'vile',"Stemmed word");
	test.equal(stemmer._testStem('analogousli',"step2"), 'analogous',"Stemmed word");
	test.equal(stemmer._testStem('vietnamization',"step2"), 'vietnamize',"Stemmed word");
	test.equal(stemmer._testStem('predication',"step2"), 'predicate',"Stemmed word");
	test.equal(stemmer._testStem('operator',"step2"), 'operate',"Stemmed word");
	test.equal(stemmer._testStem('feudalism',"step2"), 'feudal',"Stemmed word");
	test.equal(stemmer._testStem('decisiveness',"step2"), 'decisive',"Stemmed word");
	test.equal(stemmer._testStem('hopefulness',"step2"), 'hopeful',"Stemmed word");
	test.equal(stemmer._testStem('callousness',"step2"), 'callous',"Stemmed word");
	test.equal(stemmer._testStem('formaliti',"step2"), 'formal',"Stemmed word");
	test.equal(stemmer._testStem('sensitiviti',"step2"), 'sensitive',"Stemmed word");
	test.equal(stemmer._testStem('sensibiliti',"step2"), 'sensible',"Stemmed word");	
	
	test.done();
}

exports.step3 = function(test) {
	var stemmer = new porter.PorterStemmer();
	
	test.expect(8);			
	test.equal(stemmer._testStem('fruitful',"step3"), 'fruit',"Stemmed word");
	test.equal(stemmer._testStem('triplicate',"step3"), 'triplic',"Stemmed word");
	test.equal(stemmer._testStem('formative',"step3"), 'form',"Stemmed word");
	test.equal(stemmer._testStem('formalize',"step3"), 'formal',"Stemmed word");
	test.equal(stemmer._testStem('electriciti',"step3"), 'electric',"Stemmed word");
	test.equal(stemmer._testStem('electrical',"step3"), 'electric',"Stemmed word");					
	test.equal(stemmer._testStem('hopeful',"step3"), 'hope',"Stemmed word");
	test.equal(stemmer._testStem('goodness',"step3"), 'good',"Stemmed word");					

	test.done();
}

exports.step4 = function(test) {
		
	test.expect(19);
	test.equal(stemmer._testStem('revival',"step4"), 'reviv',"Stemmed word");
	test.equal(stemmer._testStem('allowance',"step4"), 'allow',"Stemmed word");	
	test.equal(stemmer._testStem('inference',"step4"), 'infer',"Stemmed word");	
	test.equal(stemmer._testStem('airliner',"step4"), 'airlin',"Stemmed word");
	test.equal(stemmer._testStem('gyroscopic',"step4"), 'gyroscop',"Stemmed word");			
	test.equal(stemmer._testStem('adjustable',"step4"), 'adjust',"Stemmed word");
	test.equal(stemmer._testStem('defensible',"step4"), 'defens',"Stemmed word");			
	test.equal(stemmer._testStem('irritant',"step4"), 'irrit',"Stemmed word");
	test.equal(stemmer._testStem('replacement',"step4"), 'replac',"Stemmed word");			
	test.equal(stemmer._testStem('adjustment',"step4"), 'adjust',"Stemmed word");
	test.equal(stemmer._testStem('dependent',"step4"), 'depend',"Stemmed word");			
	test.equal(stemmer._testStem('adoption',"step4"), 'adopt',"Stemmed word");
	test.equal(stemmer._testStem('homologou',"step4"), 'homolog',"Stemmed word");			
	test.equal(stemmer._testStem('communism',"step4"), 'commun',"Stemmed word");
	test.equal(stemmer._testStem('activate',"step4"), 'activ',"Stemmed word");			
	test.equal(stemmer._testStem('angulariti',"step4"), 'angular',"Stemmed word");
	test.equal(stemmer._testStem('homologous',"step4"), 'homolog',"Stemmed word");			
	test.equal(stemmer._testStem('effective',"step4"), 'effect',"Stemmed word");
	test.equal(stemmer._testStem('bowdlerize',"step4"), 'bowdler',"Stemmed word");			

	test.done()
}

exports.step5 = function(test) {
	test.expect(4);
	test.equal(stemmer._testStem('probate',"step5"), 'probat',"Stemmed word");
	test.equal(stemmer._testStem('cease',"step5"), 'ceas',"Stemmed word");
	test.equal(stemmer._testStem('controll',"step5"), 'control',"Stemmed word");
	test.equal(stemmer._testStem('roll',"step5"), 'roll',"Stemmed word");			
	test.done();
}

exports.stemWord = function(test) {
	test.expect(2);

	test.equal(stemmer.stem("Cats"), 'Cat',"Respect Capitals");	
	test.equal(stemmer.stem("Trophies"), 'Trophi',"Respect Capitals");
	
	test.done();
}


     

     
