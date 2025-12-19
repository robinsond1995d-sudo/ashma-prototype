const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
onresize = resize;


// ================= GAME =================
const Game = {
  hp:100,
  rage:0,
  inRage:false,
  rageTime:0,
  shake:0,
  flash:0,
  blood:[],
  update(dt){
    if(this.inRage){
      this.rageTime -= dt;
      this.flash = 0.25;
      if(this.rageTime<=0){
        this.inRage=false;
        this.rage=0;
      }
    }
    this.shake*=0.9;
    this.flash*=0.9;

    this.blood.forEach(b=>{
      b.x+=b.vx; b.y+=b.vy;
      b.vy+=0.2; b.life-=dt;
    });
    this.blood=this.blood.filter(b=>b.life>0);
  },
  hit(x,y){
    this.shake=18;
    this.flash=0.6;
    if(!this.inRage)this.rage=Math.min(100,this.rage+20);

    for(let i=0;i<20;i++){
      this.blood.push({
        x,y,
        vx:(Math.random()-0.5)*8,
        vy:(Math.random()-0.5)*8,
        life:700,
        r:2+Math.random()*3
      });
    }

    if(this.rage>=100 && !this.inRage){
      this.inRage=true;
      this.rageTime=2500;
    }
  }
};

// ================= INPUT =================
const input={x:0,y:0};
addEventListener("keydown",e=>{
  if(e.key==="w")input.y=-1;
  if(e.key==="s")input.y=1;
  if(e.key==="a")input.x=-1;
  if(e.key==="d")input.x=1;
});
addEventListener("keyup",e=>{
  if("ws".includes(e.key))input.y=0;
  if("ad".includes(e.key))input.x=0;
});

// ================= PLAYER =================
const player={
  x:canvas.width/2,
  y:canvas.height/2,
  sway:0,
  update(){
    const spd=Game.inRage?4:2.5;
    this.x+=input.x*spd;
    this.y+=input.y*spd;
    this.sway+=Math.abs(input.x)+Math.abs(input.y);
  },
  draw(){
    const cx=canvas.width, cy=canvas.height;
    const sx=Math.sin(this.sway*0.05)*8;
    const sy=Math.cos(this.sway*0.06)*6;

    ctx.save();
    ctx.translate(cx-140+sx, cy-110+sy);
    ctx.rotate(Game.inRage?0.25:-0.2);

    // hand
    ctx.fillStyle="#4b2e1f";
    ctx.fillRect(10,50,50,40);

    // axe handle
    ctx.fillStyle="#2a1a10";
    ctx.fillRect(40,-10,14,120);

    // axe head
    ctx.fillStyle="#555";
    ctx.beginPath();
    ctx.moveTo(54,-10);
    ctx.lineTo(125,20);
    ctx.lineTo(54,50);
    ctx.fill();

    ctx.fillStyle="rgba(150,0,0,.7)";
    ctx.fillRect(80,15,18,12);
    ctx.restore();
  }
};

// ================= ENEMIES =================
const enemies=[];
for(let i=0;i<6;i++){
  enemies.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    fear:0,
    draw(){
      if(Game.inRage){
        this.fear=15;
        this.x+=(Math.random()-0.5)*6;
      }
      ctx.fillStyle=this.fear>0?"#7a0000":"#3a2a1a";
      ctx.fillRect(this.x-10,this.y-25,20,30);
      ctx.fillStyle="#1a0a05";
      ctx.fillRect(this.x-7,this.y-38,14,14);
      if(this.fear>0)this.fear--;
    }
  });
}

// ================= LOOP =================
let last=0;
function loop(t){
  const dt=t-last; last=t;

  Game.update(dt);
  player.update();

  ctx.save();
  ctx.translate((Math.random()-.5)*Game.shake,(Math.random()-.5)*Game.shake);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  enemies.forEach(e=>e.draw());
  ctx.restore();

  // blood
  ctx.fillStyle="#6b0000";
  Game.blood.forEach(b=>{
    ctx.beginPath();
    ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fill();
  });

  player.draw();

  // HUD
  ctx.fillStyle="#200000";
  ctx.fillRect(20,20,220,18);
  ctx.fillStyle="#7a0000";
  ctx.fillRect(20,20,220*(Game.hp/100),18);

  ctx.fillStyle=Game.inRage?"#ff2200":"#ff8800";
  ctx.fillRect(20,44,220*(Game.rage/100),10);

  // screen fx
  if(Game.flash>0){
    ctx.fillStyle=`rgba(200,0,0,${Game.flash})`;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  if(Game.inRage){
    ctx.fillStyle="rgba(255,50,0,.18)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // vignette
  const g=ctx.createRadialGradient(
    canvas.width/2,canvas.height/2,100,
    canvas.width/2,canvas.height/2,Math.max(canvas.width,canvas.height)
  );
  g.addColorStop(0,"rgba(0,0,0,0)");
  g.addColorStop(1,"rgba(0,0,0,.65)");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  requestAnimationFrame(loop);
}
canvas.onclick=e=>Game.hit(e.clientX,e.clientY);
requestAnimationFrame(loop);
  
