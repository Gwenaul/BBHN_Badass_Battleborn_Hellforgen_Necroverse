import { update, draw } from "./functions.js";
import { Platform } from "./platform.js";
import {Player} from "./player.js";
import { Enemy } from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width=1900;
canvas.height=700;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const minDistPlatform = 100;
let lastTime = 0;
let worldOffsetX = 0;

const midImg = new Image();
const frontImg = new Image();
midImg.src= "./assets/images/middle.png";
midImg.width=canvas.width/2;
midImg.height=canvas.height/2;
frontImg.src = "./assets/images/front.png";
frontImg.width = canvas.width/3;
frontImg.height = canvas.height/3;
let xFront = 0;
let yFront = canvas.height - frontImg.height;
let xMid = 0;
let yMid = canvas.height - midImg.height;
let newXMid=xMid;
let newXFront=xFront;

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
  new Platform(2600, 700, 200, 20)
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

  if (player.x >= canvasWidth / 2) {
    let scrollSpeed = player.moveDirection * player.speed;
    newXMid -= scrollSpeed / 4;
    newXFront -= scrollSpeed / 1.5;

  }

 for (let a = 0; a < 4; a++)
   ctx.drawImage(
     midImg,
     newXMid + (xMid + midImg.width) * a,
     yMid,
     midImg.width,
     midImg.height
   );

 for (let a = 0; a < 6; a++)
   ctx.drawImage(
     frontImg,
     newXFront + (xFront + frontImg.width) * a,
     yFront,
     frontImg.width,
     frontImg.height
   );

  // Logique et rendu
  enemies = update(deltaTime, player, platforms, enemies);
  draw(player, platforms, enemies);

  // Appel récursif
  requestAnimationFrame(gameLoop);
  
}
requestAnimationFrame(gameLoop);