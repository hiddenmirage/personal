'use strict';

angular.module('webApp.postmain', ['ngRoute', 'ngMaterial', 'firebase', 'ngMessages'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/main/postmain', {
                templateUrl: 'postmain/postmain.html',
                controller: 'postMainCtrl'
            })
    }])

    .controller('postMainCtrl', ['$scope', '$routeParams', '$location', '$firebaseArray', '$firebaseObject', '$firebaseAuth', 'sessionService', 'storeRef', function ($scope, $routeParams, $location, $firebaseArray, $firebaseObject, $firebaseAuth, sessionService, storeRef) {
        var loggedInUser = firebase.auth().currentUser;
        if (!loggedInUser) {
            // User is signed in.
            $location.path('/login');
        } else {
            var postId = sessionService.get(0);
            var postRef = firebase.database().ref().child('Article/' + postId);
            var post = $firebaseObject(postRef);

            storeRef.setVal(postRef);

            postRef.on('value', function (snap) {
                $scope.imageUrl = snap.val().imageUrl;
                $scope.title = snap.val().title;
                $scope.post = snap.val().post;
            })

            $scope.blogHome = function () {
                window.history.back();
            }


            // $scope.imageUrl = post.imageUrl;
        }
    }]);