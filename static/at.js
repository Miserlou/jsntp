/*
   Schedule things to happen at certain times

   By Thomas Levine, standing on the substantial shoulders
   of his group at the HTML5 Hackathon at Google Kirkland
*/

at = {
   //The queue
  'atq':{}
, 'DEFAULTS':{
    'PRECISION':8
  }
, 'dateToString':function(date) {
    return date.getTime()+'';
  }

   //Low-level interface for saving the function in the queue
, '_set':function(func,time,signedprecision){
      time.setTime(time.getTime()+signedprecision);
      var d = this.dateToString(time);
      this.atq[d] = func;
    }

   //User interface for saving the function in the queue
, 'at':function (func, time, precision) {
    //If a timestamp is given instead of a Date
    if (!time.getSeconds) {
      var tmp = new Date();
      tmp.setTime(time);
      time = tmp;
    }
    if (typeof(precision)==='undefined'){
      //How far away from the exact time is acceptable?
      //Use a number in milliseconds
      var precision=this.DEFAULTS.PRECISION;
    }

    //Add to the queue
    var p=0-Math.abs(precision);
    var p_end=Math.abs(precision);
    for (p;p<=precision;p++){
      this._set(func,time,p);
    }
  }

, 'atd': function(thisAT) { //Daemon
    //thisAT just sends this to atd when it's run with setTimeout
    if (typeof(thisAT)==='undefined'){
      var thisAT=this;
    }

    var date = new Date();
    var d = thisAT.dateToString(date);
    var alarm = thisAT.atq[d];

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
