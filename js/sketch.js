function Star() {
  this.x = random(-window.outerWidth, window.outerWidth);
  this.y = random(-window.outerHeight, window.outerHeight);
  this.z = random(window.outerWidth);
  this.pz = this.z;
  this.update = () => {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = window.outerWidth;
      this.x = random(-window.outerWidth, window.outerWidth);
      this.y = random(-window.outerHeight, window.outerHeight);
      this.pz = this.z;
    }
  };
  this.show = () => {
    fill(255);
    noStroke();

    let sx = map(this.x / this.z, 0, 1, 0, window.outerWidth);
    let sy = map(this.y / this.z, 0, 1, 0, window.outerHeight);

    var r = map(this.z, 0, window.outerWidth, 16, 0);
    ellipse(sx, sy, r, r);

    var px = map(this.x / this.pz, 0, 1, 0, window.outerWidth);
    var py = map(this.y / this.pz, 0, 1, 0, window.outerHeight);

    this.pz = this.z;

    stroke(255);
    line(px, py, sx, sy);
  };
}

let stars = [];

let speed;

function setup() {
  var canvas = createCanvas(window.outerWidth-18, window.outerHeight-70);
  for (let i = 0; i < 800; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  speed = map(mouseX, 0, window.outerWidth, 0, 50)
  background(52,152,219)
  tint(255, 127); 
  translate(window.outerWidth / 2, window.outerHeight / 2);
  for (let l = 0; l < 800; l++) {
    stars[l].update();
    stars[l].show();
  }
}
