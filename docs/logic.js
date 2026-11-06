(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BananLogic=api})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
// Shared mutable rules engine: browser solo and the room server use the same state shape.
const DISTRIBUTION={'A':13,'Ą':2,'B':3,'C':4,'Ć':2,'D':4,'E':10,'Ę':2,'F':2,'G':3,'H':3,'I':12,'J':3,'K':4,'L':4,'Ł':3,'M':4,'N':7,'Ń':2,'O':9,'Ó':2,'P':4,'R':6,'S':6,'Ś':2,'T':4,'U':3,'W':6,'Y':6,'Z':7,'Ź':1,'Ż':1};
function makeBag(){return Object.entries(DISTRIBUTION).flatMap(([l,n])=>Array(n).fill(l))}
function createGame(names,random=Math.random){if(!Array.isArray(names)||names.length<1||names.length>4)throw Error('Potrzeba od 1 do 4 graczy');const bag=makeBag();for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}const players=names.map(name=>({name,hand:bag.splice(0,21),board:{}}));return {bag,players,winner:null}}
function player(game,i){if(game.winner!==null)throw Error('Gra jest zakończona');const p=game.players[i];if(!p)throw Error('Nieznany gracz');return p}
// Boards are sparse maps of "x,y" to letters; moves transfer tiles, never create them.
function coord(x,y){if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>14||y>14)throw Error('Pole poza planszą');return `${x},${y}`}
function place(game,i,index,x,y){const p=player(game,i),k=coord(x,y);if(!Number.isInteger(index)||index<0||index>=p.hand.length||p.board[k])throw Error('Nie można położyć płytki');p.board[k]=p.hand.splice(index,1)[0]}
function take(game,i,x,y){const p=player(game,i),k=coord(x,y);if(!p.board[k])throw Error('Puste pole');p.hand.push(p.board[k]);delete p.board[k]}
function connected(board){const keys=Object.keys(board);if(!keys.length)return false;const seen=new Set([keys[0]]),queue=[keys[0]];while(queue.length){let [x,y]=queue.shift().split(',').map(Number);for(const k of [`${x+1},${y}`,`${x-1},${y}`,`${x},${y+1}`,`${x},${y-1}`])if(board[k]&&!seen.has(k)){seen.add(k);queue.push(k)}}return seen.size===keys.length}
// A claim requires an empty hand and one orthogonally connected, nonempty board.
// No dictionary or word-shape validation: players must agree on words themselves.
// If fewer tiles remain than players, the claimant wins; otherwise everyone draws one.
function peel(game,i){const p=player(game,i);if(p.hand.length||!connected(p.board))throw Error('Ułóż wszystkie płytki w jedną połączoną krzyżówkę');if(game.bag.length<game.players.length){game.winner=i;return 'winner'}for(const q of game.players)q.hand.push(game.bag.pop());return 'peel'}
return {DISTRIBUTION,makeBag,createGame,place,take,connected,peel};
});
