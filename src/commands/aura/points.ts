import { Message, type CommandOptions } from "eris";
import { createUser, getUser } from "../../database/userModel";

export const name = 'points';
export const description = 'Check your aura points';
export const options: CommandOptions = {
    aliases: ['p', 'cash', 'bag', 'wallet'],
    cooldown: 5,
    usage: '<@user>',
    description: 'Check your aura points',
    fullDescription: 'Check your aura points fr fr! You can check your own bag or @ someone else to see their points no cap!'
};

export async function execute(message: Message, args: string[]) {
    const argsUser = args[0] ? args[0].replace(/[<@!>]/g, '') : message.author.id;
    const user = await getUser(argsUser);

    if (!user) {
        await createUser(argsUser);
        await message.channel.createMessage(
            argsUser === message.author.id 
                ? "fr fr you got zero points bestie 💀 you down astronomical no cap"
                : `ong <@${argsUser}> is straight up broke rn fr fr 😭 zero points bestie`
        );
        return;
    }

    const isSelf = argsUser === message.author.id;
    const points = user.aurapoints;

    if (points === '0') {
        await message.channel.createMessage(
            isSelf
                ? "fr fr you got zero points bestie 💀 you down astronomical no cap"
                : `ong <@${argsUser}> is straight up broke rn fr fr 😭 zero points bestie`
        );
        return;
    }

    await message.channel.createMessage(
        isSelf
            ? `sheeeesh bestie you got \`${points}\` aura points in the bag fr fr 🔥`
            : `ong <@${argsUser}> got \`${points}\` aura points no cap 💯`
    );
}
