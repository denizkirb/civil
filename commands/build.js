const fs = require('fs');
const DiscordJS = require('discord.js');
const path = require('path');
const closest_match = require("closest-match");
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
            interaction.followUp(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
            return;
        }

        const jsonData = jdata[interaction.user.id.toString()]

        const flipped = Object
            .fromEntries(Object
            .entries(sjdata["style_values"])
            .map(([key, value]) => [value, key]));

        const buildinga = interaction.options.getString('building')
        let buildingi = buildinga.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        
        let ll = [];
        let l = [];
        Object.values(sjdata["style_values"]).forEach((j, jjj) => {
            jj = Object.keys(sjdata["style_values"])[jjj];
            if (Object.keys(sjdata["building_info"]).includes(jj)){
                ll.push(jj);
                l.push(j);
            }
        });

        buildingi = closest_match.closestMatch(buildingi, l);

        const building = ll[l.indexOf(buildingi)];
        
        function func(){
            if (sjdata["building_info"][building] == null){
                interaction.followUp(`That building doesnt exist!`);
                return;
            }
            let nw = interaction.options.getNumber('amount')
            if (nw == null){
                nw = 1
            }
            if (nw == 0){
                interaction.followUp(`You did nothing.`)
            }
            else if (nw > 0){
                for (i of sjdata["building_info"][building]["price"]){
                    if (nw*i[1]>jsonData[i[0]]){
                        interaction.followUp(`You don't have enough ${sjdata["style_values"][i[0]]}. You need ${nw*i[1]} ${sjdata["style_values"][i[0]]} to build ${nw} ${buildingi}!`);
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
                interaction.followUp(`Built ${nw} ${buildingi}.`);
            }
            else{
                interaction.followUp(`You cannot build negative buildings!`)
            }
        }
        const msg = await interaction.reply({ content: `Is ${buildingi} the building you want to build? React with :thumbsup: or :thumbsdown:.`, fetchReply: true});
        await msg.react("👍");
        await msg.react("👎");

        const filter = (reaction, user) => {
            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
         };
        msg.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '👎') {
                    interaction.followUp(`Sorry, please try something closer to the real name!`)
                    return;
                }
                else{
                    func()
                }
            })
            .catch(collected => {
                interaction.followUp(`No reaction, taking that as a no. Please try something closer to the real name!`);
                return;
            });
    }
    catch (error) {
        console.error(error);
        interaction.followUp('An error occurred.');
    }
}

module.exports = { init, description, options };
 