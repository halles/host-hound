
hostHound.controller('departmentChooserController', ['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http){

  $log.log('Department Chooser Controller');

  $http.get('api/organizations/'+$state.params.organizationId+'/departments').
    then(function(response) {
      $log.log(response);
      $scope.departments = response.data.departments;
      $scope.organization = response.data.organization;
    }, function(response) {

    });

}]);


hostHound.controller('departmentDashboardController',['$scope','$modal','$log', '$auth', '$state', '$http', '$q', 'ngProgressFactory' , function ($scope, $modal, $log, $auth, $state, $http, $q, ngProgressFactory) {

  $log.log('Department Dashboard Controller');

  $scope.organizationId = $state.params.organizationId;
  $scope.departmentId = $state.params.departmentId;
  var organizationId = $state.params.organizationId;
  var departmentId = $state.params.departmentId;

  $http.get('api/departments/'+$state.params.departmentId+'/tools').
      then(function(response) {
        $scope.opportunities = response.data.opportunities;
        $scope.organization = response.data.organization;
        $scope.department = response.data.department;
      }, function(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      });

  $scope.ngProgressBar = ngProgressFactory.createInstance();

  $scope.ngProgressBar.setParent(document.getElementById('ngProgressRow'))
  $scope.ngProgressBar.setColor('#5dade2');
  $scope.ngProgressBar.start();

  $http.get('api/organizations/'+$state.params.organizationId+'/profiles').
      then(function(response) {
        $scope.status = response.data.status;
        $scope.profiles = response.data.profiles;
        $scope.note_types = response.data.note_types;
        profilesStartUp();
      }, function(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      });

  /** Profiles Initialization Functions **/

  var profilesStartUp = function(){

    $log.log('Setting Ages');
    var promise = setAge();

    promise.then(function(){
      $log.log('Resetting Scores');
      return resetScores();
    }).then(function(){
      $log.log('Building Table');
      return buildTable();
    }).then(function(){
      $log.log('Complete!');
      $scope.ngProgressBar.complete();
    });

  }

  var setAge = function(){
    return $q(function(resolve, reject) {
      for($i = 0; $i < $scope.profiles.length; $i++){
        $scope.profiles[$i].age = $scope.age($scope.profiles[$i]);
      }
      resolve(true);
    });
  }

  $scope.scores_max = null;
  $scope.scores_min = null;

  var resetScoreLimits = function(){
    $scope.scores_max = {
      overall: 1,
      psiceval: 1,
      attributes: 1,
      experience: 1
    };

    $scope.scores_min = {
      overall: 1,
      psiceval: 1,
      attributes: 1,
      experience: 1
    };
  }

  var resetScores = function(){

    return $q(function(resolve, reject) {

      setTimeout(function(){
        resetScoreLimits();
        var factors = [];
        for($i = 0; $i < $scope.profiles.length; $i++){
          factors.psiceval = 1;
          factors.attributes = 1;
          factors.experience = 1;
          factors.overall = 1 * factors.psiceval * factors.attributes * factors.experience;
          $scope.profiles[$i].score = factors;
        }

        resolve(true);
      }, 0);
    });

  }

  /** Table Init **/

  var theTable;

  $scope.currentOpportunity = 0;

  $scope.tableOrderOptions = [
    {
      value: 'overall',
      name: 'General',
      column: 4
    },
    {
      value: 'psiceval',
      name: 'Perfil Psicológico',
      column: 5
    },
    {
      value: 'attributes',
      name: 'Atributos',
      column: 6
    },
    {
      value: 'experience',
      name: 'Experiencia',
      column: 7
    }
  ];

  $scope.tableOrder = $scope.tableOrderOptions[0];

  $scope.reorderTable = function(){
    if(theTable!=undefined){
      theTable.order([$scope.tableOrder.column, 'desc']).draw();
    }
  };

  $scope.doApplyOpportunity = function(){

    if($scope.currentOpportunity == 0){
      return;
    }

    $scope.ngProgressBar.start();

    setTimeout(function(){

      $log.log('Destroying Table!');
      var promise = destroyTable();

      promise.then(function(){
        $log.log('Recalculating Scores');
        return calculateScores();
      }).then(function(){
        $log.log('Building Table');
        return buildTable();
      }).then(function(){
        $log.log('Complete!');
        $scope.ngProgressBar.complete();
      });

    },500);

  }

  var destroyTable = function(){

    return $q(function(resolve, reject) {
      theTable.destroy().draw();
      resolve(true);
    });

  }

  var calculateScores = function(){

    return $q(function(resolve, reject) {

      resetScoreLimits();

      var Op = $scope.currentOpportunity;

      var profile_patterns = Op.parameters.profile_patterns;
      var attributes = Op.parameters.attributes;
      var employment = Op.parameters.employment;
      var experience = Op.parameters.experience;

      var factors = [];

      for(pi = 0; pi < $scope.profiles.length; pi++){

        factors = [];
        factors.psiceval = calculateProfilePattern(pi,profile_patterns);
        factors.attributes = calculateAttributes(pi,attributes);
        factors.experience = calculateEmployement(pi,employment)*calculateExperience(pi,experience);
        factors.overall = 1 * factors.psiceval * factors.attributes * factors.experience;
        $scope.profiles[pi].score = factors;

        $scope.scores_max.psiceval = (factors.psiceval > $scope.scores_max.psiceval)?factors.psiceval:$scope.scores_max.psiceval;
        $scope.scores_max.attributes = (factors.attributes > $scope.scores_max.attributes)?factors.attributes:$scope.scores_max.attributes;
        $scope.scores_max.experience = (factors.experience > $scope.scores_max.experience)?factors.experience:$scope.scores_max.experience;
        $scope.scores_max.overall = (factors.overall > $scope.scores_max.overall)?factors.overall:$scope.scores_max.overall;

        $scope.scores_min.psiceval = (factors.psiceval < $scope.scores_min.psiceval)?factors.psiceval:$scope.scores_min.psiceval;
        $scope.scores_min.attributes = (factors.attributes < $scope.scores_min.attributes)?factors.attributes:$scope.scores_min.attributes;
        $scope.scores_min.experience = (factors.experience < $scope.scores_min.experience)?factors.experience:$scope.scores_min.experience;
        $scope.scores_min.overall = (factors.overall < $scope.scores_min.overall)?factors.overall:$scope.scores_min.overall;

      }

      resolve(true);

    });

  };

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

  var buildTable = function(doRebuild){

    return $q(function(resolve, reject) {

      theTable = angular.element('#profiles-table').DataTable({
          data: $scope.profiles,
          paging: false,
          searching: false,
          order: [$scope.tableOrder.column,'desc'],
          columns: [
            { 'sClass':'person', 'type': 'display'},
            { 'sClass':'jobs', 'type': 'display' },
            { 'sClass':'score_display', 'type': 'display' },
            { 'sClass':'notes_tags', 'type': 'display' },
            { "data": "score.overall", 'sClass': 'hidden'},
            { "data": "score.psiceval", 'sClass': 'hidden' },
            { "data": "score.attributes", 'sClass': 'hidden' },
            { "data": "score.experience", 'sClass': 'hidden' }
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

                $overall_val = Math.floor((row.score.overall - $scope.scores_min.overall)/($scope.scores_max.overall-$scope.scores_min.overall)*100);
                $overall_bar = '<small>Ponderado</small><br/><div class="progress"><div class="progress-bar progress-overall" style="width: '+$overall_val+'%"></div></div>';
                $psiceval_val = Math.floor((row.score.psiceval - $scope.scores_min.psiceval)/($scope.scores_max.psiceval-$scope.scores_min.psiceval)*100);
                $psiceval_bar = '<small>Perfil Psicológico</small><br/><div class="progress"><div class="progress-bar progress-psiceval" style="width: '+$psiceval_val+'%"></div></div>';
                $attributes_val = Math.floor((row.score.attributes - $scope.scores_min.attributes)/($scope.scores_max.attributes-$scope.scores_min.attributes)*100);
                $attributes_bar = '<small>Atributos</small><br/><div class="progress"><div class="progress-bar progress-attributes" style="width: '+$attributes_val+'%"></div></div>';
                $experience_val = Math.floor((row.score.experience - $scope.scores_min.experience)/($scope.scores_max.experience-$scope.scores_min.experience)*100);
                $experience_bar = '<small>Experiencia</small><br/><div class="progress"><div class="progress-bar progress-experience" style="width: '+$experience_val+'%"></div></div>';
                return $overall_bar + $psiceval_bar + $attributes_bar + $experience_bar;

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
                return '<a href="/o/' + organizationId + '/' + departmentId + '/profile/' + row.id + '#notes">' + $stuff + '</a>';

              },
              targets: 3,
              type: "display"
            },

            { "visible": false,  "targets": [ 4,5,6,7 ] },
            { 'bSortable': false, 'aTargets': [ 0,1,2 ] }
          ],
          drawCallback: function( settings ) {
            resolve(true);
          }
        });

    });

  }

  /** Utils **/

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


}]);








