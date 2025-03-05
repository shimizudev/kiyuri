import type { Message, CommandOptions } from "eris";
import { createUser, getUser, updateAuraPoints } from "../../database/userModel";
import { works } from "./works/works";
import { pool } from "../../index";
import { createLog } from "../../database/logs";

export const name = 'work';
export const description = 'Work to earn aura points';
export const options: CommandOptions = {
    aliases: ['w', 'job'],
    cooldown: 5,
    usage: '',
    description: 'Work to earn aura points',
    fullDescription: 'Work to earn aura points fr fr! Each job has different requirements and rewards. The better the job, the more points you get no cap!'
};

export async function execute(message: Message) {
    let user = await getUser(message.author.id);

    if (!user) {
        user = await createUser(message.author.id);
    }

    // Check if user has a job
    if (!user.job) {
        return message.channel.createMessage("fr fr you need to get a job first bestie! use the jobs command to see what's available no cap 💼");
    }

    // Check cooldown
    if (user.job_cooldown_ends && new Date() < new Date(user.job_cooldown_ends)) {
        const timeLeft = Math.ceil((new Date(user.job_cooldown_ends).getTime() - new Date().getTime()) / 1000 / 60);
        return message.channel.createMessage(`sheesh bestie you need to rest fr fr! come back in ${timeLeft} minutes no cap 😴`);
    }

    // Find user's job
    const job = works.find(w => w.name === user.job);
    if (!job) {
        return message.channel.createMessage("ong something went wrong with your job bestie 💀");
    }

    // Give rewards
    await updateAuraPoints(message.author.id, job.auraPoints.toString());

    // Set cooldown (30 minutes)
    const cooldownEnd = new Date();
    cooldownEnd.setMinutes(cooldownEnd.getMinutes() + 30);

    await pool.query(
        'UPDATE users SET job_cooldown_ends = $1 WHERE discord_id = $2',
        [cooldownEnd, message.author.id]
    );

    await createLog(
        'USER',
        'WORK_COMPLETE',
        message.author.id,
        undefined,
        'Successfully completed work',
        { job: job.name, auraPointsEarned: job.auraPoints }
    );

    return message.channel.createMessage(`sheeeesh bestie you just secured the bag fr fr! you earned ${job.auraPoints} aura points from your ${job.name} job no cap 💰`);
}
