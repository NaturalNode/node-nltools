
require('../../lib/inherit').Class;
var Set = require('../../lib/util');
var fs = require("fs");
var path = require('path');
var _ = require("underscore")._;
var assert = require('assert');



var WordNetError = function(msg){
  this.name = 'WordNetError';
  Error.call(this, msg);  
}


// var _FILES = ['index.verb','data.verb'];
// var _FILEMAP = {VERB: 'verb'}

var WordNetCorpusReader = module.exports = Class.extend({
  
  init: function(options, callback) {
    
    // TODO : Make these CONST
    this._FILES = ['cntlist.rev', 
                  'lexnames', 
                  'index.sense',
                  'index.adj', 
                  'index.adv', 
                  'index.noun', 
                  'index.verb',
                  'data.adj', 
                  'data.adv', 
                  'data.noun', 
                  'data.verb',
                  'adj.exc', 
                  'adv.exc', 
                  'noun.exc', 
                  'verb.exc'];

    this._FILEMAP = {ADJ: 'adj', ADV: 'adv', NOUN: 'noun', VERB: 'verb'}
    this._EXTMAP  = {'a': 'adj', 's': 'adv', 'n': 'noun', 'v': 'verb'}
    this.ADJ      = 'a';
    this.ADJ_SAT  = 's';
    this.ADV      = 'r';
    this.NOUN     = 'n';
    this.VERB     = 'v';


    
  	this.root = options.root || ".";
  	this._lexnames = [];
  	this._lemma_pos_offset_map = {};
  	this._exception_map = {};
  	this._synset_offset_cache = {};
  	this._data_file_map = {};
    this.callback = callback;
  	
		var _this = this;

		// Load Lexnames
		this.open('lexnames', function(data){
			var lines = data.toString().split(/\n/);
			for (var i = 0; i < lines.length;i++) {
				var line = lines[i].split(/\t/);
				if (line.length === 3) {
					_this._lexnames.push(line[1])
				}
			}
			
      // console.log("Loading lexnames");
      _this._loadLemmaPosOffsetMap();
		});

  },
  
  // This method loads all the data from the index files.
  _loadLemmaPosOffsetMap: function() {
		var _this = this;
		var fileCount = 0;
		_(this._FILEMAP).each(function(suffix) {
				// parse each line of the file (ignoring comment lines)
				_this.open('index.'+ suffix ,function(data){
          data.toString().split("\n").forEach(function(line, i) {
					  
						// If it is not a comment
            if (!/^\s/.test(line)) {
						  
              var lineParts = new Set(line.split(' '));
              
              try {
                
                // get the lemma and part-of-speech
                var lemma = lineParts.next();
							  var pos = lineParts.next();

							  // get the number of synsets for this lemma
							  var n_synsets = parseInt(lineParts.next());

							  // get the pointer symbols for all synsets of this lemma
							  var n_pointers = parseInt(lineParts.next());

							  var _ = [];
							  while (n_pointers > 0) {
							    _.push(lineParts.next());
						      n_pointers--;
							  }
							  
							  // same as number of synsets
							  var n_senses = parseInt(lineParts.next());
							  assert.equal(n_synsets,n_senses, "Should Equal");
							  
								// get number of senses ranked according to frequency
                var _ = parseInt(lineParts.next());

								// get synset offsets
								var synset_offsets = [];

							  while( n_synsets > 0) {
                 synset_offsets.push(parseInt(lineParts.next(),10));
                 n_synsets--;
                }

                // map lemmas and parts of speech to synsets
                if (_this._lemma_pos_offset_map[lemma] == undefined) {
                 _this._lemma_pos_offset_map[lemma] = {};
                }
                
                _this._lemma_pos_offset_map[lemma][pos] = synset_offsets;
                
                if (pos == _this.ADJ){
                 _this._lemma_pos_offset_map[lemma][_this.ADJ_SAT] = synset_offsets;
                }

						  } catch (e) {
						    console.log("TODO: Handle Error", suffix, i, e.name);
                //throw new WordNetError('file %s, line %i: %s', suffix, i, e.name)
						  }
						  

						} 
					}); // Each Line

					fileCount++;
					
					// Once all the files are loaded proceed
					if (fileCount == Object.keys(_this._FILEMAP).length) {

						// load the exception file data into memory
					  _this._loadExceptionMap();
					}
				});	// Process File

		});
    
  },
  
  _loadExceptionMap: function() {
		// load the exception file data into memory
		var _this = this;
		var i = 0;
		_(_this._FILEMAP).each(function(suffix,pos) {

			_this._exception_map[pos] = {};

			_this.open(suffix + '.exc' ,function(data){
				data.toString().split("\n").forEach(function(line){
					var terms = line.split(' ');
					_this._exception_map[pos][terms[0]] = terms.slice(1);
				}); // Each line

				i++;

				if (Object.keys(_this._FILEMAP).length == i) {
					_this._exception_map[_this.ADJ_SAT] = _this._exception_map[_this.ADJ];
					_this.callback(_this);
				}
			}); // Process File
		});		
	},
  
  // Open file
  open: function(name, callback) {
		var _this = this;
		var p = path.join(this.root,name);
		if (!_(callback).isFunction()) {
			throw new Error("No Callback given to process data");
		}

		path.exists(p, function (exists) {
			if (!exists) {
				throw new Error("Wordnet not found at location "+ p)
			}
      
      //console.log("Reading File", p)
      fs.readFile(p, function (err, data) {
        if (err) throw err;
        //console.log("Closing File", p)
				callback(data);
      });
		});
	},
  
  justOpen: function(name, callback) {
  	var _this = this;
  	var p = path.join(this.root,name);
  	if (!_(callback).isFunction()) {
  		throw new Error("No Callback given to process data");
  	}
  	path.exists(p, function (exists) {
  		if (!exists) {
  			throw new Error("Wordnet not found at location "+ p)
  		}

      //console.log("Opening file", p);

  		var str = fs.open(p,"r",function(err,fd){
  			if (err) {
  				console.log(err);
  			}
  			callback(fd);
  		});
  	});
  },
  
  /**
   * Fetches a synet from index offset
   */
  _synsetFromPosAndOffset: function(pos, offset, callback) {
  	var _this = this;
  	// Check to see if the synset is in the cache

    if (_(this._synset_offset_cache[pos]).contains(offset)) {
     callback(self._synset_offset_cache[pos][offset]);
    } 

  	this._dataFile(pos, function(fd){			
  		var buff = new Buffer(4096);
  		fs.read(fd,buff,0,4096,offset,function(err,br,buff){
  			if (err)  { console.log("ERROR Reading File") }

  			var data_line = buff.toString().split('\n')[0];
  			var synset = _this._synsetFromPosAndLine(pos, data_line);
        
  			if (synset.offset != offset) {
  				new Error("synset offset does not match...");
  			} else {
  				if (_this._synset_offset_cache[pos] == undefined) {
  					_this._synset_offset_cache[pos] = [];	
  				}
          _this._synset_offset_cache[pos][offset] = synset;
          callback(synset);            
  			}
  		})
  	});    
  },
  
  _dataFile: function(pos, callback){
    var _this = this;
  	if (pos == _this.ADJ_SAT) pos = _this.ADJ;

    if (this._data_file_map[pos] == null) {
  		var fileid = 'data.' + _this._EXTMAP[pos];
  		_this.justOpen(fileid,function(fd){
  			_this._data_file_map[pos] = fd;
  			callback(fd);
  		});
  	} else {
  		callback(this._data_file_map[pos]);		
  	}
  },
  
  _synsetFromPosAndLine: function(pos, line) {

    var _this = this;
    
  	var synset = new Synset(_this);
    
    console.log(line);
  	var m = line.split('|');
  	var columns_str = m[0], gloss = m[1];

  	// parse out the definitions and examples from the gloss
  	synset.definition = [];
  	synset.examples = [];
  	
  	var gloss_part = gloss.split(';');
    for (var i = 0; i < gloss_part.length; i++) {
      if (gloss_part[i].trim().substr(0,1) == '"') {
        synset.examples.push(gloss_part[i].trim().replace(/\"/g,''));
      } else {
        synset.definition.push(gloss_part[i].trim());
      }
    }



  	// split the other info into fields
  	var parts = columns_str.split(" ");

  	// get the offset
  	synset.offset = parseInt(parts[0],10);

  	// determine the lexicographer file name
  	var lexname_index = parseInt(parts[1]);
    synset.lexname = this._lexnames[lexname_index];
    
  	// get the part of speech
    synset.pos = parts[2];

    // create Lemma objects for each lemma
    var n_lemmas = parseInt(parts[3], 16);
  	var nextOffset = 3;
  	for (var i = 0; i < n_lemmas;i++){
  		// get the lemma name
  		var lemma_name = parts[nextOffset + 1];
  		// get the lex_id (used for sense_keys)
  		nextOffset++
  		var lex_id = parseInt(parts[nextOffset + 1], 16)

  		// If the lemma has a syntactic marker, extract it.
  		var m = lemma_name.match(/(.*?)(\(.*\))?$/);
  		var lemma_name = m[0], syn_mark = m[1];

      // create the lemma object
      lemma = new Lemma(this, synset, lemma_name, lexname_index, lex_id, syn_mark);
      synset.lemmas.push(lemma);
      synset.lemma_names.push(lemma.name);
  		nextOffset++;
  	}
  	
  	
  	// collect the pointer tuples
  	nextOffset++
    var n_pointers = parseInt(parts[nextOffset],10);
    
  	for (var i = 0; i < n_pointers; i++) {
  		var symbol = parts[nextOffset + 1];
  		
  		nextOffset++;
  		var offset = parseInt(parts[nextOffset + 1],10);

  		nextOffset++;
  		var p = parts[nextOffset + 1];

  		nextOffset++;
  		var lemma_ids_str = parts[nextOffset + 1];
      
  		if (lemma_ids_str == '0000') {
  			synset._pointers[symbol] = [];
  			synset._pointers[symbol].push([p, offset]);
  			
  		} else {
  		  if (lemma_ids_str != undefined) {
  		    
          var source_index = parseInt(lemma_ids_str.slice(0,2), 16) - 1;
          var target_index = parseInt(lemma_ids_str.slice(2), 16) - 1;
          var source_lemma_name = synset.lemmas[source_index].name;
          var lemma_pointers = synset._lemma_pointers;
    			// TODO - figure this bit out.

          var tups = lemma_pointers[source_lemma_name, symbol];
    			// 	tups.push((pos, offset, target_index))
  		  }

  		}
  		nextOffset++;
  	}
  	

  	var frame_count = parseInt(parts[nextOffset]);

  	// TODO - Finish parsing data for info
    // the canonical name is based on the first lemma    
    var lemma_name = synset.lemmas[0].name.toLowerCase();
    var offsets = this._lemma_pos_offset_map[lemma_name][synset.pos];

    var sense_index = _(offsets).indexOf(synset.offset)
    synset.name = lemma_name + '.' + synset.pos + '.' + (parseInt(sense_index,10) + 1);

    return synset;
  },
  
  
  /**
   * Main entry point
   */
   
  // Fetch Lemma by Name
  lemma: function(name, callback){
    callback(new Lemma())
  },
  
  
  // Fetch Synset by Name
  synset: function(name, callback){

  	var wp = name.toLowerCase().rsplit('.', 2);
  	var lemma = wp[0], pos = wp[1], synsetIndexStr = wp[2];

    var synsetIndex = parseInt(synsetIndexStr) - 1;
    var offset = this._lemma_pos_offset_map[lemma][pos][synsetIndex];

	  this._synsetFromPosAndOffset(pos, offset, function(synset) {
	    callback(synset);
	  });
  },  
  
});



/**
 * Base class for all wordnet methods
 *
 */
 
var _WordNetObject = Class.extend({

  init: function(){
    
  },
  
  verbGroups: function(callback) {
    this._related('$', callback);
  }
  
  
});



var Synset = _WordNetObject.extend({
  
  
  init: function(wordnetCorpusReader){
    this.wordnetCorpusReader = wordnetCorpusReader;
  	this.lemmas = [];
  	this.lemma_names = [];
  	this._pointers = [];
    this.pos = null;
    this.offset = null;
    this.name = null;
    this.frame_ids = [];
    this.lemma_infos = []; // never used?
    this.definition = null;
    this.examples = [];
    this.lexname = null; // lexicographer name
    this._pointers = {};
    this._lemma_pointers = {};   
  },
  
  hypernyms: function(callback) {
    this._related('@', callback);
  },

  instance_hypernyms: function(callback) {
    this._related('@i', callback);
  },

  hyponyms:function(callback) {
    this._related('~', callback);
  },
  
  verbGroups : function(callback) {
    this._super(callback);
  },
      
  _related: function(relation_symbol, callback) {

    var pointerTuples = this._pointers[relation_symbol];

    // TODO: construct an array fire callback after collection
    for (var i = 0; i < pointerTuples.length; i++) {
      var pos     = pointerTuples[i][0];
      var offset  = pointerTuples[i][1];
            
      this.wordnetCorpusReader._synsetFromPosAndOffset(pos, offset, function(s){
        if (pointerTuples.length == i) {
          callback(s);          
        }
      });
    }
  },
});




var Lemma = _WordNetObject.extend({
  
  
  init: function(wordnetCorpusReader, synset, name, lexname_index, lex_id, syntactic_marker) {
    this.name = name;
    this._wordnet_corpus_reader = wordnetCorpusReader;
    this.name = name;
    this.syntactic_marker = syntactic_marker;
    this.synset = synset;
    this.frame_strings = [];
    this.frame_ids = [];
    this._lexname_index = lexname_index;
    this._lex_id = lex_id;
    this.key = null; // gets set later
    
  },
  
  _related: function(relation_symbol) {
    return relation_symbol;
    
    // var get_synset = self._wordnet_corpus_reader._synset_from_pos_and_offset
    //     return [get_synset(pos, offset).lemmas[lemma_index]
    //             for pos, offset, lemma_index
    //             in self.synset._lemma_pointers[self.name, relation_symbol]]
    
  },
  
    
  derivationallyRelatedForms: function() {
    return this._related('+');
  },

  count: function() {
    // """Return the frequency count for this Lemma"""
    // return self._wordnet_corpus_reader.lemma_count(self)
  },

  antonyms: function() {
    return this._related('!');  
  },
  
  pertainyms: function(){
    return this._related('\\');
  }
})



// TODO: replace with underscore.string
String.prototype.rsplit = function(sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}