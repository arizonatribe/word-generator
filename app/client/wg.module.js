(function(angular) {
  'use strict';

  var wgApp = angular.module('wg', ['wg.words']),
      initInjector = angular.injector(['ng']),
      $http = initInjector.get('$http'),
      $log = initInjector.get('$log'),
      configNotFound = function(additionalError) {
        $log.debug('Unable to find configuration settings. Please make sure a "config.json" file exists in your "config" directory.');
        if (additionalError) $log.debug(additionalError);
      };

  $http.get('config/config.json')
    .then(function(response) {
      if (typeof response.data !== 'object') {
        configNotFound();
      } else {
        $log.debug('bootstrap config.json: ', response.data);
        var baseUrl = '';

        ['host', 'port', 'name', 'version'].forEach(function(param) {
          if (response.data[param]) {
            baseUrl += param + (param === 'host' ? ':' : '/');
          }
        });

        /**
         * Non-changing values obtained from local config files and used throughout the site
         * for things like API calls, URLs, etc.
         * @ngdoc constant
         * @name wg.appConfig
         * @constant
         * @type {object}
         */
        wgApp.constant('appConfig', angular.extend(response.data, {
          baseUrl: baseUrl
        }))
        .run(['wordListHelper', function(wordListHelper) {
          wordListHelper.setDefaults();
        }]);
      }
    }, configNotFound.bind(null)
  ).catch(function(err) {
    configNotFound(err);
  })
  .finally(function() {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['wg']);
    });
  });
})(window.angular);