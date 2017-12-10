'use strict';

angular.module('webApp.addPost', ['ngRoute', 'firebase'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/addPost/:email', {
                templateUrl: 'addPost/addPost.html',
                controller: 'addPostCtrl'
            })
    }])
    .controller('addPostCtrl', ['$scope', '$routeParams', '$firebaseArray', '$location', '$firebaseAuth', '$mdToast', '$firebaseStorage', function ($scope, $routeParams, $firebaseArray, $location, $firebaseAuth, $mdToast, $firebaseStorage) {

        var loggedInUser = firebase.auth().currentUser;


        if (!loggedInUser) {
            $location.path('/login');
        } else {

            //listen for file selection
            var uploader = document.getElementById('uploader');
            var fileButton = document.getElementById('fileButton');

            $scope.percentageBar = 0;
            $scope.displayMsg = false;
            $scope.fileName = "No images uploaded";
            $scope.selectFile = function (file) {
                if (file != null) {
                    $scope.fileName = file.name;
                    $scope.displayFile = file;
                    $scope.fileList = file;
                    $scope.displayMsg = true;
                }
            }


            $scope.user = $routeParams.email;
            //calling firebase database, reference to the child object 'Article'. If not found,
            //will auto create 1 reference
            var ref = firebase.database().ref().child('Article');

            //firebase array takes in the ref object or query and returns as an array object
            $scope.articles = $firebaseArray(ref);


            //use $add to add data into firebase.
            $scope.createPost = function () {

                var title = $scope.titleTxt;
                var post = $scope.postTxt;

                //upload photos
                var file = $scope.fileList;
                //create firebase storage ref object
                var storageRef = firebase.storage().ref('Photos/' + file.name);
                var storage = $firebaseStorage(storageRef);
                var uploadTask = storage.$put(file);
                //update progress bar
                uploadTask.$progress(function (snapshot) {
                    var percentageUpload = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    var percentage = percentageUpload.toFixed(0);
                    uploader.value = percentage;
                    $scope.percentageBar = percentage;

                })

                uploadTask.$complete(function(snapshot){
                    //add blog post to firebase
                    var imageUrl = snapshot.downloadURL;
                    var imageName = snapshot.metadata.name;
                    $scope.articles.$add({
                        title: title,
                        post: post,
                        imageUrl: imageUrl,
                        imageName: imageName
                    }).then(function (ref) {
                        //clear or reset selections
                        $scope.titleTxt = '';
                        $scope.postTxt = '';
                        $scope.displayFile = '';
                        $scope.fileList = '';
                        $scope.displayMsg = '';
                        $scope.fileName = "No files uploaded";
                        $scope.percentageBar = 0;
                        uploader.value = 0;
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Your blog is posted!')
                                .position('top center')
                                .hideDelay(3000)
                        );
                        $scope.$parent.selectedIndex--;
                    }), function (error) {
                        console.log(error);
                    }

                })


            }


            // fileButton.addEventListener('change', function (e) {
            //     //get file
            //     var file = e.target.files[0];
            //     console.log("file is :", e.target.files);
            //     $scope.displayImage = file;
            //     // $scope.fileList = e.target.files;
            //     //create storage ref
            //     var storageRef = firebase.storage().ref('Photos/' + file.name);
            //     //upload file
            //     var task = storageRef.put(file);
            //     //update progress bar
            //     //subscribe to any state changes that happened when file is being uploaded
            //     task.on('state_changed', function progress(snapshot) {
            //             var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //             uploader.value = percentage;
            //         },
            //         function error(err) {
            //             //edit error messages if error occurs
            //             console.log("An error occurred while uploading the image: ", err);
            //         },
            //         function complete() {
            //             //indicates if upload is complete
            //             console.log("Uploading is complete!");
            //             console.log("snapshot on complete: ", task);
            //         }
            //     )
            //
            // })


        }
    }]);
