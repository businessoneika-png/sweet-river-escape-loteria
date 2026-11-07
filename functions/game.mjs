import {authorized,configured,reply,store,getGame,fresh} from './_shared.mjs';
export default async(request)=>{
 if(!configured())return reply({error:'Organizer setup required'},503);
 if(request.method==='GET'){const s=await getGame();return reply({called:s.deck.slice(0,s.pos),last:s.pos?s.deck[s.pos-1]:null,count:s.pos,started:s.started,revision:s.revision})}
 if(request.method!=='POST')return reply({error:'Method not allowed'},405);
 if(!authorized(request))return reply({error:'Organizer login required'},401);
 let body;try{body=await request.json()}catch{return reply({error:'Invalid request'},400)}
 if(!['draw','reset','start'].includes(body.action))return reply({error:'Unknown action'},400);
 const s=await getGame();
 if(body.action==='reset'){const next=fresh();next.revision=s.revision+1;await store().setJSON('game',next);return reply({ok:true})}
 if(body.action==='start'){s.started=true;s.revision++;await store().setJSON('game',s);return reply({ok:true})}
 if(!s.started)return reply({error:'Start the game before drawing'},409);
 if(s.pos>=36)return reply({error:'All 36 cards have been called'},409);
 s.pos++;s.revision++;await store().setJSON('game',s);return reply({ok:true})
};
