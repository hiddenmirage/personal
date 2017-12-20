'use strict';

angular.module('webApp.login', [
    'ngRoute',
    'ngMaterial',
    'firebase',
    'ngMessages'
])
    .controller('loginCtrl', ['$scope', '$firebaseAuth', '$location', function ($scope, $firebaseAuth, $location) {

        var auth = $firebaseAuth();
        $scope.errorMessage = "";
        $scope.processLogin = function () {
            var email = $scope.loginForm.email;
            var password = $scope.loginForm.password;


            auth.$signInWithEmailAndPassword(email, password).then(function () {
                //passing email object into URL so that user will not lose info when refreshing
                $location.path('/main');
            }).catch(function (error) {
                console.log(error);
                $scope.errorMessage = "Invalid password or username";
            })
        }

    }])
