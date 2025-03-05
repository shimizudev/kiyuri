import { pool } from '../index';

export async function createLogsTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS logs (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            action VARCHAR(255) NOT NULL,
            executor_id VARCHAR(255) NOT NULL,
            target_id VARCHAR(255),
            reason TEXT,
            metadata JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            is_private BOOLEAN DEFAULT FALSE
        )
    `);
}

export async function createLog(
    type: 'ADMIN' | 'MOD' | 'USER' | 'DEV',
    action: string,
    executorId: string,
    targetId?: string,
    reason?: string,
    metadata?: any,
    isPrivate: boolean = false
) {
    const result = await pool.query(
        `INSERT INTO logs (
            type,
            action,
            executor_id,
            target_id,
            reason,
            metadata,
            is_private
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [type, action, executorId, targetId, reason, metadata, isPrivate]
    );
    return result.rows[0];
}

export async function getLogs(
    type?: 'ADMIN' | 'MOD' | 'USER' | 'DEV',
    limit: number = 100,
    offset: number = 0,
    isPrivate: boolean = false
) {
    const params: any[] = [];
    let query = 'SELECT * FROM logs WHERE 1=1';
    
    if (type) {
        params.push(type);
        query += ` AND type = $${params.length}`;
    }
    
    if (!isPrivate) {
        query += ' AND is_private = FALSE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    params.push(limit, offset);
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
    
    const result = await pool.query(query, params);
    return result.rows;
}

export async function getLogsByUser(
    userId: string,
    type?: 'ADMIN' | 'MOD' | 'USER' | 'DEV',
    isExecutor: boolean = false,
    isPrivate: boolean = false
) {
    const params: any[] = [userId];
    let query = `SELECT * FROM logs WHERE ${isExecutor ? 'executor_id' : 'target_id'} = $1`;
    
    if (type) {
        params.push(type);
        query += ` AND type = $${params.length}`;
    }
    
    if (!isPrivate) {
        query += ' AND is_private = FALSE';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
}
