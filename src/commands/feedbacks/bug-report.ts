import * as discord from "discord.js";
import {Command} from "../../utils/references/command.js";
import {client} from "../../index.js";

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['bug-report', 'br'],
        });
    }

    async run(message, args) {

        const messageSlice = args.join(' ');
        const BugReportChannel = <discord.TextChannel>client.channels.cache.get(`805031277186646047`);

        BugReportChannel.send({
            embed: {
                color: 0xd57eeb,
                title: `Bug report from ${message.author.username} | ${message.author.id}.`,
                description: `${messageSlice}`,
                timestamp: new Date().getTime()
            }
        });

        message.author.send(`Congratulations **${message.author.username}**, your bug report has been received. Thank you for your help to improve WWAH.`);
    }
}