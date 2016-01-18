#!flask/bin/python

from flask import Flask, request, jsonify
from random import randint
import json
import sys
from copy import copy

app = Flask(__name__)

words = {}

"""
Import a local json filed named 'words.json' where lists of noun,
verb, adverb and adjective string values are expected
"""
with open('app/server/words.json') as json_file:
    words = json.load(json_file)
    
def _has(obj, name):
    """
    Args:
        ob: a JSON object submitted in a POST request
        name: a string value representing the expected member in the object to check for

    Returns: A boolean value indicating if the member was found in the object (and is not `None`)

    """
    if not obj or not name or name not in obj:
        return False
    if not obj[name] or obj[name] == 'None':
        return False
    else:
        return True


def _filter_list(words, starting_letter):
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

@app.route('/words/v1/list', methods=['GET'])
def getDefaultList():
    """
    Retrieves the default list of words used by this service
    """
    return jsonify(words)    

@app.route('/words/v1/short', methods=['GET'])
def generateShortSentence():
    """
    Create a shortened version of randomly generated words, just the adjective and noun together.
    Optionally, can specifiy a starting character(s) in the query string parameter 'startsWith'
    """
    starting_letter = request.args.get('startsWith')

    wordObj = {}

    wordObj['adjective'] = _filter_list(words['adjectives'], starting_letter)
    wordObj['noun'] = _filter_list(words['nouns'], starting_letter)
    wordObj['sentence'] = "%s %s" % (wordObj['adjective'], wordObj['noun'])
    
    return jsonify(wordObj)


@app.route('/words/v1/full', methods=['GET', 'POST'])
def generateFullSentence():
    """
    Create a sentence of one of each type of randomly generated words (verb, adverb, adjective and noun).
    GET request will use the local dictionary of words to generate from, however POST requests will accept
    lists of certain word types to override the local dictionary.
    Optionally, can restrict the sentence to words of certain type by specifying 'word-type=true' in the query string.
    Optionally, can also specifiy a starting character(s) in the query string parameter 'startsWith'
    """
    starting_letter = request.args.get('startsWith')

    all_types = ['verb', 'adverb', 'adjective', 'noun']
    included_word_types = []

    # If the user specifies one or more word types in the query string, then we
    # switch funcgtionality to generate only those word types they specify.
    for word_type in all_types:
        if request.args.get(word_type):
            included_word_types.append(word_type)

    # By default, one of each word-type will be printed in the final sentence.
    # So, if the user isn't restricting the sentence to specified word types, include all of them.
    if len(included_word_types) == 0:
        included_word_types = all_types
    
    words_copy = copy(words)

    if request.method == 'POST':
        posted_json = request.get_json()
        if _has(posted_json, 'nouns'):
            words_copy['nouns'] = posted_json['nouns']
        if _has(posted_json, 'verbs'):
            words_copy['verbs'] = posted_json['verbs']
        if _has(posted_json, 'adjectives'):
            words_copy['adjectives'] = posted_json['adjectives']
        if _has(posted_json, 'adverbs'):
            words_copy['adverbs'] = posted_json['adverbs']

    wordObj = {}
    sentence = ""
    for word_type in included_word_types:
        wordObj[word_type] = _filter_list(words_copy["%ss" % word_type], starting_letter)
        sentence += "%s " % wordObj[word_type]
    
    wordObj['sentence'] = sentence
    
    return jsonify(wordObj)

if __name__ == '__main__':
    app.debug = True
    app.run(host = '0.0.0.0', port = 5000)