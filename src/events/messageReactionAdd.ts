import * as discord from "discord.js";
import {client} from "../index.js";

export default class {
    async run(reaction : discord.MessageReaction, user : discord.User) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
                return;
            }
        }

        if (user.bot) {
            return
        }

        if (reaction.emoji.name === '🗑' && reaction.message.author.id === client.user.id) {
            if (reaction.message.deletable) {
                reaction.message.delete();
            }
        }
    }
}