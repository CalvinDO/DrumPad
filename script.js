var DrumPad;
(function (DrumPad) {
    window.addEventListener('load', init);
    document.addEventListener('keydown', function (event) {
        /*
        if (event.keyCode == 49) {
            playSample(samples[0]);
        }
        else if (event.keyCode == 50) {
            playSample(samples[1]);
        }
        else if (event.keyCode == 51) {
            playSample(samples[2]);
        }
        else if (event.keyCode == 52) {
            playSample(samples[3]);
        }
        else if (event.keyCode == 53) {
            playSample(samples[4]);
        }
        else if (event.keyCode == 54) {
            playSample(samples[5]);
        }
        else if (event.keyCode == 55) {
            playSample(samples[6]);
        }
        else if (event.keyCode == 56) {
            playSample(samples[7]);
        }
        else if (event.keyCode == 57) {
            playSample(samples[8]);
        };
        */
        //---->
        //---->
        // oder auch so:
        var index = +event.key - 1;
        onClickPadButton(samples[index], index);
        //---->
        //---->
        console.log(storedInstrumentsTimes);
    });
    var path = 'assets/L07_task_material_assets_';
    var name = ['kick', 'snare', 'hihat', 'A', 'C', 'F', 'G', 'laugh-1', 'laugh-2'];
    var type = '.mp3';
    var samples = [new Audio(path + name[0] + type), new Audio(path + name[1] + type), new Audio(path + name[2] + type), new Audio(path + name[3] + type), new Audio(path + name[4] + type), new Audio(path + name[5] + type), new Audio(path + name[6] + type), new Audio(path + name[7] + type), new Audio(path + name[8] + type)];
    var timeSinceRecord = 0;
    var timeSincePlay = 0;
    var timeSinceStart = 0;
    var lastFrameTime = new Date().getTime();
    var currentTime = lastFrameTime;
    var deltaTime;
    var recording;
    var playing;
    var sampleKick = samples[0];
    var sampleSnare = samples[1];
    var sampleHihat = samples[2];
    var aKick = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
    var aSnare = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
    var aHihat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
    var index = 0;
    var tempInstrumentsTimes = [];
    var storedInstrumentsTimes = [];
    var buttonList;
    function init(_event) {
        document.querySelector('#kick').addEventListener('click', function () { onClickPadButton(samples[0], 0); });
        document.querySelector('#snare').addEventListener('click', function () { onClickPadButton(samples[1], 1); });
        document.querySelector('#hihat').addEventListener('click', function () { onClickPadButton(samples[2], 2); });
        document.querySelector('#A').addEventListener('click', function () { onClickPadButton(samples[3], 3); });
        document.querySelector('#C').addEventListener('click', function () { onClickPadButton(samples[4], 4); });
        document.querySelector('#F').addEventListener('click', function () { onClickPadButton(samples[5], 5); });
        document.querySelector('#G').addEventListener('click', function () { onClickPadButton(samples[6], 6); });
        document.querySelector('#laugh1').addEventListener('click', function () { onClickPadButton(samples[7], 7); });
        document.querySelector('#laugh2').addEventListener('click', function () { onClickPadButton(samples[8], 8); });
        document.querySelector('#play').addEventListener('click', onPlay);
        document.querySelector('#record').addEventListener('click', onRecord);
        buttonList = document.querySelectorAll(".button-container button");
        initInstrumentTimes();
        animate();
    }
    function onClickPadButton(sample, _index) {
        if (sample === void 0) { sample = new Audio; }
        sample.play();
        if (recording) {
            tempInstrumentsTimes[_index].push(timeSinceRecord);
        }
    }
    function drumMachine() {
        if (aKick[index] == 1)
            sampleKick.play();
        if (aSnare[index] == 1)
            sampleSnare.play();
        if (aHihat[index] == 1)
            sampleHihat.play();
        index += 1;
        if (index > 15)
            index = 0;
    }
    ;
    function onPlay() {
        if (recording) {
            recording = false;
            storeTempInstruments();
        }
        else {
            if (storedInstrumentsTimes) {
                fillUpTempInstrumentTimes();
            }
        }
        playing = true;
        console.log(storedInstrumentsTimes);
        timeSincePlay = 0;
    }
    function initInstrumentTimes() {
        tempInstrumentsTimes = [];
        buttonList.forEach(function (button) {
            tempInstrumentsTimes.push([]);
        });
    }
    function onRecord() {
        initInstrumentTimes();
        playing = false;
        recording = true;
        timeSinceRecord = 0;
    }
    function animate() {
        lastFrameTime = currentTime;
        currentTime = new Date().getTime();
        deltaTime = currentTime - lastFrameTime;
        if (recording) {
            timeSinceRecord += deltaTime;
        }
        if (playing) {
            timeSincePlay += deltaTime;
            tempInstrumentsTimes.forEach(function (instrument) {
                instrument.forEach(function (time) {
                    if (time) {
                        if (timeSincePlay > time) {
                            samples[tempInstrumentsTimes.indexOf(instrument)].play();
                            instrument[instrument.indexOf(time)] = null;
                        }
                    }
                });
            });
        }
        timeSinceStart += deltaTime;
        requestAnimationFrame(animate);
    }
    function fillUpTempInstrumentTimes() {
        tempInstrumentsTimes = [];
        for (var _i = 0, storedInstrumentsTimes_1 = storedInstrumentsTimes; _i < storedInstrumentsTimes_1.length; _i++) {
            var instrument = storedInstrumentsTimes_1[_i];
            var newInstrument = [];
            for (var _a = 0, instrument_1 = instrument; _a < instrument_1.length; _a++) {
                var time = instrument_1[_a];
                newInstrument.push(time);
            }
            tempInstrumentsTimes.push(newInstrument);
        }
    }
    function storeTempInstruments() {
        storedInstrumentsTimes = [];
        for (var _i = 0, tempInstrumentsTimes_1 = tempInstrumentsTimes; _i < tempInstrumentsTimes_1.length; _i++) {
            var instrument = tempInstrumentsTimes_1[_i];
            var newInstrument = [];
            for (var _a = 0, instrument_2 = instrument; _a < instrument_2.length; _a++) {
                var time = instrument_2[_a];
                newInstrument.push(time);
            }
            storedInstrumentsTimes.push(newInstrument);
        }
    }
    function isAllNulls() {
        tempInstrumentsTimes.forEach(function (instrument) {
            instrument.forEach(function (time) {
                if (time) {
                    return false;
                }
            });
        });
        return true;
    }
})(DrumPad || (DrumPad = {}));
//# sourceMappingURL=script.js.map