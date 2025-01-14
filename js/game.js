import { update, draw } from "./functions.js";
import { Platform } from "./platform.js";
import {Player} from "./player.js";
import { Enemy } from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const minDistPlatform = 100;
let lastTime = 0;
let worldOffsetX = 0;



const player = new Player(50, canvasHeight / 2);
const platforms = [
  new Platform(1, 600, 200, 20),
  new Platform(300, 500, 200, 20),
  new Platform(100, 300, 200, 20),
  new Platform(400, 400, 200, 20),
  new Platform(600, 200, 200, 20),
  new Platform(200, 100, 200, 20),
  new Platform(500, 700, 200, 20),
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
  if (event.key === "ArrowLeft" || event.key === "ArrowRight")
    if (!player.moveDirection == 0 && !player.mustStop) player.stop(); // Arrêter le mouvement horizontal
});

function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;




  // Efface l'écran
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Logique et rendu
  enemies = update(deltaTime, player, platforms, enemies);
  draw(player, platforms, enemies);

  // Appel récursif
  requestAnimationFrame(gameLoop);
  
}
requestAnimationFrame(gameLoop);



