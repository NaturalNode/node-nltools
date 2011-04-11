var HunposTagger = require('../lib/tagger').HunposTagger;
var Sentences = require('../lib/analyser').Sentences;

var testCase = require('nodeunit').testCase;

var sentObj = function(p,test) {
	new Sentences(p, function(s){
		s.part(function(s1){
			test(s1);
		});
	});
}

module.exports = testCase({
    setUp: function (callback) {
	
		var _this = this;
			new HunposTagger(
				'/Users/ironman/projects/node_projects/node-nltools/hunpos-1.0/en_wsj.model',
				'/Users/ironman/projects/node_projects/node-nltools/hunpos-1.0/hunpos-tag', 
				function(pos){
					_this.pos = pos;
	        callback();
				}
			);
    },

    tearDown: function (callback) {
			callback();
    },

    interrogative0: function (test) {
			this.pos.tag(['sally','ran','?'], function(posObj) {
				sentObj(posObj,function(sen){					
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by punct.");
					test.done();
				})
			});
    },

    interrogative1: function (test) {
			this.pos.tag(['sally','?'], function(posObj) {
				sentObj(posObj,function(sen){					
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by punct.");
					test.done();
				})
			});
    },

    interrogative2: function (test) {
			this.pos.tag(['?'], function(posObj) {
				sentObj(posObj,function(sen){					
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by punct.");
					test.done();
				})
			});
    },

		// interrogative word (5w's) no punct
    interrogative3: function (test) {
			this.pos.tag("Who ran".split(" "), function(posObj) {
				sentObj(posObj,function(sen){					
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by pos.");
					test.done();
				})
			});
    },

    interrogative4: function (test) {
			this.pos.tag("How did".split(" "), function(posObj) {
				sentObj(posObj,function(sen){					
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by pos.");
					test.done();
				})
			});
    },

		// tag questions ending in possive pronoun
    interrogative5: function (test) {
			this.pos.tag("Oh I must , must I".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by pos.");
					test.done();
				})
			});
    },

		// tag questions ending in possive pronoun
    interrogative6: function (test) {
			this.pos.tag("You want to see that again , do you".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "INTERROGATIVE","Question sentence by pos.");
					test.done();
				})
			});
    },

    command0: function (test) {
			this.pos.tag("Sit down !".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "COMMAND","Command by punct.");
					test.done();
				})
			});
    },

		// implicit you overrides punct.
    command1: function (test) {
			this.pos.tag("shut the hell up .".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "COMMAND","Command by implicit you.");
					test.done();
				})
			});
		},

    declarative0: function (test) {
			this.pos.tag("I think it is time to go .".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "DECLARATIVE","declarative by punct.");
					test.done();
				})
			});
    },

		// Probaby should be command.
    declarative1: function (test) {
			this.pos.tag("Janice , shut the hell up .".split(" "), function(posObj) {
				sentObj(posObj,function(sen){		
					test.equals(sen.type(), "DECLARATIVE","declarative by punct.");
					test.done();
				})
			});
    },


});

