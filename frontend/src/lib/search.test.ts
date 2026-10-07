import assert from 'node:assert/strict';
import test from 'node:test';

import { matchesSearchTerm } from './search';

test('matches search term across row values', () => {
  const row = { name: 'Sophia Nguyen', company: 'Northstar Labs', status: 'Qualified' };

  assert.equal(matchesSearchTerm(row, 'northstar'), true);
  assert.equal(matchesSearchTerm(row, 'qualified'), true);
  assert.equal(matchesSearchTerm(row, 'not-found'), false);
  assert.equal(matchesSearchTerm(row, ''), true);
});
