import type { Client } from "eris";

export async function execute(client: Client) {
    console.log(`Logged in as ${client.user.globalName || client.user.username}`);
} 