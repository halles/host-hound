hostHound.filter('reverse', function() {
  return function(items) {
    if(items!=undefined){
      return items.slice().reverse();
    }else{
      return items;
    }
  };
});

hostHound.filter('answerstochain', function() {
  return function(test) {

    if(test!=undefined){

      var chain = [];

      for (var i = 0; i < test.answers.length; i++) {
        for (var o = 0; o < test.answers[i].length; o++) {
          chain.push(test.answers[i][o]);
        };
      };

      return chain.join('-');

    }else{
      return test;
    }

  };
});

hostHound.filter('resultstochain', function() {
  return function(test) {

    if(test!=undefined){

      var chain = [test.score_e,test.score_c,test.score_i,test.score_a];

      return chain.join('-');

    }else{
      return test;
    }

  };
});
