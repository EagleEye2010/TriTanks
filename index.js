// Server side code for tritanks
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var SAT = require('sat');
var V = SAT.Vector;

var users = {};
var tanks = {};
var bullets = {};
var rooms = {};
var mines = {};

var maps = {
  chaos: {
    walls: [
      {x:0,y:0,w:1250,h:25},
      {x:0,y:25,w:25,h:1250},
      {x:1225,y:25,w:25,h:1250},
      {x:0,y:1250,w:1250,h:25},

      {x:625,y:250,w:25,h:750},
      {x:250,y:625,w:750,h:25},
    ],
    size: {
      w: 1250,
      h: 1250,
    }
    },
  labyrinth: {
    walls:[
      {x:0,y:0,w:3250,h:25},
      {x:0,y:25,w:25,h:1725},
      {x:0,y:1750,w:3250,h:25},
      {x:3225,y:25,w:25,h:1725},

      {x:725,y:25,w:25,h:475},
      {x:250,y:475,w:500,h:25},
      {x:250,y:500,w:25,h:1000},
      {x:500,y:1000,w:250,h:25},
      {x:725,y:1000,w:25,h:500},
      {x:250,y:1500,w:500,h:25},

      {x:1000,y:250,w:1250,h:25},
      {x:1000,y:275,w:25,h:1250},
      {x:2225,y:275,w:25,h:1250},
      {x:1000,y:1500,w:500,h:25},
      {x:1750,y:1500,w:500,h:25},

      {x:1475,y:750,w:25,h:750},
      {x:1250,y:750,w:250,h:25},
      {x:1000,y:750,w:25,h:500},
      {x:1750,y:750,w:25,h:750},
      {x:1750,y:750,w:250,h:25},

      {x:1250,y:500,w:250,h:25},
      {x:1475,y:275,w:25,h:225},
      {x:1750,y:275,w:25,h:250},
      {x:1750,y:500,w:250,h:25},

      {x:2500,y:25,w:25,h:500},
      {x:2500,y:525,w:500,h:25},
      {x:3000,y:525,w:25,h:1000},
      {x:2500,y:1500,w:500,h:25},
      {x:2500,y:1000,w:25,h:500},
      {x:2500,y:1000,w:250,h:25},
      {x:2750,y:1000,w:25,h:250},
    ],
    size: {
      w: 3250,
      h: 1750,
    }
  },
  shadow: {
    walls: [
      {x:0,y:0,w:2250,h:25},
      {x:0,y:0,w:25,h:2250},
      {x:25,y:2225,w:2225,h:25},
      {x:2225,y:25,w:25,h:2200},

      {x:0,y:750,w:500,h:25},
      {x:0,y:1475,w:500,h:25},
      {x:500,y:750,w:25,h:250},
      {x:500,y:1250,w:25,h:250},
      {x:500,y:1000,w:250,h:25},
      {x:500,y:1225,w:250,h:25},

      {x:500,y:250,w:25,h:250},
      {x:250,y:475,w:250,h:25},

      {x:250,y:1750,w:250,h:25},
      {x:500,y:1750,w:25,h:250},

      {x:750,y:1750,w:25,h:500},
      {x:750,y:1750,w:250,h:25},
      {x:1000,y:1500,w:25,h:275},
      {x:1250,y:1500,w:25,h:250},
      {x:1250,y:1750,w:250,h:25},
      {x:1500,y:1750,w:25,h:500},

      {x:1750,y:1750,w:25,h:250},
      {x:1750,y:1750,w:250,h:25},

      {x:1750,y:750,w:500,h:25},
      {x:1750,y:775,w:25,h:250},
      {x:1500,y:1000,w:250,h:25},
      {x:1500,y:1225,w:275,h:25},
      {x:1750,y:1250,w:25,h:250},
      {x:1750,y:1500,w:500,h:25},

      {x:1750,y:250,w:25,h:225},
      {x:1750,y:475,w:250,h:25},

      {x:750,y:0,w:25,h:500},
      {x:750,y:500,w:250,h:25},
      {x:1000,y:500,w:25,h:250},
      {x:1250,y:500,w:25,h:250},
      {x:1250,y:500,w:250,h:25},
      {x:1500,y:0,w:25,h:500},
    ],
    size: {
      w:2250,
      h:2250,
    },
    shadows: [
      {x:750,y:750,w:750,h:750},
    ]
  }
}

var mapNames = ['chaos','labyrinth','shadow'];

var spawn = {
}

var tank = {
  yellow: {damage:25,health:100,size:25,speed:8,delay:250,recoil:3.5,count:1,accuracy:5,range:1200,width:5,height:50,bs:16},
  green: {damage:20,health:80,size:25,speed:8,delay:225,recoil:3,count:2,accuracy:7,range:900,width:5,height:50,bs:16},
  blue: {damage:120,health:100,size:30,speed:7,delay:1200,recoil:5,count:1,accuracy:0,range:2000,width:15,height:150,bs:35},
  red: {damage:14,health:100,size:25,speed:10,delay:100,recoil:2,count:1,accuracy:4,range:750,width:5,height:50,bs:12},
  purple: {damage:18,health:50,size:15,speed:11,delay:250,recoil:4,count:1,accuracy:2,range:500,width:5,height:50,bs:18},
  black: {damage:13,health:110,size:25,speed:8,delay:700,recoil:4,count:8,accuracy:7,range:500,width:5,height:50,bs:12},
  teal: {damage:15,health:150,size:40,speed:6.5,delay:140,recoil:4,count:1,accuracy:8,range:1000,width:5,height:50,bs:14},
  white: {damage:40,health:100,size:25,speed:7.5,delay:300,recoil:4,count:1,accuracy:2,range:1600,width:10,height:100,bs:28},
  pink: {damage:15,health:130,size:30,speed:8,delay:1700,recoil:5,count:10,accuracy:12,range:700,width:3,height:30,bs:14},
  orange: {damage:22,health:90,size:25,speed:8,delay:600,recoil:4.5,count:4,accuracy:3,range:1100,width:5,height:30,bs:18},
  desert: {damage:60,health:110,size:20,speed:9,delay:500,recoil:3,count:1,accuracy:2,range:1800,width:8,height:80,bs:25},
  ghillie: {damage:35,health:20,size:25,speed:6,delay:700,recoil:3,count:1,accuracy:0,range:1500,width:7,height:70,bs:20},
  mushroom: {damage:8,health:100,size:25,speed:9,delay:50,recoil:4,count:1,accuracy:5,range:700,width:4,height:40,bs:12},
}

app.use(express.static('game'));

function toRadians(degrees) {
  return degrees * (Math.PI/180);
}

io.on('connection', (socket) => {
  users[socket.id] = {username:'UNKNOWN_USER', room: null, timeout:[]},

  socket.on('join', (username,room,t) => {
    let type = 'yellow';
    if (t in tank) {
      type = t;
    }
    // If there is no room already, then create one.
    if (!(room in rooms)) {
      let random = Math.floor(Math.random() * (mapNames.length));

      tanks[room] = {};
      bullets[room] = [];
      mines[room] = [];
      rooms[room] = {
        count: 1,
        names: [],
        map: mapNames[random],
      };
    } else {
      rooms[room].count++;
    }

    // Check for users with the same name
    if (!rooms[room].names.includes(username)) {
      rooms[room].names.push(username);
      socket.join(room);
      users[socket.id] = {username:username,room:room,timeout:[]};

      socket.emit('data', tanks[room], bullets[room], maps[rooms[room].map]);

      // Spawn a tank here
      tanks[room][socket.id] = {
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 100,
        a: 0,
        t: type,
        h: tank[type]['health'],
        id: username,
        size: tank[type]['size'],
        canShoot: true,
        canMine: true,
        mines: 0,
        timeout: null,
        recoil: 0,
        show: true,
        socket: socket.id,
      }
    } else {
      socket.emit('username-error');
    }
  });

  socket.on('data-loaded', () => {
    let name = users[socket.id]['username'];
    let room = users[socket.id]['room'];

    io.to(room).emit('joined', name, tanks[room][socket.id]);
  });

  socket.on('update', (imp) => {
    try {
      let r = users[socket.id]['room'];
      let t = tanks[r][socket.id];
      // Get impulses --> put into object --> send to users
      // x y shoot mouse

      if (tanks[r][socket.id].show) {

        if ('show' in imp) {
          tanks[r][socket.id].show = false;
        }

        if ('x' in imp) {
          let x = imp['x']
          if (x=='p') {
            tanks[r][socket.id].x += tank[t.t].speed - t.recoil;
            if (tryMove(tanks[r][socket.id],rooms[r].map,r)) {
              tanks[r][socket.id].x -= tank[t.t].speed - t.recoil;
            }
          } else if (x=='n') {
            tanks[r][socket.id].x -= tank[t.t].speed - t.recoil;
            if (tryMove(tanks[r][socket.id],rooms[r].map,r)) {
              tanks[r][socket.id].x += tank[t.t].speed - t.recoil;
            }
          }
        }

        if ('y' in imp) {
          let y = imp['y']
          if (y=='p') {
            tanks[r][socket.id].y += tank[t.t].speed - t.recoil;
            if (tryMove(tanks[r][socket.id],rooms[r].map,r)) {
              tanks[r][socket.id].y -= tank[t.t].speed - t.recoil;
            }
          } else if (y=='n') {
            tanks[r][socket.id].y -= tank[t.t].speed - t.recoil;
            if (tryMove(tanks[r][socket.id],rooms[r].map,r)) {
              tanks[r][socket.id].y += tank[t.t].speed - t.recoil;
            }
          }
        }

        if ('mouse' in imp) {
          tanks[r][socket.id].a = imp['mouse'];
        }

        if ('shoot' in imp) {
          if (tanks[r][socket.id].canShoot) {
            for (let i = 0; i < tank[t.t].count; i++) {
              bullets[r].push({
                x: tanks[r][socket.id].x - (tank[tanks[r][socket.id].t].width/2),
                y: tanks[r][socket.id].y - (tank[tanks[r][socket.id].t].height/2),
                a: tanks[r][socket.id].a,
                t: tanks[r][socket.id].t,
                dist: 0,
                sender: tanks[r][socket.id].id,
              });

              let idx = bullets[r].length-1;
              let bs = tank[bullets[r][idx].t].bs;
              bullets[r][idx].x += ((tank[bullets[r][idx].t].height-(tank[tanks[r][socket.id].t].size/2)) + bs) * Math.cos(bullets[r][idx].a);
              bullets[r][idx].y += ((tank[bullets[r][idx].t].height-(tank[tanks[r][socket.id].t].size/2)) + bs) * Math.sin(bullets[r][idx].a);
              bullets[r][idx].a += toRadians((Math.random()*tank[t.t].accuracy) - tank[t.t].accuracy/2);
            }


            tanks[r][socket.id].canShoot = false;
            tanks[r][socket.id].recoil = tank[tanks[r][socket.id].t].recoil;
            users[socket.id].timeout.push(setTimeout(function(){tanks[r][socket.id].canShoot=true;tanks[r][socket.id].recoil=0;},tank[t.t].delay));
          }
        }

        if ('m' in imp && tanks[r][socket.id].show && tanks[r][socket.id].mines < 5) {
          if (tanks[r][socket.id].canMine) {
            tanks[r][socket.id].canMine = false;
            tanks[r][socket.id].mines++;
            mines[r].push({
              x: tanks[r][socket.id].x,
              y: tanks[r][socket.id].y,
              color: tanks[r][socket.id].t,
              owner: socket.id,
            });

            users[socket.id].timeout.push(setTimeout(function(){tanks[r][socket.id].canMine=true},7000));
          }
        }
      }
    } catch(e){}
  });

  socket.on('chat', (data) => {
    let r = users[socket.id].room;
    let n = users[socket.id].username;
    io.to(r).emit('chat',data,n);
  })

  socket.on('disconnect', () => {
    try {
      let n = users[socket.id]['username'];
      let r = users[socket.id]['room'];
      for (let i in users[socket.id]['timeout']) {
        clearTimeout(users[socket.id]['timeout'][i]);
      }
      rooms[r].count--;
      rooms[r].names.splice(rooms[r].names.indexOf(n),1);
      if (rooms[r].count <= 0) {
        mines[r] = [];
        bullets[r] = [];
        delete rooms[r];
      }
      io.to(r).emit('leave',n);
      delete tanks[r][socket.id];
      delete users[socket.id];
    } catch(e) {}
  });
});

function frame() {

  // Go through each room
  for (let r in rooms) {
    let tm = [];
    let bm = [];

    // Create tank models
    for (let i in tanks[r]) {
      if (tanks[r][i].show) {
        let td = tanks[r][i];
        let t = new SAT.Box(new V(td.x - td.size/2,td.y-td.size/2),td.size,td.size).toPolygon();

        tm.push({m:t,s:i});
      }
    }

    // Create bullet models
    for (let l in bullets[r]) {
      let b = bullets[r][l];
      let deleteBullet = false;

      b.w = tank[b.t].width;
      b.h = tank[b.t].height;

      let bullet = new SAT.Box(new V(b.x,b.y),b.w,b.h).toPolygon();
      bullet.setOffset(new V(-b.w/2,-b.h/2));
      bullet.pos.x += b.w/2;
      bullet.pos.y += b.h/2;
      bullet.setAngle(b.a);

      for (let i in maps[rooms[r].map].walls) {
        let m = maps[rooms[r].map].walls[i];
        let map = new SAT.Box(new V(m.x,m.y),m.w,m.h).toPolygon();

        if (SAT.testPolygonPolygon(bullet,map)) {
          deleteBullet = true;
          break;
        }
      }

      if (!deleteBullet) {
        bm.push(bullet);
      }

      for (let i in tm) {
        let s = tm[i].s;
        // Detect collision
        if (SAT.testPolygonPolygon(bullet,tm[i].m)) {
          tanks[r][s].h -= tank[bullets[r][l].t].damage;
          deleteBullet = true;
        }

        if (tanks[r][s].h <= 0) {
          tanks[r][s].show = false;
          tanks[r][s].h = 0;
          users[s].timeout.push(setTimeout(
            function() {
              tanks[r][s].h = tank[tanks[r][s].t].health;
              tanks[r][s].show = true;
          },4500));
          tm.splice(i,1);
          io.to(r).emit('kill',tanks[r][s].id,bullets[r][l].sender);
        }
      }

      // Update the bullets
      bullets[r][l].x += tank[b.t].bs * Math.cos(b.a);
      bullets[r][l].y += tank[b.t].bs * Math.sin(b.a);
      bullets[r][l].dist += tank[b.t].bs;

      if (bullets[r][l].dist > tank[b.t].range) {
        deleteBullet = true;
      }

      if (deleteBullet) {
        bullets[r].splice(l,1);
      }
    }

    // Now go through mines
    for (let l in mines[r]) {
      let mine = new SAT.Circle(new V(mines[r][l].x, mines[r][l].y),20);//TODO: Add mine size
      let deleteMine = false;

      for (let i in tm) {
        // If collided, deal 120 damage to player
        let collided = SAT.testPolygonCircle(tm[i].m, mine);
        if (collided && tm[i].s != mines[r][l].owner) {
          // Decrease mines placed
          tanks[r][mines[r][l].owner].mines--;
          let s = tm[i].s;
          deleteMine = true;
          tanks[r][s].h -= 120;
          if (tanks[r][s].h <= 0) {
            tanks[r][s].h = 0;
            tanks[r][s].show = false;
            users[s].timeout.push(setTimeout(
              function() {
                tanks[r][s].show = true;
                tanks[r][s].h = tank[tanks[r][s].t].health;
              },4500
            ));
            io.to(r).emit('kill',tanks[r][s].id,mines[r][l].owner);
          }
        }
      }

      for (let i in bm) {
        if (SAT.testPolygonCircle(bm[i],mine)) {
          deleteMine = true;
          tanks[r][mines[r][l].owner].mines--;
        }
      }

      if (deleteMine) {
        mines[r].splice(l,1);
      }
    }

    // Finally, send data to each room
    io.to(r).emit('update',tanks[r],bullets[r],mines[r]);
  }
}

function tryMove(b,m) {
  let p = new SAT.Box(new V(b.x - b.size/2,b.y - b.size/2),b.size,b.size).toPolygon();
  let collided = false;
  for (let i in maps[m].walls) {
    let w = new SAT.Box(new V(maps[m].walls[i].x,maps[m].walls[i].y),maps[m].walls[i].w,maps[m].walls[i].h).toPolygon();

    collided = SAT.testPolygonPolygon(p,w);

    if (collided) {
      return true;
    }
  }

  return false;
}

setInterval(frame,16);

server.listen(2010, () => {
  console.log('Listening on port 2010');
});