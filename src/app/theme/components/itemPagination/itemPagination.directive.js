/**
 * @author p.baboo@huulke.com
 * created on 06.09.2017
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components').directive('itemPagination', itemPagination);

    /** @ngInject */
    function itemPagination() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'app/theme/components/itemPagination/layout.html'
        };
    }
})();
