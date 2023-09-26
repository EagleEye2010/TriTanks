// Game code

var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');

var interval = null;
var date = null;
var timeSurvived = 0;
var canChat = true;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var player = {
  x: 0,
  y: 0,
  health: 0,
  angle: 0,
}

var mouse = {
  x: 0,
  y: 0,
  click: false,
}

var kills = 0;
var streak = 0;

var fps = 0;
var bgfps = 0;

var sounds = [];

var tankType = 'yellow';
var keys = {};
var impulses = {};

var skull = new Image();
skull.src = 'assets/skull.svg';

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mousedown', () => {
  mouse.click = true;
});

window.addEventListener('mouseup', () => {
  mouse.click = false;
});

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function checkKey(key) {
  if (key in keys) {
    if (keys[key]) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function degrees(radians) {
  return radians (Math.PI/180);
}

function game(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (checkKey('w') || checkKey('ArrowUp')) {
    impulses['y'] = 'n';
  } else if (checkKey('s') || checkKey('ArrowDown')) {
    impulses['y'] = 'p';
  }

  if (checkKey('a') || checkKey('ArrowLeft')) {
    impulses['x'] = 'n';
  } else if (checkKey('d') || checkKey('ArrowRight')) {
    impulses['x'] = 'p'
  }

  if (checkKey(' ')) {
    impulses['m'] = true;
  }

  if (mouse.click) {
    impulses['shoot'] = 's';
  }

  if (checkKey('p')) {
    impulses['show'] = false;
  }

  if (checkKey('f')) {
    document.getElementById('player').style.visibility = 'visible';
  }

  if (checkKey('g')) {
    document.getElementById('player').style.visibility = 'hidden';
    document.getElementById('health').style.visibility = 'visible';
  }

  impulses['mouse'] = Math.atan2(mouse.y - canvas.height/2, mouse.x - canvas.width/2);

  drawMap();

  for (let i in bullets) {
    bullets[i].draw();
  }

  for (let i in mines) {
    if (mines[i].exploded) {
      mines[i].explode();
    } else {
      mines[i].draw()
    }
  }

  for (let i in tanks) {
    // If the tank is alive, update/draw the tank. Otherwise, put a grave.

    if (tanks[i].show) {
      tanks[i].draw();
    } else {
      let w = skull.width/3;
      let h = skull.height/3;
      let x = (tanks[i].x - (w/2)) - player.x;
      let y = (tanks[i].y - (h/2)) - player.y;
      ctx.drawImage(skull,x,y,w,h);
      ctx.fillStyle = '#4A4A4A';
      ctx.font = '16px Gill Sans';
      ctx.textAlign = 'center';
      ctx.fillText(i,(tanks[i].x)-player.x,(tanks[i].y + w)-player.y);
    }
  }
  
  drawShadows();

  update();

  ctx.font = '24px Gill Sans';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.fillText('FPS: ' + fps,30,30);
  ctx.fillText('Kills: ' + kills,30,60);
  ctx.fillText('Streak: ' + streak,30,90);
  ctx.fillText('HP: ' + player.health,30,120);

  bgfps++;

  acheivements();
}

function fpsCounter() {
  fps = bgfps;
  bgfps = 0;
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

window.onload = function() {
}

setInterval(fpsCounter,1000);