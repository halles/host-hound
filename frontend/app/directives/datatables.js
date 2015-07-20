hostHound
.directive('profileDataTableElement', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      $(document).ready(function() {
        $('table').dataTable();
      });
    }
  };
});
