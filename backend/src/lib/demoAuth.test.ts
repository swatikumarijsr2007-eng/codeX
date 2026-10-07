import assert from 'node:assert/strict';
import test from 'node:test';

import { isCustomPasswordAllowed } from './mockData.js';

test('allows any non-empty password for demo login', () => {
  assert.equal(isCustomPasswordAllowed('MyOwnPassword123!'), true);
  assert.equal(isCustomPasswordAllowed('   '), false);
  assert.equal(isCustomPasswordAllowed(''), false);
});
