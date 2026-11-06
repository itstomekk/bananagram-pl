// Room server: node server.js (optional PORT). Static GitHub Pages cannot run it.
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),G=require('./logic');
// Trusted-network prototype: rooms live only in memory, with no expiry or rate limiting.
const rooms=new Map(), port=Number(process.env.PORT)||8080;
const id=(n=16)=>crypto.randomBytes(n).toString('hex');
function safeName(v){const s=String(v||'').trim().slice(0,20);if(!s)throw Error('Podaj imię');return s}
function member(room,token){let i=room.members.findIndex(x=>x.token===token);if(i<0)throw Error('Nieprawidłowy bilet do pokoju');return i}
function lookup(key){const r=rooms.get(String(key||'').toUpperCase());if(!r)throw Error('Nie znaleziono pokoju');return r}
function output(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj))}
// Tokens identify members, but state exposes all hands, boards and the bag to each member.
// The state token is in the query string; use HTTPS and avoid exposing request logs.
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(req.method==='GET'&&url.pathname==='/api/state'){let r=lookup(url.searchParams.get('room')),i=member(r,url.searchParams.get('token'));return output(res,200,{room:r.code,host:i===0,me:i,names:r.members.map(m=>m.name),game:r.game})}
if(req.method==='POST'&&url.pathname.startsWith('/api/')){let data='';for await(const chunk of req){data+=chunk;if(data.length>10000)throw Error('Za duże żądanie')}const d=JSON.parse(data||'{}');
if(url.pathname==='/api/create'){let code;do{code=id(3).toUpperCase()}while(rooms.has(code));const token=id();rooms.set(code,{code,members:[{name:safeName(d.name),token}],game:null});return output(res,200,{room:code,token})}
if(url.pathname==='/api/join'){let r=lookup(d.room);if(r.game)throw Error('Gra już się rozpoczęła');if(r.members.length>=4)throw Error('Pokój jest pełny');const token=id();r.members.push({name:safeName(d.name),token});return output(res,200,{room:r.code,token})}
if(url.pathname==='/api/action'){let r=lookup(d.room),i=member(r,d.token);if(d.action==='start'){if(i!==0||r.game||r.members.length<2)throw Error('Tylko gospodarz rozpoczyna grę dla 2–4 graczy');r.game=G.createGame(r.members.map(x=>x.name))}else{if(!r.game)throw Error('Gra jeszcze się nie rozpoczęła');switch(d.action){case 'place':G.place(r.game,i,d.index,d.x,d.y);break;case 'take':G.take(r.game,i,d.x,d.y);break;case 'peel':G.peel(r.game,i);break;default:throw Error('Nieznana akcja')}}return output(res,200,{ok:true})}throw Error('Nieznany adres')}
if(req.method==='GET'){const files={'/':'index.html','/index.html':'index.html','/logic.js':'logic.js','/ui.js':'ui.js','/style.css':'style.css','/tutorial.css':'tutorial.css','/tutorial.js':'tutorial.js'};const file=files[url.pathname];if(!file){res.writeHead(404);return res.end('Nie znaleziono')}const type=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html';res.writeHead(200,{'Content-Type':type+'; charset=utf-8','X-Content-Type-Options':'nosniff'});return fs.createReadStream(path.join(__dirname,file)).pipe(res)}res.writeHead(405);res.end();}catch(e){output(res,400,{error:e.message})}});
server.listen(port,'0.0.0.0',()=>console.log(`Serwer działa na porcie ${port}`));
