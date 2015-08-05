
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

  $http.get('api/departments/'+$state.params.departmentId+'/tools').
      success(function(data, status, headers, config) {
        $scope.opportunities = data.opportunities;
        $scope.organization = data.organization;
        $scope.department = data.department;
      }).
      error(function(data, status, headers, config) {

      });

  /** Utils **/

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

  var resetScores = function(){
    for($i = 0; $i < $scope.profiles.length; $i++){
      $scope.profiles[$i].score = 1;
    }
  }

  var vm = this;

  var theTable;

  $http.get('api/organizations/'+$state.params.organizationId+'/profiles').
      success(function(data, status, headers, config) {
        $scope.status = data.status;
        $scope.profiles = data.profiles;
        $scope.note_types = data.note_types;
        prepareProfiles();
        buildTable();
      }).
      error(function(data, status, headers, config) {

      });

  var prepareProfiles = function(){
    setAge();
    resetScores();
  }

  $scope.currentOpportunity = 0;

  var calculateProfilePattern = function(index,patterns){
    var upatterns = $scope.profiles[index].test.patterns;
    var factor = false;

    for (var ui = 0; ui < upatterns.length; ui++) {
      for (var pi = 0; pi < patterns.length; pi++) {
        if(patterns[pi].patterns.indexOf(upatterns[ui]) >= 0){
          factor = patterns[pi].factor;
          break;
        }
      }
      if(factor)
        break;
    };
    return factor;
  }

  var calculateAttributes = function(index,attributes){
    var uattributes = $scope.profiles[index].attributes;
    var factors = [];

    for (var a = 0; a < attributes.length; a++) {
      found = false;
      for (var u = 0; u < uattributes.length; u++) {
        if(uattributes[u].id == attributes[a].attribute_id){
          found = true;
        }
      }
      if(found){
        if(attributes[a].requirement == 'mandatory'){
          factors.push(2);
        }else if(attributes[a].requirement == 'plus'){
          factors.push(1.5);
        }else if(attributes[a].requirement == 'neutral'){
          factors.push(1);
        }else if(attributes[a].requirement == 'negative'){
          factors.push(0.5);
        }
      }else{
        if(attributes[a].requirement == 'mandatory'){
          factors.push(0.5);
        }else if(attributes[a].requirement == 'plus'){
          factors.push(0.75);
        }else if(attributes[a].requirement == 'neutral'){
          factors.push(1);
        }else if(attributes[a].requirement == 'negative'){
          factors.push(1.5);
        }
      }

    }

    var finalfactor = 1;

    for (var i = 0; i < factors.length; i++) {
      finalfactor = finalfactor * factors[i]
    };

    return finalfactor;
  }

  var calculateEmployement = function(index,employment){
    var profile = $scope.profiles[index];
    if(profile.is_employee){
      return employment.is_employee;
    }else{
      if(profile.jobs.length > 0){
        if(profile.jobs[profile.jobs.length-1].end == null){
          return employment.employed;
        }else{
          return employment.unemployed;
        }
      }else{
        return 1;
      }

    }
  }

  var calculateExperience = function(index,experience){
    var profile = $scope.profiles[index];

    var factor = 1;

    var avg_length = 0;
    var job_count = (profile.jobs.length > 3)?3:profile.jobs.length;

    if(job_count > 0){

      factor = factor * experience.previous;

      for (var i = 0; i < job_count; i++) {
        end = (profile.jobs[i].end!=null)?profile.jobs[i].end:undefined;
        avg_length = avg_length + $scope.monthDiff(profile.jobs[i].start,end)
      }

      avg_length = avg_length / job_count;

      if(avg_length >= 6){
        factor = factor * experience.stability;
      }

    }else{

      factor = factor * 1;

    }

    return factor;

  }

  $scope.calculateScores = function(doRebuild){

    if($scope.currentOpportunity == 0){
      return;
    }

    var Op = $scope.currentOpportunity;

    var profile_patterns = Op.parameters.profile_patterns;
    var attributes = Op.parameters.attributes;
    var employment = Op.parameters.employment;
    var experience = Op.parameters.experience;

    var factors = [];

    for(pi = 0; pi < $scope.profiles.length; pi++){
      factors = []
      factors.push(calculateProfilePattern(pi,profile_patterns));
      factors.push(calculateAttributes(pi,attributes));
      factors.push(calculateEmployement(pi,employment));
      factors.push(calculateExperience(pi,experience));
      $scope.profiles[pi].score = 1*factors[0]*factors[1]*factors[2]*factors[3];
    }

    buildTable(true);

  };

  function buildTable(doRebuild){

    if(doRebuild){
      theTable.destroy();
    }

    theTable = angular.element('#profiles-table').DataTable({
          data: $scope.profiles,
          paging: false,
          searching: false,
          order: [3,'desc'],
          columns: [
            { 'sClass':'person', 'type': 'display'},
            { 'sClass':'jobs', 'type': 'display' },
            { 'sClass':'notes_tags', 'type': 'display' },
            { "data": "score" }
          ],
          columnDefs: [
            {
              "render": function ( data, type, row ) {
                var sexImg = (row.sex=='m')?'dude.svg':'girl.svg';
                return '<img src="/img/icons/'+sexImg+'" alt="">' +
                '<div><a href="/o/' + organizationId + '/' + departmentId + '/profile/'+row.id+'">'+row.name+'</a><br/>'+
                row.age + ' años</div>';
              },
              targets: 0,
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
              targets: 1,
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
                return '<a href="/o/' + organizationId + '/' + departmentId + '/profile/' + row.id + '#notes">' + $stuff + '</a>';

              },
              targets: 2,
              type: "display"
            },

            { "visible": false,  "targets": [ 3 ] },
            { 'bSortable': false, 'aTargets': [ 0,1,2 ] }
          ]
        });
  }



}]);








