// One might ask...
// WHY?
// The simple answer is;
// I wanted to
// and I DIDN'T WANT TO CREATE 5138050823 setTimeouts and setIntervals


// but if you want you can disable it.
const SCHEDULE = true;
const SCHEDULER_PREHANDLE = 10;

if (SCHEDULE) {
	var scheduler = {};
	var id = -1;

	scheduler.scheduled = [];

	scheduler._addToScheduler = function(info) {
		var index = scheduler.scheduled.indexOf(null);

		if(index != -1) {
			scheduler.scheduled[index] = info;
			return;
		}

		scheduler.scheduled.push(info);
	}

	scheduler.timeout = function(handler, time) {
		id++;
			
		scheduler._addToScheduler({
			"handler": handler,
			"targetTime": ((+Date.now()) + time),
			"happened": false
		});
		return id;
	}

	scheduler.interval = function(handler, time) {
		id++;
		scheduler._addToScheduler({
			"handler": handler,
			"happened": "interval",
			"interval": time,
			"targetTime": ((+Date.now()) + time)
		});
		return id;
	}

	scheduler.clearInterval = function(cid) {
		scheduler.scheduled[cid].happened = true;
	}
	
	scheduler.activateInterval = function(cid) {
		scheduler.scheduled[cid].happened = "interval";
	}
	
	scheduler.onceAgain = function(cid) {
		scheduler.scheduled[cid].happened = false;
	}

	scheduler.handle = function() {
		for (var i = 0; i < scheduler.scheduled.length; i++) {
			var item = scheduler.scheduled[i];
			if(item == null) { continue; }
			if (((+Date.now() + SCHEDULER_PREHANDLE) >= item.targetTime) && ((!item.happened) || item.happened == "interval")) {
				if (item.happened != "interval") {
					item.happened = true;
					scheduler.scheduled[i] = null;
				} else {
					item.targetTime = ((+Date.now()) + item.interval);
				}
				item.handler();
			}
		}
	}

} else {
	scheduler.timeout = function(a, b) {
		return setTimeout(a, b);
	}
	
	scheduler.interval = function(a, b) {
		return setInterval(a, b);
	}
	
	scheduler.clearInterval = function(a, b) {
		return clearInterval(a, b);
	}
	
	scheduler.activateInterval = function(cid) {
		scheduler.scheduled[cid].happened = "interval";
	}
	
	scheduler.onceAgain = function(cid) {
		console.error("Once again is a scheduler");
	}
	
	scheduler.handle = function() {
		// console.warn("Schedule handler diabled.");
	};
}