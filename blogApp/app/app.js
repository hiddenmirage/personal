'use strict';

// Declare app level module which depends on views, and components
//inject webapp login, so that routeprovider will recognise the
//login controller
angular.module('webApp', [
    'ngRoute',
    'webApp.login',
    'webApp.main',
    'webApp.addPost',
    'webApp.editPostDialog',
    'webApp.postmain',
    'ngMaterial',
    'ngFileUpload'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

    $routeProvider.otherwise({redirectTo: '/login'});

}])
    .controller('indexCtrl', ['$scope', '$routeParams', '$location', '$firebaseArray', '$firebaseObject', '$firebaseAuth', 'storeRef', '$mdToast', function ($scope, $routeParams, $location, $firebaseArray, $firebaseObject, $firebaseAuth, storeRef, $mdToast) {
        $scope.showNavBar = false;
        var loggedInUser = firebase.auth().currentUser;

        if (loggedInUser) {
            $scope.showNavBar = true;
        }

        $scope.processLogout = function ($scope) {
            var auth = $firebaseAuth();
            var getRef = storeRef.getVal();
            console.log("getRef is: ",getRef);
            if (getRef != '') {
                auth.$signOut().then(function () {
                    //destroy all reference objects that is created in the blog
                    getRef.off();
                    console.log("user has logged out");
                    //destroy all factory data inside storeRef
                    storeRef.setVal('');
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('You have logged out')
                            .position('top center')
                            .hideDelay(3000)
                    );
                    $location.path('/login');
                }).catch(function (error) {
                    console.log(error);
                    $scope.errorMessage = "Cannot logout successfully";
                })
            }else{
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('You are already logged out!')
                        .position('top center')
                        .hideDelay(3000)
                );
            }
        }
    }])
;
