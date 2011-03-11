var fs = require('fs');
var spawn = require('child_process').spawn;

HunposTagger = function(path_to_model,path_to_bin,callback) {
	
  this._hunpos_model = path_to_model
  this._encoding = HunposTagger._hunpos_charset;
	this._hunpos_bin = path_to_bin;
	this.tags = [];

	var _self = this;
	fs.stat(path_to_model,function(error,file){

		if (error) {
			throw new Error("Not a valid Model");
		}

		_self._hunpos = spawn(_self._hunpos_bin, [_self._hunpos_model]);
				
		_self._hunpos.stderr.on('data', function (data) {
			if (data.toString().match("tagger compiled")) {
				callback(_self);
			}
		});
		
	});	
}

HunposTagger._hunpos_charset = 'ISO-8859-1';

HunposTagger.prototype.tag = function(tokens,callback){

	for (var i = 0; i < tokens.length; i++) {
		this._hunpos.stdin.write(tokens[i] + "\n", encoding='utf8');
	}
	
	this._hunpos.stdin.end();
	
	var chunks = "";
	this._hunpos.stdout.on('data', function (data) {
		chunks  += data.toString();
	});

	var clean_results = [];
	var _self = this;
	this._hunpos.on('exit', function (code) {
		if (code == 0) {
			var tok = chunks.split("\n");
			for (var i = 0; i < tok.length; i++) {
				if (tok[i] == '') continue;
				
				var tok2 = tok[i].split("\t");
				var word = tok2[0];
				var pos = tok2[1];
				clean_results.push({token:word,pos:pos});
			}			
			_self.tags = clean_results
			callback(_self);
		}
	});

}

HunposTagger.prototype._fetchType = function(id) {

	var names = [];
	var result = [];
	var n2 = [];
	
	if (this.neTagged) {
		for (var i = 0; i < this.tags.length;i++) {
			if (this.tags[i].ne == id) {
				result.push(this.tags[i].token);
			} else {
				names.push(result.join(' '));
				result = [];
			}
		}	
	}
	
	for (var i = 0; i < names.length; i++) {
		if (names[i] != "") n2.push(names[i]);
	}

	return n2
}

HunposTagger.prototype.names = function() {
	return this._fetchType("PERSON");
}

HunposTagger.prototype.locations = function() {
	return this._fetchType("LOCATION");
}

HunposTagger.prototype.organizations = function() {
	return this._fetchType("ORGANIZATION");
}

HunposTagger.prototype.misc = function() {
	return this._fetchType("MISC");
}



HunposTagger.prototype.punct = function() {
	function cleanArray(actual){
	  var newArray = new Array();
	  for(var i = 0; i<actual.length; i++){
	      if (actual[i]){
	        newArray.push(actual[i]);
	    }
	  }
	  return newArray;
	}
	var p = this.tags.map(function(t){ if (t.pos == ".") return t;});

	return cleanArray(p)
}


HunposTagger.prototype.toString = function() {
	return this.tags.map(function(t){return t.token}).join(' ');
}

exports.HunposTagger = HunposTagger;