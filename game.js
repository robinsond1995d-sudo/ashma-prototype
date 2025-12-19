// ===============================================================
// ASHMA : WRATH OF PERSIA
// FINAL APOCALYPSE BUILD
// Single File | Canvas Only | Mobile Safe
// DOOM × ACHAEMENID BRUTALITY
// ===============================================================

const C=document.getElementById("game");
const X=C.getContext("2d");
function RS(){C.width=innerWidth;C.height=innerHeight}RS();
addEventListener("resize",RS);

// ================= GLOBAL STATE =================
const G={
 hp:100,rage:0,inRage:false,
 shake:0,flash:0,freeze:0,dark:0,
 blood:[],dust:[],
 end:false,
 update(dt){
  if(this.freeze>0){this.freeze-=dt;return}
  if(this.rage>=100)this.inRage=true;
  this.shake*=0.9;this.flash*=0.85;
  this.dark=this.inRage?Math.min(.7,this.dark+.003):this.dark*.97;

  this.blood=this.blood.filter(b=>b.l>0);
  this.blood.forEach(b=>{b.x+=b.vx;b.y+=b.vy;b.vy+=.2;b.l-=dt});

  this.dust=this.dust.filter(d=>d.l>0);
  this.dust.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.l-=dt});
 },
 impact(px,py,p=1){
  this.shake=34;this.flash=.6;
  this.rage=Math.min(120,this.rage+28*p);
  for(let i=0;i<26;i++)this.blood.push({
   x:px,y:py,
   vx:(Math.random()-.5)*8,
   vy:(Math.random()-.5)*9,
   l:700,r:2+Math.random()*4
  });
 }
};

// ================= INPUT / MOBILE =================
let M={x:0,y:0},LT=0;
C.addEventListener("touchstart",e=>{
 const t=performance.now();
 if(t-LT<260)P.dash();
 LT=t;
});
C.addEventListener("touchmove",e=>{
 const t=e.touches[0];
 M.x=(t.clientX/C.width-.5)*2;
 M.y=(t.clientY/C.height-.5)*2;
});
C.addEventListener("touchend",()=>M.x=M.y=0);

// ================= PLAYER POV =================
const P={
 x:0,y:0,d:0,
 update(){
  const s=this.d>0?7:(G.inRage?4:2.4);
  this.x+=M.x*s;this.y+=M.y*s;
  if(this.d>0)this.d--;
 },
 dash(){
  this.d=12;
  for(let i=0;i<14;i++)G.dust.push({
   x:C.width/2,y:C.height/2,
   vx:(Math.random()-.5)*7,
   vy:(Math.random()-.5)*7,l:350
  });
 },
 draw(){
  X.save();
  X.translate(C.width-150,C.height-110);
  X.rotate(G.inRage?.25:-.2);
  X.fillStyle="#2b1b10";
  X.fillRect(40,-20,16,115);
  X.fillStyle="#666";
  X.beginPath();
  X.moveTo(56,-20);
  X.lineTo(132,34);
  X.lineTo(56,52);
  X.fill();
  X.restore();
 }
};

// ================= BOSS : IMMORTAL GUARD =================
const Boss={
 x:C.width/2,y:C.height/2,
 hp:650,p:0,cd:160,dead:false,
 update(){
  if(this.dead)return;
  if(this.hp<450)this.p=1;
  if(this.hp<220)this.p=2;

  if(this.p==2&&Math.random()<.012)G.freeze=180;

  if(this.cd--<=0){
   G.impact(this.x,this.y,1.3);
   this.cd=160;
  }
 },
 draw(){
  if(this.dead)return;
  const h=80;
  X.fillStyle=["#24170e","#3a260f","#000"][this.p];
  X.fillRect(this.x-20,this.y-h,40,h);
 }
};

// ================= FEAR ENEMIES =================
const mobs=[];
for(let i=0;i<5;i++)mobs.push({
 x:Math.random()*innerWidth,
 y:Math.random()*innerHeight,
 u(){
  if(G.inRage){
   this.x+=(this.x-Boss.x)*.02;
   this.y+=(this.y-Boss.y)*.02;
  }
 },
 d(){
  X.fillStyle=G.inRage?"#420":"#000";
  X.fillRect(this.x-8,this.y-22,16,28);
 }
});

// ================= MAIN LOOP =================
let L=0;
function loop(t){
 const dt=t-L;L=t;
 G.update(dt);P.update();Boss.update();

 X.save();
 X.translate((Math.random()-.5)*G.shake,(Math.random()-.5)*G.shake);
 X.fillStyle="#100804";
 X.fillRect(0,0,C.width,C.height);
 mobs.forEach(m=>{m.u();m.d()});
 Boss.draw();
 X.restore();

 X.fillStyle="#6a0000";
 G.blood.forEach(b=>{X.beginPath();X.arc(b.x,b.y,b.r,0,6.28);X.fill()});

 X.fillStyle="rgba(140,130,100,.4)";
 G.dust.forEach(d=>X.fillRect(d.x,d.y,2,2));

 P.draw();

 // HUD
 X.fillStyle="#200000";X.fillRect(20,20,220,14);
 X.fillStyle="#7a0000";X.fillRect(20,20,220*(G.hp/100),14);
 X.fillStyle=G.inRage?"#ff2400":"#ff9300";
 X.fillRect(20,40,220*Math.min(G.rage/100,1),10);

 if(G.dark>0){
  X.fillStyle=`rgba(0,0,0,${G.dark})`;
  X.fillRect(0,0,C.width,C.height);
 }
 if(G.flash>0){
  X.fillStyle=`rgba(180,50,0,${G.flash})`;
  X.fillRect(0,0,C.width,C.height);
 }

 if(Boss.hp<=0&&!Boss.dead){
  Boss.dead=true;G.end=true;
 }
 if(G.end){
  X.fillStyle="rgba(0,0,0,.85)";
  X.fillRect(0,0,C.width,C.height);
  X.fillStyle="#732";
  X.font="20px monospace";
  X.textAlign="center";
  X.fillText("THE WRATH IS NEVER OVER",C.width/2,C.height/2);
 }

 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
  
