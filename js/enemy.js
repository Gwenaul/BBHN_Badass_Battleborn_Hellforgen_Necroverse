



export class Enemy {
  constructor(x, y, platform) {
    this.isFrog = (Math.random() > 0.5);
    this.img = new Image();
    this.img.src = this.isFrog
      ? "./assets/images/frog.png"
      : "./assets/images/mechant.png";
    this.baseWidth = this.isFrog? 80 : 60;
    this.baseHeight = this.isFrog ? 80 : 60;
    this.yRatio = this.img.height / this.baseHeight;
    this.xRatio = this.img.width / this.baseWidth;
    this.width = this.img.width / this.xRatio;
    this.height = this.img.height / this.yRatio;
    this.x = x + this.baseWidth - this.img.width / this.xRatio;
    this.y = y + (this.isFrog ? this.baseHeight / 3 : this.baseHeight/1.5) - this.img.height / this.yRatio;
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
    img.src = this.isFrog
      ? "./assets/images/frog.png":"./assets/images/mechant.png";
    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.img.width / this.xRatio,
      this.img.height / this.yRatio
    );
    // ctx.fillStyle = this.color;
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
