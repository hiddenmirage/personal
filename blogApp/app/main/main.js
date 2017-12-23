'use strict';

angular.module('webApp.main', ['ngRoute', 'ngMaterial', 'firebase', 'ngMessages'])
    .controller('MainCtrl', ['$scope', '$routeParams', '$location', '$firebaseArray', '$firebaseObject', '$firebaseAuth', 'postValue', 'storeRef', '$mdDialog', 'sessionService', function ($scope, $routeParams, $location, $firebaseArray, $firebaseObject, $firebaseAuth, postValue, storeRef, $mdDialog, sessionService) {
        var loggedInUser = firebase.auth().currentUser;


        // if (!loggedInUser) {
        //     // User is signed in.
        //     $location.path('/login');
        // } else {


        $scope.readMore = function (article) {
            sessionService.set(0, article.$id);

            $location.path('/main/postmain');
            return;
        }

        //populate all the posts to the page
        $scope.user = $routeParams.email;
        var ref = firebase.database().ref().child('Article');
        $scope.articles = $firebaseArray(ref);

        //store this ref so that you can destroy later when user clicks logout
        storeRef.setVal(ref);

        //edit a particular post in the page
        $scope.editPost = function (ev, id) {

            $mdDialog.show({
                templateUrl: 'dialog/editPostDialog.html',
                controller: EditPostCtrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {dataToPass: id}
            })

            function EditPostCtrl($scope, $mdDialog, dataToPass) {
                $scope.myPost = dataToPass;
                var ref = firebase.database().ref().child('Article/' + dataToPass);
                $scope.editPostData = $firebaseObject(ref);

                $scope.updatePost = function () {
                    var ref = firebase.database().ref().child('Article/' + id);
                    ref.update({
                        title: $scope.editPostData.title,
                        post: $scope.editPostData.post
                    })
                    //update or edit post only once
                    ref.off();
                    $mdDialog.hide();
                }
                $scope.cancelPost = function () {
                    $mdDialog.hide();
                }

            }

        }


        $scope.deletePost = function (articleToBeDeleted) {
            $scope.deleteArticle = articleToBeDeleted;
            postValue.setVal(articleToBeDeleted);
        }

        $scope.deletePostConf = function () {
            var deleteArticle = postValue.getVal();
            $scope.articles.$remove($scope.articles.$getRecord(deleteArticle.$id));
            //hide dialog
            $('#deleteModal').modal('hide');
        }

        // }

    }])


    .service('postValue', ['$location', function ($location) {
        var numVal = "";
        return {
            getVal: function () {
                return numVal;
            },
            setVal: function (value) {
                numVal = value;
            }
        };
    }])

    .service('storeRef', [function () {
        var refVal = "";
        return {
            getVal: function () {
                return refVal;
            },
            setVal: function (value) {
                refVal = value;
            }
        };
    }])

    .service('sessionService', function ($window) {
        var service = this;
        var sessionStorage = $window.sessionStorage;

        service.get = function (key) {
            return sessionStorage.getItem(key);
        };

        service.set = function (key, value) {
            sessionStorage.setItem(key, value);
        };

        service.unset = function (key) {
            sessionStorage.removeItem(key);
        };
    })

;

