function log(foo) {console.log(foo)}
/*
   Alarms, mostly Steve's work
*/
window.alarms = {};
function alarm(func, time) {
if (!time.getSeconds) {
    var tmp = new Date();
    tmp.setMilliseconds(tmp.getMilliseconds() + time);
    time = tmp;
}
var d = dateToString(time);
alarms['a_' + d] = func;
time.setMilliseconds(time.getMilliseconds() - 1);
d = dateToString(time);
alarms['a_' + d] = func;
time.setMilliseconds(time.getMilliseconds() + 1);
d = dateToString(time);
/*alarms['a_' + d] = func;
time.setMilliseconds(time.getMilliseconds() + 2);
d = dateToString(time);
alarms['a_' + d] = func;*/
func.time = time.getMilliseconds();
return d;
}
var time = document.getElementById('time').firstChild;
function dateToString(d) {
var millis = d.getMilliseconds();
millis = (millis/1000).toPrecision(2) + '';
/*if (millis.length < 2) {
    millis = '00' + millis;
} else if (millis.length < 3) {
    millis = '0' + millis;
} else if (millis.length < 4) {
    millis = '0' + millis;
}*/
return [d.getHours(), d.getMinutes(), d.getSeconds(), 'ted' && millis].join(':');
}
function spinner() {
var date = new Date();
var d = dateToString(date);
var alarm = alarms['a_' + d];
var m = date.getMilliseconds();
var fire = alarm && (alarm() || (time.nodeValue = [m, alarm.time, m - alarm.time].join(' | ')));
//        time.nodeValue = d;
setTimeout(spinner, 1);
}
spinner();
//    alarm(function() {updateTime(1) }, 3*1000);




/*
   Math for averaging
*/

function compare(a,b){
	return a-b;
}

function median(list){
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

function mean(list){
	var average = 0;
	var i=0;
	for (i=0; i < list.length;i++){
		average += list[i];
	}
	average = Math.round(average / i);
	return average
}



/*
   Syncing
*/


var offsets=new Array();
var burnin=20;
var trips=100;
var tripsSoFar=0;

var socket = io.connect();

socket.on('connect', function(){
  //log('connected'); 
});

socket.on('message', function(times){
  clientReceive=new Date().getTime();
  server=parseInt(times.split(":")[0]);
  clientSend=parseInt(times.split(":")[1]);
  
  offset=(clientReceive+clientSend)/2-server;
  window.offsets.push(offset);
/*
  log('');
  log('Raw times');
  log(clientReceive+':'+server+':'+clientSend);
  log('');
  log('Round-trip lag: '+(clientReceive-clientSend));
  log('Offset: '+offset);
  log('');
*/
  tripsSoFar++;
  if (tripsSoFar < trips){
    socket.send(new Date().getTime());
  } else {
    //log(mean(offsets.slice(burnin)));

		//Absolute time--for production
		var startPlayingAbs=new Date();
		startPlayingAbs.setTime(1315251434570);

		//Relative time--for testing. It runs in seconds from now
		var startPlayingRel=new Date();
		startPlayingRel.setTime(startPlayingRel.getTime()*1+15*1000);

		//Adjust for the lag
		log(offset);
		startPlayingAbs.setTime(startPlayingAbs.getTime()*1+offset);
		startPlayingRel.setTime(startPlayingRel.getTime()*1+offset);

//			var startPlaying=startPlayingAbs;
		var startPlaying=startPlayingRel;

		function startIn() {
			var startTime=startPlaying.getTime();
			var now=new Date();
			return startTime-now.getTime();
		};

		jQuery('#syncing').hide();
		jQuery('#counting').show();
		jQuery('#countdown').countdown({until: startPlaying}); 
/* 
		jQuery('#removeCountdown').toggle(function() { 
				$(this).text('Re-attach'); 
				$('#defaultCountdown').countdown('destroy'); 
			}, 
			function() { 
				$(this).text('Remove'); 
				$('#defaultCountdown').countdown({until: newYear}); 
			} 
		);
*/

		//Only run if we are more than four seconds in advance
		if (startIn()>1000){
			checkLoad=new Date();
			checkLoad.setTime(startPlaying.getTime()-10000);
			log(checkLoad);
			alarm(function() {
				log('foo');
				p=document.getElementById('player');

				//Start playing at no volume.
				p.volume=0;
				p.play();

				if (p.duration===p.buffered.end()){
					log('Setting the alarm');
					alarm(function() {
						p=document.getElementById('player');
						p.currentTime=42;
						p.volume=1;
						log('playing the music');
					},startPlaying);
				} else {
					log("Audio didn't load in time");
				}
			},checkLoad);
		}else{
			//If it's too late, report that it's too late,
			log('Too close to the start time');
		};

		//Sync check
  }
});

function sync(){
	socket.send(new Date().getTime());
}

