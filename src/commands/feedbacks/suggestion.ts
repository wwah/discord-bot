import * as discord from "discord.js";
import {Command} from "../../utils/references/command.js";
import {client} from "../../index.js";

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['suggestion', 's'],
        });
    }

    async run(message, args) {

        const messageSlice = args.join(' ');
        const suggestionChannel = <discord.TextChannel>client.channels.cache.get(`805031325261496341`);

        suggestionChannel.send({
            embed: {
                color: 0xd57eeb,
                title: `Suggestion from ${message.author.username} | ${message.author.id}.`,
                description: `${messageSlice}`,
                timestamp: new Date().getTime()
            }
        });

        message.author.send("Congratulations, your suggestion has been received. Thank you for your interest in WWAH.");
    }
}