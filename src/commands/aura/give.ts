import { Message, type CommandOptions } from "eris";
import { getUser, updateAuraPoints, createUser } from "../../database/userModel";
import { createLog } from "../../database/logs";
import { calculateReceiveLimit } from "../../helpers/receive-limit";
import { bot } from "../..";

export const name = 'give';
export const description = 'Give aura points to another user';
export const options: CommandOptions = {
    aliases: ['add', '++', '+', '+++', '++++', '+++++', '++++++', '+++++++'],
    cooldown: 300,
    usage: '<@user> <amount>',
    description: 'Give aura points to another user',
    fullDescription: 'Give aura points to another user! You can give up to 10000 aura points per day to another user. You can only give aura points to users that have less than 10000 aura points.'
};

export async function execute(message: Message, args: string[]) {
    if (args.length < 2) {
        return message.channel.createMessage("fr fr bestie you gotta @ someone and say how much you wanna give! like this: `give <@user> <amount>` 💀");
    }

    const targetId = args[0].replace(/[<@!>]/g, '');
    const amount = args[1];
    const giveAmount = Number(amount);

    // Early validation checks
    if (targetId === message.author.id) {
        return message.channel.createMessage("nah fr you can't give points to yourself bestie that's not how it works 💀");
    }

    if (targetId === bot.user.id) {
        return message.channel.createMessage("ong bestie i don't need points fr fr i'm built different 😤");
    }

    const currentGuild = bot.guilds.get(message.guildID as string);
    const tgUser = currentGuild?.members.get(targetId);
    
    if (tgUser?.bot) {
        return message.channel.createMessage("no cap you can't give points to bots bestie they don't even know what to do with them fr 💀");
    }

    if (amount === "Infinity" || isNaN(giveAmount) || giveAmount <= 0) {
        return message.channel.createMessage("bestie that ain't a real number fr fr 💀 try again");
    }

    // Get or create users in parallel
    let sourceUser = await getUser(message.author.id);
    let targetUser = await getUser(targetId);

    if (!sourceUser) {
        sourceUser = await createUser(message.author.id);
    }

    if (!targetUser) {
        targetUser = await createUser(targetId);
    }

    const sourcePoints = sourceUser.is_infinite ? Infinity : Number(sourceUser.aurapoints);
    
    if (sourcePoints < giveAmount) {
        return message.channel.createMessage(`fr fr you only got ${sourceUser.aurapoints} points bestie 💀 can't give more than you have no cap`);
    }

    // Calculate limits
    const sourceLimits = calculateReceiveLimit(sourcePoints);
    const targetLimits = calculateReceiveLimit(Number(targetUser.aurapoints));

    const now = new Date();
    const resetGiveLimit = !isSameDay(now, new Date(sourceUser.aura_points_give_limit_last_reset));
    const resetReceiveLimit = !isSameDay(now, new Date(targetUser.aura_points_receive_limit_last_reset));

    // Reset limits if needed
    if (resetGiveLimit) {
        sourceUser.aura_points_give_limit = '0';
        sourceUser.aura_points_give_limit_last_reset = now;
    }

    if (resetReceiveLimit) {
        targetUser.aura_points_receive_limit = '0';
        targetUser.aura_points_receive_limit_last_reset = now;
    }

    const currentGiveTotal = Number(sourceUser.aura_points_give_limit) + giveAmount;
    const currentReceiveTotal = Number(targetUser.aura_points_receive_limit) + giveAmount;

    if (currentGiveTotal > sourceLimits.giveLimit) {
        return message.channel.createMessage(`sheesh bestie you can only give ${sourceLimits.giveLimit} points per day! you already gave ${sourceUser.aura_points_give_limit} points today fr fr 💀`);
    }

    if (currentReceiveTotal > targetLimits.receiveLimit) {
        return message.channel.createMessage(`ong <@${targetId}> can only get ${targetLimits.receiveLimit} points per day! they already got ${targetUser.aura_points_receive_limit} points today no cap 😤`);
    }

    // Update points and limits in parallel
    await Promise.all([
        updateAuraPoints(targetId, amount),
        createLog(
            'USER',
            'GIVE_POINTS',
            message.author.id,
            targetId,
            `Gave ${amount} aura points`,
            {
                amount,
                source_points: sourceUser.aurapoints,
                target_previous_points: targetUser.aurapoints,
                daily_give_amount: currentGiveTotal,
                daily_receive_amount: currentReceiveTotal
            }
        )
    ]);

    return message.channel.createMessage(`sheeeesh bestie you just blessed <@${targetId}> with ${amount} aura points fr fr 🔥 that's a W no cap`);
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
}
