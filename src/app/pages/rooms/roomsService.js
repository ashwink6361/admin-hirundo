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
    var showCreateModal = false;
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
        }
    };
};

function RoomService($q, $http) {
    var _roomDetails = {};
    var _rooms = [];
    var socket = io.connect(SOCKETURL);
    if (socket.connected)
        console.log("Socket Connection Done");
    socket.on('tablestatus', function (data) {
        for (var i = 0; i < _rooms.length; i++) {
            if (data.room == _rooms[i]._id) {
                for (var j = 0; j < _rooms[i].tables.length; j++) {
                    if (data.table == _rooms[i].tables[j]._id) {
                        _rooms[i].tables[j].status = data.status;
                    }
                }
            }
        }
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
        setStepData: function(data) {
            localStorage.setItem('stepData', JSON.stringify(data));
        },
        getStepData: function() {
            var data = localStorage.getItem('stepData');
            return JSON.parse(data);
        },
        setTabData: function(data) {
            localStorage.setItem('tabData', JSON.stringify(data));        
        },
        getTabData: function() {
            var data = localStorage.getItem('tabData');
            return JSON.parse(data);
        }
    };
}
})();