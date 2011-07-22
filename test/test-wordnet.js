
var WordNetCorpusReader = require('../lib/wordnet/wordReader');


new WordNetCorpusReader({root:'./wordnet'},function(wn){
    
  // wn.lemma('zap.v.03.nuke', function(L){
  //  console.log(L.derivationallyRelatedForms())
  // });    

  
  wn.synset('go.v.21', function(move_synset){
    console.log('getting a synset for go');
    console.log(move_synset.name, move_synset.pos, move_synset.lexname);
    console.log(move_synset.lemma_names);
    console.log(move_synset.definition);
    console.log(move_synset.examples);
    
    move_synset.verbGroups(function(group){
      console.log(group.name)
    })
  });
  
  // var fn = function(nav){
  //   console.log(nav.name);
  // }
  // 
  // console.log("Navigations:");
  // wn.synset('travel.v.01',function(S){
  //   S.hypernyms(fn)
  // });
  
  // wn.synset('travel.v.02',function(S){
  //   S.hypernyms(fn)
  // });
  // 
  // wn.synset('travel.v.03',function(S){
  //   S.hypernyms(fn)
  // });
  
});
