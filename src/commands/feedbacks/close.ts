import * as discord from "discord.js";
import {Command} from "../../utils/references/command.js";
import ErrorEmbed from "../../utils/embeds/error-embed.js";

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['delete', 'close', 'd'],
        });
    }

    async run(message, args) {

        const currentChannel = <discord.GuildChannel>message.channel;

        if (!message.guild) {
            new ErrorEmbed("You can not send a command in private message.").send(message.author);
            return
        }

        const member = message.guild.members.cache.get(message.author.id);

        if (!member.roles.cache.has('805027909315723284')) {
            new ErrorEmbed("Unfortunately, you haven't the permission to delete this channel. Ask to a moderator to do this.").send(message.channel);
            return
        }

        if (currentChannel.parentID !== '855792413908664380') {
            new ErrorEmbed("Unfortunately, you are not authorized to delete this channel.").send(message.channel);
            return
        }

        message.channel.delete();
    }
}