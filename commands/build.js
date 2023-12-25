const fs = require('fs');
const DiscordJS = require('discord.js');
const path = require('path');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number;
const STRING = ApplicationCommandOptionType.String;

const description = 'Build a building, do /buildings for info on different buildings'

const options = [
    {
        name: 'building',
        description: 'type of building to be built',
        required: true,
        type: STRING,
    },
    {
        name: 'amount',
        description: 'amount of the building to be built, one will be chosen if left blank',
        required: false,
        type: NUMBER,
    },
]
 
const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('database.json', 'utf8');
        let jdata = JSON.parse(data);
        const sdata = await fs.promises.readFile('information.json', 'utf8');
        const sjdata = JSON.parse(sdata);

        if (!(Object.keys(jdata).includes(interaction.user.id.toString()))){
            interaction.reply(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
        }

        const jsonData = jdata[interaction.user.id.toString()]

        const flipped = Object
            .fromEntries(Object
            .entries(sjdata["style_values"])
            .map(([key, value]) => [value, key]));

        const buildinga = interaction.options.getString('building')
        const buildingi = buildinga.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        const building = flipped[buildingi]
        if (sjdata["building_info"][building] == null){
            interaction.reply(`That building doesnt exist!`);
            return;
        }
        let nw = interaction.options.getNumber('amount')
        if (nw == null){
            nw = 1
        }
        if (nw == 0){
            interaction.reply(`You did nothing.`)
        }
        else if (nw > 0){
            for (i of sjdata["building_info"][building]["price"]){
                if (nw*i[1]>jsonData[i[0]]){
                    interaction.reply(`You don't have enough ${sjdata["style_values"][i[0]]}. You need ${nw*i[1]} ${sjdata["style_values"][i[0]]} to build ${nw} ${buildingi}!`);
                    return;
                }
                jdata[interaction.user.id.toString()][i[0]] -= nw*i[1];
            }
            jdata[interaction.user.id.toString()][building] += nw;
            if (!jsonData["order"].includes(building)){
                jdata[interaction.user.id.toString()]["order"].push(building)
            }
            fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });
            interaction.reply(`Built ${nw} ${buildingi}.`);
        }
        else{
            interaction.reply(`You cannot build negative buildings!`)
        }
    }
    catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 