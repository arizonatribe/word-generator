(function(angular) {
  'use strict';
  
  angular.module('wg.words')
    .factory('wordListHelper', [
      'wordList', '$http', '$log', 'appConfig',
      WordListHelper
    ]);

  /**
   * WordsListHelper service assists setup an extends functionality of {@link wg.words.wordList wordList} singleton object
   * @ngdoc service
   * @name wg.words.wordListHelper
   * @class
   * @constructor
   * @returns {object}
   * @requires wg.words.wordList
   * @requires $http 
   * @requires $log
   * @requires wg.appConfig
   */
  function WordListHelper(wordList, $http, $log, appConfig) {
    var setDefaults = function() {
          return $http.get(appConfig.baseUrl + 'list').then(function(res) {
            $log.debug('Default word list: ', res);
            return wordList.value.defaults = res.data;
          }).catch(function(error) {
            $log.debug(error);
            throw new Error('Error retrieving default list.');
          });
        };
    
    return {
      setDefaults: setDefaults
    };
  }
})(window.angular);