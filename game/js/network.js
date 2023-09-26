// Network

/*
Strategy
Get tank data --> send data loaded message to server on data load --> join, adding yourself
*/

var socket = io();

// Emitters
function join() {
  socket.emit('join', username.name, username.room, username.type);
}

function leave() {
  socket.emit('leave');
  clearInterval(interval);
}

function update() {
  socket.emit('update', impulses);
  impulses = {};
}

// Receivers
socket.on('joined', (name,t) => {
  // When someone joins, (user included), add a new tank.
  console.log(name + ' joined.');
  tanks[name] = new Tank();
  tanks[name].setD(t.x,t.y,t.a,t.t,t.h,t.id,t.socket);
});

socket.on('data', (t,b,m) => {
  document.body.style.backgroundImage = 'none';
  // make all the tanks/bullets already in use before appearing before everyone
  for (let i in t) {
    tanks[t[i].id] = new Tank();
    tanks[t[i].id].setD(t[i].x,t[i].y,t[i].a,t[i].t,t[i].h,t[i].id);
  }

  for (let i in b) {
    bullets[i] = new Bullet();
    bullets[i].setD(b[i].x,b[i].y,b[i].a,b[i].t)
  }

  map['wall'] = [];
  map['shadows'] = [];
  map['size'] = {
    w: m['size'].w,
    h: m['size'].h,
  };

  for (let i in m.walls) {
    addMap(m.walls[i].x,m.walls[i].y,m.walls[i].w,m.walls[i].h,'wall');
  }


  for (let i in m.shadows) {
    addMap(m.shadows[i].x,m.shadows[i].y,m.shadows[i].w,m.shadows[i].h,'shadows');
  }

  document.getElementById('menu').style.visibility = 'hidden';
  interval = setInterval(game,1000/60);
  document.getElementById('health').style.visibility = 'visible';
  socket.emit('data-loaded', tankType);
});

socket.on('update', (t,b,m)=> {
    // Update, add, and delete all tanks and bullets
    let bulletSounds = [];
    for (let i = 0; i < b.length; i++) {
      // If the bullet does not exist, create one
      if (bullets[i] == undefined) {
        bullets[i] = new Bullet();
        bullets[i].setD(b[i].x,b[i].y,b[i].a,b[i].t);
        if (!bulletSounds.includes(b[i].t)) {
          bulletSounds.push(b[i].t);
        }
      } else {
        bullets[i].update(b[i].x,b[i].y,b[i].a);
      }
    }
  
    // If client bullets exceeds server bullets, delete bullets
    for (let i = b.length; i < bullets.length; i++) {
      bullets.splice(i,1);
      i--;
    }
  // Tanks
  for (let i in t) {
    if (t[i] == undefined) {
      tanks[t[i].id] = new Tank();
      tanks[t[i].id].setD(t[i].x,t[i].y,t[i].a,t[i].t,t[i].h,t[i].id);
    } else {
      tanks[t[i].id].update(t[i].x,t[i].y,t[i].a);
      tanks[t[i].id].show = t[i].show;
    }

    if (t[i].id == username.name) {
      player.health = t[i].h;
      document.getElementById('health').value = player.health;
      document.getElementById('health').max = tank[t[i].t].health;
    }
  }

  for (let i in m) {
    if (mines[i] == undefined) {
      mines[i] = new Mine();
      mines[i].setD(m[i].x,m[i].y,m[i].color);
    }
  }

  for (let i = m.length; i < mines.length; i++) {
    setTimeout(function(){mines.splice(i,1)},1500);
    mines[i].exploded = true;
  }

  // Play all sounds
  for (let i in bulletSounds) {
    sounds[bulletSounds[i]].cloneNode(true).play();
  }
});

socket.on('confirm', (d) => {
  console.log(d);
});

socket.on('kill', (v,s) => {
  console.log(v + ' was killed by ' + s);
  if (username.name==s) {
    kills++;
    streak++;
    if (date == null) {
      date = new Date();
      date.getMinutes();
    }
    
  } else if(username.name==v) {
    let d = new Date();
    d.getMinutes();
    timeSurvived = d - date;
    console.log(timeSurvived);
    streak = 0;
  }
});

socket.on('chat', (data, name) => {
  let e = document.createElement('p');
  let node = document.createTextNode(name + ': ' + data);
  e.appendChild(node);
  let d = document.getElementById('chat-data')
  d.appendChild(e);
});

socket.on('username-error', () => {
  alert('That username for this room is taken.');
});

socket.on('leave', (name) => {
  delete tanks[name];
});