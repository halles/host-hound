/*
hostHound
.directive('profileDataTableElement', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      $(document).ready(function() {
        $('table').dataTable({
          "order": [[ 4, "desc" ]],
          "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "All"]],
          "aoColumns": [
            null,
            null,
            null,
            null,
            { "bVisible": true }
          ],
          "aoColumnDefs": [
            { "iDataSort": 4 }
          ]
        });
      });
    }
  };
});
*/
