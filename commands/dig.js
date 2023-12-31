const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number;

const description = 'Dig stone, uses up actions'

const options = [
    {
        name: 'amount',
        description: 'amount of stone to be dug',
        required: false,
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
        const n = jdata[interaction.user.id.toString()]['actions']
        let nw = interaction.options.getNumber('amount')
        if (nw == null){
            nw = 1
        }
        if (nw == 0){
            interaction.reply(`You did nothing.`)
        }
        if (n >= nw && nw > 0){
            jdata[interaction.user.id.toString()]['stone'] += nw
            jdata[interaction.user.id.toString()]['actions'] -= nw
            fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });
                interaction.reply(`Dug up ${nw} stone.`);
        }
        else if(n >= nw && nw < 0){
            interaction.reply(`Cannot dig negative stone!`);
        }
        else{
            interaction.reply(`Your labor force is exhausted.`)
        }
    }
    catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 