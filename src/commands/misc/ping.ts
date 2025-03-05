import type { Message } from "eris";

export const name = 'ping';
export const description = 'Check bot latency';
export const options = [];

export async function execute(message: Message) {
    const start = Date.now();
    const msg = await message.channel.createMessage('Pinging...');
    const latency = Date.now() - start;
    
    msg.edit(`Pong! Latency: ${latency}ms`);
} 