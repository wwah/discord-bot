import {Command} from "../../utils/references/command.js";

export default class extends Command {

    constructor() {
        super();
        super.help = async () => ({
            aliases: ['ticket', 'new', 'help-me'],
        });
    }

    async run(message, args) {

        const channelName = `Ticket from ${message.author.username}`;

        message.guild.channels.create(channelName, {
            type: 'text',
            parent: '855792413908664380',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: message.author,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: '805027909315723284',
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                }
            ],
        });

        message.author.send({
            embed: {
                color: 0xd57eeb,
                title: `Ticket opening confirmation.`,
                description: `Hey <@${message.author.id}> ! You have opened a ticket. A member of our team will soon come to your aid.`,
                timestamp: new Date().getTime()
            }
        })
    }
}