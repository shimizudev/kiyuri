import { pool } from '../index';

export async function createUserTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            discord_id VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            aurapoints TEXT DEFAULT '0',
            is_infinite BOOLEAN DEFAULT FALSE,
            aurapoints_last_updated TIMESTAMP DEFAULT NOW(),
            last_daily TIMESTAMP DEFAULT NULL,
            aura_points_receive_limit TEXT DEFAULT '0',
            aura_points_receive_limit_last_reset TIMESTAMP DEFAULT NOW(),
            aura_points_give_limit TEXT DEFAULT '0',
            aura_points_give_limit_last_reset TIMESTAMP DEFAULT NOW(),
            aura_points_last_got TIMESTAMP DEFAULT NULL,
            job TEXT DEFAULT NULL,
            job_started_at TIMESTAMP DEFAULT NULL,
            job_cooldown_ends TIMESTAMP DEFAULT NULL,
            job_cooldown_duration INTERVAL DEFAULT NULL,
            job_cooldown_remaining INTERVAL DEFAULT NULL,
            job_cooldown_last_reset TIMESTAMP DEFAULT NULL,
            job_cooldown_last_updated TIMESTAMP DEFAULT NULL
        )
    `);

    await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS aurapoints TEXT DEFAULT '0',
        ADD COLUMN IF NOT EXISTS is_infinite BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS aurapoints_last_updated TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS last_daily TIMESTAMP DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS aura_points_receive_limit TEXT DEFAULT '0',
        ADD COLUMN IF NOT EXISTS aura_points_receive_limit_last_reset TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS aura_points_give_limit TEXT DEFAULT '0',
        ADD COLUMN IF NOT EXISTS aura_points_give_limit_last_reset TIMESTAMP DEFAULT NOW(),
        ADD COLUMN IF NOT EXISTS aura_points_last_got TIMESTAMP DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job TEXT DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_started_at TIMESTAMP DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_cooldown_ends TIMESTAMP DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_cooldown_duration INTERVAL DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_cooldown_remaining INTERVAL DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_cooldown_last_reset TIMESTAMP DEFAULT NULL,
        ADD COLUMN IF NOT EXISTS job_cooldown_last_updated TIMESTAMP DEFAULT NULL
    `);
}

export async function createUser(discordId: string) {
    const result = await pool.query(
        'INSERT INTO users (discord_id, last_daily, aura_points_last_got, job, job_started_at, job_cooldown_ends, job_cooldown_duration, job_cooldown_remaining, job_cooldown_last_reset, job_cooldown_last_updated) VALUES ($1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) RETURNING *',
        [discordId]
    );
    return result.rows[0];
}

export async function getUser(discordId: string) {
    const result = await pool.query(
        'SELECT * FROM users WHERE discord_id = $1',
        [discordId]
    );
    return result.rows[0] as {
        id: number;
        discord_id: string;
        created_at: Date;
        aurapoints: string;
        is_infinite: boolean;
        aurapoints_last_updated: Date;
        last_daily: Date;
        aura_points_receive_limit: string;
        aura_points_receive_limit_last_reset: Date;
        aura_points_give_limit: string;
        aura_points_give_limit_last_reset: Date;
        aura_points_last_got: Date;
        job: string | null;
        job_started_at: Date | null;
        job_cooldown_ends: Date | null;
        job_cooldown_duration: string | null;
        job_cooldown_remaining: string | null;
        job_cooldown_last_reset: Date | null;
    };
}

export async function deleteUser(discordId: string) {
    await pool.query('DELETE FROM users WHERE discord_id = $1', [discordId]);
}

export async function updateAuraPoints(discordId: string, amount: string | 'Infinity') {
    if (amount === 'Infinity') {
        const result = await pool.query(
            'UPDATE users SET aurapoints = $1, is_infinite = TRUE WHERE discord_id = $2 RETURNING *',
            ['Infinity', discordId]
        );
        return result.rows[0] as {
            id: number;
            discord_id: string;
            created_at: Date;
            aurapoints: string;
            is_infinite: boolean;
        };
    }

    const result = await pool.query(
        'UPDATE users SET aurapoints = (CASE WHEN is_infinite = TRUE THEN aurapoints ELSE (CAST(aurapoints AS NUMERIC) + CAST($1 AS NUMERIC))::TEXT END) WHERE discord_id = $2 RETURNING *',
        [amount, discordId]
    );

    return result.rows[0] as {
        id: number;
        discord_id: string;
        created_at: Date;
        aurapoints: string;
        is_infinite: boolean;
    };
}
