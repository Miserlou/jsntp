at = {
   //The queue
  'atq':{}

   //Low-level interface for saving the function in the queue
, '_set':function(time,offset){
      time.setMilliseconds(time.getMilliseconds()+offset);
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
    this._set(time,-1));
    this._set(time, 1));

    //I don't know what the rest of this function does yet
    d = dateToString(time);
    func.time = time.getMilliseconds();
    return d;
  }

, 'dateToString':function(d) {
     var millis = d.getMilliseconds();
     millis = (millis/1000).toPrecision(2) + '';
     return [d.getHours(), d.getMinutes(), d.getSeconds(), 'ted' && millis].join(':');
  }

, 'atd': function() { //Daemon
        var date = new Date();
        var d = dateToString(date);
        var alarm = this.atq['a_' + d];
        var m = date.getMilliseconds();
        var fire = alarm && (alarm() || (time.nodeValue = [m, alarm.time, m - alarm.time].join(' | ')));
       // Run again
        setTimeout(atd, 1);
    }
}
at.atd();
