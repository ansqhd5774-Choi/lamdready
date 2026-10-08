import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, matchCondition, validateRelease } from '../src/rule-engine.js';

// Synthetic jurisdiction and evidence: these are not legal travel guidance.
const base = { id: 'FIXTURE-1', version: 1, jurisdiction: 'TEST', item: 'TEST_ITEM', status: 'APPROVED', evidence: ['fixture-only'], verifiedAt: '2026-10-09', effectiveFrom: '2026-01-01', effectiveTo: '2027-01-01', condition: { field: 'quantity', op: 'lte', value: 200 }, outcome: { duty: 'WITHIN_ALLOWANCE' } };
const context = { jurisdiction: 'TEST', item: 'TEST_ITEM', eventDate: '2026-10-09', quantity: 200 };
test('boundary and missing axes', () => { const value = evaluate([base], context); assert.equal(value.result.duty, 'WITHIN_ALLOWANCE'); assert.equal(value.result.entry, 'UNKNOWN'); assert.equal(evaluate([base], { ...context, quantity: 201 }).status, 'UNVERIFIED'); });
test('missing input is never assumed', () => { const value = evaluate([base], { ...context, quantity: undefined }); assert.equal(value.status, 'NEEDS_INPUT'); assert.deepEqual(value.missing, ['quantity']); });
test('unapproved and unsourced rules excluded', () => { assert.equal(evaluate([{ ...base, status: 'DRAFT' }], context).status, 'UNVERIFIED'); assert.equal(evaluate([{ ...base, evidence: [] }], context).status, 'UNVERIFIED'); });
test('effective dates, exclusive end', () => { assert.equal(evaluate([base], { ...context, eventDate: '2027-01-01' }).status, 'UNVERIFIED'); assert.equal(evaluate([base], { ...context, eventDate: '2025-12-31' }).status, 'UNVERIFIED'); });
test('conflicts are local to an axis', () => { const value = evaluate([base, { ...base, id: 'FIXTURE-2', outcome: { duty: 'NO_ALLOWANCE', declaration: 'REQUIRED' } }], context); assert.equal(value.status, 'CONFLICT'); assert.equal(value.result.duty, 'UNKNOWN'); assert.equal(value.result.declaration, 'REQUIRED'); });
test('unknown potentially applicable rule blocks definitive axis', () => { const value = evaluate([base, { ...base, id: 'FIXTURE-2', condition: { field: 'age', op: 'gte', value: 18 }, outcome: { duty: 'NO_ALLOWANCE' } }], context); assert.equal(value.result.duty, 'UNKNOWN'); assert.equal(value.status, 'NEEDS_INPUT'); });
test('AND and OR use three-valued logic', () => { const age = { field: 'age', op: 'gte', value: 18 }; const quantity = base.condition; assert.equal(matchCondition({ all: [age, quantity] }, { quantity: 201 }).value, false); assert.equal(matchCondition({ any: [age, quantity] }, context).value, true); });
test('string numbers are not coerced', () => assert.equal(evaluate([base], { ...context, quantity: '200' }).status, 'NEEDS_INPUT'));
test('invalid dates rejected', () => assert.throws(() => evaluate([base], { ...context, eventDate: '2026-02-30' })));
test('release gate rejects missing evidence and draft', () => { const release = { schemaVersion: 1, engineVersion: 1, releaseId: 'fixture', rules: [base] }; assert.equal(validateRelease(release).valid, true); assert.equal(validateRelease({ ...release, rules: [{ ...base, status: 'DRAFT', evidence: [] }] }).valid, false); });
