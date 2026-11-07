import {getStore} from '@netlify/blobs';
import {createHmac,timingSafeEqual,randomBytes} from 'node:crypto';
export const store=()=>getStore('loteria-live');
export const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json','cache-control':'no-store','access-control-allow-origin':'same-origin'}});
const secret=()=>process.env.ORGANIZER_SECRET||'';
export function configured(){return secret().length>=16&&!!process.env.ORGANIZER_PASSWORD}
function sign(v){return createHmac('sha256',secret()).update(v).digest('hex')}
export function token(){const value=String(Date.now()+8*60*60*1000)+'.'+randomBytes(16).toString('hex');return value+'.'+sign(value)}
export function authorized(request){if(!configured())return false;const t=(request.headers.get('authorization')||'').replace(/^Bearer /,'');const bits=t.split('.');if(bits.length!==3||!/^\d+$/.test(bits[0])||Number(bits[0])<Date.now())return false;const payload=bits[0]+'.'+bits[1];const expected=Buffer.from(sign(payload),'hex');const received=Buffer.from(bits[2]||'','hex');return received.length===expected.length&&timingSafeEqual(expected,received)}
export function passwordOK(input){const a=Buffer.from(createHmac('sha256','pw').update(String(input)).digest());const b=Buffer.from(createHmac('sha256','pw').update(process.env.ORGANIZER_PASSWORD||'').digest());return timingSafeEqual(a,b)}
export const fresh=()=>({deck:Array.from({length:36},(_,i)=>i+1).sort(()=>Math.random()-.5),pos:0,revision:0,started:false});
export async function getGame(){const s=await store().get('game',{type:'json'});return s&&Array.isArray(s.deck)&&s.deck.length===36?s:fresh()}
