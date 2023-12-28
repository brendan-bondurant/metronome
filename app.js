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
  decreaseTempoBtn.addEventListener('click', updateBPM(-1));
  increaseTempoBtn.addEventListener('click', updateBPM(1));
  tempoSlider.addEventListener('input', () => {
    bpm = Math.max(30, Math.min(210, tempoSlider.value));
    updateMetronome();
  });
  subtractBeats.addEventListener('click', updateBeatsPerMeasure(-1));
  addBeats.addEventListener('click', updateBeatsPerMeasure(1));
  startStopBtn.addEventListener('click', toggleMetronome);
}
function updateBPM(change) {
  return () => {
      const newBPM = bpm + change;
      if (newBPM >= 30 && newBPM <= 210) {
          bpm = newBPM;
          updateMetronome();
      }
  };
}
function updateBeatsPerMeasure(change) {
  return () => {
      const newBeatsPerMeasure = beatsPerMeasure + change;
      if (newBeatsPerMeasure >= 2 && newBeatsPerMeasure <= 12) {
          beatsPerMeasure = newBeatsPerMeasure;
          displayBeatsRange(beatsPerMeasure);
          count = 0;
      }
  };
}
function toggleMetronome() {
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
}
setupEventListeners();

function updateMetronome() {
  tempoDisplay.textContent = bpm;
  tempoSlider.value = bpm;
  metronome.timeInterval = 60000 / bpm;
  updateColorBasedOnBPM(bpm);
}

function playClick() {
  resetCountIfNeeded();
  const currentBeatId = `beat-${count + 1}`;
  const currentBeatElement = document.querySelector(`#${currentBeatId}`);
  circleBeat(currentBeatElement);
  playAppropriateClick(currentBeatId);
  count++;
}

function resetCountIfNeeded() {
  if (count === beatsPerMeasure) {
    count = 0;
  }
}

function playAppropriateClick(beatId) {
  const beatState = beatStates[beatId];
  if (!beatState) return;

  switch (beatState) {
    case 'click1':
      playSound(click1);
      break;
    case 'click2':
      playSound(click2);
      break;
    case 'neutral':
      break;
  }
}

function playSound(sound) {
  sound.play();
  sound.currentTime = 0;
}

function circleBeat(element) { 
  if (element) {
    element.classList.add('circle');
    setTimeout(() => {
      element.classList.remove('circle');
    }, 300);
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
    updateBeatAppearance(`beat-${i}`); 
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

