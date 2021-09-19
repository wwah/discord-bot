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
            aliases: ['warn', 'warning', 'w'],
        });
    }

    async run(message, args) {

        const member = message.guild.members.cache.get(message.author.id);
        let reason = args.slice(1).join(' ') || "`not precised`";

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

        if (!jsonFile[message.guild.id]) {
            jsonFile[message.guild.id] = {
                currentIndex: 0
            }
        }

        if (!jsonFile[message.guild.id][target.id]) {
            jsonFile[message.guild.id][target.id] = {};
        }

        jsonFile[message.guild.id].currentIndex++;

        jsonFile[message.guild.id][target.id][jsonFile[message.guild.id].currentIndex] = {
            moderator: {
                id: member.id,
                name: member.displayName
            },
            reason: reason,
            date: Date.now()
        };

        fs.writeFile("./warn.json", JSON.stringify(jsonFile, null, 2), (err) => {
            if(err) throw err;
        });

        message.channel.send({
            embed: {
                color: 0xd57eeb,
                title: `Member warned !`,
                description: `${target} has been warned.`,
                timestamp: new Date().getTime()
            }
        });

        target.send({
            embed: {
                color: 0xd57eeb,
                title: `You have been warned on WWAH server !`,
                description: `You have been warned for \`${reason}\` by ${member}.`,
                timestamp: new Date().getTime()
            }
        });
    }
}