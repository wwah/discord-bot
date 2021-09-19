import { kebabToCamel } from '@redstom/casetransformer/src/kebab.js';
import * as discord from 'discord.js';
import * as fs from 'fs';
import config from '../config/config.prod.js';
import tokens from '../config/tokens.prod.js';

import c from './utils/ansi-colors.js';

import { Command } from './utils/references/command.js';
import { Terminal } from './utils/terminal.js';

// Get token with the environment and the bot name.
const { environment } = config;
const botName = config['bot-name'];

const token = tokens[`${botName}-${environment}`];

// Initialize the discord.js bot client instance.
export const client = new discord.Client({
    partials : ['MESSAGE', 'CHANNEL', 'REACTION']
});

// Initialize the logger
const filePath = import.meta.url.split('/');
const fileName = filePath[filePath.length - 1];

const term = new Terminal(fileName);

// Initialize the command collection
export const commands: discord.Collection<string, Command> = new discord.Collection();

async function registerCommandFolder(folder) {
    // Get all the files and folders into the actual folder
    const files = fs.readdirSync(new URL(folder, import.meta.url));
    // Check for all the files/folders in the actual folder
    for (let i1 = 0; i1 < files.length; i1 += 1) {
        const file = files[i1];
        // Check for all the files/folders in the actual folder
        if (!(file.endsWith('.js') || file.endsWith('.ts'))) {
            if (file.split('.').length === 1) {
                // Register all the commands in the folder
                // eslint-disable-next-line no-await-in-loop
                await registerCommandFolder(`${folder}/${file}`);
            }
            // eslint-disable-next-line no-continue
            continue;
        }
        // eslint-disable-next-line no-await-in-loop
        const cmd = await import(`${folder}/${file}`);

        if (!cmd.default) {
            term.warning(`Cannot handle file ${c.yellow}${folder}/${file}${c.reset} !`);
            // eslint-disable-next-line no-continue
            continue;
        }

        // eslint-disable-next-line new-cap
        const command = new cmd.default();

        if (!command.run || typeof command.run !== 'function') {
            term.error(`The file ${file} does not respect the following interface :`
                + 'run(?message, ?args) -> function');
            // eslint-disable-next-line no-continue
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const help = await command.help(null);
        for (let i = 0; i < help.aliases.length; i += 1) {
            const a = help.aliases[i];
            commands.set(a, command);
        }
        term.info(
            `Registered ${c.green}command${help.aliases.length === 1 ? '' : 's'}${c.reset} `
            + `${c.cyan}${config.prefix}`
            + `${help.aliases.join(`${c.reset},${c.cyan} ${config.prefix}`)}${c.reset} `
            + `in file ${c.yellow}${folder}/${file}`,
        );
    }
}

async function registerEventFolder(folder) {
    // Get all the files and folders into the actual folder
    const files = fs.readdirSync(new URL(folder, import.meta.url));

    // Check for all the files/folders in the actual folder
    files.forEach(async (file) => {
        // Check if the file isn't a javascript file
        if (!(file.endsWith('.js') || file.endsWith('.ts'))) {
            // Check if the file is a folder
            if (file.split('.').length === 1) {
                // Register all the events in the folder
                await registerEventFolder(`${folder}/${file}`);
            }
            return;
        }
        // Get the event type
        const eventType = kebabToCamel(file.split('.')[0]);

        // Import the file as a js module
        const cmdClass = await import(`${folder}/${file}`);

        if (!cmdClass.default) {
            term.warning(`Cannot handle file ${c.yellow}${folder}/${file}${c.reset} !`);
            return;
        }

        // Instantiate the current class
        // eslint-disable-next-line new-cap
        const event = new cmdClass.default();

        if (!event.run || typeof event.run !== 'function') {
            term.error(`The file ${file} does not respect the following interface : run -> function`);
            return;
        }

        term.info(
            `Registered ${c.magenta}event${c.reset} ${c.cyan}${eventType}${c.reset}`
            + ` on file ${c.yellow}${folder}/${file}`,
        );
        // Register the event
        client.on(eventType, event.run);
    });
}

async function registerAllEvents() {
    registerEventFolder('./events')
        .then(() => {
        });
}

async function registerAllCommands() {
    await registerCommandFolder('./commands');
    commands.keyArray()
        .forEach((key) => {
            const cmd = commands.get(key);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            cmd.setup && cmd.setup()
                .then();
        });
}

client.login(token)
    .then(async () => {
        // Register the events and the commands
        registerAllEvents();
        registerAllCommands();
        term.info(`Bot ${c.cyan}${client.user.tag}${c.reset} has logged in !`);
    });