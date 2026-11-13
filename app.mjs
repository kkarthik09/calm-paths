import {question,initialSession,record} from './engine.mjs';
const $=id=>document.getElementById(id);
const key='calm-paths-settings-v1';
let config={level:1,total:3,quiet:true,large:false,remember:false};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&[1,2,3].includes(saved.level)&&[3,5,8].includes(saved.total))config={...config,level:saved.level,total:saved.total,quiet:saved.quiet!==false,large:saved.large===true,remember:true};}catch{}
let session=initialSession(config.total), current, kind='pattern', currentView='home';
const names={pattern:'PATTERN GARDEN',count:'LITTLE COLLECTIONS',match:'SHAPE FRIENDS'};
function appearance(){document.body.classList.toggle('quiet-colors',config.quiet);document.body.classList.toggle('large',config.large);}
appearance();
function view(id){for(const el of document.querySelectorAll('.view'))el.hidden=el.id!==id;currentView=id;$('message').textContent='';window.scrollTo(0,0);}
function shape(name){
  const container=document.createElement('span');container.className='shape';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 64 64');svg.setAttribute('aria-hidden','true');
  const paths={circle:'M32 8a24 24 0 1 0 0 48a24 24 0 1 0 0-48',triangle:'M32 7L58 55H6Z',square:'M10 10H54V54H10Z',star:'M32 5L40 24L60 25L44 38L49 59L32 47L15 59L20 38L4 25L24 24Z'};
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]);svg.append(path);
  const label=document.createElement('small');label.textContent=name;container.append(svg,label);return container;
}
function start(activity){kind=activity;session=initialSession(config.total);view('play');renderQuestion();}
function renderQuestion(){
  current=question(kind,config.level,crypto.getRandomValues(new Uint32Array(1))[0]);
  $('activityLabel').textContent=names[kind];$('questionTitle').textContent=current.prompt;
  $('roundLabel').textContent=`Step ${session.completed+1} of ${session.total}`;
  $('progressFill').style.width=`${session.completed/session.total*100}%`;
  $('feedback').textContent='';$('nextButton').hidden=true;$('skipButton').hidden=false;
  $('hintButton').disabled=false;
  $('stimulus').replaceChildren(...current.sequence.map(shape));
  if(kind==='pattern'){const mark=document.createElement('strong');mark.textContent='?';mark.setAttribute('aria-label','What comes next?');$('stimulus').append(mark);}
  $('answers').replaceChildren(...current.choices.map(choice=>{
    const button=document.createElement('button');button.className='answer';button.setAttribute('aria-label',choice);
    if(/^\d+$/.test(choice))button.textContent=choice;else button.append(shape(choice));
    button.addEventListener('click',()=>answer(choice,button));return button;
  }));
  $('questionTitle').focus();
}
function answer(choice,button){
  if(session.answered)return;
  if(choice!==current.answer){$('feedback').textContent='Let’s look again. You can try another answer, use a hint, or skip.';return;}
  session=record(session,'correct');button.classList.add('selected');$('feedback').textContent=current.explanation;settled();
}
function settled(){
  for(const button of $('answers').children)button.disabled=true;
  $('hintButton').disabled=true;$('skipButton').hidden=true;$('nextButton').hidden=false;
  $('nextButton').textContent=session.completed===session.total?'Finish these steps ✓':'Next step →';
  $('progressFill').style.width=`${session.completed/session.total*100}%`;
}
for(const button of document.querySelectorAll('[data-kind]'))button.addEventListener('click',()=>start(button.dataset.kind));
$('hintButton').onclick=()=>{$('feedback').textContent=current.hint;};
$('skipButton').onclick=()=>{session=record(session,'skip');$('feedback').textContent='Skipped. Choosing a different step is okay.';settled();};
$('nextButton').onclick=()=>{if(session.completed===session.total)finish();else{session={...session,answered:false};renderQuestion();}};
function finish(){view('finished');$('finishTitle').focus();}
$('homeButton').onclick=$('routineHome').onclick=$('againButton').onclick=()=>view('home');
document.querySelector('.brand').onclick=e=>{e.preventDefault();view('home');};
$('routineButton').onclick=$('finishRoutine').onclick=()=>view('routine');
$('helpButton').onclick=()=>{$('message').textContent='I need help. Please sit with me and show me one step at a time.';};
$('breakButton').onclick=()=>{$('breakDialog').showModal();};
$('returnButton').onclick=()=>{$('breakDialog').close();};
$('leaveBreak').onclick=()=>{$('breakDialog').close();finish();};
$('doneButton').onclick=finish;
function resetRoutine(){$('firstStatus').textContent='Ready when you are.';$('thenStatus').textContent='This comes next.';$('firstDone').disabled=false;$('thenDone').disabled=false;}
$('firstDone').onclick=()=>{$('firstStatus').textContent='Finished ✓';$('thenStatus').textContent='Next, when you are ready.';$('firstDone').disabled=true;};
$('thenDone').onclick=()=>{$('thenStatus').textContent='Finished ✓ Your plan is complete.';$('thenDone').disabled=true;};
$('firstChoice').onchange=$('thenChoice').onchange=$('resetRoutine').onclick=resetRoutine;
$('settingsButton').onclick=()=>{$('difficulty').value=String(config.level);$('rounds').value=String(config.total);$('lowStim').checked=config.quiet;$('largeText').checked=config.large;$('remember').checked=config.remember;$('settings').showModal();};
$('age').onchange=()=>{const presets={'4-6':1,'7-10':2,'11+':3};if(presets[$('age').value])$('difficulty').value=String(presets[$('age').value]);};
$('settings').addEventListener('close',()=>{if($('settings').returnValue!=='save')return;config={level:Number($('difficulty').value),total:Number($('rounds').value),quiet:$('lowStim').checked,large:$('largeText').checked,remember:$('remember').checked};appearance();try{if(config.remember)localStorage.setItem(key,JSON.stringify(config));else localStorage.removeItem(key);}catch{$('message').textContent='Settings work for this visit, but could not be saved on this device.';}$('settings').returnValue='';});
$('clearSettings').onclick=()=>{try{localStorage.removeItem(key);}catch{}config.remember=false;$('remember').checked=false;$('clearSettings').textContent='Saved settings cleared';};
