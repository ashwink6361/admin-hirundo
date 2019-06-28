/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.rooms')
    .factory('RoomService', RoomService)
    .provider('baRoomService', baRoomServiceProvider);
    
function baRoomServiceProvider() {
    /** @ngInject */
    this.$get = function () {
        return new _factory();
        function _factory() {
            var showCreateModal = false;
            this.setCreateModalCollapsed = function (data) {
                showCreateModal = data;
            };
            this.getCreateModalCollapsed = function () {
                return showCreateModal;
            };
            this.setStepData = function(data) {
                localStorage.setItem('stepData', JSON.stringify(data));
            };
            this.getStepData = function() {
                var data = localStorage.getItem('stepData');
                return JSON.parse(data);
            };
            this.setTabData = function(data) {
                localStorage.setItem('tabData', JSON.stringify(data));        
            };
            this.getTabData = function() {
                var data = localStorage.getItem('tabData');
                return JSON.parse(data);
            };
            this.setOrderId = function(data){
                localStorage.setItem('orderId', JSON.stringify(data));
            };
            this.getOrderId = function(){
                var data = localStorage.getItem('orderId');
                return JSON.parse(data);
            };
            this.setOrderItems = function(data){
                localStorage.setItem('orderItems', JSON.stringify(data));
            };
            this.getOrderItems = function(){
                var data = localStorage.getItem('orderItems');
                return JSON.parse(data);
            };
        }
    };
};

function RoomService($q, $http, $rootScope) {
    var _roomDetails = {};
    var _rooms = [];
    var socket = io.connect(SOCKETURL);
    if (socket.connected)
        var user = JSON.parse(localStorage.getItem('adminUser'));
        if(user){
            socket.emit('connection');  
            socket.on('connected', function (data) {
                if(data && socket.id == data.socketId){
                socket.emit('userAuth', {userId: user._id});           
                socket.on('authConnected', function (data) {
                });
            }
            });
        }
    socket.on('tablestatus', function (data) {
        for (var i = 0; i < _rooms.length; i++) {
            if (data.room._id == _rooms[i]._id) {
                for (var j = 0; j < _rooms[i].tables.length; j++) {
                    if (data.table == _rooms[i].tables[j]._id) {
                        _rooms[i].tables[j].orderId.push(data);
                    }
                }
            }
        }
        $rootScope.$broadcast('tablestatus');        
    });

    socket.on('orderstatus', function (data) {
        for (var i = 0; i < _rooms.length; i++) {
            if (data.room._id === _rooms[i]._id) {
                for (var j = 0; j < _rooms[i].tables.length; j++) {
                    if (data.table == _rooms[i].tables[j]._id) {
                        for (var k = 0; k < _rooms[i].tables[j].orderId.length; k++) {
                            if (data._id == _rooms[i].tables[j].orderId[k]._id) {
                                _rooms[i].tables[j].orderId[k] = data;
                            }
                        }
                    }
                }
            }
        }
        $rootScope.$broadcast('orderstatus');        
    });

    return {
        getRooms: function () {
            var def = $q.defer();
            var url = '/api/room';
            doGet($q, $http, url).then(function (data) {
                _rooms = data.data;
                def.resolve(data);
            }).catch(function (error) {
                _rooms = [];
                def.reject(error);
            });
            return def.promise;
        },
        listRoom: function () {
            return _rooms;
        },
        addRoom: function (opts) {
            var def = $q.defer();
            var url = '/api/room';
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateRoom: function (id, opts) {
            var def = $q.defer();
            var url = '/api/room/' + id;
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeRoom: function (id) {
            var def = $q.defer();
            var url = '/api/room/' + id;
            doDelete($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        getRoomDetails: function () {
            return _roomDetails;
        },
        setRoomDetails: function (data) {
            _roomDetails = data;
        },

        addTable: function (id, opts) {
            var def = $q.defer();
            var url = '/api/room/' + id + '/table';
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeTable: function (id, tableId) {
            var def = $q.defer();
            var url = '/api/room/' + id + '/table/' + tableId;
            doDelete($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateTable: function (id, tableId, opts) {
            var def = $q.defer();
            var url = '/api/room/' + id + '/table/' + tableId;
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        createOrder: function (opts) {
            var def = $q.defer();
            var url = '/api/order';
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        getVariantsAndNotes: function () {
            var def = $q.defer();
            var url = '/api/variantAndNotes';
            doGet($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        getCategories: function () {
            var def = $q.defer();
            var url = '/api/category';
            doGet($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },

        getCategoryWithItems: function () {
            var def = $q.defer();
            var url = '/api/category/itemsByCategory';
            doGet($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateOrder: function (item, orderId) {
            var def = $q.defer();
            var url = '/api/waiter/order';
            var opts = {
                item: item,
                orderId: orderId
            }
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        checkoutOrder: function (id, tableId, orderId, opts) {
            var def = $q.defer();
            var url = '/api/room/checkout/' + id + '/table/' + tableId + '/' + orderId;
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        checkoutTable: function (roomid, tableid, status) {
            var def = $q.defer();
            var url = '/api/orders/checkout/' + roomid + '/' + tableid + '/' + status;
            doGet($q, $http, url).then(function (data) {
              def.resolve(data);
            }).catch(function (error) {
              def.reject(error);
            });
            return def.promise;
          },
        updateNoOfPeople: function (roomId, tableId, opts) {
            var def = $q.defer();
            var url = '/api/room/noOfPeople/' + roomId + '/' + tableId;
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        deleteOrderItem: function (orderId, id) {
            var def = $q.defer();
            var url = '/api/deleteDish/' + orderId + '/' + id;
            doGet($q, $http, url).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        editOrderItem: function (orderId, itemId, opts) {
            var def = $q.defer();
            var url = '/api/updateOrderItem/' + orderId + '/' + itemId;
            doPut($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },
        addArticle: function (opts) {
            var def = $q.defer();
            var url = '/api/addItem';
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },

        printReceipt: function(url,xml){
            var def = $q.defer();
            $http({
                method  : "POST",
                url     : url,
                data    : xml,
                headers : { 'Content-Type': 'text/xml' }
            })
            .success( function(data) {
                def.resolve(data);
            })
            .error(function(data, status, headers, config) {
                def.reject(data);
            });
            return def.promise;
        },

        printInvoiceAndSend: function(roomid,tableid,total,email){
            var def = $q.defer();
            var url = '/api/invoice';
            var opts = {
                "roomID": roomid,
                "tableID": tableid,
                "total": total,
                "email": email
            };
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },        
        
        sendMail: function (opts) {
            var def = $q.defer();
            var url = '/api/send/mail';
            doPost($q, $http, url, opts).then(function (data) {
                def.resolve(data);
            }).catch(function (error) {
                def.reject(error);
            });
            return def.promise;
        },

        printInvoice: function(roomid,tableid,total){
            var def = $q.defer();
            var url = '/api/invoice/' + roomid + '/' + tableid + '/' + total;
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