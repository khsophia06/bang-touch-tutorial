'use strict';const params=new URLSearchParams(location.search);const count=[4,5,6,7].includes(+params.get('n'))?+params.get('n'):4;let cards=[];const USE_CARD_IMAGES=true;const fullName=k=>k;
function image(c){
  const el=document.createElement('span');
  if(!USE_CARD_IMAGES||!c.rect){el.className='text-card';const icon=document.createElement('span'),name=document.createElement('b'),brief=document.createElement('small');icon.textContent=c.group==='역할'?'★':c.group==='인물'?'♟':cardCategories[c.key]==='막기'?'♥':'♠';icon.setAttribute('aria-hidden','true');name.textContent=fullName(c.key);brief.textContent=info[c.key][1];el.append(icon,name,brief);return el;}
  const r=c.rect;el.className='card-image';el.setAttribute('role','img');el.setAttribute('aria-label',fullName(c.key)+' 한글판 카드');el.style.aspectRatio=r.width+'/'+r.height;el.style.backgroundSize=(3200/r.width*100)+'% '+(9360/r.height*100)+'%';el.style.backgroundPosition=(r.x/(3200-r.width)*100)+'% '+(r.y/(9360-r.height)*100)+'%';return el;
}
var setupFilmStep=0;
var setupFilmBusy=false;
var setupFilmTimer;
function renderSetupFilm(){
 const host=document.getElementById('setup-film-seats');if(!host)return;host.replaceChildren();
 const characters=['bart-cassidy','black-jack','calamity-janet','jesse-jones','kit-carlson','lucky-duke','rose-doolan'];
 for(let i=0;i<count;i++){
  const seat=document.createElement('div');seat.className='setup-film-seat';seat.style.setProperty('--seat-index',i);seat.style.setProperty('--seat-rotation',(i*360/count-180)+'deg');const angle=(i/count)*Math.PI*2-Math.PI/2;seat.style.left=(50+Math.cos(angle)*38)+'%';seat.style.top=(50+Math.sin(angle)*28)+'%';seat.style.setProperty('--seat-top',(50+Math.sin(angle)*28)+'%');
  const label=document.createElement('b');label.className='setup-seat-label';label.textContent=i===0?'보안관':'자리 '+(i+1);
  const mat=document.createElement('div');mat.className='setup-real-mat';const pic=document.createElement('img');pic.src='assets/player-mat-clean.webp';pic.alt='개인 판';pic.width=1479;pic.height=1064;mat.append(pic);
  const role=document.createElement('span');role.className='setup-dealt-role';
  const card=cards.find(c=>c.key==='sheriff');if(i===0&&card)role.append(image(card));else{const back=document.createElement('span');back.className='setup-card-reverse back-role';back.textContent='';back.setAttribute('aria-label','비밀 역할 카드 뒷면');role.append(back);}
  const character=document.createElement('span');character.className='setup-dealt-person';const person=cards.find(c=>c.key===characters[i]);if(person)character.append(image(person));if(i===1){const ring=document.createElement('span');ring.className='setup-life-ring';ring.setAttribute('aria-hidden','true');character.append(ring);}
  const life=document.createElement('span');life.className='setup-dealt-life';for(let j=0;j<(i===0?5:4);j++){const bullet=document.createElement('img');bullet.src='assets/life-bullet.webp';bullet.alt='';life.append(bullet);}
  const weapon=document.createElement('span');weapon.className='setup-base-weapon';const colt=cards.find(c=>c.key==='colt-45');if(colt)weapon.append(image(colt));
  mat.append(role,character,life,weapon);
  const hand=document.createElement('div');hand.className='setup-dealt-hand';hand.setAttribute('aria-label','시작 생명 수만큼 받은 손패');for(let j=0;j<(i===0?5:4);j++){const back=document.createElement('span');back.className='setup-card-reverse';back.style.setProperty('--card-index',j);back.setAttribute('aria-hidden','true');hand.append(back);}
  const handLabel=document.createElement('b');handLabel.className='setup-hand-label';handLabel.textContent='손패';hand.append(handLabel);
  seat.append(label,mat,hand);host.append(seat);
 }
 document.getElementById('setup-film-board').setAttribute('aria-label',count+'인 테이블 배치 예시. 위쪽이 보안관 자리예요.');
}
function showSetupStep(step){
 setupDealController?.abort();setupDealController=null;
 document.getElementById('setup-motion-status').hidden=step!==2&&step!==4;setupFilmStep=step;const board=document.getElementById('setup-film-board');if(!board)return;
 const content=[['01 / 각자의 자리','개인 판을 하나씩 나눠 가지세요.','각자의 앞에 개인 판을 놓고, 가운데는 비워 두세요. 콜트 45는 판에 표시된 기본 무기이며 따로 나눠 주는 카드가 아니에요.'],['02 / 역할 나누기','역할 카드를 한 장씩 받아요.','보안관만 역할을 공개하고 나머지는 자신만 역할을 확인한 후 개인 판에 올려놓아요.'],['03 / 인물과 생명','인물을 공개하고 생명을 놓아요.','인물 카드에 그려진 총알 수가 자신의 생명 수입니다. 보안관은 그려진 총알 수보다 1개를 더 받아요!!'],['04 / 시작 손패','시작 생명 수만큼 카드를 받아요.','플레이 카드 더미에서 내 시작 생명 수만큼 카드를 받아 손패로 들어요.'],['05 / 중앙 카드 더미','가운데에 더미를 놓으면 준비 끝!','남은 플레이 카드는 뒷면이 위로 향하게 쌓아요. 옆에는 버린 더미 자리를 비워 두세요. 보안관부터 시계 방향으로 시작해요.'],['06 / 참조표 카드','참조표를 옆에 놓고 확인하세요.','']][step];
 board.classList.remove('hand-received','setup-turn-ready');board.querySelectorAll('.setup-turn-highlight').forEach(n=>n.classList.remove('setup-turn-highlight'));board.querySelector('.setup-turn-cue')?.remove();board.dataset.stage=step;board.setAttribute('aria-label',(step===0||step===4)?count+'인 전체 테이블 배치':'내 자리에서 바라본 개인 판. 왼쪽은 역할, 가운데는 인물, 오른쪽은 기본 무기 자리이며 아래쪽은 손패예요.');board.classList.remove('is-dealing');void board.offsetWidth;board.classList.add('is-dealing');
 document.getElementById('setup-film-progress').textContent=(step+1)+' / 6';document.getElementById('setup-film-step-label').textContent=content[0];document.getElementById('setup-film-title').textContent=content[1];document.getElementById('setup-film-description').textContent=content[2];document.getElementById('setup-film-description').hidden=step===5;
 document.getElementById('setup-film-back').hidden=false;document.getElementById('setup-film-back').disabled=step===0;document.getElementById('setup-film-next').hidden=false;document.getElementById('setup-film-next').textContent='다음 →';document.getElementById('setup-film-next').disabled=step===5;document.getElementById('setup-film-reference').hidden=step!==5;board.hidden=step===5;
 const touch=document.getElementById('setup-film-touch');touch.setAttribute('role',step===5?'group':'button');touch.tabIndex=step===5?-1:0;touch.setAttribute('aria-label',content[1]+' '+content[2]+(step===5?'':' 화면을 터치하면 다음 단계로 이동해요.'));
 clearTimeout(setupFilmTimer);setupFilmBusy=true;
 board.querySelectorAll('.setup-film-seat').forEach((seat,i)=>{seat.classList.toggle('is-my-seat',i===1);const label=seat.querySelector('.setup-seat-label');if(label)label.textContent=i===1&&step>0&&step<4?'':i===0?'보안관':'자리 '+(i+1);});
 if(step===0)animateSetupMats();else if(step>0&&step<5)animateSetupDeal(step);else{setupFilmBusy=false;}
}var setupDealController;
async function animateSetupDeal(step){
 const controller=new AbortController();setupDealController=controller;const signal=controller.signal;
 const board=document.getElementById('setup-film-board'),seat=board.querySelector('.is-my-seat');if(!seat){setupFilmBusy=false;return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hidden=[],actors=[];
 const next=document.getElementById('setup-film-next');next.hidden=false;
 const conceal=el=>{el.classList.add('setup-awaiting-card');hidden.push(el);};
 const animation=async(el,keyframes,duration,slow=true)=>{if(signal.aborted)throw new DOMException('Aborted','AbortError');const a=el.animate(keyframes,{duration:slow?duration*1.6:duration,fill:'forwards',easing:'cubic-bezier(.2,.7,.2,1)'});const stop=()=>a.cancel();signal.addEventListener('abort',stop,{once:true});try{await a.finished;}finally{signal.removeEventListener('abort',stop);}};
 const fly=async(target,key,back=false,order=0)=>{
  const actor=document.createElement('div');actor.className='setup-flying-card';actor.setAttribute('aria-hidden','true');
  const source=key?cards.find(c=>c.key===key):null;
  if(source){actor.append(image(source));if(key==='black-jack'){const ring=document.createElement('span');ring.className='setup-life-ring';ring.setAttribute('aria-hidden','true');ring.style.opacity='0';const label=document.createElement('span');label.className='setup-life-callout';label.style.opacity='0';label.textContent='총알 4개 = 시작 생명 4';actor.append(ring,label);}}else{const reverse=document.createElement('span');reverse.className='setup-card-reverse';reverse.textContent='BANG!';actor.append(reverse);}
  const bounds=board.getBoundingClientRect(),dest=target.getBoundingClientRect();
  const width=step===4?Math.min(74,bounds.width*.22):Math.min(190,bounds.width*.6,innerHeight*.24),height=width*1.5;
  const x=bounds.left+(bounds.width-width)/2+order*3,y=Math.max(82,bounds.top+(bounds.height-height)/2);
  Object.assign(actor.style,{left:x+'px',top:y+'px',width:width+'px',height:height+'px'});document.body.append(actor);actors.push(actor);
  await animation(actor,[{opacity:0,transform:'perspective(900px) rotateY(95deg) scale(.9)'},{opacity:1,transform:'perspective(900px) rotateY(0deg) scale(1)'},{opacity:1,transform:'perspective(900px) rotateY(0deg) scale(1)'}],step===3?500:1050);
  if(key==='black-jack'){
   const ring=actor.querySelector('.setup-life-ring'),label=actor.querySelector('.setup-life-callout');
   await Promise.all([animation(ring,[{opacity:0,transform:'scale(1.25)'},{opacity:1,transform:'rotate(5deg)'}],350),animation(label,[{opacity:0},{opacity:1}],350)]);
   await animation(actor,[{transform:'none'},{transform:'none'}],1000,false);

  }
  if(back&&source){await animation(actor,[{transform:'rotateY(0deg)'},{transform:'rotateY(90deg)'}],140);actor.replaceChildren();const reverse=document.createElement('span');reverse.className='setup-card-reverse back-role';reverse.textContent='';actor.append(reverse);await animation(actor,[{transform:'rotateY(90deg)'},{transform:'rotateY(0deg)'}],140);}
  actor.querySelector('.setup-life-callout')?.remove();
  await animation(actor,[{transform:'translate(0,0) scale(1)'},{transform:'translate('+(dest.left-x)+'px,'+(dest.top-y)+'px) scale('+(dest.width/width)+','+(dest.height/height)+')'}],600);
  target.classList.remove('setup-awaiting-card');actor.remove();
  if(key==='black-jack'){
   const life=seat.querySelector('.setup-dealt-life');
   life.classList.remove('setup-awaiting-card');
   const bullets=[...life.querySelectorAll('img')];
   for(const bullet of bullets)bullet.style.opacity='0';
   for(const bullet of bullets){await animation(bullet,[{opacity:0,transform:'translateY(-45px) scale(1.5)'},{opacity:1,transform:'none'}],230);bullet.style.opacity='';}
   await animation(life,[{opacity:1},{opacity:1}],600,false);
   const prompt=document.createElement('div');prompt.className='sheriff-life-prompt';prompt.setAttribute('role','status');prompt.textContent='내가 보안관이라면? 총알을 한 개 더 받아요!';document.getElementById('setup-motion-status').append(prompt);actors.push(prompt);
   const extra=document.createElement('img');extra.src='assets/life-bullet.webp';extra.alt='보안관 추가 생명 1';extra.className='sheriff-extra-bullet';life.append(extra);
   await animation(extra,[{opacity:0,transform:'translateY(-60px) scale(1.5)'},{opacity:1,transform:'none'}],600);
   const roleTarget=seat.querySelector('.setup-dealt-role');roleTarget.replaceChildren(image(cards.find(c=>c.key==='sheriff')));
   await animation(prompt,[{opacity:1},{opacity:1}],1600,false);prompt.remove();

  }
 };
 const distribute=async(kind)=>{
  const overlay=document.createElement('div');overlay.className='setup-distribution';overlay.setAttribute('aria-hidden','true');board.append(overlay);actors.push(overlay);
  const deck=document.createElement('div');deck.className='setup-distribution-deck';for(let i=0;i<3;i++){const back=document.createElement('span');back.className='setup-card-reverse';back.classList.add(kind==='role'?'back-role':'back-person');back.textContent='';back.style.transform='translate('+(i*3)+'px,'+(-i*3)+'px)';deck.append(back);}overlay.append(deck);
  const recipients=[];for(let i=0;i<count;i++){const recipient=document.createElement('div');recipient.className='setup-distribution-person';recipient.style.left=(i===count-1?50:10+(i/Math.max(1,count-2))*80)+'%';recipient.style.top=(i===count-1?80:22)+'%';recipient.textContent=i===count-1?'나':'사람 '+(i+1);overlay.append(recipient);recipients.push(recipient);}
  const bounds=overlay.getBoundingClientRect();const deckBounds=deck.getBoundingClientRect();
  for(let i=0;i<count;i++){
   if(signal.aborted)throw new DOMException('Aborted','AbortError');
   const token=document.createElement('span');token.className='setup-distribution-card setup-card-reverse';token.classList.add(kind==='role'?'back-role':'back-person');token.textContent='';overlay.append(token);
   const dest=recipients[i].getBoundingClientRect();const fromX=deckBounds.left-bounds.left,fromY=deckBounds.top-bounds.top;Object.assign(token.style,{left:fromX+'px',top:fromY+'px'});
   await animation(token,[{transform:'translate(0,0) rotate(0)',opacity:1},{transform:'translate('+(dest.left+dest.width/2-deckBounds.left-18)+'px,'+(dest.top-deckBounds.top-24)+'px) rotate('+(i%2===0?-8:8)+'deg)',opacity:1}],280);
   recipients[i].classList.add('has-card');
  }
  await animation(overlay,[{opacity:1},{opacity:0}],320);overlay.remove();
 };
 try{
  if(reduced)return;
  if(step===1){const target=seat.querySelector('.setup-dealt-role');conceal(target);await distribute('role');await fly(target,'outlaw',true);}
  if(step===2){const target=seat.querySelector('.setup-dealt-person'),life=seat.querySelector('.setup-dealt-life');conceal(target);conceal(life);await distribute('person');await fly(target,'black-jack');}
  if(step===3){
   const hand=seat.querySelector('.setup-dealt-hand');conceal(hand);
   const bundle=document.createElement('div');bundle.className='setup-hand-bundle';bundle.setAttribute('aria-hidden','true');
   const boardBounds=board.getBoundingClientRect(),destination=hand.getBoundingClientRect();
   const width=Math.min(120,boardBounds.width*.36),height=width*1.5;
   const x=boardBounds.left+(boardBounds.width-width)/2,y=Math.max(82,boardBounds.top+20);
   Object.assign(bundle.style,{left:x+'px',top:y+'px',width:width+'px',height:height+'px'});
   for(let i=0;i<4;i++){const back=document.createElement('span');back.className='setup-card-reverse';back.textContent=i===3?'생명 수만큼':'';back.style.transform='translate('+(i*5)+'px,'+(-i*4)+'px)';bundle.append(back);}
   document.body.append(bundle);actors.push(bundle);
   await animation(bundle,[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'},{opacity:1,transform:'scale(1)'}],800);
   await animation(bundle,[{transform:'translate(0,0) scale(1)'},{transform:'translate('+(destination.left+destination.width/2-x-width*.35)+'px,'+(destination.top-y)+'px) scale(.7)',opacity:0}],700);
   hand.classList.remove('setup-awaiting-card');bundle.remove();board.classList.add('hand-received');
  }
  if(step===4){
   const draw=board.querySelector('.setup-film-draw>.setup-card-reverse');conceal(draw);await fly(draw,null);
   await animation(board,[{opacity:1},{opacity:1}],1000);
   const cue=document.createElement('div');cue.className='setup-turn-cue';cue.setAttribute('role','status');cue.textContent='보안관부터 시작해요';document.getElementById('setup-motion-status').append(cue);
   const seats=[...board.querySelectorAll('.setup-film-seat')];
   for(let i=0;i<seats.length;i++){
    seats.forEach(n=>n.classList.remove('setup-turn-highlight'));seats[i].classList.add('setup-turn-highlight');
    cue.textContent=i===0?'보안관부터 시작해요':'시계 방향으로 차례가 돌아요 ↻';
    await animation(seats[i],[{filter:'drop-shadow(0 0 0px #d9362b)'},{filter:'drop-shadow(0 0 10px #d9362b)',offset:.3},{filter:'drop-shadow(0 0 0px #d9362b)'}],i===0?1150:550);
   }
   seats.forEach(n=>n.classList.remove('setup-turn-highlight'));seats[0].classList.add('setup-turn-highlight');
   cue.textContent='보안관부터 시계 방향으로 시작!';board.classList.add('setup-turn-ready');
  }
 }catch(error){if(error.name!=='AbortError')console.error(error);}
 finally{actors.forEach(n=>n.remove());hidden.forEach(n=>n.classList.remove('setup-awaiting-card'));seat.querySelectorAll('.setup-dealt-life img').forEach(n=>n.style.opacity='');if(setupDealController===controller){if(step>=3)board.classList.add('hand-received');setupFilmBusy=false;setupDealController=null;if(step===4){next.hidden=false;document.getElementById('setup-film-reference').hidden=true;}}}
}


var lessonPresentationsReady=false;
var seenLessonPresentations=new Set();
fetch('assets/cards.json').then(r=>r.json()).then(d=>{cards=d.cards;renderSetupFilm();document.fonts.ready.then(()=>{parent.postMessage({type:'setup-ready'},location.origin)});showSetupStep(Math.min(5,Math.max(0,+params.get('s')||0)));document.getElementById('setup-film-touch').onclick=()=>{if(!setupFilmBusy)parent.postMessage({type:'setup-next'},location.origin)};});const report=()=>parent.postMessage({type:'setup-height',height:Math.ceil(document.documentElement.getBoundingClientRect().height)},location.origin);new ResizeObserver(report).observe(document.body);addEventListener('load',report);

async function animateSetupMats(){
 const controller=new AbortController();setupDealController=controller;const signal=controller.signal;const board=document.getElementById('setup-film-board');const mats=[...board.querySelectorAll('.setup-real-mat')];const actors=[];setupFilmBusy=true;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){setupFilmBusy=false;return;}
 mats.forEach(m=>m.style.visibility='hidden');
 try{for(const [i,mat] of mats.entries()){
  if(signal.aborted)throw new DOMException('Aborted','AbortError');
  const dest=mat.getBoundingClientRect(),bounds=board.getBoundingClientRect();const actor=document.createElement('img');actor.src='assets/player-mat-clean.webp';actor.alt='';actor.setAttribute('aria-hidden','true');actor.className='setup-flying-mat';Object.assign(actor.style,{position:'fixed',left:dest.left+'px',top:dest.top+'px',width:dest.width+'px',height:dest.height+'px',zIndex:100,pointerEvents:'none'});document.body.append(actor);actors.push(actor);
  const dx=bounds.left+bounds.width/2-dest.left-dest.width/2,dy=bounds.top+bounds.height/2-dest.top-dest.height/2;
  const a=actor.animate([{transform:`translate(${dx}px,${dy}px) scale(.65) rotate(-12deg)`,opacity:0},{opacity:1,offset:.15},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});const stop=()=>a.cancel();signal.addEventListener('abort',stop,{once:true});try{await a.finished}finally{signal.removeEventListener('abort',stop)}mat.style.visibility='';actor.remove();
 }}catch(e){if(e.name!=='AbortError')console.error(e)}finally{actors.forEach(a=>a.remove());mats.forEach(m=>m.style.visibility='');if(setupDealController===controller){setupFilmBusy=false;setupDealController=null}}
}
