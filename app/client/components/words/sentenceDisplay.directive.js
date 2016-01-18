(function(angular) {
  'use strict';

  angular.module('cc.words')
    .directive('sentenceDisplay', [function() {
      return {
        restrict: 'E',
        templateUrl: '/templates/sentence-display.html',
        controller: ['sentence', function(sentence) {
          this.sentence = sentence;
        }],
        controllerAs: 'ctrlSentenceDisplay',
        bindToController: true
      };     
    }]);

})(window.angular);