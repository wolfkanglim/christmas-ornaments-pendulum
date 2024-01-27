
// key
const getFileNameKey = (index) => {
     return `key-${index}`;
};

// Bell Major 
const getBellMajorURL = (index) => {
     return `./assets/audios/bell-major/${getFileNameKey(index)}.mp3`;
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

export {playBellMajor};

