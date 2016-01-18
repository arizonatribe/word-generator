(function(angular) {
  'use strict';
  
  angular.module('wg.words')
    .value('wordList', {
      value: {
        defaults: {},
        overrides: {}
      },
      isEmpty: function() {
        return (!this.overrides.nouns || !this.overrides.nouns.length) &&
          (!this.overrides.verbs || !this.overrides.verbs.length) &&
          (!this.overrides.adverbs || !this.overrides.adverbs.length) &&
          (!this.overrides.adjectives || !this.overrides.adjectives.length);
      },
    });
})(window.angular);