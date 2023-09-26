// Map data
var map = {};

function addMap(x,y,w,h,t) {
  map[t].push({x:x,y:y,w:w,h:h});
}

function drawMap() {
  // Background
  ctx.fillStyle = '#CFCFCF';
  ctx.fillRect(0-player.x,0-player.y,map['size'].w,map['size'].h);

  ctx.strokeStyle = '#B1B1B1';
  ctx.lineWidth = 3;

  let y = 0;
  let x = 0;
  ctx.beginPath();
  while (y < map['size'].h) {
    ctx.moveTo(x - player.x, y - player.y);
    ctx.lineTo((x + map['size'].w) - player.x, (y) - player.y);
    y += 125;
  }
  y = 0;
  while (x < map['size'].w) {
    ctx.moveTo(x-player.x,y-player.y);
    ctx.lineTo(x-player.x,(y+map['size'].h) - player.y);
    x += 125;
  }

  ctx.stroke();
  ctx.closePath();

  // Draw the walls
  for (let i in map['wall']) {
    ctx.fillStyle = 'black';
    ctx.fillRect(map['wall'][i].x-player.x,map['wall'][i].y-player.y,map['wall'][i].w,map['wall'][i].h);
  }
}

function drawShadows() {
  // Shadows
  for (let i in map['shadows']) {
    ctx.fillStyle = '#575757';
    let s = map['shadows'][i];
    ctx.fillRect(s.x-player.x,s.y-player.y,s.w,s.h);
  }
}

function clearMap() {
  map = [];
}