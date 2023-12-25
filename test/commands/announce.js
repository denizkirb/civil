const fs = require('fs');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number;

const description = 'Set an update channel'
 
const init = async (interaction, client) => {
    try {
        if (interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)){
            const data = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/information.json', 'utf8');
            let jdata = JSON.parse(data);

            jdata["guilds"][interaction.guild.id] = interaction.channel.id

            fs.writeFile ("information.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });

            interaction.reply("Update channel is now here!")
        }
        else {
            interaction.reply("You don't have admin privileges!")
        }
    }
    catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description };
 