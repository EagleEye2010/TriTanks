var tanks = [];
var tank = {
  yellow: {damage:25,health:100,size:25,speed:8,delay:250,recoil:3.5,count:1,accuracy:2,range:1200,width:5,height:50,bs:16,color:{border:'#FFBF00',fill:'#FED049'}},
  green: {damage:30,health:80,size:25,speed:8,delay:225,recoil:3,count:2,accuracy:7,range:900,width:5,height:50,bs:16,color:{border:'#285430',fill:'#5F8D4E'}},
  blue: {damage:80,health:100,size:30,speed:7,delay:1200,recoil:5,count:1,accuracy:0,range:2000,width:15,height:150,bs:35,color:{border:'#0002A1',fill:'#332FD0'}},
  red: {damage:10,health:100,size:25,speed:10,delay:100,recoil:2,count:1,accuracy:4,range:750,width:5,height:50,bs:12,color:{border:'#C21010',fill:'#E64848'}},
  purple: {damage:25,health:50,size:15,speed:12,delay:250,recoil:4,count:1,accuracy:2,range:500,width:5,height:50,bs:18,color:{border:'#810CA8',fill:'#C147E9'}},
  black: {damage:10,health:100,size:25,speed:8,delay:700,recoil:4,count:8,accuracy:7,range:500,width:5,height:50,bs:12,color:{border:'#222222',fill:'#434242'}},
  teal: {damage:15,health:150,size:40,speed:6.5,delay:140,recoil:4,count:1,accuracy:8,range:1000,width:5,height:50,bs:14,color:{border:'#006c6c',fill:'#008080'}},
  white: {damage:40,health:100,size:25,speed:7.5,delay:300,recoil:4,count:1,accuracy:2,range:1600,width:10,height:100,bs:28,color:{border:'#D6E4E5',fill:'#EFF5F5'}},
  pink: {damage:15,health:130,size:30,speed:8,delay:1700,recoil:5,count:10,accuracy:12,range:700,width:3,height:30,bs:14,color:{border:'#F65A83',fill:'#FF87B2'}},
  orange: {damage:11,health:90,size:25,speed:8,delay:600,recoil:4.5,count:4,accuracy:3,range:1100,width:5,height:30,bs:18,color:{border:'#E14D2A',fill:'#FD841F'}},
  desert: {damage:60,health:110,size:20,speed:9,delay:500,recoil:3,count:1,accuracy:2,range:1800,width:8,height:80,bs:25,color:{border:'#92967D',fill:'#C8C6A7'}},
  ghillie: {damage:35,health:20,size:25,speed:6,delay:700,recoil:3,count:1,accuracy:0,range:1500,width:7,height:70,bs:20,color:{border:'rgba(202,202,202,0.7)',fill:'rgba(202,202,202,0.5)'}},
  mushroom: {damage:8,health:100,size:25,speed:9,delay:70,recoil:4,count:1,accuracy:5,range:700,width:4,height:40,bs:12,color:{border:'#EFF5F5',fill:'#DC0000'}},
}

for (let i in tank) {
  sounds[i] = new Audio();
  sounds[i].src = 'assets/sounds/' +i + '.mp3';
}

class Tank {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.size = 40;

    this.targetX = null;
    this.targetY = null;
    this.targetA = null;

    this.angle = 0;
    this.health = 100;
    this.type = 'yellow';
    this.id = username.name;
    this.damage = 25;
    this.show = true;
  }

  setD(x,y,angle,type,health,id) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.type = type;
    this.health = health;
    this.id = id;
    this.size = tank[this.type].size;
  }

  update(x,y,a) {
    this.targetX = x;
    this.targetY = y;
    this.targetA = a;
    console.log(x,y,a);
  }

  draw() {
    // Interpolate
    if (this.targetX != null) {
      this.x += (this.targetX - this.x) * 0.16;
      this.y += (this.targetY - this.y) * 0.16;
      this.angle = this.targetA;
    }

    if (this.id == username.name) {
      player.x = this.x - canvas.width/2;
      player.y = this.y - canvas.height/2;
    }

    let x = this.x - player.x;
    let y = this.y - player.y;

    ctx.font = '16px Gill Sans';
    ctx.textAlign = 'center';
    ctx.fillStyle = tank[this.type].color.border;
    ctx.fillText(this.id,x,y-(this.size*1.25));

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle + Math.PI/2);
    ctx.translate(-x, -y);
    
    ctx.beginPath();
    ctx.strokeStyle = tank[this.type].color.border;
    ctx.fillStyle = tank[this.type].color.fill;
    ctx.lineWidth = this.size/10;

    ctx.moveTo(x, y - this.size/2);
    ctx.lineTo(x - this.size/2, y + this.size/2);
    ctx.lineTo(x + this.size/2, y + this.size/2);
    ctx.lineTo(x,y - this.size/2);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
  }
}