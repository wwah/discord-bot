import {Command} from "../../utils/references/command.js";
import ErrorEmbed from "../../utils/embeds/error-embed.js";
import {createRequire} from "module";
import * as fs from "fs";
import {MessageEmbed} from "discord.js";
const require = createRequire(import.meta.url);
const jsonFile = require("../../../warn.json");

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['warns', 'infraction', 'infractions', 'i'],
        });
    }

    async run(message, args) {

        const member = message.guild.members.cache.get(message.author.id);

        if (!member.roles.cache.has('805027909315723284')) {
            new ErrorEmbed(`Unfortunately, you don't have the permission to execute this command.`).send(message.channel);
            return
        }

        if (!(/(<@|)[0-9]{18}(>|)/.test(args[0]))) {
            new ErrorEmbed(`Unfortunately, I can't find the user provided as the first argument.`).send(message.channel);
            return;
        }

        const targetId = args[0].replaceAll(/[^0-9]*/g, '');
        const target = message.guild.members.cache.get(targetId);

        if (!target) {
            new ErrorEmbed(`Unfortunately, this user doesn't exist.`).send(message.channel);
            return
        }

        const infractions = (jsonFile[message.guild.id] ?? {})[targetId] ?? {};

        if (!infractions || Object.keys(infractions).length === 0) {
            new ErrorEmbed(`Unfortunately, no infractions were found for this user.`).send(message.channel);
            return
        }

        const embed = new MessageEmbed({
            color: 0xd57eeb,
            title: `Infractions from ${target.displayName}.`,
            timestamp: new Date().getTime()
        });

        for (const id of Object.keys(infractions)) {
            const infraction = infractions [id];
            embed.addField(id,
                `**Reason :** \`${infraction.reason}\`
                **Moderator :** <@${infraction.moderator.id}>
                **Date :** ${new Date(infraction.date)}`);
        }

        message.channel.send(embed);
    }
}