/**
 * @author p.baboo@huulke.com
 * created on 26.03.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.orders').factory('OrderService', OrderService);

    function OrderService($q, $http) {
        var _orders = [];
        var socket = io.connect(SOCKETURL);
        if (socket.connected)
            console.log("Socket Connection Done");
            var user = JSON.parse(localStorage.getItem('adminUser'));
            if(user){
                socket.emit('connection');  
                console.log('user',user);                               
                socket.on('connected', function (data) {
                    console.log('connected',data);            
                    if(data && socket.id == data.socketId){
                    socket.emit('userAuth', {userId: user._id});           
                    socket.on('authConnected', function (data) {
                            console.log('authConnected',data);            
                    });
                }
                });
            }
        socket.on('neworder', function (data) {
            _orders.push(data);
        });
        socket.on('orderstatus', function (data) {
            for (var i = 0; i < _orders.length; i++) {
                if (data._id === _orders[i]._id) {
                    _orders[i] = data;
                    // for (var j = 0; j < _orders[i].item.length; j++) {
                    //     if (data.order.itemId === _orders[i].item[j].id._id && data.order.step === _orders[i].item[j].step) {
                    //         _orders[i].item[j].status = data.order.status;
                    //     }
                    // }
                }
            }
        });
        socket.on('newItem', function (data) {
            for (var i = 0; i < _orders.length; i++) {
                if (data._id === _orders[i]._id) {
                    _orders[i] = data;
                }
            }
        });
        return {
            getOrders: function (id) {
                var def = $q.defer();
                var url = '/api/orders'
                doGet($q, $http, url).then(function (data) {
                    _orders = data.data;
                    def.resolve(data);
                }).catch(function (error) {
                    _orders = [];
                    def.reject(error);
                });
                return def.promise;
            },
            listOrder: function () {
                return _orders;
            },
            getOrderDetail: function (id) {
                var def = $q.defer();
                var url = '/api/orders/' + id;
                doGet($q, $http, url).then(function (data) {
                    def.resolve(data);
                }).catch(function (error) {
                    def.reject(error);
                });
                return def.promise;
            },
            updateOrder: function (id, opts) {
                var def = $q.defer();
                var url = '/api/orders/' + id;
                doPut($q, $http, url, opts).then(function (data) {
                    def.resolve(data);
                }).catch(function (error) {
                    def.reject(error);
                });
                return def.promise;
            },
            checkoutTable: function (roomid, tableid) {
                var def = $q.defer();
                var url = '/api/orders/checkout/' + roomid + '/' + tableid;
                doGet($q, $http, url).then(function (data) {
                    def.resolve(data);
                }).catch(function (error) {
                    def.reject(error);
                });
                return def.promise;
            }
        };
    }
})();