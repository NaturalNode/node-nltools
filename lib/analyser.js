/*
 Sentences Analizer Class
 From http://www.writingcentre.uottawa.ca/hypergrammar/sntpurps.html

 Take a POS input and analyse it for
  - Type of Sentense
     - Interrogative
     - Declarative
     - Exclamatory 
     - Imperative

  - Parts of a Sentense
     - Subject
     - Predicate

  - Show Preposition Phrases
*/

Sentences = function(pos, callback) {
	this.posObj = pos;
	this.senType = null;
	callback(this);
}

Sentences.prototype.part = function(callback) {
	var subject = [],
		predicat = [],
		verbFound = false;
	
	this.prepositionPhrases();
	
	for (var i = 0; i < this.posObj.tags.length; i++) {
		if (this.posObj.tags[i].pos.match("VB")) {

			if (i == 0) {
				verbFound = true;
			} else {
				// We need to Test for any EX before the VB
				if (this.posObj.tags[i - 1].pos != "EX") {
					verbFound = true;
				} else {
					predicat.push(this.posObj.tags[i].token);
				}					
			}
		}

		if (!verbFound) {
			if (this.posObj.tags[i].pp != true)
				this.posObj.tags[i].spos = "SP";
				subject.push(this.posObj.tags[i].token)
		} else {
			if (this.posObj.tags[i].pp != true)
				this.posObj.tags[i].spos = "PP";
				predicat.push(this.posObj.tags[i].token)
		}
	}
	
	if (subject.length == 0) {
		this.posObj.tags.push({token:"You",spos:"SP",pos:"PRP",added:true});
	}

	callback(this);	
}

// Takes POS and removes IN to NN or NNS
// Adds a PP for each prepositionPhrases
Sentences.prototype.prepositionPhrases = function() {
	var remove = false;

	for (var i = 0; i < this.posObj.tags.length; i++) {
		if (this.posObj.tags[i].pos.match("IN")) {
			remove = true;
		}

		if (remove) {
 			this.posObj.tags[i].pp = true;
		}

		if (this.posObj.tags[i].pos.match("NN")) {
			remove = false;
		}
	}	
}

Sentences.prototype.subjectToString = function() {
	return this.posObj.tags.map(function(t){ if (t.spos == "SP" || t.spos == "S" ) return t.token }).join(' ');
}

Sentences.prototype.predicateToString = function() {
	return this.posObj.tags.map(function(t){ if (t.spos == "PP" || t.spos == "P" ) return t.token }).join(' ');
}

Sentences.prototype.implicitYou = function() {
	
	for (var i = 0; i < this.posObj.tags.length;i++) {
		if (this.posObj.tags[i].added) {
			return true;
		}
	}
	return false;
}

Sentences.prototype.toString = function() {
	return this.posObj.tags.map(function(t){return t.token}).join(' ');
}

// This is quick and incomplete.
Sentences.prototype.type = function(callback) {
	
	var lastElement = this.posObj.punct();
	lastElement = (lastElement.length != 0) ? lastElement.pop() : {};
	
	if (lastElement.pos !== ".") {
		this.senType = (this.implicitYou()) ? "COMMAND" : "UNKNOWN";
	} else {
		switch(lastElement.token) {
			case "?": this.senType = "INTERROGATIVE"; break;
			case "!": this.senType = (this.implicitYou()) ? "COMMAND":"EXCLAMATORY"; break;
			case ".": this.senType = (this.implicitYou()) ? "COMMAND":"DECLARATIVE";	break;
		}
	}
	
	callback(this);
}

exports.Sentences = Sentences;