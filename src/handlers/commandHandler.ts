import { CommandClient, Message, type CommandGenerator, type CommandOptions } from 'eris';
import { readdirSync } from 'fs';
import path from 'path';
import { AsciiTable3 } from 'ascii-table3';

export async function loadCommands(client: CommandClient) {
    const table = new AsciiTable3('Commands')
        .setHeading('Category', 'Command', 'Status')
        .setStyle('unicode-single');
    
    const commandCategories = readdirSync(path.join(__dirname, '../commands'));
    
    for (const category of commandCategories) {
        if (category.includes('.')) continue;
        
        const commandFiles = readdirSync(path.join(__dirname, `../commands/${category}`))
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
        
        for (const file of commandFiles) {
            try {
                const command = await import(`../commands/${category}/${file}`) as {
                    name: string;
                    description: string;
                    options: CommandOptions;
                    execute: CommandGenerator;
                };
                if (!command.name || !command.description || !command.execute) {
                    throw new Error(`Invalid command file: ${file}`);
                }
                client.registerCommand(command.name, command.execute, command.options);
                table.addRow(category, command.name, '✓');
            } catch (error) {
                table.addRow(category, file.replace('.ts', '').replace('.js', ''), '✕');
                console.error(`Error loading command ${file}:`, error);
            }
        }
    }
    
    console.log(table.toString());
}