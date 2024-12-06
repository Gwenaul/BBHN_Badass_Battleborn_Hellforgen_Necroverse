export class Enemy {
  constructor(x, y, platform) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 2;
    this.direction = 1; // 1 pour droite, -1 pour gauche
    this.platform = platform; // Plateforme sur laquelle il patrouille
    this.color = "red";
  }

  update(scrollSpeed = 0) {
    // Déplacement horizontal
    this.x += this.speed * this.direction;
    // Changer de direction aux bords de la plateforme
    if (
      this.x <= this.platform.x ||
      this.x + this.width >= this.platform.x + this.platform.width
    ) {
      this.direction *= -1; // Inverser la direction
      // Appliquer le scrolling si nécessaire
      this.x -= scrollSpeed;
            this.x = Math.max(
              this.platform.x,
              Math.min(
                this.x,
                this.platform.x + this.platform.width - this.width
              )
            );

    }
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
