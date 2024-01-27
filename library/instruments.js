
// piano
const getFileNamePiano = (index) => {
     return `piano-${index}`;
}
const getPianoURL = (index) => {
     return `./audios/grandpiano/${getFileNamePiano(index)}.mp3`;
}
let pianoKeys = [];
for(let i = 0; i < 72; i++){
     const audio = new Audio(getPianoURL(i));
     audio.currentTime = 0;
     audio.volume = 0.4; 
     pianoKeys.push(audio);
};
const playPiano = (index) => {
     pianoKeys[index].currentTime = 0;
     pianoKeys[index].play();
};

// piano major
const getPianoMajorURL = (index) => {
     return `./audios/grandpiano-major/${getFileNamePiano(index)}.mp3`;
}
let pianoMajorKeys = [];
for(let i = 0; i < 43; i++){
     const audio = new Audio(getPianoMajorURL(i));
     audio.currentTime = 0;
     audio.volume = 0.4; 
     pianoMajorKeys.push(audio);
}
const playPianoMajor = (index) => {
     pianoMajorKeys[index].currentTime = 0;
     pianoMajorKeys[index].play();
};

// key
const getFileNameKey = (index) => {
     return `key-${index}`;
};

// Bell 
const getBellURL = (index) => {
     return `./audios/bell/${getFileNameKey(index)}.mp3`;
}
let bellKeys = [];
for(let i = 0; i < 61; i++){
     const audio = new Audio(getBellURL(i));
     audio.currentTime = 0;
     audio.volume = 0.4; 
     bellKeys.push(audio);
}
const playBell = (index) => {
     bellKeys[index].currentTime = 0;
     bellKeys[index].play();
};

// Bell Major 
const getBellMajorURL = (index) => {
     return `./audios/bell-major/${getFileNameKey(index)}.mp3`;
}
let bellMajorKeys = [];
for(let i = 0; i < 36; i++){
     const audio = new Audio(getBellMajorURL(i));
     audio.currentTime = 0;
     audio.volume = 0.4; 
     bellMajorKeys.push(audio);
};
const playBellMajor = (index) => {
     bellMajorKeys[index].currentTime = 0;
     bellMajorKeys[index].play();
};

//Bass
const getBassURL = (index) => {
     return `./audios/bass/${getFileNameKey(index)}.mp3`;
}
let bassKeys = [];
for(let i = 0; i < 15; i++){
     const audio = new Audio(getBassURL(i));
     audio.currentTime = 0;
     audio.volume = 0.2; 
     bassKeys.push(audio);
}
const playBass = (index) => {
     bassKeys[index].currentTime = 0;
     bassKeys[index].play();
};

// Harp 
const getHarpURL = (index) => {
     return `./audios/harp/${getFileNameKey(index)}.mp3`;
}
let harpKeys = [];
for(let i = 0; i < 72; i++){
     const audio = new Audio(getHarpURL(i));
     audio.currentTime = 0;
     audio.volume = 0.4; 
     harpKeys.push(audio);
}
const playHarp = (index) => {
     harpKeys[index].currentTime = 0;
     harpKeys[index].play();
};

// Hickory Bells 
const getHickorybellsURL = (index) => {
     return `./audios/hickorybells/${getFileNameKey(index)}.mp3`;
}
let hickorybellsKeys = [];
for(let i = 0; i < 72; i++){
     const audio = new Audio(getHickorybellsURL(i));
     audio.currentTime = 0;
     audio.volume = 0.5; 
     hickorybellsKeys.push(audio);
};
const playHickorybells = (index) => {
     hickorybellsKeys[index].currentTime = 0;
     hickorybellsKeys[index].play();
}

// Nylon Guitar 
const getNylonURL = (index) => {
     return `./audios/nylon/${getFileNameKey(index)}.mp3`;
}
let nylonKeys = [];
for(let i = 0; i < 61; i++){
     const audio = new Audio(getNylonURL(i));
     audio.currentTime = 0;
     audio.volume = 0.5; 
     nylonKeys.push(audio);
}
const playNylon = (index) => {
     nylonKeys[index].currentTime = 0;
     nylonKeys[index].play();
};

export {playPiano, playPianoMajor, playBell, playBellMajor, playHarp, playBass, playHickorybells, playNylon};