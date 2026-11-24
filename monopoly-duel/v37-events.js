/* V3.7 city monopoly event engine. Does not touch existing game turn logic. */
(function(root){
"use strict";
const templates=[
{id:"train",type:"chance",title:"🚄 城市高鐵",challenge:"advanced",success:3,fail:0},
{id:"treasure",type:"chance",title:"🎁 神秘寶箱",challenge:null,success:2,fail:0},
{id:"helicopter",type:"chance",title:"🚁 空中捷徑",challenge:"expert",success:3,fail:0},
{id:"shield",type:"chance",title:"🛡️ 幸運護盾",challenge:null,shield:1},
{id:"double",type:"chance",title:"🎯 雙倍挑戰",challenge:"expert",optional:true,success:4,fail:-1},
{id:"catchup",type:"chance",title:"🏆 落後追擊",challenge:"expert",behindOnly:true,success:2,fail:0},
{id:"tornado",type:"fate",title:"🌪️ 城市龍捲風",challenge:"advanced",success:0,fail:-2},
{id:"redlight",type:"fate",title:"🚦 紅燈管制",challenge:"basic",success:0,fail:0},
{id:"swap",type:"fate",title:"🔀 時空交換站",challenge:"expert",swap:true,success:0,fail:0},
{id:"boss",type:"fate",title:"👹 魔王封鎖線",challenge:"boss",success:3,fail:0},
{id:"fatedice",type:"fate",title:"🎲 命運骰子",challenge:null,choice:true,success:0,fail:0},
{id:"lightning",type:"fate",title:"⚡ 雷電危機",challenge:null,success:-1,fail:-1}
];
function create(seed){
let rng=typeof seed==="function"?seed:Math.random, deck={chance:[],fate:[]},pending=null,consumed=new Set(),last={chance:null,fate:null}, serial=0;
function shuffle(type){const a=templates.filter(e=>e.type===type).map(x=>x.id);for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}if(a.length>1&&a[a.length-1]===last[type]) [a[0],a[a.length-1]]=[a[a.length-1],a[0]];deck[type]=a;}
function draw(type,playerId,behind){if(type!=="chance"&&type!=="fate")throw Error("invalid type");if(pending)throw Error("resolve current event first");if(!deck[type].length)shuffle(type);let id=deck[type].pop(), t=templates.find(x=>x.id===id);if(t.behindOnly&&!behind){t={...t,challenge:"advanced",success:1};}last[type]=id;pending={token:"event-"+(++serial),playerId,event:t};return JSON.parse(JSON.stringify(pending));}
function resolve(token,playerId,{correct=false,accept=true,choice="safe",roll=0,hasShield=false}={}){
if(consumed.has(token))return {ignored:true,reason:"already resolved"};
if(!pending||pending.token!==token||pending.playerId!==playerId)throw Error("event token or player mismatch");
const t=pending.event;let steps=0,shieldGain=0,shieldUsed=false,swap=false;
if(t.shield){shieldGain=1;}
else if(t.choice){steps=choice==="risk"?Math.max(0,Math.min(3,Math.floor(Number(roll)||0))):1;}
else if(t.optional&&!accept){steps=0;}
else if(t.challenge){steps=correct?t.success:t.fail;swap=!!(t.swap&&correct);}
else{steps=t.success;}
if(steps<0&&hasShield){steps=0;shieldUsed=true;}
steps=Math.min(4,Math.max(-2,steps));
const result={token,playerId,eventId:t.id,steps,shieldGain,shieldUsed,swap,finished:true,triggerAnotherEvent:false,advanceTurn:false};
consumed.add(token);pending=null;return result;
}
return {draw,resolve,get pending(){return pending?JSON.parse(JSON.stringify(pending)):null;},get cards(){return templates.map(x=>({...x}));}};
}
root.MonopolyV37Events=Object.freeze({create,templates:templates.map(x=>({...x}))});
})(typeof window!=="undefined"?window:globalThis);
