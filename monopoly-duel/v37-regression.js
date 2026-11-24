/* V3.7 isolated, non-production regression test. Run in browser on v37-event-test.html or test harness. */
(function(root){
"use strict";
function run(){
const engine=root.MonopolyV37Events;
if(!engine)throw Error("V3.7 event module missing");
let cases=0, failures=[];
function assert(ok,msg){cases++;if(!ok)failures.push(msg);}
const seq=[0.1,0.4,0.7,0.9,0.2,0.8,0.6,0.3];
let cursor=0;const events=engine.create(()=>seq[(cursor++)%seq.length]);
let round=1,team=0, lastQuestionByTeam={},questionSerial=0, turns=0;
function nextQuestion(){return {id:++questionSerial,team,round};}
for(let n=0;n<20;n++){
const current=nextQuestion();
if(team===1)assert(current.id!==lastQuestionByTeam[0],"second group must get a new question");
assert(current.team===team,"question belongs to active team");
lastQuestionByTeam[team]=current.id;
const type=(n%2)?"fate":"chance";
const pending=events.draw(type,team,team>1);
assert(pending.playerId===team,"event belongs to current group");
let blocked=false;
try{events.draw(type,team);}catch(_){blocked=true;}
assert(blocked,"second draw while pending must be rejected");
const result=events.resolve(pending.token,team,{correct:n%3!==0,accept:true,roll:2,choice:"risk",hasShield:n%7===0});
assert(result.finished===true,"event must finish");
assert(result.advanceTurn===false,"event must not independently advance main turn");
assert(result.triggerAnotherEvent===false,"event must not chain another tile");
assert(result.steps>=-2&&result.steps<=4,"event steps bounded");
const duplicate=events.resolve(pending.token,team,{correct:true});
assert(duplicate.ignored===true,"duplicate resolution ignored");
assert(events.pending===null,"pending event cleared");
team=(team+1)%4;if(team===0)round++;turns++;
}
assert(turns===20,"five rounds require 20 group turns");
assert(round===6&&team===0,"end state after 5 complete rounds");
for(const t of ["chance","fate"]){const ids=engine.templates.filter(x=>x.type===t).map(x=>x.id);assert(ids.length===6,t+" has six distinct cards");assert(new Set(ids).size===6,t+" unique ids");}
return {passed:failures.length===0,cases,failures,turns,completedRounds:5,important:"Only isolated event/module regression; does NOT test the 1 MB production game, gameplay questions, audio or Safari."};
}
root.MonopolyV37Regression=Object.freeze({run});
})(typeof window!=="undefined"?window:globalThis);
