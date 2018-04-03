/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.rooms').service('RoomService', RoomService);
function RoomService($q, $http) {
    var _roomDetails = {};
    var _rooms = [];

    var socket = io.connect(SOCKETURL);
    if(socket.connected)
    console.log("Socket Connection Done");
    socket.on('tablestatus', function(data) {
        console.log('data',data);
        if(data.who != 'admin') {
            for(var i=0; i<_rooms.length; i++) {
                for(var j=0; j<_rooms[i].tables.length; j++) {
                    if(data.id === _rooms[i].tables[j]._id) {
                        console.log(' _rooms[i].tables[j]._id', _rooms[i].tables[j]._id);
                        _rooms[i].tables[j].status = data.status;
                    }
                }
                console.log(' _rooms[i].tables[j].status', _rooms[i].tables[j].status);
                // if(data.id === _rooms[i]._id) {
                //     _rooms[i].status = data.status;
                // }
            }
        }
    });
    return {
        getRooms: function() {
            var def = $q.defer();
            var url = '/api/room';
            doGet($q, $http, url).then(function(data) {
                _rooms = data.data;
                def.resolve(data);
            }).catch(function(error) {
                _rooms = [];
                def.reject(error);
            });
            return def.promise;
        },
        listRoom: function() {
            return _rooms;
        },
        addRoom: function(opts) {
            var def = $q.defer();
            var url = '/api/room';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateRoom: function(id, opts) {
            var def = $q.defer();
            var url = '/api/room/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeRoom: function(id) {
            var def = $q.defer();
            var url = '/api/room/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getRoomDetails: function() {
            return _roomDetails;
        },
        setRoomDetails: function(data) {
            _roomDetails = data;
        },
        addTable: function(id,opts) {
            var def = $q.defer();
            var url = '/api/room/'+id+'/table';
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeTable: function(id,tableId) {
            var def = $q.defer();
            var url = '/api/room/'+id+'/table/'+tableId;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateTable: function(id,tableId,opts) {
            var def = $q.defer();
            var url = '/api/room/'+id+'/table/'+tableId;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
