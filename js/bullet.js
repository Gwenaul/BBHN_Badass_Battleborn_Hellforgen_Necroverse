

const canvas = document.getElementById("gameCanvas");
const canvasWidth = canvas.width;

export class Bullet {
  constructor(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 5;
    this.speed = 7 * orientation;
    this.color = "yellow";
  }

  update() {
    this.x += this.speed;
  }

  outOfBounds() {
    return this.x > canvasWidth;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}