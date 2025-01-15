
import { Bullet } from "./bullet.js";


const maxLives = 3;
const canvas = document.getElementById("gameCanvas");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

export class Player {
  constructor(x, y) {
    this.img = new Image();
    this.img.src = "./assets/images/first_sprite_right.png";
    this.x = x;
    this.y = y;
    this.lives = maxLives;
    this.isDead=false;
    this.coolDown = 0;
    this.mustStop = false;
    this.slowing = 0.85;
    this.baseWidth = 50;
    this.ratio = this.img.width / this.baseWidth;
    this.width = this.img.width/this.ratio;
    this.height = this.img.height/this.ratio;
    this.speed = 5;
    this.dy = 0; // Vitesse verticale (chute)
    this.gravity = 0.75; // Gravité
    this.jumpStrength = -17; // Force du saut
    this.isOnGround = false; // Indicateur si le joueur est sur une plateforme
    this.moveDirection = 0; // 1 pour droite, -1 pour gauche, 0 pour immobile
    this.color = "blue";
    this.bullets = [];
    this.orientation = 1; //par defaut regarde a droite
  }
  move(direction) {
    this.mustStop = false;
    if(!this.isDead){ 
    if (direction === "left") this.moveDirection = -1;
    if (direction === "right") this.moveDirection = 1;
    this.orientation = this.moveDirection;
    }
  }

  stop() {
    this.mustStop = true;
  }
  shoot() {
        if(!this.isDead){ 
    this.bullets.push(
      new Bullet(
        this.orientation == -1 ? this.x : this.x + this.width,
        this.y + this.height / 2,
        this.orientation
      )
    );
  }
  }
  jump() {
        if(!this.isDead){ 

    if (this.isOnGround) {
      this.dy = this.jumpStrength; // Applique la force du saut
      this.isOnGround = false;
    } else if (!this.hasDoubleJumped) {
      this.dy = this.jumpStrength;
      this.hasDoubleJumped = true;
    }
  }
  }
  dead() {
    this.isDead = true;
    this.stop();
  }

  update(platforms) {
    this.previousY = this.y;
    let inertia = this.slowing;
    //applique le stop lent
    if (!this.isOnGround) inertia = this.slowing + 0.12;
    if (this.mustStop && this.moveDirection != 0) this.moveDirection *= inertia;
    else this.mustStop = false;

    // Applique la gravité
    this.dy += this.gravity;
    this.y += this.dy;
    this.isOnGround = false; // Réinitialise l'état de "sur le sol"
    // Détecter la collision avec chaque plateforme
    platforms.forEach((platform) => {
      // Vérifier la collision horizontale et verticale
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y &&
        this.y + this.height < platform.y + platform.height &&
        this.previousY + this.height <= platform.y
      ) {
        if (this.dy >= 0) {
          this.dy = 0; // Arrête la chute
          this.isOnGround = true;
          this.y = platform.y - this.height; // Placer le joueur sur la plateforme
        }
        //peu importe l'inertie, double saut possible
        this.hasDoubleJumped = false;
      }
    });
    // Déplace le joueur horizontalement en fonction de la direction
    this.x += this.moveDirection * this.speed;
    // Limiter les mouvements horizontaux aux bords de l'écran
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
    // Si le joueur tombe en dehors de l'écran
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
      this.dy = 0;
      this.isOnGround = true;
      this.hasDoubleJumped = false;
    }
    this.bullets.forEach((bullet) => bullet.update(this.orientation));
    this.bullets = this.bullets.filter((bullet) => !bullet.outOfBounds());

    if (this.lives <= 0) this.dead();

    if (this.coolDown > 0) this.coolDown--;

    let textZone = document.getElementById("lives");
    textZone.textContent = "Vies : " + this.lives;
  }
  draw(ctx) {
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    // Dessine les projectiles
     this.img.src = this.isDead
       ? "./assets/images/dead.png"
       : this.orientation == 1
       ? "./assets/images/first_sprite_right.png"
       : "./assets/images/first_sprite_left.png";
     
     ctx.drawImage(
       this.img,
       this.x + this.width - this.img.width / this.ratio,
       this.y + this.height - this.img.height / this.ratio,
       this.img.width / this.ratio,
       this.img.height / this.ratio
     );
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}