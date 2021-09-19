import { client } from '../../index.js';
import discordColors from '../../utils/discord-colors.js';
import { Command } from '../../utils/references/command.js';

const emotes = {
    green: '🟩',
    orange: '🟧',
    red: '🟥',
};

function correctEmote(latency: number) {
    if (latency <= 250) {
        return emotes.green;
    } if (latency <= 750) {
        return emotes.orange;
    }
    return emotes.red;
}

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['ping', 'pong'],
        });
    }

    async run(message) {

        const wsLatency = client.ws.ping;

        const msg = await message.channel.send({
            embed: {
                title: 'Pinging...',
                color: discordColors.orange,
            },
        });

        const botLatency = msg.createdTimestamp - message.createdTimestamp;

        await msg.edit({
            embed: {
                title: 'Pong !',
                color: discordColors.green,
                thumbnail: {
                    url: msg.author.avatarURL({ format: 'png', size: 256 }),
                },
                fields: [
                    {
                        name: '🤖 Bot Latency',
                        value: `${correctEmote(botLatency)} **${botLatency}**ms`,
                    },
                    {
                        name: '🛠 API Latency',
                        value: `${correctEmote(wsLatency)} **${wsLatency}**ms`,
                    },
                ],
            },
        });
    }
}