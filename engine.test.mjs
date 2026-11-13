import test from 'node:test';
import assert from 'node:assert/strict';
import {question,initialSession,record} from './engine.mjs';
test('all activities generate deterministic valid choices across 500 seeds',()=>{
  for(const kind of ['pattern','count','match'])for(const level of [1,2,3])for(let seed=0;seed<500;seed++){
    const q=question(kind,level,seed);
    assert.deepEqual(q,question(kind,level,seed));
    assert.equal(new Set(q.choices).size,q.choices.length);
    assert.equal(q.choices.filter(x=>x===q.answer).length,1);
    assert.equal(q.choices.length,level+1);
    if(kind==='count')assert.equal(q.sequence.length,Number(q.answer));
    if(kind==='match')assert.equal(q.sequence[0],q.answer);
    if(kind==='pattern'){
      const period=level===1?2:3;
      assert.equal(q.answer,q.sequence[q.sequence.length%period]);
    }
  }
});
test('correct answer counted only once; skipped rounds complete without score',()=>{
  const a=record(initialSession(3),'correct');assert.equal(a.correct,1);
  assert.deepEqual(record(a,'correct'),a);
  const b=record({...a,answered:false},'skip');assert.equal(b.completed,2);assert.equal(b.correct,1);assert.equal(b.skipped,1);
});
test('session cannot overrun and invalid values rejected',()=>{
  const full={...initialSession(3),completed:3};assert.deepEqual(record(full,'correct'),full);
  assert.throws(()=>question('bad',1,1));assert.throws(()=>question('count',4,1));assert.throws(()=>initialSession(0));
});
