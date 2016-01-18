(function(angular) {
  'use strict';
  
  angular.module('wg.words')
    .value('sentence', {
      value: {
        current: {},
        history: []
      },
      clear: function() {
        if (!this.value.current && this.value.current.sentence) {
          this.value.history.push(this.value.current);
          this.value.current = {};
        }
      },
      setValue: function(val) {
        this.clear();
        if (val && val.sentence) {
          this.value.current = val;
        }
      }
    });
})(window.angular);