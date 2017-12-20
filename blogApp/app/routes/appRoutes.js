angular.module('webApp.appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/main', {
            templateUrl: 'main/main.html',
            controller: 'MainCtrl'
        })
        .when('/main/postmain', {
            templateUrl: 'postmain/postmain.html',
            controller: 'postMainCtrl'
        })
        .when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        })
        .when('/addPost/:email', {
            templateUrl: 'addPost/addPost.html',
            controller: 'addPostCtrl'
        })
        .otherwise({redirectTo: '/login'});

}])

