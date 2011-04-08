/**

  A word tokenizer that tokenizes sentences using the conventions
  used by the Penn Treebank.  Contractions, such as "can't", are
  split in to two tokens.  E.g.:

    - can't S{->} ca n't
    - he'll S{->} he 'll
    - weren't S{-} were n't

  This tokenizer assumes that the text has already been segmented into
  sentences.  Any periods -- apart from those at the end of a string --
  are assumed to be part of the word they are attached to (e.g. for
  abbreviations, etc), and are not separately tokenized.

**/
var util = require("util");
var _ = require('underscore')._;


TreebankWordTokenizer = function() {
  // List of contractions adapted from Robert MacIntyre's tokenizer.
  this.CONTRACTIONS2 = [
		/(.)('ll|'re|'ve|n't|'s|'m|'d)\b/ig,
    /\b(can)(not)\b/ig,
    /\b(D)('ye)\b/ig,
    /\b(Gim)(me)\b/ig,
    /\b(Gon)(na)\b/ig,
    /\b(Got)(ta)\b/ig,
    /\b(Lem)(me)\b/ig,
    /\b(Mor)('n)\b/ig,
    /\b(T)(is)\b/ig,
    /\b(T)(was)\b/ig,
    /\b(Wan)(na)\b/ig];
  this.CONTRACTIONS3 = [
		/\b(Whad)(dd)(ya)\b/ig,
		/\b(Wha)(t)(cha)\b/ig];
}

exports.TreebankWordTokenizer = TreebankWordTokenizer;

TreebankWordTokenizer.prototype.tokenize = function(text) {
	_.each(this.CONTRACTIONS2,function(regexp) {
		text = text.replace(regexp,"$1 $2");
	})
	_.each(this.CONTRACTIONS3,function(regexp) {
		text = text.replace(regexp,"$1 $2 $3");
	})

  // Separate most punctuation
  text = text.replace(/([&-]|[\.\!\?])/g, " $1 ");

  // Separate commas if they're followed by space.
	text = text.replace(/(,\s)/," $1");

	// Space out front single quotes if followed by 3 characters
  text = text.replace(/([\'])(\w{3})/g, " $1 $2 ");
	
  // Separate single quotes if they're followed by a space.
	text = text.replace(/('\s)/," $1");

  // Separate periods that come before newline or end of string.
	text = text.replace(/\. *(\n|$)/," . ");
	

	return  _.without(text.split(' '),'');
	
}
