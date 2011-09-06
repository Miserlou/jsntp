/*
   Schedule things to happen at certain times

   By Thomas Levine, built on the substantial shoulders
   of his team at the HTML5 Hackathon at Google Kirkland
*/

at = {
   //The queue
  'atq':{}

, 'dateToString':function(d) {
     var millis = d.getMilliseconds();
     millis = (millis/1000).toPrecision(2) + '';
     return [d.getHours(), d.getMinutes(), d.getSeconds(), 'ted' && millis].join(':');
  }

   //Low-level interface for saving the function in the queue
, '_set':function(func,time,signedprecision){
      time.setMilliseconds(time.getMilliseconds()+signedprecision);
      var d = this.dateToString(time);
      this.atq['a_' + d] = func;
    }

   //User interface for saving the function in the queue
, 'at':function (func, time) {
    //If a timestamp is given instead of a Date
    if (!time.getSeconds) {
      var tmp = new Date();
      tmp.setMilliseconds(tmp.getMilliseconds() + time);
      time = tmp;
    }

    //Add to the queue
    this._set(func,time,-1);
    this._set(func,time, 1);
  }

, 'atd': function(thisAT) { //Daemon
    //thisAT just sends this to atd when it's run with setTimeout
    if (typeof(thisAT)==='undefined'){
      var thisAT=this;
    }

    var date = new Date();
    var d = thisAT.dateToString(date);
    var alarm = thisAT.atq['a_' + d];

    if (alarm) {
      alarm();
    }

    // Run again
    setTimeout(function(){
      thisAT.atd(thisAT);
    },1);
  }
}
at.atd();
at.at(function(){
  console.log('Yay! at.js works');
},new Date().getTime()+2000);
