import { Logger } from '@nestjs/common';
import * as process from 'process';

export interface InsertResult {
  affectedRows: number;
  insertId: number;
  warningStatus: number;
}

export class DbConnection {
  static readonly logger = new Logger(DbConnection.name);
  static readonly pool = require('mariadb').createPool({
    host: 'warestore.crcln0nsujd0.us-east-2.rds.amazonaws.com',
    user: 'xnuser',
    password: process.env.DB_PASSWORD,
    database: 'User',
  });

  public static async select(query: string, values: any[]): Promise<any[] | null> {
    const conn = await DbConnection.pool.getConnection();
    try {
      return await conn.query(query, values);
    } catch (e) {
      DbConnection.logger.error(e);
    } finally {
      if (conn) {
        await conn.end();
      }
    }
    return null;
  }

  public static async insert(query: string, values: any[]): Promise<InsertResult | null> {
    const conn = await DbConnection.pool.getConnection();
    try {
      return await conn.query(query, values);
    } catch (e) {
      DbConnection.logger.error(e);
    } finally {
      if (conn) {
        await conn.end();
      }
    }
    return null;
  }
}
