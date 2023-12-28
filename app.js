import Timer from './timer.js';

const tempoDisplay = document.querySelector('.tempo');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const subtractBeats = document.querySelector('.subtract-beats');
const addBeats = document.querySelector('.add-beats');
const measureCount = document.querySelector('.measure-count');

const click1 = new Audio('clickhi.mp3');
const click2 = new Audio('clicklo.mp3');

let beatStates = {};
let bpm = 120;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;

function setupEventListeners() {
  decreaseTempoBtn.addEventListener('click', () => {
      bpm--;
      updateMetronome();
      validateTempo();
  });

  increaseTempoBtn.addEventListener('click', () => {
      bpm++;
      updateMetronome();
      validateTempo();
  });

  tempoSlider.addEventListener('input', () => {
      bpm = tempoSlider.value;
      updateMetronome();
  });

  subtractBeats.addEventListener('click', () => {
      if (beatsPerMeasure <= 2) { return; }
      beatsPerMeasure--;
      displayBeatsRange(beatsPerMeasure);
      count = 0;
  });

  addBeats.addEventListener('click', () => {
      if (beatsPerMeasure >= 12) { return; }
      beatsPerMeasure++;
      displayBeatsRange(beatsPerMeasure);
      count = 0;
  });

  startStopBtn.addEventListener('click', () => {
      count = 0;
      if (!isRunning) {
          metronome.start();
          isRunning = true;
          startStopBtn.textContent = 'Stop';
      } else {
          metronome.stop();
          isRunning = false;
          startStopBtn.textContent = 'Start';
      }
  });
}

setupEventListeners();



function updateMetronome() {
  tempoDisplay.textContent = bpm;
  tempoSlider.value = bpm;
  metronome.timeInterval = 60000 / bpm;
  updateColorBasedOnBPM(bpm);
}

function validateTempo() {
  if (bpm >= 210) { return }
  if (bpm <= 30) { return }
}

function playClick() {
  console.log(count);
  if (count === beatsPerMeasure) {
    count = 0;
  }

  const currentBeatId = `beat-${count + 1}`;
  const currentBeatElement = document.querySelector(`#${currentBeatId}`);
  circleBeat(currentBeatElement);

  if (beatStates[currentBeatId] === 'click1') {
    click1.play();
    click1.currentTime = 0;
  } else if (beatStates[currentBeatId] === 'click2') {
    click2.play();
    click2.currentTime = 0;
  }
  
  count++;
}

function circleBeat(element) { 
  if (element) {
    element.classList.add('circle');
    setTimeout(() => {
      element.classList.remove('circle');
    }, 300);
  }
}

function flashBeat(element) {
if (element) {
  element.style.color = 'black'; 
  setTimeout(() => {
    element.style.color = ''; 
  }, 100);
}
}

const metronome = new Timer(playClick, 60000 / bpm, { immediate: true }); 


function updateColorBasedOnBPM(bpm) {
  const minBPM = 30;
  const maxBPM = 210;
  const ratio = (bpm - minBPM) / (maxBPM - minBPM);
  const red = Math.round(255 * ratio);
  const blue = Math.round(255 * (1 - ratio));
  const color = `rgb(${red}, 0, ${blue})`;
  document.documentElement.style.setProperty('--dynamic-color', color);
}

function displayBeatsRange(beatsPerMeasure) {
  let beatsRange = '';
  beatStates = {};
  for (let i = 1; i <= beatsPerMeasure; i++) {
    beatsRange += `<div class="beat-container"><span class="beat-number" id="beat-${i}">${i}</span></div> `;
    beatStates[`beat-${i}`] = i === 1 ? 'click1' : 'click2';
  }
  measureCount.innerHTML = beatsRange.trim(); 
  for (let i = 1; i <= beatsPerMeasure; i++) {
    const beatElement = document.querySelector(`#beat-${i}`);
    updateBeatAppearance(`beat-${i}`); // Apply initial state
    beatElement.addEventListener('click', () => toggleBeatState(`beat-${i}`));
  }
}



function toggleBeatState(beatId) {
  switch (beatStates[beatId]) {
    case 'click1':
      beatStates[beatId] = 'click2';
      break;
    case 'click2':
      beatStates[beatId] = 'neutral';
      break;
    default:
      beatStates[beatId] = 'click1';
  }
  updateBeatAppearance(beatId);
}

function updateBeatAppearance(beatId) {
  const beatElement = document.querySelector(`#${beatId}`);
  if (beatElement) {
    beatElement.className = 'beat-number'; 
    beatElement.classList.add(beatStates[beatId]);
  }
}

displayBeatsRange(beatsPerMeasure);

