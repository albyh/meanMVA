'use strict';

var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http) {
    $rootScope.authenticated = false;
    $rootScope.currentUser = "";

    $rootScope.signout = function() {
        $http.get('/auth/signout');

        $rootScope.authenticated = false;
        $rootScope.currentUser = "";
    };
});

app.config(function($routeProvider) {
    $routeProvider
    //the timeline display
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
        //the login display
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'authController'
        })
        //the signup display
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'authController'
        });
});

app.factory('postService', function($http, $resource) {
    return $resource('/api/posts/:id');
    // var factory = {};
    // factory.getAll = function() {
    //     return $http.get('/api/posts');
    // }
    // return factory;
});

app.controller('mainController', function($rootScope, $scope, postService) {
    $scope.posts = postService.query();
    $scope.newPost = {
        createdBy: '',
        text: '',
        createdAt: ''
    };
    
    $scope.post = function() {
        $scope.newPost.createdBy = $rootScope.currentUser;
        $scope.newPost.createdAt = Date.now();
        postService.save($scope.newPost, function() {
            $scope.posts = postService.query();
            $scope.newPost = {
                createdBy: '',
                text: '',
                createdAt: ''
            };
        });
    }
});

app.controller('authController', function($scope, $rootScope, $http, $location) {
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.error_message = '';

    $scope.login = function() {
        $http.post('/auth/login', $scope.user)
            .success(function(data) {
                if (data && data.state !== 'failure') {
                    $rootScope.authenticated = true;
                    $rootScope.currentUser = data.user.username;

                    $location.path('/');
                } else {
                    alert('User or Password is invalid. Please try again');
                }
            });
    };

    $scope.register = function() {
        $http.post('/auth/signup', $scope.user)
            .success(function(data) {
                $rootScope.authenticated = true;
                $rootScope.currentUser = data.user.username;

                $location.path('/');
            });
    };
});