/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.ingredient')
        .controller('IngredientController', IngredientController)
        .controller('AddIngredientController', AddIngredientController)
        .controller('ViewIngredientController', ViewIngredientController);

    /** @ngInject */
    function IngredientController($scope, $state, $http, $timeout, IngredientService, AlertService) {
        $scope.name = '';
        $scope.offset = 0;
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        //Fetch Ingredient list
        $scope.getIngredientList = function (name, offset, itemsPerPage) {
            IngredientService.getIngredients(name, offset, itemsPerPage).then(function (data) {
                $scope.ingredients = data.data;
                $scope.totalCount = data.totalCount;
                $scope.totalPageCount = Math.ceil(data.totalCount / itemsPerPage);
            }).catch(function (error) {
                $scope.ingredients = [];
            });
        };

        $scope.goToPage = function (pageNumber) {
            $scope.currentPage = pageNumber;
            $scope.getIngredientList($scope.name, (pageNumber - 1) * $scope.itemsPerPage, $scope.itemsPerPage);
        };

        $scope.searchCategories = function (name) {
            $scope.getIngredientList(name, $scope.offset, $scope.itemsPerPage);
        };

        $scope.getIngredientList($scope.name, $scope.offset, $scope.itemsPerPage);

        //Delete Ingredient
        $scope.removeIngredient = function (id) {
            var result = confirm("Do you really want to delete?");
            if (result) {
                IngredientService.removeIngredient(id).then(function (data) {
                    AlertService.success('ingredientlistmsg', data.message, 4000);
                    $scope.getIngredientList();
                }).catch(function (error) {
                    AlertService.error('ingredientlistmsg', error.message, 4000);
                });
            }
        };

        //View Ingredient
        $scope.viewIngredient = function (data, id) {
            IngredientService.setIngredientDetails(data);
            $state.go('viewingredient', {
                'id': id
            });
        };

        //Edit Ingredient
        $scope.updateIngredient = function (data, id) {
            IngredientService.setIngredientDetails(data);
            $state.go('addingredient', {
                'id': id
            });
        };
    }

    function ViewIngredientController($scope, $stateParams, $state, IngredientService, AlertService) {
        var id = $stateParams.id;
        $scope.ingredientDetail = IngredientService.getIngredientDetails();
        if (!$scope.ingredientDetail)
            $state.go('ingredient');
    }

    function AddIngredientController($scope, $http, $stateParams, $state, $q, $timeout, fileReader, IngredientService, AlertService) {
        $scope.ingredientId = $stateParams.id;
        $scope.Ingredient = {};
        $scope.Ingredient.quantity = 1;
        // $scope.Unit = {
        //     name: '',
        //     quantity: 1
        // };
        $scope.showConfezioneQty = false;
        $scope.showNewInput = false;
        $q.all([
            IngredientService.getUnits()
        ]).then(function (data) {
            $scope.units = data[0].data;
            if ($scope.ingredientId) {
                $scope.Ingredient = IngredientService.getIngredientDetails();
                // for (var i = 0; i < $scope.units.length; i++) {
                    // if ($scope.units[i].name == $scope.Ingredient.unit) {
                        // $scope.Ingredient.unitData = $scope.units[i];
                        if ($scope.Ingredient.unit == 'Confezione') {
                            $scope.showConfezioneQty = true;
                        }
                    // }
                // }
                if (!$scope.Ingredient)
                    $state.go('ingredient');
            }
        });

        $scope.unitChanged = function (data) {
            if (data == 'Confezione') {
                $scope.showConfezioneQty = true;
            } else {
                $scope.showConfezioneQty = false;
            }
        }

        $scope.addUnit = function () {
            if ($scope.Unit.name == '') {
                AlertService.error('ingredientmsg', "Please enter unit", 4000);
                return false;
            }
            var opts = {
                name: $scope.Unit.name,
                quantity: $scope.Unit.quantity ? $scope.Unit.quantity : 1
            }
            IngredientService.addUnit(opts).then(function (data) {
                AlertService.success('ingredientmsg', data.message, 4000);
                IngredientService.getUnits().then(function (data) {
                    $scope.showNewInput = false;
                    $scope.showConfezioneQty = false;
                    $scope.Ingredient.unitData = {};
                    $scope.Unit.name = '';
                    $scope.Unit.quantity = 1;
                    $scope.units = data.data;
                })
            }).catch(function (error) {
                AlertService.error('ingredientmsg', error.message, 4000);
            });
        }

        $scope.ingredientAddRequest = false;
        $scope.addIngredient = function () {
            if (typeof ($scope.Ingredient.unit) == 'undefined') {
                AlertService.error('ingredientmsg', "Please select unit", 4000);
                return false;
            }
            var opts = {
                name: $scope.Ingredient.name,
                description: $scope.Ingredient.description ? $scope.Ingredient.description : '',
                price: $scope.Ingredient.price,
                unit: $scope.Ingredient.unit,
                provider: $scope.Ingredient.provider ? $scope.Ingredient.provider : '',
                quantity: Number($scope.Ingredient.quantity)
            };
            $scope.ingredientAddRequest = true;
            IngredientService.addIngredient(opts).then(function (data) {
                $scope.ingredientAddRequest = false;
                $state.go('ingredient');
            }).catch(function (error) {
                $scope.ingredientAddRequest = false;
                AlertService.error('ingredientmsg', error.message, 4000);
            });
        };

        $scope.editIngredient = function () {
            var opts = {
                name: $scope.Ingredient.name,
                description: $scope.Ingredient.description ? $scope.Ingredient.description : '',
                price: $scope.Ingredient.price,
                unit: $scope.Ingredient.unit,
                provider: $scope.Ingredient.provider ? $scope.Ingredient.provider : '',
                quantity: Number($scope.Ingredient.quantity)
            };
            $scope.ingredientAddRequest = true;
            IngredientService.updateIngredient($scope.ingredientId, opts).then(function (data) {
                $scope.ingredientAddRequest = false;
                $state.go('ingredient');
            }).catch(function (error) {
                $scope.ingredientAddRequest = false;
                AlertService.error('ingredientmsg', error.message, 4000);
            });
        };

        $scope.addNewUnit = function () {
            $scope.showNewInput = !$scope.showNewInput;
            $scope.Unit.name = '';
            $scope.Unit.quantity = 1;
        }
    }
})();