import type { Message, CommandOptions } from "eris";
import { createUser, getUser } from "../../database/userModel";
import { works } from "./works/works";
import { pool } from "../../index";
import { createLog } from "../../database/logs";

export const name = 'get-work';
export const description = 'Get a new job';
export const options: CommandOptions = {
    aliases: ['getwork', 'apply', 'getjob'],
    cooldown: 5,
    usage: '<job name>',
    description: 'Get a new job',
    fullDescription: 'Get a new job fr fr! Each job has different requirements and rewards. The better the job, the more points you need no cap!'
};

export async function execute(message: Message, args: string[]) {
    let user = await getUser(message.author.id);

    if (!user) {
        user = await createUser(message.author.id);
    }

    if (!args.length) {
        return message.channel.createMessage("fr fr you need to tell me what job you want bestie! use the jobs command to see what's available no cap 💼");
    }

    const jobName = args.join(' ');
    const job = works.find(w => w.name.toLowerCase() === jobName.toLowerCase());

    if (!job) {
        return message.channel.createMessage("ong that job doesn't exist bestie 💀 use the jobs command to see what's available fr fr");
    }

    const userPoints = Number(user.aurapoints);

    if (userPoints < job.auraPointsToJoin) {
        return message.channel.createMessage(`sheesh bestie you need ${job.auraPointsToJoin} aura points to get this job! you only got ${userPoints} points fr fr 😭`);
    }

    await pool.query(
        'UPDATE users SET job = $1, job_started_at = NOW(), job_cooldown_ends = NULL WHERE discord_id = $2',
        [job.name, message.author.id]
    );

    await createLog(
        'USER',
        'JOB_CHANGE',
        message.author.id,
        undefined,
        'Successfully changed jobs',
        { oldJob: user.job, newJob: job.name }
    );

    return message.channel.createMessage(`sheeeesh bestie you just got hired as a ${job.name} fr fr! 🎉 you'll be making ${job.auraPoints} aura points per shift no cap 💰`);
}
