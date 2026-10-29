'use strict';
const $=s=>document.querySelector(s);let atlas=[],count=4,index=-1;const labels=['서부에 온 걸 환영해요','역할과 승리','게임을 세팅해요','내 차례의 흐름','공격과 방어','생명 회복','감옥과 다이너마이트','카드 빼앗기와 버리기','탈락과 게임 종료'];
try{const saved=+sessionStorage.getItem('bang-touch-count');if([4,5,6,7].includes(saved))count=saved}catch{}
const composition=n=>({sheriff:1,deputy:n===4?0:n===7?2:1,outlaw:n>=6?3:2,renegade:1});
function card(key,caption='',extra=''){const c=atlas.find(x=>x.key===key);if(!c)return '';const r=c.rect;return `<div class="card-wrap ${extra}"><span class="card" role="img" aria-label="${c.name}" style="aspect-ratio:${r.width}/${r.height};background-size:${3200/r.width*100}% ${9360/r.height*100}%;background-position:${r.x/(3200-r.width)*100}% ${r.y/(9360-r.height)*100}%"></span>${caption?`<label>${caption}</label>`:''}</div>`}
const back=()=>'<div class="backcard" aria-label="뒷면 카드"></div>';
const town=()=>'<div class="town" aria-hidden="true"><div class="sun"></div><div class="mountains"></div><div class="buildings"><div class="building">SHERIFF</div><div class="building">SALOON</div><div class="building">BANK</div></div><div class="dust"></div></div>';
const effect=(t,tone='')=>`<div class="effect ${tone}">${t}</div>`;
const pair=(a,b,cls='',mark='→',text='')=>`<div class="cards ${cls}">${card(a)}<span class="arrow">${mark}</span>${card(b)}</div>${text?effect(text):''}`;
const life=(mode='')=>`<div class="hearts">♥ ♥ ♥ <span class="${mode}">♥</span></div>`;
function table(kind='roles'){let roles=Object.entries(composition(count)).flatMap(([k,n])=>Array(n).fill(k));return `<div class="table">${roles.map((r,i)=>{const a=-Math.PI/2+i*Math.PI*2/count,x=50+Math.cos(a)*39,y=48+Math.sin(a)*36;let inner=kind==='roles'?(i===0?card('sheriff'):back()):kind==='mat'?'<img src="assets/player-mat-clean.webp" width="65" alt="개인 판">':kind==='people'?card('bart-cassidy'):kind==='deal'?`<div class="bundle">${back().repeat(i===0?5:4)}</div>`:card('sheriff');return `<div class="seat" style="--x:${x}%;--y:${y}%;--delay:${i*.12}s">${inner}<span>${i===0?'보안관':'자리 '+(i+1)}</span></div>`}).join('')}<div class="table-center">${kind==='deal'?'카드 나누기':count+'명'}<small>${kind==='roles'?'보안관만 공개':kind==='deal'?'생명 수만큼 손패':'가운데는 비워 두세요'}</small></div></div>`}
function range(){return `<div class="table">${['나','A','B','C','D','E'].map((n,i)=>{const a=Math.PI/2+i*Math.PI/3;const d=Math.min(i,6-i);return `<div class="seat" style="--x:${50+Math.cos(a)*39}%;--y:${48+Math.sin(a)*36}%"><div class="token ${i===0?'':d<=2?'active':'out'}" style="animation-delay:${d*.45}s">${n}</div><span>${i===0?'내 자리':d<=2?'✓ 거리 '+d:'× 거리 3'}</span></div>`}).join('')}<div class="table-center">사거리 2<small>초록색 상대를 공격!</small></div></div>`}
function cardSorting(){return `<div class="sorting-grid">${[['role','역할 카드','승리 목표'],['person','인물 카드','나만의 능력'],['play','플레이 카드','게임 중 사용']].map(([k,n,t],i)=>`<figure class="sorting-pile" style="--sort-delay:${i*.18}s"><div class="sort-stack"><img src="assets/card-back-${k}.svg" alt="${n} 뒷면"></div><figcaption><b>${n}</b><small>${t}</small></figcaption></figure>`).join('')}<figure class="sorting-pile reference-pile" style="--sort-delay:.54s"><div class="reference-stack"><img src="assets/reference-card-clean.png" alt="참조카드 기호표"></div><figcaption><b>참조카드</b><small>기호 설명표</small></figcaption></figure></div>`}
function personalBoard({equipment='',character='black-jack',lifeChange=''}={}){
 return `<div class="continuity-board" aria-label="세팅 때 준비한 내 개인 판"><img class="continuity-mat" src="assets/player-mat-clean.webp" alt="개인 판"><div class="continuity-life" aria-label="예시 생명 4">${Array.from({length:4},(_,i)=>`<img src="assets/life-bullet.webp" alt="" class="${lifeChange==='lost'&&i>=1?'lost':i===3?lifeChange:''}">`).join('')}</div><div class="continuity-slot role-slot"><img src="assets/card-back-role.svg" alt="비밀 역할 카드"></div><div class="continuity-slot character-slot">${card(character)}</div><div class="continuity-slot weapon-slot">${card('colt-45')}</div>${equipment?`<div class="continuity-equipment">${card(equipment)}<small>내 앞에 놓인 카드</small></div>`:''}<span class="continuity-label">내 개인 판</span></div>`;
}
function boardLesson(content,title){const equipment=title.includes('술통')?'barrel':title.includes('감옥')?'jail':title.includes('다이너마이트')||title.includes('폭발')?'dynamite':'';const character=title.includes('시드')?'sid-ketchum':'black-jack';return `<div class="lesson-table"><div class="lesson-action">${content}</div>${personalBoard({equipment,character,lifeChange:title.includes('회복')||title.includes('맥주 한')?'gain':''})}</div>`}
function judgmentScene(kind,failed=false){const heart=kind!=='dynamite'&&!failed;const result=heart?'♥ 10':'♠ 5';const key=heart?'beer':'missed';const outcome=kind==='barrel'?(failed?'하트가 아니에요 · 빗나감!으로 다시 막을 수 있어요':'하트! 공격을 막았어요'):kind==='jail'?'하트! 정상적으로 차례를 진행해요':'스페이드 5! 생명 3을 잃어요';
 return `<div class="lesson-table judgment-scene" data-judgment="${kind}"><div class="judgment-action"><div class="judgment-deck"><img src="assets/card-back-play.svg" alt="플레이 카드 뽑는 더미"><b>플레이 더미</b></div><div class="judgment-reveal"><div class="judgment-actor"><div class="judgment-reverse"><img src="assets/card-back-play.svg" alt="더미 맨 위 카드"></div><div class="judgment-face">${card(key)}<strong>${result}</strong></div></div></div><div class="judgment-discard"><span></span><b>버린 더미</b></div><p class="judgment-status" aria-live="polite">① 맨 위 1장 뽑기</p></div>${personalBoard({equipment:kind,lifeChange:kind==='dynamite'?'lost':''})}<div class="judgment-outcome ${heart?'success':''}">${outcome}</div><button class="judgment-replay" type="button">판정 다시 보기 ↻</button><small class="judgment-example">판정 예시 · 카드 효과는 쓰지 않고, 무늬와 숫자만 확인해요.</small></div>`;
}
let judgmentTimers=[];
function playJudgment(){judgmentTimers.forEach(clearTimeout);judgmentTimers=[];const scene=document.querySelector('.judgment-scene');if(!scene)return;const status=scene.querySelector('.judgment-status');const reveal=scene.querySelector('.judgment-reveal'),r=reveal.getBoundingClientRect(),deck=scene.querySelector('.judgment-deck>img').getBoundingClientRect(),discard=scene.querySelector('.judgment-discard>span').getBoundingClientRect();reveal.style.setProperty('--judge-from-x',(deck.left+deck.width/2-r.left-r.width/2)+'px');reveal.style.setProperty('--judge-to-x',(discard.left+discard.width/2-r.left-r.width/2)+'px');scene.classList.remove('judgment-playing');void scene.offsetWidth;scene.classList.add('judgment-playing');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const events=reduced?[[0,'무늬와 숫자 확인 → 판정 카드는 버려요']]:[[0,'① 맨 위 1장 뽑기'],[1000,'② 뒤집어 무늬·숫자 확인'],[2900,'③ 결과 적용 → 판정 카드는 버리기'],[3900,'판정 완료 · 손패로 가져가지 않아요']];for(const [ms,text]of events)judgmentTimers.push(setTimeout(()=>{if(scene.isConnected)status.textContent=text},ms));scene.querySelector('.judgment-replay').onclick=playJudgment;}
function lessonArt(ch,title,art){if(title==='술통이 있다면, 판정!')return judgmentScene('barrel');if(title==='술통이 실패했다면?')return judgmentScene('barrel',true);if(title==='차례가 시작되면, 감옥 판정.')return judgmentScene('jail');if(title==='♠ 2~9면, 폭발!')return judgmentScene('dynamite');const content=art();if(ch>=3&&!title.includes('사거리')&&!title.includes('첫 뱅!')&&!title.includes('보안관부터'))return boardLesson(content,title);return content;}
const basicTopics=[{ch:4,name:'공격·방어'},{ch:5,name:'생명 회복'},{ch:6,name:'감옥·다이너마이트'},{ch:7,name:'강탈·캣 벌로우'}];
const chapterGroup=ch=>ch>=4&&ch<=7?4:ch===8?5:ch;
const chapterTitle=ch=>ch>=4&&ch<=7?'기본 규칙':labels[ch];
const steps=[
[0,'여긴, 무법자의 서부.','총격전이 벌어지는 서부 마을에 도착했어요.',()=>town()+effect('WELCOME TO THE WEST','gold')],
[0,'누가 내 편일까요?','마피아게임처럼, 서로의 정체를 추리해요.',()=>pair('sheriff','renegade','','?')],
[0,'당신을 뱅 마스터로.','믿고 따라오세요. 한 번의 터치로 하나씩!',()=>town()+'<div class="poster"><small>YOUR FIRST MISSION</small><b>BANG!</b><span>서부 생존 훈련</span></div>'],
[1,'네 가지 역할, 서로 다른 목표.','',()=>'', ''],
[1,'보안관은, 마을을 지켜요.','무법자와 배신자를 모두 제거하면 승리!',()=>`<div class="big-card">${card('sheriff','보안관 · 1명')}</div>`,'부관과 같은 팀이에요. 보안관만 역할을 공개해요.'],
[1,'부관은, 보안관의 편.','보안관을 지키고 함께 승리하세요.',()=>pair('deputy','sheriff','','＋',count===4?'4명 게임에는 부관이 없어요':''),'먼저 탈락해도 우리 팀이 이기면 함께 승리해요.'],
[1,'무법자는, 보안관을 노려요.','보안관을 제거하면 무법자 팀 승리!',()=>pair('outlaw','sheriff','shoot','→'),'단, 보안관이 죽고 배신자만 살아 있으면 배신자가 승리해요.'],
[1,'배신자는, 혼자 살아남아요.','다른 사람을 먼저 제거하고, 보안관은 마지막에!',()=>`<div class="big-card">${card('renegade','마지막 생존자')}</div>`,'보안관이 죽는 순간 게임이 끝나요. 타이밍을 잘 보세요.'],
[2,'기본세팅','','', '',0],
[2,'먼저, 카드를 네 종류로 나눠요.','뒷면으로 역할·인물·플레이 카드를 구분하고,<br>참조카드는 기호표끼리 모아 두세요.',()=>cardSorting()],
[2,'기본세팅','','', '',1],
[2,'기본세팅','','', '',2],
[2,'기본세팅','','', '',3],
[2,'기본세팅','','', '',4],
[2,'기본세팅','','', '',5],
[2,'갈색은 쓰고 버려요.','효과를 처리한 뒤, 버린 카드 더미로!',()=>pair('bang','beer','discard','→','사용 → 버림')],
[2,'파란색은 앞에 놓아요.','내 앞에 장착하고, 효과를 계속 유지해요.',()=>pair('schofield','barrel','','＋','장착 → 유지'),'같은 이름의 장비는 하나만. 무기는 새것을 놓으면 기존 것을 버려요.'],
[3,'보안관부터 시작!','시계 방향으로 차례를 이어 가요.',()=>table('roles')],
[3,'① 카드 2장 뽑기.','더미 맨 위에서 손패로 가져와요.',()=>`<div class="cards">${back()}<span class="arrow">→</span><div class="hand">${back().repeat(2)}</div></div>`],
[3,'② 원하는 카드를 사용.','사용하지 않고 넘어가도 괜찮아요.',()=>`<div class="cards triple">${card('bang')}${card('beer')}${card('barrel')}</div>`,'단, 뱅! 카드는 보통 내 차례에 1장만. 볼캐닉·윌리 더 키드는 예외예요.'],
[3,'③ 손패를 정리해요.','차례가 끝날 때, 현재 생명 수만큼만 남겨요.',()=>'<div><div class="hand">'+back().repeat(4)+'</div><div class="counter">4장 → 3장</div>'+life('lost')+'</div>','앞에 장착한 카드는 손패에 포함하지 않아요.'],
[4,'뱅! 한 명을 공격해요.','사거리 안의 상대가 막지 못하면 생명 −1.',()=>pair('bang','outlaw','shoot','→','막지 못하면 −1 ♥')],
[4,'사거리를 확인하세요.','양쪽 중 더 짧은 거리로 세어요.',()=>range(),'예시: 사거리 2 무기는 거리 1·2까지. 탈락한 자리는 빼고 세어요.'],
[4,'빗나감!으로 피하세요.','나에게 온 뱅! 공격 1회를 막아요.',()=>pair('bang','missed','defend','×','생명 그대로!'),'내 차례가 아니어도 사용해요. 기관총도 막지만, 인디언!·결투에는 못 써요.'],
[4,'술통이 있다면, 판정!','더미 맨 위 카드가 ♥면 공격을 막아요.',()=>`<div class="cards">${card('barrel')}<div class="judge">♥</div></div>${effect('하트! 막기 성공','green')}`,'판정 카드는 버리고 술통은 유지해요. 공격마다 한 번, 인디언!·결투는 못 막아요.'],
[4,'술통이 실패했다면?','손패의 빗나감!으로 다시 막을 수 있어요.',()=>pair('barrel','missed','defend','→','한 번 더 방어!'),'끝내 막지 못하면 생명 1을 잃어요.'],
[5,'맥주 한 잔, 내 생명 +1.','회복은 최대 생명까지만!',()=>`<div>${card('beer')}${life('gain')}</div>`,'내 차례에 사용해요. 내 차례 밖에는 생명이 0 이하가 되는 순간에만 사용해요.'],
[5,'둘만 남으면, 맥주 끝.','생존자가 2명이면 맥주는 효과가 없어요.',()=>`<div class="cards">${card('beer')}<div class="counter">2명<br>×</div></div>`,'다른 사람을 회복시킬 수도 없어요.'],
[5,'주점에선, 모두 +1.','나를 포함한 모든 생존자가 생명을 회복해요.',()=>`<div class="cards">${card('saloon')}<div>${life('gain')}<div class="mini-label">모두 생명 +1</div></div></div>`,'내 차례에만 사용해요. 2명이어도 효과가 있지만, 치명상 순간 맥주 대신 쓸 수는 없어요.'],
[5,'시드 케첨의 특별한 회복.','손패 2장을 버리면, 내 생명 +1.',()=>`<div class="cards">${card('sid-ketchum')}<div><div class="hand">${back().repeat(2)}</div><div class="hearts gain">＋ ♥</div></div></div>`,'언제든 사용할 수 있어요. 2명일 때도 가능해요. 최대 생명은 넘지 못해요.'],
[6,'감옥을 상대 앞에 놓아요.','보안관에게는 놓을 수 없어요.',()=>pair('jail','outlaw','','→'),'거리에 관계없이 사용해요. 같은 사람 앞에 감옥은 하나만 놓아요.'],
[6,'차례가 시작되면, 감옥 판정.','♥면 정상 진행. 아니면 이번 차례를 쉬어요.',()=>`<div class="cards">${card('jail')}<div class="judge">♥</div></div>${effect('하트 → 정상 진행','green')}`,'카드 2장을 뽑기 전에 판정해요. 결과와 상관없이 감옥은 버려요.'],
[6,'다이너마이트는 내 앞에.','다음 내 차례 시작에 카드를 뒤집어요.',()=>`<div class="big-card">${card('dynamite')}</div>`,'감옥도 있다면 다이너마이트부터 판정해요.'],
[6,'♠ 2~9면, 폭발!','다이너마이트를 버리고 생명 −3.',()=>`<div class="cards shoot">${card('dynamite')}<div class="judge black">♠<small style="display:block;font-size:26px">2~9</small></div></div>${effect('−3 ♥')}`,'그 외에는 왼쪽 다음 생존자에게 넘겨요. 터지거나 제거될 때까지 계속 돌아요.'],
[7,'강탈! 내 손패로 가져와요.','거리 1인 상대의 카드 1장을 가져와요.',()=>pair('panic','bang','steal','←','내 손패로!'),'상대 손패는 무작위, 앞에 놓인 카드는 골라요. 무기 사거리와는 별개예요.'],
[7,'가져온 카드는 바로 써도 돼요.','같은 내 차례라면, 사용 조건에 맞게!',()=>pair('panic','bang','shoot','→'),'뱅! 1장 제한은 지켜요. 가져온 장비는 다시 사용해야 장착돼요.'],
[7,'캣 벌로우! 카드 1장을 버려요.','거리에 관계없이 상대 카드를 버리게 해요.',()=>pair('cat-balou','barrel','discard','→','버린 카드 더미로'),'상대 손패는 무작위, 앞에 놓인 카드는 골라요. 내 손패로 가져오는 효과는 아니에요.'],
[8,'생명 0, 구하지 못했다면 탈락.','역할을 공개하고, 손패와 장비를 모두 버려요.',()=>`<div class="cards discard">${card('outlaw')}${back()}</div>${effect('역할 공개 · 카드 버림')}`,'치명상 때는 맥주 등으로 생명을 1 이상으로 만들면 생존해요. 벌처 샘이 있다면 버릴 카드를 그 인물이 가져가요.'],
[8,'무법자를 제거하면, 3장!','누가 제거했든 카드 3장을 보상으로 뽑아요.',()=>`<div class="cards">${card('outlaw')}<div class="hand">${back().repeat(3)}</div></div>${effect('보상 +3장','green')}`,'다이너마이트로 탈락했다면 제거한 사람이 없으므로 보상도 없어요.'],
[8,'보안관이 부관을 제거했다면?','보안관은 손패와 장비를 모두 버려요.',()=>pair('sheriff','deputy','discard','×','보안관의 카드 전부 버림'),'보안관의 생명·역할·인물은 그대로예요. 다른 사람이 부관을 제거하면 이 벌칙은 없어요.'],
[8,'배신자·부관 탈락, 기본 보상 없음.','특별한 보상은 무법자를 제거했을 때예요.',()=>pair('deputy','renegade','','＋'),'보안관이 부관을 제거한 벌칙은 별도로 적용해요.'],
[8,'보안관이 죽으면, 게임 끝.','배신자 혼자 남았다면 배신자 승리!',()=>`<div class="big-card">${card('renegade')}</div>`,'그 외에는 무법자 팀 승리. 무법자와 배신자가 모두 탈락하면 보안관·부관 팀이 이겨요.'],
[8,'이제, 첫 뱅!을 시작하세요.','보안관부터 2장 뽑고 시작해요.',()=>town()+'<div class="poster"><small>MISSION COMPLETE</small><b>READY!</b><span>당신의 서부가 시작됩니다</span></div>','헷갈리면 목차에서 필요한 장면으로 돌아오세요.']
];
function home(){document.body.classList.remove('in-tutorial','in-roles','in-setup','in-preparation');document.body.classList.add('original-home');index=-1;$('#controls').hidden=true;$('#screen').innerHTML='<iframe id="original-home" class="original-home-frame" src="home-original.html" title="뱅 설명서 홈 · 인원 선택"></iframe>';history.replaceState(null,'','#home')}

function updateComposition(){const c=composition(count);$('#composition').textContent=`보안관 1 · 부관 ${c.deputy} · 무법자 ${c.outlaw} · 배신자 1`}
const roleKeys=['sheriff','deputy','outlaw','renegade'];
const roleTitles={sheriff:'보안관',deputy:'부관',outlaw:'무법자',renegade:'배신자'};
function roleArt(key){const c=composition(count);if(!key)return `<div class="role-overview">${roleKeys.map(k=>`<div class="role-tile" data-role-image="${k}">${card(k)}<div class="role-label">${roleTitles[k]} <b>${c[k]}<small>명</small></b></div></div>`).join('')}</div>`;return `<div class="role-focus" data-role-image="${key}">${card(key)}<div class="role-quantity"><span>${count}명 게임</span><strong>${c[key]}<small>명</small></strong><b>${roleTitles[key]}</b></div></div>`}
function renderStep(n){
 const priorRects=new Map([...document.querySelectorAll('[data-role-image]')].map(el=>[el.dataset.roleImage,el.getBoundingClientRect()]));
 index=Math.max(0,Math.min(steps.length-1,n));const [ch,title,caption,art,note,setupStage]=steps[index];const firstRole=steps.findIndex(s=>s[0]===1);const role=ch===1?roleKeys[index-firstRole-1]:null;
 document.body.classList.remove('original-home');document.body.classList.toggle('in-setup',ch===2&&Number.isInteger(steps[index][5]));document.body.classList.toggle('in-preparation',ch===2);document.body.classList.add('in-tutorial');document.body.classList.toggle('in-roles',ch===1);
 $('#controls').hidden=false;$('#screen').innerHTML=`<article class="scene ${ch===1?'role-scene':''} ${ch===2?'preparation-scene':''}" aria-label="${title}"><p class="eyebrow">${String(chapterGroup(ch)+1).padStart(2,'0')} / ${chapterTitle(ch)}</p>${ch>=4&&ch<=7?`<nav class="basic-tabs" aria-label="기본 규칙 주제 선택">${basicTopics.map(t=>`<button data-basic-tab="${t.ch}" aria-current="${ch===t.ch?'true':'false'}">${t.name}</button>`).join('')}</nav>`:''}${ch===1?`<nav class="role-tabs" aria-label="역할 선택">${roleKeys.map((k,i)=>`<button data-role-tab="${i}" aria-current="${role===k?'true':'false'}">${roleTitles[k]}</button>`).join('')}</nav><p class="selected-player-count">${count}명 게임의 역할 구성</p>`:''}${Number.isInteger(setupStage)?'':`<h1 class="headline">${title}</h1>`}<div class="art ${ch===1?'role-art':''}">${ch===1?roleArt(role):Number.isInteger(setupStage)?`<iframe class="original-setup-frame" src="setup-original.html?s=${setupStage}&n=${count}" title="기본세팅 ${setupStage+1}단계"></iframe>`:lessonArt(ch,title,art)}</div>${caption?`<p class="caption">${caption}${ch===1&&note?`<br>${typeof note==='function'?note():note}`:''}</p>`:''}${note&&ch!==1?`<p class="note">${typeof note==='function'?note():note}</p>`:''}</article>`;
 document.querySelectorAll('[data-basic-tab]').forEach(b=>b.onclick=()=>show(steps.findIndex(s=>s[0]===+b.dataset.basicTab)));playJudgment();document.querySelectorAll('[data-role-tab]').forEach(b=>b.onclick=()=>show(firstRole+1+(+b.dataset.roleTab)));
 if(ch===1&&role){const el=document.querySelector(`[data-role-image="${role}"]`),old=priorRects.get(role);if(old&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const now=el.getBoundingClientRect();el.animate([{transform:`translate(${old.x-now.x}px,${old.y-now.y}px) scale(${old.width/now.width},${old.height/now.height})`,opacity:.65},{transform:'none',opacity:1}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});}}
 $('#position').textContent=`${index+1} / ${steps.length}`;$('#progress').style.width=(index+1)/steps.length*100+'%';$('#next').textContent=index===steps.length-1?'인원 선택 ↻':'다음 →';history.replaceState(null,'','#step-'+(index+1));$('#screen').scrollTop=0;window.scrollTo({top:0,behavior:'instant'})
}
let chapterTransitionBusy=false;
async function show(n){
 if(chapterTransitionBusy)return;
 const target=Math.max(0,Math.min(steps.length-1,n)),chapter=steps[target][0];
 if(index>=0&&chapterGroup(steps[index][0])===chapterGroup(chapter)){renderStep(target);return;}
 chapterTransitionBusy=true;
 const veil=document.createElement('div');veil.className='chapter-transition';veil.setAttribute('role','status');veil.setAttribute('aria-live','polite');veil.innerHTML=`<div class="chapter-transition-label"><span>CHAPTER ${String(chapterGroup(chapter)+1).padStart(2,'0')}</span><h2>${chapterTitle(chapter)}</h2><i></i></div>`;document.body.append(veil);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 try{
  await veil.animate([{opacity:0},{opacity:1}],{duration:reduced?100:350,fill:'forwards',easing:'ease-out'}).finished;
  renderStep(target);
  const label=veil.firstElementChild;
  await label.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none',offset:.3},{opacity:1,transform:'none'}],{duration:reduced?250:1000,fill:'forwards',easing:'ease-out'}).finished;
  await veil.animate([{opacity:1},{opacity:0}],{duration:reduced?120:550,fill:'forwards',easing:'ease-in-out'}).finished;
 }finally{veil.remove();chapterTransitionBusy=false;}
}

function next(){if(index<0)return;if(index===steps.length-1)home();else show(index+1)}
$('#home').onclick=home;$('#prev').onclick=()=>index===0?home():show(index-1);$('#next').onclick=next;
// Only an intentional tap advances; a scroll/drag or text selection does not.
let down=null;$('#screen').addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});$('#screen').addEventListener('pointerup',e=>{if(index<0||e.target.closest('button,a')||!down)return;const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(moved<12&&!window.getSelection()?.toString())next()});
document.addEventListener('keydown',e=>{if($('#menu').open||e.target.closest('button,input'))return;if(['ArrowRight',' '].includes(e.key)){e.preventDefault();next()}if(e.key==='ArrowLeft'&&index>=0){e.preventDefault();index===0?home():show(index-1)}});
$('#chapters').onclick=()=>$('#menu').showModal();$('#close-menu').onclick=()=>$('#menu').close();$('#menu-list').innerHTML=[0,1,2,3,4,8].map(ch=>`<button data-chapter="${ch}">${String(chapterGroup(ch)+1).padStart(2,'0')}　${chapterTitle(ch)}</button>`).join('');document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{$('#menu').close();show(steps.findIndex(x=>x[0]===+b.dataset.chapter))});
fetch('assets/cards.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{atlas=d.cards;const match=location.hash.match(/^#step-(\d+)$/);if(match&&+match[1]>=1&&+match[1]<=steps.length)renderStep(+match[1]-1);else home()}).catch(()=>{$('#screen').innerHTML='<article class="scene"><h1>카드를 불러오지 못했어요.</h1><p>로컬 서버를 실행한 뒤 새로고침해 주세요.</p></article>'});

addEventListener('message',e=>{if(e.origin!==location.origin)return;const d=e.data;if(e.source===document.getElementById('original-home')?.contentWindow){if(d.type==='home-height')document.getElementById('original-home').style.height=d.height+'px';if(d.type==='player-count'&&[4,5,6,7].includes(d.count)){count=d.count;try{sessionStorage.setItem('bang-touch-count',count)}catch{}}if(d.type==='tutorial-start'){count=d.count;show(0)}}if(e.source===document.querySelector('.original-setup-frame')?.contentWindow){if(d.type==='setup-ready')document.querySelector('.original-setup-frame').classList.add('is-ready');if(d.type==='setup-next')next()}});

let judgeResizeFrame;addEventListener('resize',()=>{cancelAnimationFrame(judgeResizeFrame);judgeResizeFrame=requestAnimationFrame(()=>{const scene=document.querySelector('.judgment-scene');if(!scene)return;const reveal=scene.querySelector('.judgment-reveal'),r=reveal.getBoundingClientRect(),deck=scene.querySelector('.judgment-deck>img').getBoundingClientRect(),discard=scene.querySelector('.judgment-discard>span').getBoundingClientRect();const base=scene.querySelector('.judgment-action').getBoundingClientRect();const center=base.left+base.width/2;reveal.style.setProperty('--judge-from-x',(deck.left+deck.width/2-center)+'px');reveal.style.setProperty('--judge-to-x',(discard.left+discard.width/2-center)+'px');})});
