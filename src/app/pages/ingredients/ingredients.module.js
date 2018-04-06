(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ingredient', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('ingredient', {
        url: '/ingredient',
        templateUrl: 'app/pages/ingredients/views/list.html',
        title: 'Editor Menu',
        controller: 'IngredientController',        
      })
      .state('addingredient', {
        url: '/ingredient/add/:id',
        templateUrl: 'app/pages/ingredients/views/add.html',
        title: 'Editor Menu',
        controller: 'AddIngredientController',
      })
      .state('viewingredient', {
        url: '/ingredient/{id}',
        templateUrl: 'app/pages/ingredients/views/view.html',
        title: 'Editor Menu',
        controller: 'ViewIngredientController',
      });
  }
})();