import { Client } from 'eris';
import { readdirSync } from 'fs';
import path from 'path';

export async function loadEvents(client: Client) {
    const eventFiles = readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.ts'));
    
    for (const file of eventFiles) {
        const event = await import(`../events/${file}`);
        const eventName = file.split('.')[0];
        
        client.on(eventName, (...args) => event.execute(client, ...args));
        console.log(`Loaded event: ${eventName}`);
    }
} 