/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.variants').service('VariantService', VariantService);
function VariantService($q, $http) {
    var _variantDetails = {};
    return {
        getVariants: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/variant';
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

        getNotes: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/note';
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
        addVariant: function(opts) {
            var def = $q.defer();
            var url = '/api/variant';
            console.log(opts);
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },

        addNote: function(opts) {
            var def = $q.defer();
            var url = '/api/note';
            console.log(opts);
            doPost($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },

        updateVariant: function(id, opts) {
            var def = $q.defer();
            var url = '/api/variant/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },

        updateNote: function(id, opts) {
            var def = $q.defer();
            var url = '/api/note/'+id;
            doPut($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        
        removeVariant: function(id) {
            var def = $q.defer();
            var url = '/api/variant/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },

        removeNote: function(id) {
            var def = $q.defer();
            var url = '/api/note/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getVariantDetails: function() {
            return _variantDetails;
        },
        setVariantDetails: function(data) {
            _variantDetails = data;
        },
        getNoteDetails: function() {
            return _noteDetails;
        },
        setNoteDetails: function(data) {
            _noteDetails = data;
        },
        getVariantDetail: function(id) {
            var def = $q.defer();
            var url = '/api/variant/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getNoteDetail: function(id) {
            var def = $q.defer();
            var url = '/api/note/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        }
    };
}
})();
