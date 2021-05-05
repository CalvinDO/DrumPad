namespace DrumPad {
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
        let index = +event.key - 1;
        onClickPadButton(samples[index], index);
        //---->
        //---->


        console.log(storedInstrumentsTimes)
    });




    let path: string = 'assets/L07_task_material_assets_';
    let name: string[] = ['kick', 'snare', 'hihat', 'A', 'C', 'F', 'G', 'laugh-1', 'laugh-2'];
    let type: string = '.mp3';

    let samples: HTMLAudioElement[] = [new Audio(path + name[0] + type), new Audio(path + name[1] + type), new Audio(path + name[2] + type), new Audio(path + name[3] + type), new Audio(path + name[4] + type), new Audio(path + name[5] + type), new Audio(path + name[6] + type), new Audio(path + name[7] + type), new Audio(path + name[8] + type)];

    let timeSinceRecord: number = 0;
    let timeSincePlay: number = 0;
    let timeSinceStart: number = 0;

    let lastFrameTime: number = new Date().getTime();
    let currentTime: number = lastFrameTime;
    let deltaTime: number;

    let recording: boolean;
    let playing: boolean;


    let sampleKick: HTMLAudioElement = samples[0];
    let sampleSnare: HTMLAudioElement = samples[1];
    let sampleHihat: HTMLAudioElement = samples[2];

    let aKick: number[] = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0];
    let aSnare: number[] = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
    let aHihat: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

    let index: number = 0;

    let tempInstrumentsTimes: number[][] = [];
    let storedInstrumentsTimes: number[][] = [];

    let buttonList;

    function init(_event: Event): void {
        document.querySelector('#kick').addEventListener('click', function () { onClickPadButton(samples[0], 0) });
        document.querySelector('#snare').addEventListener('click', function () { onClickPadButton(samples[1], 1) });
        document.querySelector('#hihat').addEventListener('click', function () { onClickPadButton(samples[2], 2) });
        document.querySelector('#A').addEventListener('click', function () { onClickPadButton(samples[3], 3) });
        document.querySelector('#C').addEventListener('click', function () { onClickPadButton(samples[4], 4) });
        document.querySelector('#F').addEventListener('click', function () { onClickPadButton(samples[5], 5) });
        document.querySelector('#G').addEventListener('click', function () { onClickPadButton(samples[6], 6) });
        document.querySelector('#laugh1').addEventListener('click', function () { onClickPadButton(samples[7], 7) });
        document.querySelector('#laugh2').addEventListener('click', function () { onClickPadButton(samples[8], 8) });

        document.querySelector('#play').addEventListener('click', onPlay);
        document.querySelector('#record').addEventListener('click', onRecord);

        buttonList = document.querySelectorAll(".button-container button");

        initInstrumentTimes();


        animate();
    }


    function onClickPadButton(sample = new Audio, _index: number) {
        sample.play();

        if (recording) {
            tempInstrumentsTimes[_index].push(timeSinceRecord)
        }
    }


    function drumMachine() {
        if (aKick[index] == 1) sampleKick.play();
        if (aSnare[index] == 1) sampleSnare.play();
        if (aHihat[index] == 1) sampleHihat.play();
        index += 1;
        if (index > 15) index = 0;
    };


    function onPlay() {
        if (recording) {
            recording = false;
            storeTempInstruments();
        } else {
            if (storedInstrumentsTimes) {
                fillUpTempInstrumentTimes();
            }
        }


        playing = true;
        console.log(storedInstrumentsTimes);

        timeSincePlay = 0;
    }

    function initInstrumentTimes(): void {
        tempInstrumentsTimes = [];
        buttonList.forEach(button => {
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

            tempInstrumentsTimes.forEach(instrument => {
                instrument.forEach(time => {
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

        for (let instrument of storedInstrumentsTimes) {
            let newInstrument: number[] = [];
            for (let time of instrument) {
                newInstrument.push(time);
            }

            tempInstrumentsTimes.push(newInstrument)
        }
    }

    function storeTempInstruments() {
        storedInstrumentsTimes = [];

        for (let instrument of tempInstrumentsTimes) {
            let newInstrument: number[] = [];
            for (let time of instrument) {
                newInstrument.push(time);
            }

            storedInstrumentsTimes.push(newInstrument)
        }
    }

    function isAllNulls(): boolean {
        tempInstrumentsTimes.forEach(instrument => {
            instrument.forEach(time => {
                if (time) {
                    return false;
                }
            });
        });

        return true;
    }
}