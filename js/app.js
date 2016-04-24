var starter = angular.module('starter', ['ui.router', 'firebase'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    
    
    $stateProvider
    
    .state('signin', {
        url: '/signin',
        templateUrl: 'pages/login.html',
        controller: 'SignInCtrl'
    })
    
    .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'pages/dashboard.html'
    })
    
    .state('create-course', {
        url: '/create-course',
        templateUrl: 'pages/create-course.html'
    });
    
    
    $urlRouterProvider.otherwise('/signin');
}])

/* file reader from stack overflow. */
.directive('fileReader', function() {
  return {
    scope: {
      fileReader:"="
    },
    link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              scope.$apply(function () {
                scope.fileReader = contents;
              });
          };
          
          r.readAsText(files[0]);
        }
      });
    }
  };
});