import { Platform } from "./platform.js";
import { Enemy } from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1900;
canvas.height = 680;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const maxCoolDown = 100;


function checkCollisions(enemies, player) {
 let newEnemies = enemies.filter((enemy) => {
    const isCollided = player.bullets.some(
      (bullet) =>
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    );
    if (isCollided) return false; // L'ennemi est détruit
    return enemy.x + enemy.width > 0; // Garde les ennemis dans l'écran
  });
  return newEnemies;
}

function canKill(enemies,player) {
  enemies.forEach((enemy) => {
    if (
      player.x <= enemy.x + enemy.width &&
      player.x + player.width >= enemy.x &&
      player.y <= enemy.y + enemy.height &&
      player.y + player.height >= enemy.y &&
      player.coolDown <= 0
    ) {
      player.lives--;
      player.coolDown = maxCoolDown;
    }
  });
}

function generatePlatform(platforms) {
  const platformWidth = Math.random() * 200 + 100; // Largeur entre 100 et 250 pixels
  const platformHeight = 20;
  const platformX = canvasWidth + Math.random() * canvasWidth; // Position hors écran (à droite)
  const platformY = tryPlatform(platformX, platforms); // Hauteur aléatoire (évite le bas de l'écran)
  return new Platform(platformX, platformY, platformWidth, platformHeight);
}
function generateEnemy(platform) {
  const enemyX = platform.x + Math.random() * (platform.width - 40); // Position sur la plateforme
  const enemyY = platform.y - 40; // Juste au-dessus de la plateforme
  return new Enemy(enemyX, enemyY, platform);
}

function tryPlatform(platformX, platforms) {
  const maxHeight = canvasHeight * 0.85;
  const minHeight = canvasHeight * 0.2; // Lower minimum to cover more screen
  const minDistance = 150; // Combined minimum distance check

  // Generate base height in sections to ensure better distribution
  const heightSection = (maxHeight - minHeight) / 3; // Split screen into 3 vertical sections
  const section = Math.floor(Math.random() * 3); // Choose a random section
  const proposedHeight =
    minHeight + section * heightSection + Math.random() * heightSection;

  // Simple distance check from existing platforms
  for (const platform of platforms) {
    const distance = Math.sqrt(
      Math.pow(platformX - platform.x, 2) +
        Math.pow(proposedHeight - platform.y, 2)
    );

    if (distance < minDistance) {
      // If too close to another platform, offset it upward or downward
      return proposedHeight + minDistance;
    }
  }

  return proposedHeight;
}

function update(deltaTime,player,platforms,enemies) {
  player.update(platforms);
  // Si le joueur dépasse le centre de l'écran
  if (player.x > canvasWidth / 2) {
    // Le joueur reste centré, et tout le reste défile
    const scrollSpeed = player.moveDirection * player.speed ;

    player.x = canvasWidth / 2; // Garder le joueur au centre
    platforms.forEach((platform) => platform.update(scrollSpeed));
    enemies.forEach((enemy) => enemy.update(scrollSpeed));
    // Vérifie si des plateformes sortent de l'écran et en génère de nouvelles
    for (let i = platforms.length - 1; i >= 0; i--) {
      const platform = platforms[i];

      // Si la plateforme est sortie de l'écran
      if (platform.x + platform.width < 0) {
        platforms.splice(i, 1); // Supprime la plateforme
        platforms.push(generatePlatform(platforms)); // Ajoute une nouvelle plateforme
      }
    }
  }
  // Limiter à un maximum de 4 ennemis dans le jeu
  if (enemies.length < 2) {
    platforms.forEach((platform) => {
      // Vérifie si un ennemi n'est pas déjà sur la plateforme
      if (
        Math.random() < 0.3 &&
        !enemies.some((enemy) => enemy.platform === platform)
      ) {
        enemies.push(generateEnemy(platform));
      }
    });
  }
  enemies.forEach((enemy) => enemy.update(deltaTime));
  enemies = checkCollisions(enemies, player);
  
  canKill(enemies, player);
  return enemies;
}
function draw(player, platforms, enemies) {
  player.draw(ctx);
  platforms.forEach((platform) => platform.draw(ctx));
  enemies.forEach((enemy) => enemy.draw(ctx));
}

export {
  checkCollisions,
  canKill,
  generatePlatform,
  generateEnemy,
  tryPlatform,
  update,
  draw
};
