import { Message, type CommandOptions } from "eris";
import { getUser, updateAuraPoints, createUser } from "../../database/userModel";
import { createLog } from "../../database/logs";
import { bot } from "../..";

export const name = 'get';
export const description = 'Get aura points from another user';
export const options: CommandOptions = {
    aliases: ['negative', '--', '-', '---', '----', '-----', '------', '-------'],
    cooldown: 300,
    usage: '<@user> <amount>',
    description: 'Get aura points from another user',
    fullDescription: 'Get aura points from another user! You need to have at least as many points as you want to take from someone. For example, to take 500 points you need to have at least 500 points yourself.'
};

export async function execute(message: Message, args: string[]) {
    if (args.length < 2) {
        return message.channel.createMessage("fr fr bestie you gotta @ someone and say how much you want! like this: `get <@user> <amount>` 💀");
    }

    const targetId = args[0].replace(/[<@!>]/g, '');
    const amount = args[1];
    const getAmount = Number(amount);

    // Early validation checks
    if (targetId === message.author.id) {
        return message.channel.createMessage("nah fr you can't steal from yourself bestie that's not how it works 💀");
    }

    if (targetId === bot.user.id) {
        return message.channel.createMessage("ong bestie i'm too broke for this 😭 i ain't got no points fr fr");
    }

    const currentGuild = bot.guilds.get(message.guildID as string);
    const tgUser = currentGuild?.members.get(targetId);
    
    if (tgUser?.bot) {
        return message.channel.createMessage("no cap you can't steal from bots bestie they're just as broke as me fr 💀");
    }

    if (amount === "Infinity" || isNaN(getAmount) || getAmount <= 0) {
        return message.channel.createMessage("bestie that ain't a real number fr fr 💀 try again");
    }

    // Get or create users in parallel
    const [sourceUser, targetUser] = await Promise.all([
        getUser(message.author.id) || createUser(message.author.id),
        getUser(targetId) || createUser(targetId)
    ]);

    const sourcePoints = sourceUser.is_infinite ? Infinity : Number(sourceUser.aurapoints);
    const targetPoints = targetUser.is_infinite ? Infinity : Number(targetUser.aurapoints);
    
    if (targetPoints < getAmount) {
        return message.channel.createMessage(`nah fr they only got ${targetUser.aurapoints} points bestie 💀 you can't take more than they have no cap`);
    }

    if (sourcePoints < getAmount) {
        return message.channel.createMessage(`fr fr you need at least ${getAmount} points to take that much bestie 💀 get your bag up first no cap`);
    }

    // Update points and create log
    await Promise.all([
        updateAuraPoints(targetId, (-getAmount).toString()),
        createLog(
            'USER',
            'GET_POINTS',
            message.author.id,
            targetId,
            `Got ${amount} aura points`,
            {
                amount,
                source_points: sourceUser.aurapoints,
                target_points: targetUser.aurapoints
            }
        )
    ]);

    return message.channel.createMessage(`sheeeesh bestie you just secured ${amount} aura points from <@${targetId}> fr fr 🔥 that's a W no cap`);
}
