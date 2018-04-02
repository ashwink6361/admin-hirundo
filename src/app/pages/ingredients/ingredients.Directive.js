/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
        angular.module('BlurAdmin.pages.ingredient').directive('ingredientList',ingredientList);
        /** @ngInject */
        function ingredientList() {
            return {
                restrict: 'EA',
                controller: 'IngredientController',
                templateUrl: 'app/pages/ingredients/views/list.html'
            };
        }
    })();
    