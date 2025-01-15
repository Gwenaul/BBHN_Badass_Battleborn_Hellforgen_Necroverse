



export class Enemy {
  constructor(x, y, platform) {
    this.img = new Image();
    this.img.src = "./assets/images/mechant.png";
    this.x = x;
    this.y = y;
    this.baseWidth = 40;
    this.ratio = this.img.width / this.baseWidth;
    this.width = this.img.width / this.ratio;
    this.height = this.img.height / this.ratio;
    this.speed = 2;
    this.direction = 1; // 1 pour droite, -1 pour gauche
    this.platform = platform; // Plateforme sur laquelle il patrouille
    this.color = "red";
  }

  update() {
    // Déplacement horizontal
    this.x += this.speed * this.direction;
    
    // Changer de direction aux bords de la plateforme
    if (
      this.x <= this.platform.x ||
      this.x + this.width >= this.platform.x + this.platform.width
    ) {
      this.direction *= -1; // Inverser la direction
      // Appliquer le scrolling si nécessaire
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
    let img = new Image();
    img.src = "./assets/images/mechant.png";
    ctx.drawImage(
      this.img,
      this.x + this.baseWidth - this.img.width / this.ratio,
      this.y + this.baseWidth - this.img.height / this.ratio,
      this.img.width / this.ratio,
      this.img.height / this.ratio
    );
    // ctx.fillStyle = this.color;
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
