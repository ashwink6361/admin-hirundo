/**
 * @author s.gautam@huulke.com
 * created on 25.01.2018
 */
(function () {
'use strict';
angular.module('BlurAdmin.pages.categories').service('CategoryService', CategoryService);
function CategoryService($q, $http) {
    var _categoryDetails = {};
    var _itemCategoryDetails = {};
    var _subCategoryDetails = '';
    var _activeTab = 0;
    return {
        getCategories: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/category';
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
        getIcons: function(name, offset, limit) {
            var def = $q.defer();
            var url = '/api/category/icons';
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
        addCategory: function(opts) {
            var def = $q.defer();
            var url = '/api/category';
            doPostWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getCategoryDetail: function(id) {
            var def = $q.defer();
            var url = '/api/category/'+id;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getCategoryWithItems: function() {
            var def = $q.defer();
            var url = '/api/category/items';
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateCategory: function(id, opts) {
            var def = $q.defer();
            var url = '/api/category/'+id;
            doPutWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeCategory: function(id) {
            var def = $q.defer();
            var url = '/api/category/'+id;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getCategoryDetails: function() {
            return _categoryDetails;
        },
        setCategoryDetails: function(data) {
            _categoryDetails = data;
        },
        addSubCategory: function(categoryId,opts) {
            var def = $q.defer();
            var url = '/api/category/'+categoryId+'/subcategory';
            doPostWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getSubCategoryDetail: function(subCategoryId,categoryId) {
            var def = $q.defer();
            var url = '/api/category/'+categoryId+'/subcategory/'+subCategoryId;
            doGet($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        updateSubCategory: function(categoryId,subCategoryId, opts) {
            var def = $q.defer();
            var url = '/api/category/'+categoryId+'/subcategory/'+subCategoryId;
            doPutWithImage($q, $http, url, opts).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        removeSubCategory: function(categoryId,subCategoryId) {
            var def = $q.defer();
            var url = '/api/category/'+categoryId+'/subcategory/'+subCategoryId;
            doDelete($q, $http, url).then(function(data) {
                def.resolve(data);
            }).catch(function(error) {
                def.reject(error);
            });
            return def.promise;
        },
        getSubCategoryDetails: function() {
            return _subCategoryDetails;
        },
        setSubCategoryDetails: function(data) {
            _subCategoryDetails = data;
        },
        getItemCategoryDetails: function() {
            return _itemCategoryDetails;
        },
        setItemCategoryDetails: function(data) {
            _itemCategoryDetails = data;
        },       
        setActiveTab: function(tab) {
            _activeTab = tab;
        },
        getActiveTab: function() {
            return _activeTab;
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
    };
}
})();
