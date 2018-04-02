'use strict';

//Common function to call the Get services
function doGet($q, $http, url) {
    var def = $q.defer();
    $http({
        method: "GET",
        url: url,
        headers : { 'Content-Type': 'application/json; charset=UTF-8' }
    })
    .success( function(data, status, headers, config) {
        def.resolve(data);
    })
    .error(function(data, status, headers, config) {
        def.reject(data);
    });
    return def.promise;
}

function doDelete($q, $http, url) {
    var def = $q.defer();
    $http({
        method: "DELETE",
        url: url,
        headers : { 'Content-Type': 'application/json; charset=UTF-8' }
    })
    .success( function(data, status, headers, config) {
        def.resolve(data);
    })
    .error(function(data, status, headers, config) {
        def.reject(data);
    });
    return def.promise;
}

function doPost($q, $http, url, opts) {
    var def = $q.defer();
    $http({
        method: "POST",
        url: url,
        data    : opts,
        headers : { 'Content-Type': 'application/json; charset=UTF-8' }
    })
    .success( function(data) {
        def.resolve(data);
    })
    .error(function(data, status, headers, config) {
        def.reject(data);
    });
    return def.promise;
}
function doPut($q, $http, url, opts) {
    var def = $q.defer();
    $http({
        method: "PUT",
        url: url,
        data    : opts,
        headers : { 'Content-Type': 'application/json; charset=UTF-8' }
    })
    .success( function(data) {
        def.resolve(data);
    })
    .error(function(data, status, headers, config) {
        def.reject(data);
    });
    return def.promise;
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function doPostWithImage($q, $http, url, opts) {
    var def = $q.defer();
    var fd = new FormData();
    for (var key in opts) {
        fd.append(key, opts[key]);
    }
    $http.post(APIURL.replace('/api/','')+url, fd, {
        transformRequest: angular.identity,
        headers: {'Authorization': 'Bearer '+getCookie('session'), 'privatekey': APIKEY, 'Content-Type': undefined}
    }).success( function(data) {
        def.resolve(data);
    }).error(function(error) {
        def.reject(error);
    });
    return def.promise;
}

function doPutWithImage($q, $http, url, opts) {
    var def = $q.defer();
    var fd = new FormData();
    for (var key in opts) {
        fd.append(key, opts[key]);
    }
    $http.put(APIURL.replace('/api/','')+url, fd, {
        transformRequest: angular.identity,
        headers: {'Authorization': 'Bearer '+getCookie('session'), 'privatekey': APIKEY, 'Content-Type': undefined}
    }).success( function(data) {
        def.resolve(data);
    }).error(function(error) {
        def.reject(error);
    });
    return def.promise;
}

//Define the Global Namespace
angular.module('BlurAdmin', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'pascalprecht.translate',
  'color.picker',
  'angular-progress-button-styles',
  'angular-img-cropper',
  // 'ghiscoding.validation',
  'BlurAdmin.theme',
  'BlurAdmin.pages',
  'ngImageCompress',
  'mj.scrollingTabs',
  'angucomplete-alt'
]).config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/i18n/',// path to translations files
        suffix: '.json'//suffix, currently- extension of the translations
    });
    // The default language is applied on first load
    $translateProvider.preferredLanguage('en');
});
