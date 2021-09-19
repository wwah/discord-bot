import {Guild, Message,} from 'discord.js';

export interface CommandCategory {
    name: string,

    emote: string,

    index: string,

    config?: object
}

export enum CommandCategories {
    Basics,
    Other,
    Admin,
}

export const commandCategories: CommandCategory[] = [
    {
        name: 'Basic',
        emote: ':green_square:',
        index: 'basic',
    },
    {
        name: 'Other',
        emote: ':orange_square:',
        index: 'other',
    },
    {
        name: 'Admin',
        emote: ':red_square:',
        index: 'admin',
    },
];

export interface CommandArgument {
    type: 'string' | 'number' | 'select';
    values?: string[];
    name?: string;
    required?: boolean;
    description?: string;
}

export interface CommandHelp {
    aliases: string[];
    hidden?: boolean;
    name?: string;
    description?: string;
    arguments?: CommandArgument[];
    category?: CommandCategories;
}

export interface CommandRunInformation {
    serverPrefix: string,

    label: string
}

export interface Command {
    setup?();
}

export abstract class Command {
    public declare help: (guild: Guild) => Promise<CommandHelp>;

    abstract run(message: Message, args: string[], otherInfos: CommandRunInformation): Promise<void>;
}