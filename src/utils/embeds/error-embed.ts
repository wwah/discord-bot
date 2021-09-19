import {MessageEmbed} from "discord.js";
import discordColors from "../discord-colors.js";

export default class ErrorEmbed {
    private readonly embed: MessageEmbed;

    constructor(message: string) {
        this.embed = new MessageEmbed()
            .setTitle('Error !')
            .setDescription(message)
            .setColor(discordColors.red);
    }

    /**
     * @param channel {TextChannel}
     */
    async send(channel) {
        await channel.send(this.embed);
    }
}