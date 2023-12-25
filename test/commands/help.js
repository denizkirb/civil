const fs = require('fs');
const path = require('path')
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Gives info about commands'
 
const init = async (interaction, client) => {
    try {
        let commandTmp = []
        let commandsFiles = fs.readdirSync('/home/denizkirbiyik/Documents/GitHub/civil/test/commands/');

        let a = ``;

        commandsFiles.forEach((file, i) => {
            commandTmp[i] = require('/home/denizkirbiyik/Documents/GitHub/civil/test/commands/' + file)
            a += `\n /${file.split('.')[0]}: ${commandTmp[i].description}`
        })

        const finalEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Commands:")
        .setDescription(a);
        interaction.reply({embeds:[finalEmbed]})
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description };
 