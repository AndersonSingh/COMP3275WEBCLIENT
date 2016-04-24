starter.controller('SignInCtrl',['$scope', '$state', function($scope, $state) {
    

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

.controller('DashboardCtrl', ['$scope', '$firebaseObject', '$state', '$stateParams', function($scope, $firebaseObject, $state, $stateParams){

    var ref = new Firebase("https://comp3275.firebaseio.com");
    
    $scope.user = null; 
    
    $scope.courseName = null;
    $scope.courseCode = null;
    $scope.courseSchedule = [];
    $scope.courses = null;
    
    $scope.studentsCSV = null;
    

    /* function to list all courses on dashboard. */
    $scope.getCourses = function(){
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        $scope.courses = $firebaseObject(ref.child('/lecturers/' + uid));
    };
    
    $scope.sayHi = function(key){
      $state.go('edit-course',{'courseCode':key});
        
    };
    /* firebase delete course */
    $scope.deleteCourse = function(courseCode){

        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        
        var deleteRef = ref.child('/lecturers/' + uid + '/' + courseCode);
        deleteRef.remove(function(error){
            
            if(error){
                
            }
            else{
                $state.go('dashboard');
            }
        });
        
    };
    
}])


.controller('CreateCourseCtrl', ['$scope', '$firebaseObject', '$state', function($scope, $firebaseObject, $state){
    
    /* firebase database reference. */
    var ref = new Firebase("https://comp3275.firebaseio.com");
    
    /* important variables for the creation of a course. */    
    $scope.courseName = null; 
    $scope.courseCode = null;
    $scope.courseSchedule = [];
    $scope.courses = null; 
    
    $scope.studentsCSV = null; 
    
    
    /* create a course for a lecturer. */
    $scope.createCourse = function(){
        var day = ["Mon", "Tue", "Wed" ,"Thu" ,"Fri" ,"Sat"];
        var fullDay = ["Monday" ,"Tuesday" ,"Wednesday","Thursday","Friday","Saturday"]
        
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        
        var courseRef = ref.child('/lecturers/' + uid + '/' + $scope.courseCode); 
        
        
        /* parse times for course schedule inorder to push to firebase. */
        var courseSchedule = [{}];
        
        for(var i = 0; i < $scope.courseSchedule.length; i++){
            courseSchedule.push();
            var daynum = $scope.courseSchedule[i]['day'];
            var stime = $scope.courseSchedule[i]['start'].getHours();
            var key = day[daynum]+" "+stime;
            //vat zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
            courseSchedule[key]={"day" : fullDay[parseInt(daynum)],
            
            /* get the starting hour and minutes of the class. */
            "startHr" : $scope.courseSchedule[i]['start'].getHours(),
            "startMin" : $scope.courseSchedule[i]['start'].getMinutes(),
            
            /* get the ending hour and minutes of the class. */
            "endHr" : $scope.courseSchedule[i]['end'].getHours(),
            "endMin" : $scope.courseSchedule[i]['end'].getMinutes()};
        }
        var s = {"d":"d"}
        /* student ids */
        var studentIDsArray = $scope.studentsCSV.split(",");
        
        /* object containing studentIds and names. */
        var studentsData = {};
        

        for(var i = 0; i < studentIDsArray.length; i+=2){
            if(studentIDsArray[i].length > 0){
                
                /* get the current student's id. */
                var id = studentIDsArray[i].replace(/\s+/g, ' ').trim();
                var name = studentIDsArray[i + 1].replace(/\s+/g, ' ').trim();
                studentsData[id] = {};
                
                /* add fields with name and id */
                studentsData[id]['id'] = id
                studentsData[id]['name'] = name;
            }
        }
        console.log(courseSchedule);
        //console.log(studentIDsArray);
        courseRef.set({
            'courseName' : $scope.courseName,
            'courseCode' : $scope.courseCode,
            'lectures' : courseSchedule,
            'students' : studentsData
        });
    };
    
    
    /* allows a lecturer to add a new class time to the system. */
    $scope.addLectureRow = function(){
        var row = {'day' : null, start : null, end : null};
        $scope.courseSchedule.push(row);
    };
    
    /* allows a lecturer to remove a new class time from the system. */
    $scope.removeLectureRow = function(index){
        
        for(var i = index; i < $scope.courseSchedule.length - 1; i++){
            $scope.courseSchedule[i] = $scope.courseSchedule[i + 1];
        }
        
        $scope.courseSchedule.length = $scope.courseSchedule.length - 1;
    };
    
}])


.controller('SideMenuCtrl',['$scope', '$firebaseObject', '$state', function($scope, $firebaseObject, $state){
    
    var ref = new Firebase("https://comp3275.firebaseio.com");
    
    $scope.user = null; 
    
    /* init function will pull the necessary data from firebase such as name and profile image.  */
    $scope.init = function(){
        
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        var uid = authData['uid'];
        $scope.user = $firebaseObject(ref.child('/users/' + uid));
        
    };
    
    /* this function signs a user out from the dashboard. */
    $scope.googleSignOut = function(){
      
        var authData = JSON.parse(localStorage.getItem('firebase:session::comp3275'));
        
        if(authData !== null){
            localStorage.removeItem('firebase:session::comp3275');
            $state.go('signin');
        }
    };
}]);
