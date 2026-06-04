import * as migration_20260604_232437_initial from './20260604_232437_initial';

export const migrations = [
  {
    up: migration_20260604_232437_initial.up,
    down: migration_20260604_232437_initial.down,
    name: '20260604_232437_initial'
  },
];
