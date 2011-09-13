/*
   Synchronize your browser with a server.
   Inspired by Network Time Protocol

   By Thomas Levine, standing on the substantial shoulders
   of his group at the HTML5 Hackathon at Google Kirkland,
   and inspired partly by Jehiah Czebotar's ntp-for-javascript
   http://jehiah.cz/a/ntp-for-javascript

   ----

   Copyright 2011, Thomas Levine
   Distributed under the terms of the GNU Affero General Public License

   This file is part of ntpjs.

   ntpjs is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   ntpjs is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with ntpjs.  If not, see <http://www.gnu.org/licenses/>.
*/

ntp={
  'offsets':new Array()
, 'roundtrips':new Array()
, 'math':{
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

, 'setup':function(trips,burnin){
    /*
       Prepare for syncing
    */
    this.tripsSoFar=0;

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

  }

, 'sync':function(callback,trips,burnin,get_client_id){
    if (typeof(callback)==='undefined'){
      throw 'No callback to be run after syncing is defined.';
    }
    this.setup();

    var thisNTP=this;
    this.socket.on('message', function(times){
      clientReceive=new Date().getTime();
      server=parseInt(times.split(":")[0]);
      clientSend=parseInt(times.split(":")[1]);
      
      lastOffset=(clientReceive+clientSend)/2-server;
      thisNTP.offsets.push(lastOffset);

      thisNTP.roundtrips.push({
        'clientSend':clientSend
      , 'server':server
      , 'clientReceive':clientReceive
//      , 'clientId':get_client_id()
      });

      thisNTP.tripsSoFar++;
      if (thisNTP.tripsSoFar < thisNTP.trips){
        thisNTP.socket.send(new Date().getTime());
      } else {
        //Compute the offset
        thisNTP.offset=thisNTP.math.mean(thisNTP.offsets.slice(thisNTP.burnin));
        callback();
/*
        //Send statistics to the server
        $.post("/stats",thisNTP.roundtrips,function(){
          console.log($(this))
        });
*/
      }
    });
    this.socket.send(new Date().getTime());
  }

, 'date':function(clientDate){
    /*
       Get the date of the server that
       corresponds to a client date.
    */
    if (typeof(clientDate)==='undefined'){
      //Use now if no date is specified
      clientDate=new Date();
    } else if (typeof(clientDate)==='number'){
      tmp=new Date();
      tmp.setTime(clientDate);
      clientDate=tmp;
    }
    clientDate.setTime(clientDate.getTime()-this.offset);
    return clientDate;
  }

, 'sort':function(trips,attr){
    var list=new Array();
    var i=0;
    for (i=0; (trips.length-1); i++ ){
      list.push(
    }
    return trips.sort(function(a,b) {
      return a - b;
    });
}

, 'stats':{
    'map':function(listin,fun) { 
      var listout=new Array();
      var i=0;
      for (i=0; (listin.length-1); i++ ){
        var out=fun(listin[i]);
        if (typeof(out)!='undefined'){
          listout.push(out);
        }
      }
      return listout;
    }

    //Round-trip length
  , 'delay':function(trip) {
      return (trip.clientReceive-trip.clientSend);
    }
  , 'offset':function(trip){
      return (trip.clientReceive+trip.clientSend)/2-trip.server;
    }

  , 'all':function(trips) {
      console.log('delay,offset');
      var _this=this;
      _this.map(trips, function(trip) {
        console.log(_this.delay(trip)+','+_this.offset(trip));
      });
    }
  }

} //End of the ntp json
