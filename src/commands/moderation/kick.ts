import {Command} from "../../utils/references/command.js";
import ErrorEmbed from "../../utils/embeds/error-embed.js";

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['kick', 'k'],
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

        if (target.kickable) {
            new ErrorEmbed(`Unfortunately, this user can't be kicked.`).send(message.channel);
        }

        await target.send({
            embed: {
                color: 0xd57eeb,
                title: `You have been kicked from WWAH Server !`,
                description: `You have been kicked from **WWAH Server** for \`${reason}\` by ${member}.`,
                timestamp: new Date().getTime()
            }
        });

        await message.channel.send({
            embed: {
                color: 0xd57eeb,
                title: `Member kicked !`,
                description: `${target} has been kicked from WWAH Server.`,
                timestamp: new Date().getTime()
            }
        });

        target.kick({reason});
    }
}