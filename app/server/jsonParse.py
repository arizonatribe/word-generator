#!/usr/bin/python

import sys
from getopt import getopt
import json
from random import randint

def filter_list(words, starting_letter):
    """
        Plucks a single string from a collection matching a given word type,
        optionally restricting the collection to entries beginning with a provided character(s)
    """
    if starting_letter:
        startswith_filter = lambda w : w.startswith(starting_letter)
        filtered_list = filter(startswith_filter, words)
    else:
        filtered_list = words
    
    return filtered_list[randint(0,len(filtered_list) - 1)]

def main(argv):
    """
        Import a local json filed named 'words.json' where lists of noun,
        verb, adverb and adjective string values are expected
    """
    with open('words.json') as json_file:
        words = json.load(json_file)
    
        # if the user specifies a starting character(s), filter based on that
        starting_letter = None
    
        # by default, one of each word-type will be printed in the final sentence
        skip_noun = False
        skip_verb = False
        skip_adjective = False
        skip_adverb = False
    
        if len(argv) > 0:
            opts, args = getopt(argv, "s:nvjb", ["starts-with=", "noun", "verb", "adjective", "adverb"])
            
            has_starts_with = any("-s" in op for op in opts)
            
            # If user specifies word-type filters, then we'll only print out those they explicitly ask for
            if (has_starts_with and len(opts) > 1) or (not has_starts_with and len(opts) > 0):
                skip_noun = True
                skip_verb = True
                skip_adjective = True
                skip_adverb = True
    
            for opt, arg in opts:
                if opt == "-n" or opt == "--noun":
                    skip_noun = False
                if opt == "-v" or opt == "--verb":
                    skip_verb = False
                if opt == "-j" or opt == "--adjective":
                    skip_adjective = False
                if opt == "-b" or opt == "--adverb":
                    skip_adverb = False
                if (opt == "-s" or opt == "--starts-with") and arg:
                    starting_letter = arg
        
        sentence = ""
        
        if not skip_verb:
            sentence += filter_list(words['verbs'], starting_letter)
        if not skip_adverb:
            sentence += " %s" % filter_list(words['adverbs'], starting_letter)
        if not skip_adjective:
            sentence += " %s" % filter_list(words['adjectives'], starting_letter)
        if not skip_noun:
            sentence += " %s" % filter_list(words['nouns'], starting_letter)
        
        print sentence

if __name__ == "__main__":
   main(sys.argv[1:])