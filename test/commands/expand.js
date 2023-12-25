const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number;

const description = 'Expand your land'

const options = [
    {
        name: 'area',
        description: 'amount of area to expand',
        required: true,
        type: NUMBER,
    },
]
 
const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('database.json', 'utf8');
        let jdata = JSON.parse(data);

        if (!(Object.keys(jdata).includes(interaction.user.id.toString()))){
            interaction.reply(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
        }
        const nw = interaction.options.getNumber('area')

        if (nw == 0){
            interaction.reply(`You did nothing.`)
        }
        if (nw > 0 && jdata[interaction.user.id.toString()]['treasury'] >= nw*100){
            jdata[interaction.user.id.toString()]['land'] += nw
            jdata[interaction.user.id.toString()]['treasury'] -= nw*100
            interaction.reply(`Bought ${nw} pieces of land.`)
            fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });
        }
        else if(nw > 0 && jdata[interaction.user.id.toString()]['treasury'] < nw*100){
            reply.interaction(`Not enough money. ${nw*100} treasury is required to buy ${nw} pieces of land.`)
        }
        else{
            interaction.reply(`You cannot sell land!`)
        }
    }
    catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 