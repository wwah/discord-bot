import {Command} from "../../utils/references/command.js";
import ErrorEmbed from "../../utils/embeds/error-embed.js";
import {createRequire} from "module";
import * as fs from "fs";
const require = createRequire(import.meta.url);
const jsonFile = require("../../../warn.json");

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['delwarn', 'delete-warn', 'dw'],
        });
    }

    async run(message, args) {

        const member = message.guild.members.cache.get(message.author.id);

        if (!member.roles.cache.has('805027909315723284')) {
            new ErrorEmbed(`Unfortunately, you don't have the permission to execute this command.`).send(message.channel);
            return
        }

        if(!(/(<@|)[0-9]{18}(>|)/.test(args[0]))) {
            new ErrorEmbed(`Unfortunately, I can't find the user provided as the first argument.`).send(message.channel);
            return;
        }

        const targetId = args[0].replaceAll(/[^0-9]*/g, '');
        const target = message.guild.members.cache.get(targetId);

        if (!target) {
            new ErrorEmbed(`Unfortunately, this user doesn't exist.`).send(message.channel);
            return
        }



    }
}