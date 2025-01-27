
export class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "white";
  }
  update(scrollSpeed) {
    this.x -= scrollSpeed; // Appliquer le défilement uniquement lorsqu'il y a un scrollSpeed
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
