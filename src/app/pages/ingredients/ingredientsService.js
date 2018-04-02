/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.ingredient').service('IngredientService', IngredientService);
    function IngredientService($q, $http) {
        var _ingredientDetails = {};

        return {
            getIngredients: function(name, offset, limit) {
                var def = $q.defer();
                var url = '/api/ingredient';
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
            addIngredient: function(opts) {
                var def = $q.defer();
                var url = '/api/ingredient';
                doPost($q, $http, url, opts).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
            getIngredientDetail: function(id) {
                var def = $q.defer();
                var url = '/api/ingredient/'+id;
                doGet($q, $http, url).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
            updateIngredient: function(id, opts) {
                var def = $q.defer();
                var url = '/api/ingredient/'+id;
                doPut($q, $http, url, opts).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
            removeIngredient: function(id) {
                var def = $q.defer();
                var url = '/api/ingredient/'+id;
                doDelete($q, $http, url).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
            getIngredientDetails: function() {
                return _ingredientDetails;
            },
            setIngredientDetails: function(data) {
                _ingredientDetails = data;
            },
            getUnits: function() {
                var def = $q.defer();
                var url = '/api/unit';                         
                doGet($q, $http, url).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
            addUnit: function(opts) {
                var def = $q.defer();
                var url = '/api/unit';
                doPost($q, $http, url, opts).then(function(data) {
                    def.resolve(data);
                }).catch(function(error) {
                    def.reject(error);
                });
                return def.promise;
            },
        };
    }
    })();
    