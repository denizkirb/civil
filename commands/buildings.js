const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Gives info on buildings'

const options = [
    {
        name: 'type',
        description: 'type of buildings or name of building to show, leaving blank will show the different types',
        required: false,
        type: STRING,
    },
]

const things = ['', ]

const init = async (interaction, client) => {
    try {
        const data = await fs.promises.readFile('database.json', 'utf8');
        const jdata = JSON.parse(data);
        const jsonData = jdata[interaction.user.id.toString()]

        if (!(Object.keys(jdata).includes(interaction.user.id.toString()))){
            interaction.reply(`You have not founded a nation yet! Found a nation with '/found <nation_name>'`)
        }

        const sdata = await fs.promises.readFile('information.json', 'utf8');
        const sjdata = JSON.parse(sdata);

        let nm = interaction.options.getString('type');
        let n = null;
        if(nm == null){
            let a = `\n Fields \n Farms \n Mills \n Factories \n Plants \n Other Buildings`;
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("Types of Buildings:")
            .setDescription(a);
            interaction.reply({embeds:[finalEmbed]});
            return;
        }
        else{
            n = nm.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        }
        if(Object.keys(sjdata["style_types"]).includes(n) && n != "Basic Stats" && n != "Raw Items" && n != "Metals" && n != "Human-Made Items"){
            let a = '';
            for (i of sjdata["style_types"][n]){
                a += `\n ${sjdata["style_values"][i]}`
            }
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`${n}:`)
            .setDescription(a);
            interaction.reply({embeds:[finalEmbed]});
        }
        else if(Object.values(sjdata["style_values"]).includes(n) && !(["Name", "Money", "Land", "Population", "Actions", "Aluminium", "Ammunition", "Artillery", "Bauxite", "Books", "Cars", "Clothing", "Concrete", "Copper", "Crops", "Electronics", "Firearms", "Fish", "Flour", "Food", "Fuel", "Furniture", "Glass", "Gold", "Household Plastic", "Houses", "Iron", "Lemonade", "Meat", "Oil", "Ore", "Paper", "Pastries", "Petroleum", "Plastic", "Seafood", "Ships", "Silver", "Sneakers", "Steel", "Stone", "Timber", "Tissues", "Toys", "Wood"].includes(n))){
            const flipped = Object
            .fromEntries(Object
            .entries(sjdata["style_values"])
            .map(([key, value]) => [value, key]));
            let m = sjdata["building_info"][flipped[n]]
            let b = '';
            if(m["price"].length != 1){
                for (i of m["price"]){
                    if (i != m["price"][m["price"].length - 1]){
                        b += `${i[1]} ${sjdata["style_values"][i[0]]}, `;
                    }
                }
                b += `and ${m["price"][m["price"].length - 1][1]} ${sjdata["style_values"][m["price"][m["price"].length - 1][0]]}`
            }
            else{
                b = `${m["price"][m["price"].length - 1][1]} ${sjdata["style_values"][m["price"][m["price"].length - 1][0]]}`
            }

            let c = '';
            if (m["consumes"].length == 0){
                c = 'Nothing!'
            }
            else if(m["consumes"].length == 1){
                c = `${m["consumes"][m["consumes"].length - 1][1]} ${sjdata["style_values"][m["consumes"][m["consumes"].length - 1][0]]}`
            }
            else{
                for (j of m["consumes"]){
                    if (j != m["consumes"][m["consumes"].length - 1]){
                        c += `${j[1]} ${sjdata["style_values"][j[0]]}, `;
                    }
                }
                c += `and ${m["consumes"][m["consumes"].length - 1][1]} ${sjdata["style_values"][m["consumes"][m["consumes"].length - 1][0]]}`
            }

            if (m["produces"].length == 1){
                d = `${m["produces"][m["produces"].length - 1][1]} ${sjdata["style_values"][m["produces"][m["produces"].length - 1][0]]}`
            }
            else{
                let d = ''
                for (k of m["produces"]){
                    if (k != m["produces"][m["produces"].length - 1]){
                        d += `${k[1]} ${sjdata["style_values"][k[0]]}, `;
                    }
                }
                d += `and ${m["produces"][m["produces"].length - 1][1]} ${sjdata["style_values"][m["produces"][m["produces"].length - 1][0]]}`
            }
            const a = `\n Description: ${m["description"]} \n Price: ${b} \n Consumption: ${c} \n Production: ${d}`
            const finalEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`${n} Info:`)
            .setDescription(a);
            interaction.reply({embeds:[finalEmbed]});
        }
        else{
            p = `That is not a type of building!`
            interaction.reply(p)
        }
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 