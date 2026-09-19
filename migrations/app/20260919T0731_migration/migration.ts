#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/221961d489b73b6dcf76474379f9de57c47330fd8edaffe674216e9b99fb1024/contract';
import startContract from '../../snapshots/221961d489b73b6dcf76474379f9de57c47330fd8edaffe674216e9b99fb1024/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c50140090a493e4c39e40b0eeaecea77e34e05e68fa79857fa905b1bc3098d97/contract';
import endContract from '../../snapshots/c50140090a493e4c39e40b0eeaecea77e34e05e68fa79857fa905b1bc3098d97/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'deposit',
        columns: [
          col('amount', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('method', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('reference', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('userId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'deposit_method_check_5c8e9670',
            "\"method\" IN ('BANK_TRANSFER', 'EASYPAISA', 'JAZZCASH', 'RAAST')",
          ),
          checkExpression(
            'deposit_status_check_56005a61',
            "\"status\" IN ('PENDING', 'APPROVED', 'REJECTED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'deposit',
        constraint: 'deposit_reference_key',
        columns: ['reference'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'deposit',
        index: 'deposit_status_idx_e98638ab',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'deposit',
        index: 'deposit_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'deposit',
        foreignKey: {
          name: 'deposit_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
