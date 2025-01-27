import { Bullet } from "./bullet.js";
import { applyDitheringToImage } from "./game.js";

const maxLives = 3;
const canvas = document.getElementById("gameCanvas");
canvas.width = 1900;
canvas.height = 680;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lives = maxLives;
    this.isDead = false;
    this.coolDown = 0;
    this.mustStop = false;
    this.slowing = 0.85;
    this.baseWidth = 50;
    this.width = this.baseWidth;
    this.height = 50;
    this.speed = 5;
    this.dy = 0;
    this.gravity = 0.75;
    this.jumpStrength = -17;
    this.isOnGround = false;
    this.moveDirection = 0;
    this.color = "blue";
    this.bullets = [];
    this.orientation = 1;

    // Charger les images
    this.img = new Image();
    this.imgRight = new Image();
    this.imgLeft = new Image();
    this.imgDead = new Image();

    this.imgRight.src = "./assets/images/first_sprite_right.png";
    this.imgLeft.src = "./assets/images/first_sprite_left.png";
    this.imgDead.src = "./assets/images/dead.png";

    // Initialiser les images dithered
    this.ditheredImgRight = new Image();
    this.ditheredImgLeft = new Image();
    this.ditheredImgDead = new Image();

    this.initPlayer();
  }

  async initPlayer() {
    this.ditheredImgRight = await applyDitheringToImage(
      this.imgRight,
      "color",
      0.6
    );
    this.ditheredImgLeft = await applyDitheringToImage(
      this.imgLeft,
      "color",
      0.6
    );
    this.ditheredImgDead = await applyDitheringToImage(
      this.imgDead,
      "color",
      0.6
    );
  }

  move(direction) {
    this.mustStop = false;
    if (!this.isDead) {
      if (direction === "left") this.moveDirection = -1;
      if (direction === "right") this.moveDirection = 1;
      this.orientation = this.moveDirection;
    }
  }

  stop() {
    this.mustStop = true;
  }

  shoot() {
    if (!this.isDead) {
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
    if (!this.isDead) {
      if (this.isOnGround) {
        this.dy = this.jumpStrength;
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

    if (!this.isOnGround) inertia = this.slowing + 0.12;
    if (this.mustStop && this.moveDirection != 0) this.moveDirection *= inertia;
    else this.mustStop = false;

    this.dy += this.gravity;
    this.y += this.dy;
    this.isOnGround = false;

    platforms.forEach((platform) => {
      if (
        this.x < platform.x + platform.width &&
        this.x + this.width > platform.x &&
        this.y + this.height > platform.y &&
        this.y + this.height < platform.y + platform.height &&
        this.previousY + this.height <= platform.y
      ) {
        if (this.dy >= 0) {
          this.dy = 0;
          this.isOnGround = true;
          this.y = platform.y - this.height;
        }
        this.hasDoubleJumped = false;
      }
    });

    this.x += this.moveDirection * this.speed;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;

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

    if (this.isDead) {
      this.ratio = this.ditheredImgDead.width / this.baseWidth;
      this.width = this.ditheredImgDead.width / this.ratio;
      this.height = this.ditheredImgDead.height / this.ratio;
      this.img = this.ditheredImgDead;
    } else {
      if (this.orientation == 1) {
        this.ratio = this.ditheredImgRight.width / this.baseWidth;
        this.width = this.ditheredImgRight.width / this.ratio;
        this.height = this.ditheredImgRight.height / this.ratio;
        this.img = this.ditheredImgRight;
      } else if (this.orientation == -1) {
        this.ratio = this.ditheredImgLeft.width / this.baseWidth;
        this.width = this.ditheredImgLeft.width / this.ratio;
        this.height = this.ditheredImgLeft.height / this.ratio;
        this.img = this.ditheredImgLeft;
      }
    }
  }

  draw(ctx) {
    if (this.img.width > 0) {
      ctx.drawImage(this.img, this.x, this.y-90, this.width*8, this.height*8);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}
