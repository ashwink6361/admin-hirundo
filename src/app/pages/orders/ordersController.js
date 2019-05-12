/**
 * @author s.gautam@huulke.com
 * created on 26.03.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.orders')
    .controller('OrderController', OrderController)
    .controller('datepickerpopupCtrl', datepickerpopupCtrl);

    /** @ngInject */
    function OrderController($scope, $uibModal, $interval, OrderService, AlertService) {
        $scope.ordersList = [];
        $scope.tableList = [];
        $scope.showItemDetail = false;
        $scope.loader = true;
        $scope.filter = {
            date: null
        };
        $scope.tableFilter = {
            date: null
        };
        OrderService.getOrders().then(function(data) {
            $scope.ordersList = OrderService.listOrder();
            $scope.loader = false;            
        }).catch(function(error) {
            $scope.ordersList = [];
            $scope.loader = false;            
        });
        $scope.getOrdersList = function (){
            OrderService.getOrders().then(function(data) {
                $scope.ordersList = data.data;
            }).catch(function(error) {
                $scope.ordersList = [];
            });
        }
        $scope.getTablesList = function (){
            OrderService.getTables().then(function(data) {
                $scope.tableList = data.data;
            }).catch(function(error) {
                $scope.tableList = [];
            });
        }
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
            var ids = [];            
            for (var i = 0; i < order.item.length; i++) {
                items.push(order.item[i].id._id);
                ids.push(order.item[i]._id);                
            }
            var opts = {
                status: status,
                itemId: items,
                id: ids
            };
            OrderService.updateOrder(order._id, opts).then(function(data) {
            }).catch(function(error) {
            });
        };

        $scope.updateItem = function(item, order, status) {
            item.status = status;
            var ids = [];                        
            ids.push(item._id);            
            var opts = {
                id: ids
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

        $scope.changeDate = function (date) {
            OrderService.getOrders(date).then(function(data) {
                $scope.ordersList = OrderService.listOrder();
            }).catch(function(error) {
                $scope.ordersList = [];
            });
        }
        
        $scope.cleardate = function () {
            $scope.filter.date = null;
            OrderService.getOrders().then(function(data) {
                $scope.ordersList = OrderService.listOrder();
            }).catch(function(error) {
                $scope.ordersList = [];
            });
        }
        $scope.changeDate1 = function (date) {
            OrderService.getTables(date).then(function(data) {
                $scope.tableList = data.data;
            }).catch(function(error) {
                $scope.tableList = [];
            });
        }
        $scope.cleardate1 = function () {
            $scope.tableFilter.date = null;
            OrderService.getTables().then(function(data) {
                $scope.tableList = data.data;
            }).catch(function(error) {
                $scope.tableList = [];
            });
        }
    }

    function datepickerpopupCtrl($scope) {
        $scope.open = open;
        $scope.popup1 = {
            opened: false
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.options = {
            showWeeks: false
        };
    
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
    }
})();