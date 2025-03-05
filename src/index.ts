import 'dotenv/config';
import { CommandClient} from 'eris';
import { Pool } from 'pg';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { createLogsTable } from './database/logs';
import { createUserTable } from './database/userModel';
import { createGuildTable } from './database/guilds';

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Initialize Discord bot
export const bot = new CommandClient(process.env.DISCORD_TOKEN!, { intents: ['guilds', 'guildMessages', 'guildMembers', "messageContent", "guildEmojis", "guildMessageReactions"] }, {
    description: "Aura Bot",
    owner: "Sohom829",
    prefix: ["kiyuri", "k!", "k", "@mention", "aura"]
});

async function start() {
    await loadCommands(bot);
    await loadEvents(bot);
    await bot.connect();
    await createLogsTable();
    await createUserTable();
    await createGuildTable();
}

start().catch(console.error);
