/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
    angular.module('BlurAdmin.pages.variants').directive('variantsList', variantsList);
    /** @ngInject */
    function variantsList() {
        return {
            restrict: 'EA',
            controller: 'VariantController',
            templateUrl: 'app/pages/variants-notes/views/list.html'
        };
    }
})();
