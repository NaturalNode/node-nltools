/*
A classifier based on the Naive Bayes algorithm.  In order to find the
probability for a label, this algorithm first uses the Bayes rule to
express P(label|features) in terms of P(label) and P(features|label)::

                      P(label) * P(features|label)
 P(label|features) = ------------------------------
                             P(features)

The algorithm then makes the 'naive' assumption that all features are
independent, given the label::
                             
                      P(label) * P(f1|label) * ... * P(fn|label)
 P(label|features) = --------------------------------------------
                                        P(features)

Rather than computing P(featues) explicitly, the algorithm just
calculates the denominator for each label, and normalizes them so they
sum to one::
                             
                      P(label) * P(f1|label) * ... * P(fn|label)
 P(label|features) = --------------------------------------------
                       SUM[l]( P(l) * P(f1|l) * ... * P(fn|l) )
*/
NaiveBayesClassifier = function() {}