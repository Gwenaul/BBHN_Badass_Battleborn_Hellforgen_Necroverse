import { update, draw } from "./functions.js";
import { Platform } from "./platform.js";
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { DitheringProcessor } from "./ditheringProcessor.js"; // Ajoute ton fichier dithering
import { randomizeSettings  } from "./ditheringProcessor.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let lastTime = 0;

const ditheringCanvas = document.createElement("canvas");
ditheringCanvas.width = canvasWidth;
ditheringCanvas.height = canvasHeight;

const ditheringProcessor = new DitheringProcessor(ditheringCanvas);

// Charger l'image de l'arrière-plan
const backgroundImg = new Image();
backgroundImg.src = "./assets/images/background.png";
// Chargement des backgrounds
const midImg = new Image();
const frontImg = new Image();
midImg.src = "./assets/images/middle.png";
frontImg.src = "./assets/images/front.png";

let xFront = 0;
let yFront = canvas.height - 550;
// let yFront = canvas.height - frontImg.height;
let xMid = 0;
let yMid = canvas.height - 550;
// let yMid = canvas.height - midImg.height;

const player = new Player(50, canvasHeight / 2);

const platforms = [
  new Platform(1, 600, 200, 20),
  new Platform(300, 500, 200, 20),
  new Platform(600, 300, 200, 20),
  new Platform(800, 300, 200, 20),
  new Platform(1000, 300, 200, 20),
  new Platform(1200, 300, 200, 20),
  new Platform(1400, 400, 200, 20),
  new Platform(1600, 200, 200, 20),
  new Platform(1900, 100, 200, 20),
  new Platform(2600, 700, 200, 20),
];

let enemies = [
  new Enemy(120, 300 - 40, platforms[2]), // Ennemis sur la première plateforme
  new Enemy(420, 400 - 40, platforms[3]),
];

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") player.move("left");
  if (event.key === "ArrowRight") player.move("right");
  if (event.key === "ArrowUp") player.jump();
  if (event.key === " ") player.shoot(); // Touche espace pour tirer
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") player.stop();
});

export async function applyDitheringToImage(
  img,
  palette,
  strength
) {
  // Crée un canvas temporaire pour cette image
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvasWidth;
  tempCanvas.height = canvasHeight;
  const tempCtx = tempCanvas.getContext("2d");

  // Charge l'image sur le canvas temporaire
  await ditheringProcessor.loadImage(img.src);
  ditheringProcessor.palette = palette;
  ditheringProcessor.strength = strength;
  ditheringProcessor.applyDithering();

  // Dessine le résultat sur le canvas temporaire
  tempCtx.drawImage(ditheringCanvas, 0, 0);

  // Retourne une nouvelle image à partir du canvas temporaire
  const ditheredImg = new Image();
  ditheredImg.src = tempCanvas.toDataURL();
  return ditheredImg;
}


// Fonction pour appliquer le dithering sur l'image du background
let ditheredBackground;
let ditheredMidImg;
let ditheredFrontImg;

async function initBackgrounds() {
  // Appliquer le dithering aux backgrounds
  ditheredMidImg = await applyDitheringToImage(midImg, "color", 0.6);
  ditheredFrontImg = await applyDitheringToImage(frontImg, "color", 0.6);
  ditheredBackground = await applyDitheringToImage(backgroundImg, "color", 0.6);
}

// Variable pour le décalage du background
let backgroundOffsetX = 0;



// Fonction pour dessiner le background avec scroll
function drawBackground() {
  // Déplacement du background pour l’effet de parallax
  backgroundOffsetX -= player.moveDirection * player.speed * 0.1;

  // Répétition horizontale du background
  const bgWidth = canvasWidth;
  const bgHeight = canvasHeight;

  for (let i = -1; i < 2; i++) {
    ctx.drawImage(
      ditheredBackground,
      backgroundOffsetX + i * bgWidth,
      0,
      bgWidth,
      bgHeight
    );
  }

  // Réinitialise l'offset pour éviter les dépassements
  if (backgroundOffsetX <= -bgWidth) {
    backgroundOffsetX += bgWidth;
  } else if (backgroundOffsetX >= bgWidth) {
    backgroundOffsetX -= bgWidth;
  }
}

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Efface l'écran
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Effet de scrolling si le joueur atteint le milieu de l'écran
  if (player.x >= canvasWidth / 2) {
    const scrollSpeed = player.moveDirection * player.speed;
    xMid -= scrollSpeed / 4;
    xFront -= scrollSpeed / 1.5;
  }
  // Dessiner le background avec l'effet de scroll
  drawBackground();

  // Dessiner les backgrounds dithered
  ctx.drawImage(
    ditheredMidImg, 
    xMid, 
    yMid, 
    midImg.width, 
    midImg.height);
    
  ctx.drawImage(
    ditheredFrontImg,
    xFront,
    yFront,
    frontImg.width,
    frontImg.height
  );

  // Dessiner les autres éléments (parallax, joueur, plateformes, ennemis)
  enemies = update(deltaTime, player, platforms, enemies);
  draw(player, platforms, enemies);

  requestAnimationFrame(gameLoop);
}
// Initialisation
initBackgrounds().then(() => {
  requestAnimationFrame(gameLoop);
});

document
  .getElementById("randomizeButton")
  .addEventListener("click", randomizeSettings);

const button = document.getElementById("processImage");
button.addEventListener("click", () => {
  console.log("Processing image...");
  // Initialisation
  initBackgrounds()
  player.initPlayer()
  enemies.update()
});

// Bouton pour ouvrir/fermer les contrôles
document.getElementById("toggleControlsButton").addEventListener("click", function() {
  const controls = document.getElementById("controls");
  
  // Bascule la classe 'open' pour afficher/masquer le volet
  controls.classList.toggle("open");
  
  // Change le texte du bouton selon l'état du volet
  this.textContent = controls.classList.contains("open") ? "Fermer les contrôles" : "Ouvrir les contrôles"; 
});

// Bouton à l'intérieur du volet pour fermer
document.getElementById("closeControlsButton").addEventListener("click", function() {
  const controls = document.getElementById("controls");
  
  // Ferme le volet
  controls.classList.remove("open");

  // Réinitialise le texte du bouton d'ouverture
  document.getElementById("toggleControlsButton").textContent = "Ouvrir les contrôles";
});




