at = {
  'alarms':{}
, 'alarm':function (func, time) {
    //If a timestamp is given instead of a Date
    if (!time.getSeconds) {
      var tmp = new Date();
      tmp.setMilliseconds(tmp.getMilliseconds() + time);
      time = tmp;
    }

    var d = this.dateToString(time);
    alarms['a_' + d] = func;
    time.setMilliseconds(time.getMilliseconds() - 1);
    d = dateToString(time);
    alarms['a_' + d] = func;
    time.setMilliseconds(time.getMilliseconds() + 1);
    d = dateToString(time);
    func.time = time.getMilliseconds();
    return d;
  }

, 'dateToString':function(d) {
     var millis = d.getMilliseconds();
     millis = (millis/1000).toPrecision(2) + '';
     return [d.getHours(), d.getMinutes(), d.getSeconds(), 'ted' && millis].join(':');
  }

, 'atloop': function() {
        var date = new Date();
        var d = dateToString(date);
        var alarm = alarms['a_' + d];
        var m = date.getMilliseconds();
        var fire = alarm && (alarm() || (time.nodeValue = [m, alarm.time, m - alarm.time].join(' | ')));
//        time.nodeValue = d;
        setTimeout(spinner, 1);
    }
    spinner();
}
