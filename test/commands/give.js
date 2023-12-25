const fs = require('fs');
const DiscordJS = require('discord.js');
const closest_match = require("closest-match");
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const NUMBER = ApplicationCommandOptionType.Number;
const STRING = ApplicationCommandOptionType.String;

const description = 'Show other`s stats'

const options = [
    {
        name: 'nation',
        description: 'common name of nation to give to',
        required: true,
        type: STRING,
    },
    {
        name: 'stat_type',
        description: 'type of stat to give',
        required: true,
        type: STRING,
    },
    {
        name: 'amount',
        description: 'amount to give',
        required: false,
        type: NUMBER,
    },
]

const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/database.json', 'utf8');
        const jdata = JSON.parse(data);

        const sdata = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/information.json', 'utf8');
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

        const jsonData = jdata[interaction.user.id.toString()]

        const flipped = Object
            .fromEntries(Object
            .entries(sjdata["style_values"])
            .map(([key, value]) => [value, key]));

        const m = interaction.options.getString('stat_type');
        let nw = m.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        let n = flipped[nw];

        let amount = interaction.options.getNumber('amount');
        if (amount == null){
            amount = 1;
        }

        if(Object.keys(sjdata["style_values"]).includes(n)){
            if (amount < jsonData[n]){
                jdata[user][n] += amount;
                jdata[interaction.user.id.toString()][n] -= amount;
                fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                    if (err) throw err;
                });
                interaction.reply(`Gave ${amount} ${nw} to ${jdata[user]["common"]}.`);
            }
            else {
                let p = `You don't have enough ${nw} to gift that amount!`
                interaction.reply(p);
            }
        }
        else{
            let p = `That info does not exist, do "/stats types" to see all valid info names.`
            interaction.reply(p);
        }
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 