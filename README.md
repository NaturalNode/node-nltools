# Natural Language Tools

## Abstract

After leaning about IBM's Watson *1, and reading Mind vs Machine *2, I wanted to better understand the state of Natural Language Processing, 
Artificial Intelligence and Natural Language Generation. This project is not a port of any existing libraries, although it does contain some 
code ported from Pythons NLTK, it serves more of a glue layer between existing tools, ideas and projects already used today.

* 1 http://en.wikipedia.org/wiki/Watson_(artificial_intelligence_software)
* 2 http://www.theatlantic.com/magazine/archive/2011/03/mind-vs-machine/8386/


## Setup

Download, fork or clone the code, setup the 2 dependancies below.

* To use the POS Tagger download and install from http://code.google.com/p/hunpos/
* To use the Named Entity Tagger download and install from http://nlp.stanford.edu/software/CRF-NER.shtml

## What's Included

### Tokenization 
   - SpaceTokenizer
   - TabTokenizer
   - WordTokenizer
   
### POS Tagger (Parts of Speech Tagger)
   - HunposTagger
      - Project Home http://code.google.com/p/hunpos/ (DEPENDANCY)
      - 38 POS Tags http://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html

### NE Tagger (Named Entity Tagger)
  - The Stanford Named Entity Recognizer - http://nlp.stanford.edu/software/CRF-NER.shtml (DEPENDANCY)
    - Download and run the Java Server
    - java -mx600m -cp stanford-ner.jar edu.stanford.nlp.ie.NERServer -loadClassifier classifiers/ner-eng-ie.crf-4-conll-distsim.ser.gz -port 8000
 
### Sentence Analyses
  - Break a sentence down into different parts, subject, predicate etc.
 
## What's Not yet Included

### Wiki Tagger
  - Pass results though Google for "Best" wiki link or YQL
    - Notate the POS Object with the attribute.

### Sentence Boundary Detection
 - http://www.attivio.com/blog/57-unified-information-access/263-doing-things-with-words-part-two-sentence-boundary-detection.html
 - NLTK Source http://code.google.com/p/nltk/source/browse/trunk/nltk/nltk/tokenize/punkt.py
