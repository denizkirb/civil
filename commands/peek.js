const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const closest_match = require("closest-match");
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Show other`s stats'

const options = [
    {
        name: 'nation',
        description: 'common name of nation to peek at',
        required: true,
        type: STRING,
    },
    {
        name: 'stat_type',
        description: 'type of stat to show, if left blank, it will display basic info',
        required: false,
        type: STRING,
    },
]

const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('database.json', 'utf8');
        const jdata = JSON.parse(data);

        const sdata = await fs.promises.readFile('information.json', 'utf8');
        const sjdata = JSON.parse(sdata);

        let ll = [];
        let l = [];
        Object.values(jdata).forEach((j, jjj) => {
            jj = Object.keys(jdata)[jjj];
            ll.push(jj);
            l.push(j["common"]);
        });

        const close = closest_match.closestMatch(interaction.options.getString('nation'), l);

        const user = Object.keys(jdata)[l.indexOf(close)];

        const jsonData = jdata[user]

        const m = interaction.options.getString('stat_type');
        let n = null
        if(m == null){
            let p = `\n **Official Name:** ${jsonData['name']} \n **Common Name:** ${jsonData['common']} \n **Motto:** ${jsonData['motto']} \n **Currency:** ${jsonData['currency']} \n **Money:** ${jsonData['treasury']} \n **Land:** ${jsonData['land']} \n **Population:** ${jsonData['population']} \n **Actions:** ${jsonData['actions']}`
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Here are the basic stats: ")
            .setDescription(p)
            .setImage(jsonData['flag']);
            interaction.reply({embeds:[finalEmbed]})
            return;
        }
        else{
            n = m.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }

        if(n == `Types`){
            let a = ``;
            for (i of Object.keys(sjdata["style_types"])){
                a += `\n ${i} `;
            }
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("These are the types of data you can display:")
            .setDescription(a);
            interaction.reply({embeds:[finalEmbed]})
        }
        else if(Object.values(sjdata["style_types"]).includes(n)){
            let a = ``;
            for (i of sjdata["style_types"][n]){
                a += `\n ${sjdata["style_values"][i]} `;
            }
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(n + `:`)
            .setDescription(a);
            interaction.reply({embeds:[finalEmbed]})
        }
        else if(Object.values(sjdata["style_values"]).includes(n)){
            const flipped = Object
            .fromEntries(Object
            .entries(sjdata["style_values"])
            .map(([key, value]) => [value, key]));

            interaction.reply(`${n}: ${jsonData[flipped[n]]}`)
        }
        else{
            p = `That info does not exist, do "/peek <nation> types" to see all valid info names.`
            interaction.reply(p);
        }
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 