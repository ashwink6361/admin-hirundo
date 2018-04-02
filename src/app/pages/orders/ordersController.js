/**
 * @author p.baboo@huulke.com
 * created on 26.03.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.orders').controller('OrderController', OrderController);

    /** @ngInject */
    function OrderController($scope, $uibModal, $state, $http, $timeout, $interval, OrderService, AlertService) {
        $scope.ordersList = [];
        OrderService.getOrders().then(function(data) {
            $scope.ordersList = OrderService.listOrder();
        }).catch(function(error) {
            console.log("Error ", error);
        });

        $scope.getOrderStatus = function(status) {
            var str = 'In progress';
            switch(status) {
                case 0 :
                    str = 'New order'; break;
                case 1:
                    str = 'Delivered'; break;
                case 2:
                    str = 'Prepared'; break;
                case 3:
                    str = 'Cancelled'; break;
                case 4:
                    str = 'In progress'; break;
                default:
                    break;
            }

            return str;
        };

        $scope.openPopup = function(order, page, size) {
            $scope.activeOrder = order;
            $scope.editTableInstance = $uibModal.open({
                scope: $scope,
                animation: true,
                templateUrl: page,
                size: size
            });
        };

        $scope.updateOrder = function(status) {
            $scope.activeOrder.status = status;
            OrderService.updateOrder($scope.activeOrder._id, {status: status}).then(function(data) {
                console.log("Order updated", data);
            }).catch(function(error) {

            });
        };

        var tick = function() {
            $scope.clock = Date.now();
        }
        tick();
        $interval(tick, 1000);
    }

})();
