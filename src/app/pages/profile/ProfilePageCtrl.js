/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl)
    .controller('datepickerpopupCtrl', datepickerpopupCtrl);
  /** @ngInject */
  function ProfilePageCtrl($scope, $rootScope, fileReader, $filter, $uibModal, ProfileService, AlertService) {
    $scope.picture = '';
    $scope.Profile = {};
    $scope.Profile.gender = 'M';
    $scope.image1 = {};
    $scope.image1.compressed = {
      dataURL: ''
    };
    ProfileService.getDetails().then(function (data) {
      $scope.Profile = data.data;
      if ($scope.Profile.adminType == 1) {
        $scope.Profile.dob = new Date(data.data.dob);
      }
    }).catch(function (error) {
      AlertService.error('profilemsg', error.message, 4000);
    });

    $scope.uploadPicRequest = false;
    $scope.uploadProfilePic = function () {
      if (!$scope.image1.compressed.dataURL) {
        AlertService.error('profilemsg', "Please attach profile picture that is missing", 4000);
        return false;
      }
      $scope.uploadPicRequest = true;
      var datauri = $scope.image1.compressed.dataURL.split(',')[1];
      var binary = atob(datauri);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      $scope.profilePic = new File([new Uint8Array(array)], 'profile_pic.jpg', {
        type: 'image/jpg'
      });
      var opts = {
        picture: $scope.profilePic
      };
      ProfileService.addProfilePicture(opts).then(function (data) {
        $scope.uploadPicRequest = false;
        $rootScope.$broadcast('profilePicUpdated');
        AlertService.success('profilemsg', data.message, 4000);
        $scope.profilePic = '';
        $scope.image1.compressed.dataURL = '';
        document.getElementById("uploadFile").value = "";
        ProfileService.getDetails().then(function (data) {
          $scope.Profile = data.data;
          if ($scope.Profile.adminType == 1) {
            $scope.Profile.dob = new Date(data.data.dob);
          }
        }).catch(function (error) {
          AlertService.error('profilemsg', error.message, 4000);
        });
      }).catch(function (error) {
        $scope.uploadPicRequest = false;
        AlertService.error('profilemsg', error.message, 4000);
      });
    }

    $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
      var location = $scope.Profile.address.getPlace().geometry.location;
      $scope.Profile.address = $scope.Profile.address.getPlace().formatted_address;
      $scope.lat = location.lat();
      $scope.lng = location.lng();
      $scope.$apply();
    });

    $scope.updateRequest = false;
    $scope.updateProfile = function () {
      var opts = {
        firstName: $scope.Profile.firstName,
        lastName: $scope.Profile.lastName ? $scope.Profile.lastName : '',
        mobile: $scope.Profile.mobile,
        contactNumber: $scope.Profile.contactNumber ? $scope.Profile.contactNumber : '',
        gender: $scope.Profile.gender ? $scope.Profile.gender : 'M'
      };
      if ($scope.Profile.dob) {
        opts.dob = $scope.Profile.dob.toISOString();
      }
      if ($scope.Profile.address) {
        opts.address = $scope.Profile.address;
        opts.lat = $scope.lat;
        opts.lng = $scope.lng;
      }
      $scope.updateRequest = true;
      ProfileService.updateProfile(opts).then(function (data) {
        $scope.updateRequest = false;
        AlertService.success('profilemsg', data.message, 4000);
      }).catch(function (error) {
        $scope.updateRequest = false;
        AlertService.error('profilemsg', error.message, 4000);
      });
    };
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

    $scope.open1 = function () {
      $scope.popup1.opened = true;
    };
  }
})();