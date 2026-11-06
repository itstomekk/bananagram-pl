(()=>{
'use strict';
const KEY='bananagram-tutorial-v1';
// This is a scripted DOM demonstration, not a game-engine instance or a source of rules.
// Keep STEPS and SCENES aligned with each other and with the real rules when changing them.
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const seen=()=>{try{return localStorage.getItem(KEY)==='1'}catch{return false}};
const mark=()=>{try{localStorage.setItem(KEY,'1')}catch{}};
let tok=0,idx=0,root,ui={},prevFocus=null;
// Advancing or closing increments tok; pending animation waits then reject and stop the old scene.
const wait=(ms,t)=>new Promise((res,rej)=>setTimeout(()=>t===tok?res():rej(new Error('cancel')),reduce?0:ms));

const STEPS=[
 {title:'Dostajesz płytki',text:'Na start masz 21 liter. Reszta leży we wspólnej puli. Gra jest jednoczesna: bez tur, każdy układa u siebie.'},
 {title:'Układaj słowa',text:'Kliknij literę z ręki, potem puste pole. Słowa łączą się jak w krzyżówce: poziomo i pionowo.'},
 {title:'Skończyły się litery?',text:'Gdy ręka jest pusta, kliknij „Gotowe!”. Wszyscy dobierają po jednej płytce i grają dalej.'},
 {title:'Kto wygrywa?',text:'Gdy w puli jest mniej płytek niż graczy, wygrywa pierwszy, kto ułoży wszystkie swoje. Poprawność słów sprawdzacie sami.'}
];

function build(o={}){
 const box=ui.stage;box.replaceChildren();
 const S={box,cells:[],hand:[],t:tok};
 S.label=el('span','tut-label',o.label||'');S.count=el('span','tut-count',o.count||'');
 const top=el('div','tut-top');top.append(S.label,S.count);
 const board=el('div','tut-board');
 for(let r=0;r<4;r++){S.cells[r]=[];for(let c=0;c<7;c++){const x=el('div','tut-cell');S.cells[r][c]=x;board.append(x)}}
 for(const [k,v] of Object.entries(o.preset||{})){const [r,c]=k.split(',').map(Number);S.cells[r][c].append(el('div','tut-tile',v))}
 S.handEl=el('div','tut-hand');
 const bar=el('div','tut-bar');
 if(o.button){S.btn=el('div','tut-btn off','Gotowe! →');bar.append(S.btn)}
 if(o.players){S.players=el('div','tut-players');bar.append(S.players)}
 S.cursor=el('div','tut-cursor');S.cursor.hidden=true;
 box.append(top,board,S.handEl,bar,S.cursor);

 S.say=x=>{ui.note.textContent=x};
 S.hl=cells=>cells.forEach(c=>c.classList.add('word'));
 S.clear=()=>{S.hand.forEach(t=>t.remove());S.hand=[]};
 S.deal=async(letters,gap=60,total)=>{
  for(const L of letters){const t=el('div','tut-tile drop',L);S.handEl.append(t);S.hand.push(t);if(total)S.count.textContent=S.hand.length+' / '+total;await wait(gap,S.t)}
 };
 S.point=async(target,press=true)=>{
  if(reduce)return;
  const s=box.getBoundingClientRect(),b=target.getBoundingClientRect();
  S.cursor.hidden=false;
  S.cursor.style.left=(b.left-s.left-box.clientLeft+b.width/2-10)+'px';
  S.cursor.style.top=(b.top-s.top-box.clientTop+b.height/2-10)+'px';
  await wait(430,S.t);
  if(press){S.cursor.classList.add('press');await wait(150,S.t);S.cursor.classList.remove('press')}
 };
 S.fly=async(from,to,letter)=>{
  const s=box.getBoundingClientRect(),a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
  const g=el('div','tut-tile tut-fly',letter);
  g.style.left=(a.left-s.left-box.clientLeft)+'px';g.style.top=(a.top-s.top-box.clientTop)+'px';
  box.append(g);void g.offsetWidth;
  g.style.transform='translate('+(b.left-a.left)+'px,'+(b.top-a.top)+'px)';
  await wait(540,S.t);g.remove();
 };
 S.place=async(i,r,c)=>{
  const t=S.hand[i],cell=S.cells[r][c],L=t.textContent;
  await S.point(t);t.classList.add('sel');
  await S.point(cell);
  t.classList.remove('sel');t.classList.add('ghost');
  await S.fly(t,cell,L);
  cell.append(el('div','tut-tile pop',L));
 };
 S.back=async(r,c,i)=>{
  const cell=S.cells[r][c],n=cell.firstChild,t=S.hand[i],L=n.textContent;
  await S.point(n);n.remove();
  await S.fly(cell,t,L);
  t.classList.remove('ghost');t.classList.add('pop');
 };
 S.say('');
 return S;
}

const KOT_TOR={'0,0':'K','0,1':'O','0,2':'T','1,2':'O','2,2':'R'};
// The demo shows only the local hand visually; online snapshots are not confidential.
const SCENES=[
 async()=>{
  const S=build({label:'Twoje płytki',count:'0 / 21'});
  await wait(500,S.t);
  await S.deal('AIEOZNRSWKMTYPŁDCŚAE'.split('').concat('O'),70,21);
  S.say('Tylko Ty widzisz swoje litery.');
 },
 async()=>{
  const S=build({label:'Plansza'});
  await S.deal(['K','O','T','O','R','A'],60);
  await wait(500,S.t);
  S.say('Wybierz literę, potem pole.');
  await S.place(0,0,0);await S.place(1,0,1);await S.place(2,0,2);
  S.hl([0,1,2].map(c=>S.cells[0][c]));S.say('Pierwsze słowo: KOT');
  await wait(900,S.t);
  await S.place(3,1,2);await S.place(4,2,2);
  S.hl([0,1,2].map(r=>S.cells[r][2]));S.say('Drugie słowo: TOR. Litera T jest wspólna.');
  await wait(1100,S.t);
  await S.place(5,1,3);
  S.say('Litera nie pasuje? Kliknij ją na planszy, wróci do ręki.');
  await wait(600,S.t);
  await S.back(1,3,5);
 },
 async()=>{
  const S=build({label:'Plansza',count:'W puli: 12',preset:KOT_TOR,button:true});
  await S.deal(['Y'],0);
  await wait(700,S.t);
  S.say('Ostatnia litera idzie na planszę.');
  await S.place(0,0,3);
  S.hl([0,1,2,3].map(c=>S.cells[0][c]));
  S.btn.classList.remove('off');S.say('Ręka pusta. Klikasz „Gotowe!”.');
  await wait(500,S.t);
  await S.point(S.btn);S.btn.classList.add('hot');
  S.count.textContent='W puli: 10';
  S.clear();await S.deal(['E'],0);
  S.say('Każdy dobiera jedną płytkę. Gramy dalej.');
 },
 async()=>{
  const S=build({label:'Plansza',count:'W puli: 1',preset:KOT_TOR,players:true});
  const pl=(a,b)=>{S.players.textContent='Ty: '+a+' · Ola: '+b};
  pl('1 płytka','2 płytki');
  await S.deal(['Y'],0);
  await wait(700,S.t);
  S.say('W puli jest mniej płytek niż graczy. Koniec gry bliski!');
  await wait(900,S.t);
  await S.place(0,0,3);
  S.hl([0,1,2,3].map(c=>S.cells[0][c]));
  pl('0 płytek','2 płytki');
  const w=el('div','tut-win',reduce?'Bananagram!':'');
  if(!reduce){const s=el('span','','Bananagram!');w.append(s)}else{w.textContent='Bananagram!'}
  S.box.append(w);
  S.say('Pierwszy z pustą ręką wygrywa.');
 }
];

async function play(i){
 const t=++tok;
 // Reduced motion runs each scene once, with animation delays suppressed.
 try{
  for(;;){
   await SCENES[i]();
   if(reduce)break;
   await wait(2400,t);
  }
 }catch{}
}

function go(n){
 idx=Math.max(0,Math.min(STEPS.length-1,n));
 const s=STEPS[idx];
 ui.step.textContent='KROK '+(idx+1)+' Z '+STEPS.length;
 ui.title.textContent=s.title;ui.text.textContent=s.text;ui.note.textContent='';
 ui.prev.hidden=idx===0;
 ui.next.textContent=idx===STEPS.length-1?'Zaczynam':'Dalej →';
 [...ui.dots.children].forEach((d,k)=>{d.setAttribute('aria-current',k===idx?'step':'false')});
 play(idx);
}
function open(n=0){
 prevFocus=document.activeElement;
 root.hidden=false;document.body.style.overflow='hidden';
 go(n);ui.next.focus();
}
function close(){
 tok++;root.hidden=true;document.body.style.overflow='';mark();
 if(prevFocus&&prevFocus.focus)prevFocus.focus();
}

function init(){
 root=el('div','tut');root.hidden=true;root.id='tutorial';
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tut-title');
 const card=el('div','tut-card');
 const x=el('button','tut-x','×');x.type='button';x.setAttribute('aria-label','Zamknij samouczek');
 const copy=el('div','tut-copy');
 ui.step=el('p','tut-step');ui.title=el('h2');ui.title.id='tut-title';ui.text=el('p','tut-text');
 copy.append(ui.step,ui.title,ui.text);
 const demo=el('div','tut-demo');
 ui.stage=el('div','tut-stage');ui.stage.setAttribute('aria-hidden','true');
 ui.note=el('p','tut-note');ui.note.setAttribute('aria-live','polite');
 demo.append(ui.stage,ui.note);
 const foot=el('div','tut-foot');
 const skip=el('button','tut-skip','Pomiń');skip.type='button';
 ui.dots=el('div','tut-dots');
 STEPS.forEach((s,k)=>{const d=el('button');d.type='button';d.setAttribute('aria-label','Krok '+(k+1)+': '+s.title);d.onclick=()=>go(k);ui.dots.append(d)});
 const nav=el('div','tut-nav');
 ui.prev=el('button','','← Wstecz');ui.prev.type='button';
 ui.next=el('button','primary','Dalej →');ui.next.type='button';
 nav.append(ui.prev,ui.next);foot.append(skip,ui.dots,nav);
 card.append(x,copy,demo,foot);root.append(card);document.body.append(root);
 x.onclick=skip.onclick=close;
 ui.prev.onclick=()=>go(idx-1);
 ui.next.onclick=()=>idx===STEPS.length-1?close():go(idx+1);
 root.addEventListener('mousedown',e=>{if(e.target===root)close()});
 document.addEventListener('keydown',e=>{
  if(root.hidden)return;
  if(e.key==='Escape'){e.preventDefault();close()}
  else if(e.key==='ArrowRight'){e.preventDefault();if(idx<STEPS.length-1)go(idx+1)}
  else if(e.key==='ArrowLeft'){e.preventDefault();go(idx-1)}
  else if(e.key==='Tab'){
   const f=[...root.querySelectorAll('button:not([hidden])')];
   if(!f.length)return;
   const first=f[0],last=f[f.length-1];
   if(!root.contains(document.activeElement)){e.preventDefault();first.focus()}
   else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-tutorial]');if(b){e.preventDefault();open(0)}});
 if(!seen())open(0);
}
init();
})();
