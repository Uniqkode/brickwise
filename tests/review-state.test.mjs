import test from 'node:test';
import assert from 'node:assert/strict';
import {createReview, reviewProgress, reportToMarkdown} from '../assets/review-state.js';

const sample = {
  title:'Marina House · AHU 03', summary:'Two observations need a qualified review.',
  sources:[{id:'S1', name:'inspection.txt', excerpt:'Water staining at the drain.'}, {id:'S2', name:'technician.txt', excerpt:'Check the filter and drain line.'}],
  findings:[{title:'Inspect the drain', source:'S1', quote:'Water staining at the drain.', action:'Check for an active leak.'}, {title:'Check the service note', source:'S2', quote:'Check the filter and drain line.', action:'Arrange qualified follow-up.'}]
};

test('a prepared brief starts unchecked and does not mutate its sample or another review', () => {
  const first = createReview(sample, 'first'), second = createReview(sample, 'second');
  first.notes = 'Keep this note with the first case.';
  first.checked[0] = true; first.sources[0].excerpt = 'Edited local copy';
  assert.equal(second.notes, '');
  assert.deepEqual(second.checked, [false, false]);
  assert.equal(sample.sources[0].excerpt, 'Water staining at the drain.');
  assert.equal(reviewProgress(second).canQueue, false);
});

test('checking a box cannot queue a brief until every cited source has been opened', () => {
  const review = createReview(sample, 'source-check');
  review.checked = [true, true]; review.visited = ['S1'];
  assert.deepEqual(reviewProgress(review), {total:2, checked:1, fraction:.5, canQueue:false});
  review.visited.push('S2');
  assert.equal(reviewProgress(review).canQueue, true);
  review.checked[0] = false;
  assert.equal(reviewProgress(review).canQueue, false);
});

test('an accepted brief cannot be queued twice', () => {
  const review = createReview(sample, 'queued');
  review.checked = [true, true]; review.visited = ['S1', 'S2']; review.accepted = true;
  assert.equal(reviewProgress(review).fraction, 1);
  assert.equal(reviewProgress(review).canQueue, false);
});

test('empty findings and truthy non-boolean checks never count as a completed review', () => {
  assert.deepEqual(reviewProgress(createReview({...sample, findings:[]}, 'empty')), {total:0, checked:0, fraction:0, canQueue:false});
  const review = createReview(sample, 'invalid-check');
  review.checked = ['yes', 1]; review.visited = ['S1', 'S2'];
  assert.equal(reviewProgress(review).checked, 0);
  assert.equal(reviewProgress(review).canQueue, false);
});

test('downloads retain citations, actual evidence checks, multiline notes, and draft status', () => {
  const review = createReview(sample, 'export');
  review.checked = [true, true]; review.visited = ['S1'];
  review.notes = 'Verify the connection.\nRecord a follow-up photograph.';
  const text = reportToMarkdown(review, 'Brickwise', 'A qualified person approves the work.');
  assert.match(text, /Draft — not queued/);
  assert.match(text, /Evidence checked: Yes\nSource: S1/);
  assert.match(text, /Evidence checked: No\nSource: S2/);
  assert.ok(text.includes(review.notes));
  assert.ok(text.includes(sample.sources[1].excerpt));
  assert.match(text, /product illustrations/);
});

test('downloads remain compatible with saved reports from the previous desk', () => {
  const old = {...sample, id:'old', mode:'sample', accepted:true};
  const text = reportToMarkdown(old, 'Brickwise', 'Human review required.');
  assert.match(text, /Queued for human review/);
  assert.match(text, /Evidence checked: No/);
});
