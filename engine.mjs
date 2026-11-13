export function rng(seed) {
  let state=seed>>>0;
  return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
}
export function shuffle(values, random) {
  const result=[...values];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
const shapes=['circle','triangle','square','star'];
export function question(kind, level, seed) {
  if(!['pattern','count','match'].includes(kind)||![1,2,3].includes(level))throw new RangeError('Invalid activity or level');
  const random=rng(seed), pick=n=>Math.floor(random()*n);
  let prompt, sequence, answer, choices, hint, explanation;
  if(kind==='pattern'){
    const symbols=shuffle(shapes,random);
    const base=level===1?[symbols[0],symbols[1]]:level===2?[symbols[0],symbols[0],symbols[1]]:[symbols[0],symbols[1],symbols[2]];
    const length=level===1?4:level===2?5:7;
    sequence=Array.from({length},(_,i)=>base[i%base.length]);answer=base[length%base.length];
    choices=symbols.slice(0,level===1?2:level===2?3:4);
    prompt='What comes next in the pattern?';
    hint=`The repeating group is ${base.join(', ')}. Start at the left.`;
    explanation=`The group repeats: ${base.join(', ')}. The next shape is ${answer}.`;
  }else if(kind==='count'){
    const max=level===1?4:level===2?8:12;
    const n=1+pick(max); answer=String(n);sequence=Array(n).fill('circle');
    const distractors=shuffle(Array.from({length:max+2},(_,i)=>String(i+1)).filter(x=>x!==answer),random);
    choices=[answer,...distractors.slice(0,level===1?1:level===2?2:3)];
    prompt='How many dots are here?';hint='Point to each dot once. Say one number for each dot.';
    explanation=`There ${n===1?'is 1 dot':`are ${n} dots`}. You can count them again at your own pace.`;
  }else{
    const symbols=shuffle(shapes,random);answer=symbols[0];sequence=[answer];
    choices=symbols.slice(0,level===1?2:level===2?3:4);
    prompt='Find the matching shape.';hint='Look at the outline. Choose the same shape as the example.';
    explanation=`Both shapes are a ${answer}. Matching uses shape, not color.`;
  }
  return {kind,level,prompt,sequence,answer,choices:shuffle(choices,random),hint,explanation};
}
export function initialSession(total=5){
  if(![3,5,8].includes(total))throw new RangeError('Invalid session length');
  return {total,completed:0,correct:0,answered:false,skipped:0};
}
export function record(session, outcome){
  if(!['correct','skip'].includes(outcome))throw new RangeError('Invalid outcome');
  if(session.answered||session.completed>=session.total)return session;
  return {...session,answered:true,completed:session.completed+1,
    correct:session.correct+(outcome==='correct'?1:0),skipped:session.skipped+(outcome==='skip'?1:0)};
}
