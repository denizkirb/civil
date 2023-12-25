const fs = require('fs');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Displays the top 10 nations in either money or land'
 
const options = [
    {
        name: 'stat',
        description: 'stat to rank by, either money or land',
        required: true,
        type: STRING,
    },
]

const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/database.json', 'utf8');
        const jdata = JSON.parse(data);

        const sdata = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/information.json', 'utf8');
        const sjdata = JSON.parse(sdata)["style_values"];

        let nm = interaction.options.getString('stat');
        const n = nm.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        let z = "treasury"
        if (n == "Land"){
            z = "land";
        }

        let l = [];
        for (ll of Object.values(jdata)){
            l.push({"name":ll["common"], "val":ll[z]})
        }
        let y = 10
        if (Object.keys(jdata).length < 10){
            y = Object.keys(jdata).length
        }
        l.sort((a, b) => b.val - a.val);
        let top = l.slice(0, y);

        let a = ``;

        top.forEach((b, index) => {
            a += `\n **${index+1}.** ${b["name"]} \n ${n}: ${b["val"]}`
        });

        const finalEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle(`${n} Leaderboard:`)
        .setDescription(a);
        interaction.reply({embeds:[finalEmbed]})
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 