const fs = require('fs');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Rename your nation'

const options = [
    {
        name: 'name',
        description: 'new name of the nation',
        required: true,
        type: STRING,
    },
]
 
const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/database.json', 'utf8');
        let jdata = JSON.parse(data);

        if (!(Object.keys(jdata).includes(interaction.user.id.toString()))){
            interaction.reply(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
        }
        const n = jdata[interaction.user.id.toString()]['name']
        const nw = interaction.options.getString('name')
        if (n != nw){
            jdata[interaction.user.id.toString()]['name'] = nw
            fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });
                interaction.reply(`${n} has been renamed to ${nw}.`);
        }
        else{
            interaction.reply(`That is already your nation's name!`)
        }
    }
    catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 