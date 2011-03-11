
/*
 * This chunker takes pos text 
 */
ChunkParser = function(options,callback) {
	var options = options || {};
	// case sensitive ot not - not working atm
	this.strict = options.strict || true;

	var _self = this;	
	var Client = require('mysql').Client;

	this.client = new Client();
	this.dbName = options.dbName;
	this.nameTable = options.dbTable;

	this.client.user = options.dbUser;
	this.client.password = options.dbPass;

	this.client.connect(function(){
	  _self.client.useDatabase(_self.dbName, function(){
			callback(_self);
		});

	});
}

ChunkParser.prototype.parse = function(data,callback) {
	var _self = this;
	var wl = 1,
	i = 0;
	

	
	
	// Creates a new word based on offset and lenth
	var makeWordFromToken = function(tokens,index,len) {
		var w = [];
		for (var n = 0; n < len; n++) {

			if ((index + n) < tokens.length) {
				w.push(tokens[index + n].token);
			} 
		}
		return w.join(' ');
	}

	var queryWord = function(w,d,ind) {
		
		_self.client.query(
			"SELECT word FROM " + _self.nameTable + " WHERE word COLLATE latin1_general_cs like '"+w+"%';",
			function(err, results) {
		    if (err) { throw err; }
				console.log(results);
				// If more then one result, add a new word and try to reduce it
				if (results.length > 1) {

					if (ind+wl == d.length) {
						console.log("End of List");
						_self.client.end();
						callback(d);
					} else {
						wl++;						
						var nw = makeWordFromToken(d,ind,wl);
						queryWord(nw,d,ind);
					}
				} else 
				// If 1 Match remains, we have found a compound
				if ( results.length  == 1) {
					
					console.log("Match found - Need to verify.")
					
					_self.client.query(
						"SELECT word FROM " + _self.nameTable + " WHERE word COLLATE latin1_general_cs like '"+w+"';",
						secondSelect(wl,d,w,ind)
					);
					
					
					ind = ind + wl;
					 wl = 1;
					console.log("Found ",results[0]);			
					var nw = makeWordFromToken(d,ind,wl);
					console.log(nw);					
					queryWord(nw,d,ind);					
				} else {
					wl = 1;
					ind = ind + wl;
					var nw = makeWordFromToken(d,ind,wl);
					console.log(nw);
					queryWord(nw,d,ind);					
					
				}
			}
		);
	}
		
	var secondSelect = function(wl,d,w,i) {
		return  function(err2, results2) {
	    if (err2) { throw err2; }
			if (results2.length == 1) {
				console.log("WE HAVE A MATCH ",results2[0]);
			} else {
				console.log("MATCH MISS!");
				console.log(i);
				i++;
				wl = 1;

				var nw = makeWordFromToken(d,i,wl);
				console.log(nw);
				queryWord(nw,d,i);
			}
		}
	}
	
	var word = makeWordFromToken(data,i,wl);
	queryWord(word,data,i);

}

exports.ChunkParser = ChunkParser;