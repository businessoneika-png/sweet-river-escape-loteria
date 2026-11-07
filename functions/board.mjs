import {reply,store,getGame} from './_shared.mjs';
import {randomBytes} from 'node:crypto';
const randomBoard=()=>{const a=Array.from({length:36},(_,i)=>i+1);for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,16)};
export default async(request)=>{
 if(request.method!=='POST')return reply({error:'Method not allowed'},405);
 let b;try{b=await request.json()}catch{return reply({error:'Invalid request'},400)}
 const game=await getGame();
 if(b.action==='create'){
  if(game.started)return reply({error:'The game has started. New boards are closed.'},409);
  const id=randomBytes(5).toString('hex').toUpperCase();const board={id,cards:randomBoard(),marked:[],created:Date.now()};await store().setJSON('board-'+id,board);return reply(board)
 }
 if(!/^[0-9A-F]{10}$/.test(b.id||''))return reply({error:'Invalid board ID'},400);
 const board=await store().get('board-'+b.id,{type:'json'});if(!board)return reply({error:'Board not found'},404);
 if(b.action==='load')return reply(board);
 if(b.action==='mark'){
  const id=Number(b.card);if(!board.cards.includes(id))return reply({error:'Card not on this board'},400);
  // A guest may mark only a card that has actually been called.
  if(!game.deck.slice(0,game.pos).includes(id))return reply({error:'That card has not been called yet'},409);
  if(!board.marked.includes(id))board.marked.push(id);
  await store().setJSON('board-'+b.id,board);return reply(board)
 }
 return reply({error:'Unknown action'},400)
};
