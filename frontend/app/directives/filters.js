hostHound.filter('reverse', function() {
  return function(items) {
    if(items!=undefined){
      return items.slice().reverse();
    }else{
      return items;
    }
  };
});
