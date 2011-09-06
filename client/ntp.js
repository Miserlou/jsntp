function log(foo) {console.log(foo)}

ntp={
  'math':{
    /*
       Math for averaging
    */
    'median':function(list){
      function compare(a,b){
        return a-b;
      }
      list.sort(compare);
      var listlength = list.length;
      if (listlength % 2){
        var odd = (listlength / 2 - .5);
        return list[odd];
      }else{
        var even = (list[listlength / 2]);
        even += (list[listlength  / 2 + 1]);
        even = (even / 2);
        return even;
      }
    }
  , 'mean':function(list){
      var average = 0;
      var i=0;
      for (i=0; i < list.length;i++){
        average += list[i];
      }
      average = Math.round(average / i);
      return average
    }
  }

, 'setup':function(callback,trips,burnin){
    /*
       Prepare for syncing
    */

    this.offsets=new Array();
    this.tripsSoFar=0;

    if (typeof(callback)==='undefined'){
      throw 'No callback to be run after syncing is defined.';
    }
    //Defaults
    if (typeof(trips)==='undefined'){
      trips=100;
    }
    if (typeof(burnin)==='undefined'){
      burnin=20;
    }

    //Set trips and burnin
    this.trips=trips;
    this.burnin=burnin;

    this.socket = io.connect();

    this.socket.on('connect', function(){
      //log('connected');
    });

    this.socket.on('message', function(times){
      clientReceive=new Date().getTime();
      server=parseInt(times.split(":")[0]);
      clientSend=parseInt(times.split(":")[1]);
      
      lastOffset=(clientReceive+clientSend)/2-server;
      this.offsets.push(lastOffset);

      tripsSoFar++;
      if (tripsSoFar < trips){
        this.socket.send(new Date().getTime());
      } else {
        //Compute the offset
        this.offset=mean(this.offsets.slice(burnin));
        callback();
      }
    });
  }

, 'sync':function(callback){
    this.setup(callback);
    this.socket.send(new Date().getTime());
  }

}
