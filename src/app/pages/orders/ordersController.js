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
        $scope.showItemDetail = false;
        OrderService.getOrders().then(function(data) {
            $scope.ordersList = OrderService.listOrder();
        }).catch(function(error) {
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

        $scope.updateOrder = function(order, status) {
            order.status = status;
            var items = [];
            for (var i = 0; i < order.item.length; i++) {
                items.push(order.item[i].id._id)
            }
            var opts = {
                status: status,
                itemId: items
            };
            OrderService.updateOrder(order._id, opts).then(function(data) {
            }).catch(function(error) {
            });
        };

        $scope.updateItem = function(item, order, status) {
            item.status = status;
            var items = [];
            items.push(item.id._id)
            var opts = {
                step: item.step,
                status: status,
                itemId: items
            };
            OrderService.updateOrder(order, opts).then(function(data) {
            }).catch(function(error) {
            });
        };

        var tick = function() {
            $scope.clock = Date.now();
        }
        tick();
        $interval(tick, 1000);

        $scope.checkout = function (roomid,tableid) {
            OrderService.checkoutTable(roomid, tableid).then(function(data) {
                AlertService.success('checkoutmsg', data.message, 4000);
            }).catch(function(error) {
            });
        }
    }
})();