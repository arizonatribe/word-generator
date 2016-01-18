(function(angular) {
  'use strict';

  angular.module('cc.words')
    .directive('generateButtons', [function() {
      return {
        restrict: 'E',
        templateUrl: '/templates/generator-buttons.html',
        controller: ['wordsService', function(wordsService) {
          this.wordsService = wordsService;
        }],
        controllerAs: 'ctrlGenerateButtons',
        bindToController: true
      };     
    }]);

})(window.angular);