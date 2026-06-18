import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLeadSlaSnapshot } from '@/lib/lead/sla';

const config = {
  timeZone: 'Asia/Shanghai',
  workdays: new Set([1, 2, 3, 4, 5]),
  startMinutes: 8 * 60 + 30,
  endMinutes: 18 * 60,
  slaMinutes: 30,
  holidays: new Set(['2026-06-19']),
  primaryAssignee: 'cn-sales',
  backupAssignee: 'backup',
  escalationAssignee: 'manager',
};

test('SLA within business hours keeps the same window', () => {
  const snapshot = buildLeadSlaSnapshot(new Date('2026-06-18T02:00:00.000Z'), config);
  assert.equal(snapshot.startedAt.toISOString(), '2026-06-18T02:00:00.000Z');
  assert.equal(snapshot.dueAt.toISOString(), '2026-06-18T02:30:00.000Z');
});

test('SLA before business hours starts at opening time', () => {
  const snapshot = buildLeadSlaSnapshot(new Date('2026-06-18T00:10:00.000Z'), config);
  assert.equal(snapshot.startedAt.toISOString(), '2026-06-18T00:30:00.000Z');
  assert.equal(snapshot.dueAt.toISOString(), '2026-06-18T01:00:00.000Z');
});

test('SLA after business hours moves to next valid workday and skips holidays/weekends', () => {
  const snapshot = buildLeadSlaSnapshot(new Date('2026-06-18T10:30:00.000Z'), config);
  assert.equal(snapshot.startedAt.toISOString(), '2026-06-22T00:30:00.000Z');
  assert.equal(snapshot.dueAt.toISOString(), '2026-06-22T01:00:00.000Z');
});
