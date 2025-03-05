import type { Message, CommandOptions } from "eris";
import { createUser, getUser, updateAuraPoints } from "../../database/userModel";
import { getRandom } from "../../helpers/get-random";
import { pool } from "../../index";
import { createLog } from "../../database/logs";

export const name = 'daily';
export const description = 'Get your daily aura points';
export const options: CommandOptions = {
    aliases: ['d'],
    cooldown: 86400,
    usage: '',
    description: 'Get your daily aura points',
    fullDescription: 'Get your daily aura points! You can claim between 100-200 aura points every 24 hours. The amount is random each time.'
};

export async function execute(message: Message) {
    let user = await getUser(message.author.id);

    if (!user) {
        user = await createUser(message.author.id);
    }

    const lastDaily = user.last_daily ? new Date(user.last_daily) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const now = new Date();
    const timeDiff = now.getTime() - lastDaily.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
        await createLog(
            'USER',
            'DAILY_CLAIM_FAILED',
            message.author.id,
            undefined,
            'Too early to claim daily rewards',
            { hoursSinceLastClaim: hoursDiff }
        );
        return message.channel.createMessage('fr fr no cap you already claimed your daily points bestie 💀 come back in 24h');
    }

    const auraPoints = user.is_infinite ? 'Infinity' : getRandom(100, 200).toString();

    await updateAuraPoints(message.author.id, auraPoints);
    
    await pool.query(
        'UPDATE users SET last_daily = NOW() WHERE discord_id = $1',
        [message.author.id]
    );

    await createLog(
        'USER',
        'DAILY_CLAIM_SUCCESS', 
        message.author.id,
        undefined,
        'Successfully claimed daily rewards',
        { auraPointsReceived: auraPoints }
    );

    await message.channel.createMessage(`fr fr bestie you just secured the daily bag 🔥\nno cap you got \`${auraPoints}\` aura points rn fr 💯`);
}
