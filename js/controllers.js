starter.controller('SignInCtrl',['$scope', '$state', function($scope, $state){
    

    var ref = new Firebase("https://comp3275.firebaseio.com");
    
    $scope.googleSignIn = function(){
        
        ref.authWithOAuthPopup("google", function(error, authData) {
            
          if (error) {
            console.log("INFO: ERROR : ", error);
          } else {
            console.log("INFO: SUCCESSFULLY SIGNED IN : ", authData);
            
            /* get the uid of the user. */
            var uid = authData['uid'];
              
            /* get the provider from the authData object. */
            var provider = authData['provider'];;
              
            /* get the user's display name. */
            var name = authData[provider]['displayName'];

            var profileImageURL = authData[provider]['profileImageURL'];
              
            /* push the data to firebase.  */
            var userRef = ref.child('/users/' + uid);
              
            userRef.set({
                'name' : name,
                'profileImageURL' : profileImageURL
            });
              
            /* redirect to dashboard, because user is logged in. */
            $state.go('dashboard');
          }
            
        });
    }
    
}])

.controller('DashboardCtrl', ['$scope', '$firebaseObject', '$state', function($scope, $firebaseObject, $state){

    var ref = new Firebase("https://comp3275.firebaseio.com");
    
    $scope.user = null; 
    
    $scope.courseName = null; 
    $scope.courseCode = null;
    $scope.courseSchedule = [];
    
    $scope.studentsCSV = null; 
    
    /* init function will pull the necessary data from firebase such as name and profile image.  */
    $scope.init = function(){
        
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        $scope.user = $firebaseObject(ref.child('/users/' + uid));
    };
    
    $scope.googleSignOut = function(){
      
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        
        if(authData !== null){
            localStorage.removeItem('firebase:session::comp3275');
            $state.go('signin');
        }
    };
    
    /* create a course for a lecturer. */
    $scope.createCourse = function(){
        
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        
        var courseRef = ref.child('/courses/' + uid + '/' + $scope.courseCode); 
        
        
        /* parse times for course schedule inorder to push to firebase. */
        var courseSchedule = [];
        
        for(var i = 0; i < $scope.courseSchedule.length; i++){
            courseSchedule.push({});
            courseSchedule[i]['day'] = $scope.courseSchedule[i]['day'];
            courseSchedule[i]['start'] = JSON.stringify($scope.courseSchedule[i]['start']);
            courseSchedule[i]['end'] = JSON.stringify($scope.courseSchedule[i]['end']);
        }
        
        /* student ids */
        var studentIDsArray = $scope.studentsCSV.split(",");
        
        var studentIDsObj = {};
        
        for(var i = 0; i < studentIDsArray.length; i++){
            if(studentIDsArray[i].length > 0){
                studentIDsObj[studentIDsArray[i]] = true;        
            }
        }
        
        console.log(studentIDsArray);
        courseRef.set({
            'name' : $scope.courseName,
            'schedule' : courseSchedule,
            'students' : studentIDsObj
        });
    };
    
    $scope.addLectureRow = function(){
        var row = {'day' : null, start : null, end : null};
        $scope.courseSchedule.push(row);
    };
    
    $scope.removeLectureRow = function(index){
        
        for(var i = index; i < $scope.courseSchedule.length - 1; i++){
            $scope.courseSchedule[i] = $scope.courseSchedule[i + 1];
        }
        
        $scope.courseSchedule.length = $scope.courseSchedule.length - 1;
    };
}])

