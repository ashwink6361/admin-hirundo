/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.settings').directive('addSeat', addSeat);
    /** @ngInject */
    function addSeat() {
        return {
            restrict: 'EA',
            controller: 'SettingsController',
            templateUrl: 'app/pages/settings/views/addSeat.html'
        };
    }
})();
