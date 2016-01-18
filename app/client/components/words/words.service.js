(function(angular) {
  'use strict';

  angular.module('wg.words').factory('wordsService', [
    '$http', '$log', 'wordList', 'appConfig',
    WordsService
  ]);

  /**
   * WordsService defines functionality for communicating with word-generating APIs
   * @ngdoc service
   * @name wg.words.wordsService
   * @class
   * @constructor
   * @returns {object}
   * @requires $http 
   * @requires $log
   * @requires wg.words.wordList
   * @requires wg.appConfig
   */
  function WordsService($http, $log, wordList, appConfig, sentence) {
        /**
         * Retrieves a full sentence from the API
         * @method wg.words.wordsService#getSentence
         * @returns {object} A promise that resolves when the user API call completes
         */
    var getSentence = function() {
          return $http.get(appConfig.baseUrl + 'full').then(function(res) {
            $log.debug('Generated sentence: ', res);
            sentence.setValue(res);
            return res.sentence;
          }).catch(function(error) {
            $log.debug(error);
            throw new Error('Error retrieving sentence.');
          });
        },
        /**
         * Retrieves a shortened sentence (just noun and adjective) from the API
         * @method wg.words.wordsService#getShortSentence
         * @returns {object} A promise that resolves when the user API call completes
         */
        getShortSentence = function() {
          return $http.get(appConfig.baseUrl + 'short').then(function(res) {
            $log.debug('Generated shortened sentence: ', res);
            sentence.setValue(res);
            return res.sentence;
          }).catch(function(error) {
            $log.debug(error);
            throw new Error('Error retrieving shortened sentence.');
          });
        },
        /**
         * Retrieves a sentence but provides the API with a list(s) of restricted words to use
         * @method wg.words.wordsService#getSentenceFromProvidedList
         * @returns {object} A Promise that resolves when the user API call completes
         */
        getSentenceFromProvidedList = function() {
          if (!wordList.overrides || wordList.overrides.isEmpty()) {
            throw new Error('You have not provided any words to override the defaults.');
          }
  
          return $http.post(
            appConfig.baseUrl + 'full',
            wordList.overrides, {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          ).then(function(res) {
            $log.debug('Generated full sentence from overrides: ', res);
            sentence.setValue(res);
            return res.sentence;
          }).catch(function(error) {
            $log.debug(error);
            throw new Error('Error retrieving sentence with the lists you provided.');
          });
        };
  
    return {
      getSentence: getSentence,
      getShortSentence: getShortSentence,
      getSentenceFromProvidedList: getSentenceFromProvidedList
    };
  }
})(window.angular);
