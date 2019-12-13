// Einfache Klasse, um Sound wiederzugeben
// Sound-Objekte sollten zu Beginn des Spiels erstellt werden, um im Voraus zu laden.
export default class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play();
  }
  stop() {
    this.sound.pause();
  }
  setLoop(val) {
    this.sound.loop = val;
  }
  setVolume(val) {
    this.sound.volume = val;
  }
}
