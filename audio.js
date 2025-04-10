var lib = {};

// Audio
audio = {};
audio.audioCtx = null;
audio.audioDefined = false;
audio.soundsPlaying = 0;

audio.assureAudioDefined = function () {
    if (!audio.audioDefined) {
        audio.audioDefined = true;
        audio.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

audio.createSound = function (hz, waveType) {
    if (typeof waveType == "undefined") {
        waveType = "sine";
    }

    audio.assureAudioDefined();
    audio.soundsPlaying++;

    var oscillator = audio.audioCtx.createOscillator();
    oscillator.type = waveType;
    const gainNode = audio.audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audio.audioCtx.destination);
    gainNode.gain.value = 0.1;
    oscillator.connect(audio.audioCtx.destination);
    oscillator.frequency.value = hz;
    oscillator.start();
    oscillator.gainNode = gainNode;

    oscillator.oldGain = gainNode.gain.value;
    oscillator.oldHz = hz;
    oscillator.oldWaveType = waveType;

    oscillator.pauseState = false;

    oscillator.setVolume = function (volume) {
        gainNode.gain.value = volume;
    }

    oscillator.pause = function () {
        oscillator.oldGain = gainNode.gain.value;
        oscillator.oldHz = oscillator.frequency.value;
        oscillator.oldWaveType = oscillator.type;

        audio.stopSound(oscillator);
    }

    oscillator.unpause = function () {
        oscillator = audio.createSound(oscillator.oldHz, oscillator.oldWaveType);
        oscillator.gainNode.gain.value = oscillator.oldGain;
        return oscillator;
    }

    return oscillator;
}

audio.stopSound = function (oscillator) {
    oscillator.stop();
    audio.soundsPlaying--;
}

audio.playSound = async function (hz, time, waveType) {
    const oscillator = audio.createSound(hz, waveType);

    return new Promise((resolve, reject) => setTimeout(() => {
        oscillator.stop();
        audio.soundsPlaying--;
    }, time));
}

audio.playRangeSound = async function (hzS, hzE, time, waveType) {
    const oscillator = audio.createSound(hzS, waveType);

    const startTime = +Date.now();

    function getTimeSinceStart() {
        return -(startTime - (+Date.now()));
    }

    var interval = setInterval(function () {
        if (getTimeSinceStart() >= time) {
            oscillator.stop();
            audio.soundsPlaying--;
            clearInterval(interval);
        } else {
            var pr = Math.random();
            oscillator.frequency.value = ((1 - pr) * hzS) + (pr * hzE);
        }
    }, 10);
}

audio.playMovingSound = async function (hzS, hzE, time, waveType) {
    const oscillator = audio.createSound(hzS, waveType);

    const startTime = +Date.now();

    function getTimeSinceStart() {
        return -(startTime - (+Date.now()));
    }

    var interval = setInterval(function () {
        if (getTimeSinceStart() >= time) {
            oscillator.stop();
            audio.soundsPlaying--;
            clearInterval(interval);
        } else {
            var pr = (getTimeSinceStart() / time);
            oscillator.frequency.value = ((1 - pr) * hzS) + (pr * hzE);
        }
    }, 10);
}

audio.setHz = function (oscillator, Hz) {
    oscillator.frequency.value = Hz;
}