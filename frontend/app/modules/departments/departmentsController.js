
hostHound.controller('departmentChooserController', ['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http){

  $log.log('Department Chooser Controller');

  $http.get('api/organizations/'+$state.params.organizationId+'/departments').
    success(function(data, status, headers, config) {
      $log.log(status);
      $log.log(data);
      $scope.departments = data.departments;
      $scope.organization = data.organization;
    }).
    error(function(data, status, headers, config) {
      $log.log(status);
    });

}]);


hostHound.controller('departmentDashboardController',['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http) {

  $log.log('Department Dashboard Controller');

  $scope.organizationId = $state.params.organizationId;
  $scope.departmentId = $state.params.departmentId;

  /** Utils **/

}]);


hostHound.controller('profilesTableController',[
  '$scope', '$state', '$http', '$log',
  function($scope, $state, $http, $log){

  $log.log('HOLA!');

  var organizationId = $state.params.organizationId;
  var departmentId = $state.params.departmentId;

  $scope.monthDiff = function(d1,d2){
    d1 = d1.split('-');
    d1 = new Date(d1[0],d1[1],d1[2]);
    if (d2 == undefined){
      d2 = new Date();
    }else{
      d2 = d2.split('-');
      d2 = new Date(d2[0],d2[1],d2[2]);
    }
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  $scope.age = function(profile){
    months = $scope.monthDiff(profile.birthday);
    age = Math.floor(months/12);
    return age;
  }

  var getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  }

  $scope.prepareFields = function(){

  }

  var setAge = function(){
    for($i = 0; $i < $scope.profiles.length; $i++){
      $scope.profiles[$i].age = $scope.age($scope.profiles[$i]);
    }
  }

  var vm = this;

  var theTable;

  $http.get('api/organizations/'+$state.params.organizationId+'/profiles').
      success(function(data, status, headers, config) {
        $scope.status = data.status;
        $scope.profiles = data.profiles;
        $scope.note_types = data.note_types;
        setAge();
        $scope.calculateScore();
      }).
      error(function(data, status, headers, config) {

      });

  $scope.calculateScore = function(doRebuild){
    for(pi = 0; pi < $scope.profiles.length; pi++){
      $scope.profiles[pi].score = getRandomArbitrary(0,1);
    }
    if(doRebuild){
      theTable.destroy();
    }

    theTable = angular.element('#profiles-table').DataTable({
          data: $scope.profiles,
          order: [4,'desc'],
          columns: [
            { 'sClass':'person' },
            { "data": "id_num"},
            { "data": "phone" },
            { "data": "notes" },
            { "data": "score" }
          ],
          columnDefs: [
            {
              "render": function ( data, type, row ) {
                var employeeClass = (row.is_employee)?'':'not_employee';
                var sexImg = (row.sex=='m')?'dude.svg':'girl.svg';
                return '<a href="/o/' + organizationId + '/' + departmentId + '/profile/'+row.id+'/">'+row.name+'</a><br/>'+
                '<img src="/img/icons/shirt.svg" class="'+employeeClass+'">'+
                '<img src="/img/icons/'+sexImg+'" alt="">' + row.age + ' años';
              },
              targets: 0,
              type: "display"
            },
            {
              "render": function ( data, type, row ) {
                if(row.test.patterns.length == 1)
                  return '<a href="/profile/'+row.id+'/test-results">' + row.test.patterns[0] + '</a>';
                else
                  return '<a href="/profile/'+row.id+'/test-results">' + row.test.patterns[0] + ' & ' + row.test.patterns[1] + '</a>';
              },
              targets: 1,
              type: "display"
            },
            {
              "render": function ( data, type, row ) {
                if(row.jobs.length > 0){
                  var $exp;
                  if(row.jobs[row.jobs.length-1].end != null){
                    $exp = row.jobs[row.jobs.length-1].position + ' por ' + $scope.monthDiff(row.jobs[row.jobs.length-1].start) + ' meses';
                  }else{
                    $exp = row.jobs[row.jobs.length-1].position + ' por ' + $scope.monthDiff(row.jobs[row.jobs.length-1].start, row.jobs[row.jobs.length-1].end) + ' meses';
                  }
                  return $exp + '<br/>'+ (row.jobs.length-1) + ' otra(s)';
                }else{
                  return "Sin Experiencia";
                }
              },
              targets: 2,
              type: "display"
            },
            {
              "render": function ( data, type, row ) {
                var $stuff = '';
                var type_id = null;
                for (var i = 0; i < $scope.note_types.length; i++) {
                  type_id = $scope.note_types[i].id;
                  $stuff = $stuff + '<span class="note-type-tag note-type-tag-class-'+ type_id + '">' + row.note_types_count[type_id] + '</span>';
                }
                return '<a href="/o/{{organizationId}}/{{departmentId}}/profile/{{profile.id}}#notes">' + $stuff + '</a>';

              },
              targets: 3,
              type: "display"
            },

            { "visible": false,  "targets": [ 4 ] }
          ]
        });
  }



}]);








