import { pool } from '../index';

export interface Guild {
    id: number;
    guild_id: string;
    prefix: string;
    created_at: Date;
}

export async function createGuildTable(): Promise<void> {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS guilds (
            id SERIAL PRIMARY KEY,
            guild_id VARCHAR(255) UNIQUE NOT NULL,
            prefix TEXT DEFAULT 'aura',
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
}

export async function createGuild(guildId: string): Promise<Guild> {
    const result = await pool.query<Guild>(
        'INSERT INTO guilds (guild_id) VALUES ($1) RETURNING *',
        [guildId]
    );
    return result.rows[0];
}

export async function getGuild(guildId: string): Promise<Guild | null> {
    const result = await pool.query<Guild>(
        'SELECT * FROM guilds WHERE guild_id = $1',
        [guildId]
    );
    return result.rows[0] || null;
}

export async function updateGuildPrefix(guildId: string, prefix: string): Promise<Guild> {
    const result = await pool.query<Guild>(
        'UPDATE guilds SET prefix = $1 WHERE guild_id = $2 RETURNING *',
        [prefix, guildId]
    );
    return result.rows[0];
}

export async function deleteGuild(guildId: string): Promise<void> {
    await pool.query('DELETE FROM guilds WHERE guild_id = $1', [guildId]);
}

export async function getPrefix(guildId: string): Promise<string> {
    const guild = await getGuild(guildId);
    return guild?.prefix || 'k!';
}



