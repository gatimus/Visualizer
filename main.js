(function(){
  'use strict';
  angular.module('app', [])
    .controller('controller', function($window, $scope, $interval, $animationLoop){
      var audioCtx = new ($window.AudioContext || $window.webkitAudioContext)();
      var myAudio = document.getElementById('audio');
      myAudio.crossOrigin = "anonymous";
      myAudio.autoplay = true;
      var source = audioCtx.createMediaElementSource(myAudio);
      var analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      
      analyser.fftSize = 256;
      var bufferLength = analyser.frequencyBinCount;
      $scope.bars = new Uint8Array(bufferLength);
      var waveForm = new Uint8Array(bufferLength);

      
      function loop(ts){
        //analyser.getByteFrequencyData($scope.bars);
        analyser.getByteTimeDomainData(waveForm);
        /*
        var path = "";
        for(var i = 0; i < waveForm.length; i++){
          var point = "";
          if(i===0){
            point = "M " + i + " " + waveForm[i] + " ";
          } else {
            point = "L " + i + " " + waveForm[i] + " ";
          }
          
          path = path.concat(point);
        }
        $scope.path = path;
        */
        var points = "";
        for(var i = 0; i < waveForm.length; i++){
          points = points.concat(i+","+waveForm[i]+" ");
        }
        $scope.points = points;
      }
      
      $animationLoop(loop);

      
    })
    .factory('$animationFrame', function($window, $rootScope){
      return function(fn) {
        return $window.requestAnimationFrame(function(timeStamp){
          $rootScope.$apply(fn(timeStamp));
        });
      };
    })
    .factory('$cancelFrame', function($window, $rootScope){
      return function(id) {
        $window.cancelAnimationFrame(id);
      };
    })
    .factory('$animationLoop', function($animationFrame){
      var lastTime;
      return function(fn) {
        function loop(timeStamp){
          //console.log("FPS:",Math.round(1000/(timeStamp-lastTime)));
          lastTime = timeStamp;
          fn(timeStamp);
          $animationFrame(loop);
        }
        $animationFrame(loop);
      };
    })
  ;
})();