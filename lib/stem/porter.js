// Porter Stemmer

/***
  A word stemmer based on the Porter stemming algorithm.
  
      Porter, M. \"An algorithm for suffix stripping.\"
      Program 14.3 (1980): 130-137.

  A few minor modifications have been made to Porter's basic
  algorithm.  See the source code of this module for more
  information.

  The Porter Stemmer requires that all tokens have string types.

***/

var _ = require('underscore')._;

var PorterStemmer = function() {
	
	var irregular_forms = {
      "sky" :     ["sky", "skies"],
      "die" :     ["dying"],
      "lie" :     ["lying"],
      "tie" :     ["tying"],
      "news" :    ["news"],
      "inning" :  ["innings", "inning"],
      "outing" :  ["outings", "outing"],
      "canning" : ["cannings", "canning"],
      "howe" :    ["howe"],

      // --NEW--
      "proceed" : ["proceed"],
      "exceed"  : ["exceed"],
      "succeed" : ["succeed"], // Hiranmay Ghosh
		}

		this.pool = {}
		self = this;
		_.each(irregular_forms,function(i,key) {
			_.each(irregular_forms[key],function(val) {
				self.pool[val] = key;
			});
		});		
}

PorterStemmer.prototype.ends = function(s) {
	// This could be better javascript'ified
	// ends(s) is TRUE <=> k0,...k ends with the string s.
	// var length = s.length
	// if (s[length - 1] != this.b[this.k]) return false;
	// if (length > (this.k - this.k0 + 1)) return false;
	// if (this.b.slice(this.k-length+1,this.k+1) != s) return false;
	// 
	// this.j = this.k - length;
	// return true;	
	
	// New Approch
	if ((new RegExp(s + "$")).test(this.b)) {
		this.j = this.k - s.length;
		return true;		
	} else {
		return false;
	} 
}

PorterStemmer.prototype.cons = function(i) {
	// cons(i) is TRUE <=> b[i] is a consonant.

	if (this.b[i] == 'a' || this.b[i] == 'e' || this.b[i] == 'i' || this.b[i] == 'o' || this.b[i] == 'u') {
		return false;
	}
		
	if (this.b[i] == 'y') {
		if (i == this.k0) {
			return true;
		} else {
			return (!this.cons(i - 1))
		}
	}
	
	return true;	
}

PorterStemmer.prototype.vowelinstem = function() {
	// vowelinstem() is TRUE <=> k0,...j contains a vowel
	for (var i = this.k0; i < this.j + 1;i++ ){
	// for (i in range(this.k0, this.j + 1)) {
		if (!this.cons(i)) {
			return true;
		}
		return false;
	}
}

PorterStemmer.prototype.doublec = function(j) {
	// doublec(j) is TRUE <=> j,(j-1) contain a double consonant.
	if (j < (this.k0 + 1)) {
		return false;
	}
	if ((this.b[j] != this.b[j-1])) {
		return false;
	}
	return this.cons(j);
}

PorterStemmer.prototype.setto = function(s) {
	// setto(s) sets (j+1),...k to the characters in the string s, readjusting k.
	var length = s.length;
	// TODO This line seems questionable
	this.b = this.b.slice(0,this.j+1) + s + this.b.slice(this.j+length+1,length);
	this.k = this.j + length
}

PorterStemmer.prototype.cvc = function(i) {
	/*
    cvc(i) is TRUE <=>

    a) ( --NEW--) i == 1, and p[0] p[1] is vowel consonant, or

    b) p[i - 2], p[i - 1], p[i] has the form consonant -
       vowel - consonant and also if the second c is not w, x or y. this
       is used when trying to restore an e at the end of a short word.
       e.g.

           cav(e), lov(e), hop(e), crim(e), but
           snow, box, tray.        
	*/
	if (i == 0) return false; // i == 0 never happens perhaps
	if (i == 1) return (!this.cons(0) && this.cons(1));
	if (!this.cons(i) || this.cons(i-1) || !this.cons(i-2)) return false;
    
	ch = this.b[i]
	if (ch == 'w' || ch == 'x' || ch == 'y'){
		return false;
	}

	return true;
}

PorterStemmer.prototype.m = function(){
	/*
		m() measures the number of consonant sequences between k0 and j.
    if c is a consonant sequence and v a vowel sequence, and <..>
    indicates arbitrary presence,
    
       <c><v>       gives 0
       <c>vc<v>     gives 1
       <c>vcvc<v>   gives 2
       <c>vcvcvc<v> gives 3
       ....
	*/
	var n = 0;
	var i = this.k0;
	
	while (1) {
		if (i > this.j) {
			return n;
		}
		if (!this.cons(i)) {
			break;
		}
		i = i + 1;
	}
	i = i + 1

	while (1) {
		while (1) {
			if (i > this.j) {
				return n;
			}
			if (this.cons(i)) {
				break
			}
			i = i + 1;
		}
		i = i + 1;
		n = n + 1;
		while (1) {
			if (i > this.j) {
				return n;
			}
			if (!this.cons(i)) {
				break;
			}
			i = i + 1;
		}
		i = i + 1;
	}
}

PorterStemmer.prototype.step1ab = function(self) {
/***
	step1ab() gets rid of plurals and -ed or -ing. e.g.
    
		caresses  ->  caress
		ponies    ->  poni
		sties     ->  sti
		tie       ->  tie        (--NEW--: see below)
		caress    ->  caress
		cats      ->  cat
    
		feed      ->  feed
		agreed    ->  agree
		disabled  ->  disable
    
		matting   ->  mat
		mating    ->  mate
		meeting   ->  meet
		milling   ->  mill
		messing   ->  mess
    
		meetings  ->  meet
***/

	if (this.b[this.k] == 's') {
		if (this.ends("sses")) {
			this.k = this.k - 2
		} else if (this.ends("ies")) {
			if (this.j == 0) {
				this.k = this.k - 1;
			}
			// this line extends the original algorithm, so that
			// 'flies'->'fli' but 'dies'->'die' etc
			else {
				this.k = this.k - 2;
			}
		} else if (this.b[this.k - 1] != 's') {
			this.k = this.k - 1;
		}
	}


  if (this.ends("ied")) {
		if (this.j == 0) {
			this.k = this.k - 1;
		} else {
			this.k = this.k - 2;
		}
		// this line extends the original algorithm, so that
		// 'spied'->'spi' but 'died'->'die' etc

	} else if (this.ends("eed")) {
		if (this.m() > 0) {
			this.k = this.k - 1;
		}
	} else if ((this.ends("ed") || this.ends("ing")) && this.vowelinstem()) {
		this.k = this.j;
		if (this.ends("at")) {   
			this.setto("ate");
		} else if (this.ends("bl")) { 
			this.setto("ble");
		} else if (this.ends("iz")) { 
			this.setto("ize");
		} else if (this.doublec(this.k)) {
			this.k = this.k - 1;
			ch = this.b[this.k];
			if (ch == 'l' || ch == 's' || ch == 'z') {
				this.k = this.k + 1;
			}
		} else if ((this.m() == 1 && this.cvc(this.k))) {
			this.setto("e");
		}	
	}

}

PorterStemmer.prototype.step1c = function() {
	/*
  step1c() turns terminal y to i when there is another vowel in the stem.
  --NEW--: This has been modified from the original Porter algorithm so that y->i
  is only done when y is preceded by a consonant, but not if the stem
  is only a single consonant, i.e.

     (*c and not c) Y -> I

  So 'happy' -> 'happi', but
    'enjoy' -> 'enjoy'  etc

  This is a much better rule. Formerly 'enjoy'->'enjoi' and 'enjoyment'->
  'enjoy'. Step 1c is perhaps done too soon; but with this modification that
  no longer really matters.

  Also, the removal of the vowelinstem(z) condition means that 'spy', 'fly',
  'try' ... stem to 'spi', 'fli', 'tri' and conflate with 'spied', 'tried',
  'flies' ...
	*/
	if (this.ends("y") && this.j > 0 && this.cons(this.k - 1)) {
		this.b = this.b.slice(0,this.k) + 'i' + this.b.slice(this.k+1);
	}
}

/***
	 In stem(p,i,j), p is a char pointer, and the string to be stemmed
   is from p[i] to p[j] inclusive. Typically i is zero and j is the
   offset to the last character of a string, (p[j+1] == '\0'). The
   stemmer adjusts the characters p[i] ... p[j] and returns the new
   end-point of the string, k. Stemming never increases word length, so
   i <= k <= j. To turn the stemmer into a module, declare 'stem' as
   extern, and delete the remainder of this file.

***/
PorterStemmer.prototype.stemWord = function(p, i, j) {
	var j = j || null;
	
	if (j == null) j = p.length - 1;
	
	// copy the parameters into statics
  this.b = p;
  this.k = j;
  this.k0 = i;

  if (this.pool[this.b.slice(this.k0,this.k+1)]) {
		return this.pool[this.b.slice(this.k0,this.k+1)];	
	}
	
	if (this.k <= this.k0 + 1) {
		return this.b; // --DEPARTURE--		
	}

  // With this line, strings of length 1 or 2 don't go through the
  // stemming process, although no mention is made of this in the
  // published algorithm. Remove the line to match the published
  // algorithm.

	this.step1ab();
	this.step1c();
	// this.step2();
	// this.step3();
	// this.step4();
	// this.step5();
	return this.b.slice(this.k0,this.k+1);
	
}

PorterStemmer.prototype.adjustCase = function(word, stem) {
    lower = word.toLowerCase()
		return lower;
		
		//     ret = ""
		// for (var i = this.k0; i < this.j + 1;i++ ){
		// 	    if (lower[x] == stem[x]) {
		// 	        ret += word[x]
		// 	    } else {
		// 	        ret += stem[x]
		// 	}
		// }
		// return ret;
		
    // for x in xrange(len(stem)):
    //     if lower[x] == stem[x]:
    //         ret += word[x]
    //     else:
    //         ret += stem[x]
    // 
    // return ret
}

PorterStemmer.prototype.stem = function(word) {
  	var s = this.stemWord(word.toLowerCase(), 0, word.length - 1)
		return s;
   	// return this.adjustCase(word, s)	
}
exports.PorterStemmer = PorterStemmer;