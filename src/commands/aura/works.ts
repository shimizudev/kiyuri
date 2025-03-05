import type { Message, CommandOptions, User } from "eris";
import { works } from "./works/works";
import { bot } from "../..";
import { ReactionCollector, type CollectedMessageReaction } from "eris-collectors";

export const name = 'works';
export const description = 'View available jobs';
export const options: CommandOptions = {
    aliases: ['jobs', 'careers'],
    cooldown: 5,
    usage: '',
    description: 'View available jobs',
    fullDescription: 'Check out all the jobs you can get fr fr! Each job has different requirements and rewards no cap!'
};

export async function execute(message: Message) {
    const perPage = 5;
    const pages = Math.ceil(works.length / perPage);
    let currentPage = 0;

    const generateEmbed = (page: number) => {
        const start = page * perPage;
        const end = start + perPage;
        
        const jobList = works
            .slice(start, end)
            .map(job => {
                return `✨ **${job.name}** ✨\n` +
                       `${job.description}\n` +
                       `💰 Pays: ${job.auraPoints} points per shift\n` +
                       `⭐ Level: ${job.coolLevel}\n` +
                       `💼 Required Points: ${job.auraPointsToJoin}\n`;
            })
            .join('\n');

        return {
            title: "✨ Available Jobs fr fr 💼 ✨",
            description: "Here's all the jobs you can get bestie! The more points you have, the better jobs you can apply for no cap!\n\n" + jobList,
            color: 0x7289DA,
            footer: {
                text: `Page ${page + 1}/${pages} • Use 'get-work <job name>' to apply for a job!`
            }
        };
    };

    const msg = await message.channel.createMessage({ embed: generateEmbed(0) });
    
    if (pages > 1) {
        await msg.addReaction("⬅️");
        await msg.addReaction("➡️");

        const collector = new ReactionCollector({
            client: bot,
            message: msg,
            time: 300000, // 5 minutes
            filter: (reaction: CollectedMessageReaction) => {
                return ["⬅️", "➡️"].includes(reaction.emoji.name);
            }
        });

        collector.on("collect", async (reaction) => {
            if (reaction.emoji.name === "⬅️" && currentPage > 0) {
                currentPage--;
                await msg.edit({ embed: generateEmbed(currentPage) });
            } else if (reaction.emoji.name === "➡️" && currentPage < pages - 1) {
                currentPage++;
                await msg.edit({ embed: generateEmbed(currentPage) });
            }

            try {
                await msg.removeReaction(reaction.emoji.name, message.author.id);
            } catch (err) {
                // Ignore errors from failed reaction removes
            }
        });

        collector.on("end", () => {
            msg.removeReactions().catch(() => {});
        });
    }
}
