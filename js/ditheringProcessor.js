export class DitheringProcessor {
  constructor(canvas, strength, palette) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.strength = strength; // Force du dithering (entre 0 et 1)
    this.palette = palette; // Palette utilisée
  }
  
  // Applique le dithering avec la force et la palette sélectionnées
  applyDithering() {

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;

    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const index = (y * this.canvas.width + x) * 4;

        // Valeurs des pixels
        const oldR = data[index];
        const oldG = data[index + 1];
        const oldB = data[index + 2];

        // Nouvelle valeur quantifiée (dépend de la palette)
        const [newR, newG, newB] = this.quantize(oldR, oldG, oldB);

        const strength = parseFloat(
          document.getElementById("ditheringStrength").value
        );
        // Erreur de quantification ajustée par la force
        const errR = (oldR - newR) * strength;
        const errG = (oldG - newG) * strength;
        const errB = (oldB - newB) * strength;

        // Mise à jour du pixel courant
        data[index] = newR;
        data[index + 1] = newG;
        data[index + 2] = newB;

        // Propagation de l'erreur
        this.distributeError(data, this.canvas.width, x, y, errR, errG, errB);
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  quantize(r, g, b) {
    const palette = 
      document.getElementById("paletteSelector").value
    ;
    const redThreshold = parseInt(
      document.getElementById("thresholdRed").value
    );
    const greenThreshold = parseInt(
      document.getElementById("thresholdGreen").value
    );
    const blueThreshold = parseInt(
      document.getElementById("thresholdBlue").value
    );

    switch (palette) {
      case "grayscale": {
        const avg = Math.round((r + g + b) / 3);
        const gray = avg > 127 ? 255 : 0;
        return [gray, gray, gray];
      }
      case "color": {
        return [
          r > redThreshold ? 255 : 0,
          g > greenThreshold ? 255 : 0,
          b > blueThreshold ? 255 : 0,
        ];
      }
      case "blackWhite":
      default:
        const bw = (r + g + b) / 3 > 127 ? 255 : 0;
        return [bw, bw, bw];
    }
  }

  distributeError(data, width, x, y, errR, errG, errB) {
    const right = parseFloat(document.getElementById("errorRight").value);
    const bottomLeft = parseFloat(
      document.getElementById("errorBottomLeft").value
    );
    const bottom = parseFloat(document.getElementById("errorBottom").value);
    const bottomRight = parseFloat(
      document.getElementById("errorBottomRight").value
    );

    const errorDistribution = [
      [right, 0, 1], // Droite
      [bottomLeft, -1, 1], // Bas-Gauche
      [bottom, 0, 1], // Bas
      [bottomRight, 1, 1], // Bas-Droite
    ];

    errorDistribution.forEach(([factor, dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < width) {
        const newIndex = (newY * width + newX) * 4;

        data[newIndex] = Math.min(
          255,
          Math.max(0, data[newIndex] + errR * factor)
        );
        data[newIndex + 1] = Math.min(
          255,
          Math.max(0, data[newIndex + 1] + errG * factor)
        );
        data[newIndex + 2] = Math.min(
          255,
          Math.max(0, data[newIndex + 2] + errB * factor)
        );
      }
    });
  }

  // Méthode utilitaire pour charger une image
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }
}

export function randomizeSettings() {
  // Randomiser les seuils de quantification pour chaque canal RGB
  document.getElementById("thresholdRed").value = Math.floor(
    Math.random() * 256
  );
  document.getElementById("thresholdGreen").value = Math.floor(
    Math.random() * 256
  );
  document.getElementById("thresholdBlue").value = Math.floor(
    Math.random() * 256
  );

  // Randomiser les poids de distribution de l'erreur
  document.getElementById("errorRight").value = Math.random().toFixed(2); // Entre 0 et 1
  document.getElementById("errorBottomLeft").value = Math.random().toFixed(2); // Entre 0 et 1
  document.getElementById("errorBottom").value = Math.random().toFixed(2); // Entre 0 et 1
  document.getElementById("errorBottomRight").value = Math.random().toFixed(2); // Entre 0 et 1
}


