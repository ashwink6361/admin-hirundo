/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
        angular.module('BlurAdmin.pages.categories').directive('menuTabs', menuTabs);
        /** @ngInject */
        function menuTabs() {
            return {
                restrict: 'EA',
                controller: 'TabController',
                templateUrl: 'app/pages/categories/views/tabs.html'
            };
        }
    })();
    