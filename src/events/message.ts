import config from '../../config/config.prod.js';
import {commands} from '../index.js';
import c from '../utils/ansi-colors.js';
import ErrorEmbed from '../utils/embeds/error-embed.js';
import {Terminal} from '../utils/terminal.js';
import * as discord from "discord.js";

const filePath = import.meta.url.split('/');
const fileName = filePath[filePath.length - 1];
const term = new Terminal(fileName);

export default class {

    async run(message : discord.Message) {
        if (message.author.id === message.client.user.id) {
            message.react('🗑');
        }
        let prefix = config.prefix;

        if (message.mentions.users.has(message.client.user.id)) {
            await message.channel.send('My prefix is \`!\`');
        }
        if (!message.content.startsWith(prefix)) {
            return;
        }
        const cmdName = message.content
            .slice(prefix.length)
            .trim()
            .split(' ')[0];
        const args = message.content
            .slice(prefix.length + cmdName.length)
            .trim()
            .split(' ');
        const command = commands.get(cmdName);
        if (command) {
            const server = message.guild
                ? `${c.reset} on ${c.yellow}${message.guild.name}${c.reset}`
                : `${c.reset} in ${c.yellow}DM`;
            term.info(`Received command ${c.cyan}${message.content}${server}`);
            if (message.deletable) {
                message.delete();
            }
            command.run(message, args, {
                serverPrefix: prefix,
                label: cmdName,
            })
                .catch((/** Error */error) => {
                    new ErrorEmbed(error.message).send(message.channel);
                    term.warning(
                        `${c.cyan}${prefix + cmdName}${server} ${

                            config.environment === 'dev'
                                ? `: \n ${c.red}${error.stack}`
                                : `: ${c.red}${error.message}`}`,
                    );
                    term.error(error);
                });
        }
    }
}