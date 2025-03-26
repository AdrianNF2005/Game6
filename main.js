let started = false; // Variable de control

var firebaseConfig = {
  apiKey: "AIzaSyDF_0fXUVHiauVr83vsVIqBMkoXjNzRKlY",
  authDomain: "san-valero-4b07e.firebaseapp.com",
  databaseURL: "https://san-valero-4b07e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "san-valero-4b07e",
  storageBucket: "san-valero-4b07e.firebasestorage.app",
  messagingSenderId: "200137559098",
  appId: "1:200137559098:web:eab160b3bd45ba282ab903",
  measurementId: "G-0BS3YBJ3KG"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

let MaxScore = 0;

let RecordACT = 0;

let LastUpdate = true;

function HistoricalRecord(data) {
  MaxScore = data.val();
  console.log(data.val());
}

var game = new Game(false, false);

var every_sec = 0;
var restartFromSpaceKeyEnabled = true;
let img;

let Borde;
let customFont;

let millisANT = 0;

let FrameDuck = 8;

function preload() {
  Fondo1 = loadImage("/imgs/Fondo1.png");
  Duck1 = loadImage("/imgs/DuckWalking/0.png");
  Duck2 = loadImage("/imgs/DuckWalking/1.png");
  Duck3 = loadImage("/imgs/DuckWalking/2.png");
  Duck4 = loadImage("/imgs/DuckWalking/3.png");
  Duck5 = loadImage("/imgs/DuckWalking/4.png");
  Duck6 = loadImage("/imgs/DuckWalking/5.png");
  Duck7 = loadImage("/imgs/DuckWalking/6.png");
  Duck8 = loadImage("/imgs/DuckWalking/7.png");
  Duck9 = loadImage("/imgs/DuckWalking/8.png");
  
  customFont = loadFont("/imgs/font1.ttf");
  Borde = loadImage("/imgs/Border.png");
  this.img = loadImage("/imgs/dinosaur-sprite.png");
  this.game.sprite = this.img;
}

function setup(){
      // Crear el iframe oculto inicialmente
    iframe = createElement("iframe");
    iframe.attribute("src", "https://www.youtube.com/embed/S1uWGtqNCzk?autoplay=1&loop=1&playlist=S1uWGtqNCzk&cc_load_policy=0&vq=hd1080");
    iframe.attribute("width", "1280");
    iframe.attribute("height", "718");
    iframe.style("border", "none");
    iframe.style("position", "absolute");
    iframe.style("top", "0");
    iframe.style("left", "0");
    iframe.style("z-index", "10"); // Se muestra arriba del canvas al inicio
  
  createCanvas(1280, 720);
  frameRate(60);
  textFont(customFont);
  textSize(32);
  start();
}

function start(){
  ref = database.ref('Juegos/DinoDuck/HistoricalRecord');
  ref.on('value', HistoricalRecord);
  this.game.load_game(width);
  loop();
}

function restart(){
  let tempScore = this.game.getHighScore();
  let tempDebug = this.game.debug;
  this.game = new Game(true, tempDebug);
  this.game.highScore = tempScore;
  this.game.sprite = this.img;
  start();
}

function draw(){
  checkIfKeyIsPressed();
  clear();
  /*
  if(this.game.night){
    background(32,33,36,0);
  }
  else{
    background(255,0,0,0);
  }
  */
  this.game.update();
  this.game.display();

  if(this.game.started){
    this.game.despawn_entities();
    if(millis() - this.every_sec > 1000 && this.game.score>=30){
      this.every_sec = millis();
      this.game.spawn_entities();
    }
  }
  
  push();
  
  imageMode(CENTER);
  
  image(Borde, width/2, height/2, map(sin(frameCount*0.01), -1, 1, width*1.35, width*1.4), map(sin(frameCount*0.01), -1, 1, height*1.55, height*1.6));

}

function checkIfKeyIsPressed(){
  if (keyIsPressed) {
    if (key === "ArrowUp") {
      this.game.keyPressed("UP");
    }
    else if (key === "ArrowDown") {
      this.game.keyPressed("DOWN");
    }
    else if (key === " ") {
      if (!this.game.player.isAlive() && this.restartFromSpaceKeyEnabled) {
        setTimeout(() => {
          restart();
        }, 200);
      } 
      else if (this.game.player.isAlive() && this.game.started) {
        this.game.keyPressed("UP");
        this.restartFromSpaceKeyEnabled = false;
      } 
      else {
        this.game.player.jump();
      }
    }
  }
}

function keyPressed(){
  if (key === "D" || key === "d") {
    this.game.keyPressed("D");
  }
}
  
function keyReleased() {
  if (key === "ArrowDown") {
    this.game.keyReleased("DOWN");
  } 
  else if (key === " ") {
    this.restartFromSpaceKeyEnabled = true;
    if (!this.game.player.isAlive()) {
      setTimeout(() => {
        restart();
      }, 200);
    }
  }
}

function mousePressed() {
  
iframe.style("z-index", "-20"); // Ahora el canvas está por encima

    if (!started) {
    started = true; // Cambia el estado a iniciado
    console.log("¡El usuario hizo clic! Iniciando...");
  }
  
}
