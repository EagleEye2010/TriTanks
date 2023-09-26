var bullets = [];
var mines = [];

class Bullet {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = null;
    this.targetY = null;
    this.angle = 0;
    this.w = 5;
    this.h = this.w*10;
    this.t = 'yellow';
  }
  setD(x,y,a,t) {
    this.type = t;
    this.w = tank[this.type].width;
    this.h = tank[this.type].height;
    this.x = x;
    this.y = y;
    this.angle = a;
  }
  update(x,y,a) {
    this.x = x;
    this.y = y;
    this.angle = a;
    this.targetX = x;
    this.targetY = y;
  }
  draw() {

    // Interpolate frames
    if (this.targetX != null) {
      this.x += (this.targetX - this.x) * 0.16;
      this.y += (this.targetY - this.y) * 0.16;
    }

    let x = this.x - player.x;
    let y = this.y - player.y;
    ctx.save();
    ctx.translate(x + this.w/2, y + this.h/2);
    ctx.rotate(this.angle + Math.PI/2);
    ctx.translate(-x - this.w/2, -y - this.h/2);

    let gradient = ctx.createLinearGradient(x,y,x+this.w,y+this.h);
    gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.w, this.h);

    ctx.restore();
  }
}

class Mine {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.t = 'yellow';
    this.exploded = false;
    this.r = 1;
  }
  setD(x,y,t) {
    this.x = x;
    this.y = y;
    this.t = t;
  }
  draw() {
    let x = this.x - player.x;
    let y = this.y - player.y;

    ctx.beginPath();
    ctx.fillStyle = tank[this.t].color.fill;
    ctx.strokeStyle = tank[this.t].color.border;
    ctx.lineWidth = 4;
    ctx.arc(x,y,20,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  explode() {
    let x = this.x - player.x;
    let y = this.y - player.y;

    this.exploded = true;
    ctx.beginPath();
    let gradient = ctx.createRadialGradient(x,y,this.r,x,y,this.r*10);
    gradient.addColorStop(0,'rgba(203,0,0,0.5)');
    gradient.addColorStop(1,'rgba(203,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.arc(x,y,this.r * 10,0,Math.PI*2);
    ctx.fill();
    ctx.closePath();

    if (this.r < 15) {
      this.r += 0.3;
    }
  }
}

// Bullet data --> server --> server searches for collision --> server responds with collision or not