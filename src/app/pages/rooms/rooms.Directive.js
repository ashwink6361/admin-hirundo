/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.rooms').directive('roomsList', roomsList);
    /** @ngInject */
    function roomsList() {
        return {
            restrict: 'EA',
            controller: 'RoomsController',
            templateUrl: 'app/pages/rooms/views/list.html'
        };
    }
})();
