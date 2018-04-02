/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.items').service('ItemService', ItemService);
function ItemService($q, $http) {
    var _itemDetails = {};

    return {
        getItems: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/item';
            if(name) {
                url += '?name='+name;
            }
            if(offset) {
                if(url.indexOf("?") > -1) {
                    url += '&offset='+offset;
                } else {
                    url += '?offset='+offset;
                }
            }
            if(limit) {
                if(url.indexOf("?") > -1) {
                    url += '&limit='+limit;
                } else {
                    url += '?limit='+limit;
                }
            }
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getIngredients: function() {
            var def = $q.defer();
            var url = '/api/ingredient';            
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getCategories: function() {
            var def = $q.defer();
            var url = '/api/category';            
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getAllergens: function() {
            var def = $q.defer();
            var url = '/api/allergen/icons';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        addItem: function(opts) {
            var def = $q.defer();
            var url = '/api/item';
            console.log(opts);
            doPostWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getItemDetail: function(id) {
            var def = $q.defer();
            var url = '/api/item/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateItem: function(id, opts) {
            var def = $q.defer();
            var url = '/api/item/'+id;
            doPutWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeItem: function(id) {
            var def = $q.defer();
            var url = '/api/item/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getItemDetails: function() {
            return _itemDetails;
        },
        setItemDetails: function(data) {
            _itemDetails = data;
        }
    };
}
})();
