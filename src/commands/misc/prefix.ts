import { Message, type CommandOptions } from "eris";
import { getGuild, createGuild, updateGuildPrefix } from "../../database/guilds";
import { createLog } from "../../database/logs";
import { bot } from "../..";

export const name = 'prefix';
export const description = 'Change the bot prefix for this server';
export const options: CommandOptions = {
    aliases: ['setprefix', 'pfx'],
    cooldown: 5,
    usage: '<new prefix>',
    description: 'Change the bot prefix for this server',
    fullDescription: 'Change the bot prefix for this server. Only server administrators can use this command.',
    requirements: {
        permissions: {
            administrator: true
        }
    }
};

export async function execute(message: Message, args: string[]) {
    if (!args.length) {
        return message.channel.createMessage("fr fr bestie you gotta tell me what prefix you want 💀");
    }

    const newPrefix = args[0];

    if (!newPrefix) {
        let guild = await getGuild(message.guildID!);
        if (!guild) {
            guild = await createGuild(message.guildID!);
            return message.channel.createMessage(`no cap this server ain't got no prefix yet bestie, we using \`aura\` rn fr fr 💯`);
        }
        return message.channel.createMessage(`ong the current prefix is \`${guild?.prefix}\` fr fr 🔥`);
    }

    if (newPrefix.length > 10) {
        return message.channel.createMessage("sheesh bestie that prefix too long fr fr 💀 keep it under 10 characters no cap");
    }

    let guild = await getGuild(message.guildID!);

    if (!guild) {
        guild = await createGuild(message.guildID!);
    }

    const oldPrefix = guild.prefix;
    await updateGuildPrefix(message.guildID!, newPrefix);
    bot.registerGuildPrefix(message.guildID!, ['kiyuri', '@mention', 'aura', newPrefix]);

    await createLog(
        'ADMIN',
        'PREFIX_CHANGE',
        message.author.id,
        message.guildID,
        'Changed server prefix',
        { oldPrefix, newPrefix }
    );

    return message.channel.createMessage(`sheeeesh bestie you just changed the prefix from \`${oldPrefix}\` to \`${newPrefix}\` fr fr that's a W no cap 🔥`);
}
