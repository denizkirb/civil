const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Show your stuff'
 
const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('database.json', 'utf8');
        const jdata = JSON.parse(data);

        if (!(Object.keys(jdata).includes(interaction.user.id.toString()))){
            interaction.reply(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
        }
        const sdata = await fs.promises.readFile('information.json', 'utf8');
        const sjdata = JSON.parse(sdata)["style_values"];

        const jsonData = jdata[interaction.user.id.toString()]
        let a = ``;
        let b = []
        for (i of Object.keys(sjdata)){
            if (jsonData[i] != 0 && i != 'name' && i != 'common' && i != 'motto' && i != 'flag' && i != 'currency'){
                b.push(i)
            }
        }
        for (j of b){
            a += `\n ${sjdata[j]}: ${jsonData[j]}`
        }
        const finalEmbed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Your Inventory:")
        .setDescription(a);
        interaction.reply({embeds:[finalEmbed]})
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description };
 