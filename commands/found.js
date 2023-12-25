const fs = require('fs');
const path = require('path');
const DiscordJS = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const STRING = ApplicationCommandOptionType.String;

const description = 'Found a nation'

const options = [
    {
        name: 'name',
        description: 'official name of the nation',
        required: true,
        type: STRING,
    },
    {
        name: 'common_name',
        description: 'common name of the nation',
        required: false,
        type: STRING,
    },
    {
        name: 'motto',
        description: 'motto of the nation',
        required: false,
        type: STRING,
    },
    {
        name: 'flag',
        description: 'url of your nation`s flag',
        required: false,
        type: STRING,
    },
    {
        name: 'currency',
        description: 'currency of your nation',
        required: false,
        type: STRING,
    }
]
 
const init = async (interaction, client) => {
    try {
        let nam = interaction.options.getString('common_name')
        if (nam == null){
            nam = interaction.options.getString('name')
        }
        let cur = interaction.options.getString('common_name')
        if (cur == null){
            cur = "Money"
        }
        const data = await fs.promises.readFile('database.json', 'utf8');
        let jdata = JSON.parse(data);
        if (Object.keys(jdata).includes(interaction.user.id.toString())){
            interaction.reply(`You already founded a nation!`);
        }
        else{
            jdata[interaction.user.id.toString()] = {
                'name':interaction.options.getString('name'),
                'common':nam,
                'motto':interaction.options.getString('motto'),
                'flag':interaction.options.getString('flag'),
                'currency':cur,
                'treasury':Math.floor(Math.random()*50001+50000),
                'land':1,
                'population':Math.floor(Math.random()*500001+500000),
                'actions':Math.floor(Math.random()*8+18),
                'aluminum':0,
                'ammunition':0,
                'artillery':0,
                'bauxite':0,
                'books':0,
                'cars':0,
                'clothing':0,
                'concrete':0,
                'copper':0,
                'crops':200,
                'electronics':0,
                'firearms':0,
                'fish':100,
                'flour':0,
                'food':0,
                'fuel':0,
                'furniture':0,
                'glass':0,
                'gold':0,
                'household_plastic':0,
                'houses':0,
                'iron':5,
                'lemonade':0,
                'meat':100,
                'oil':0,
                'ore':0,
                'paper':0,
                'pastries':0,
                'petroleum':0,
                'plastic':0,
                'seafood':0,
                'ships':0,
                'silver':0,
                'sneakers':0,
                'steel':0,
                'stone':20,
                'timber':0,
                'tissues':0,
                'toys':0,
                'wood':12,
                "market":0,
                "main_street":0,
                "crop_field":0, 
                "fruit_field":0, 
                "pasture":0, 
                "cattle_shed":0, 
                "flour_mill":0, 
                "milking_parlor":0, 
                "slaughterhouse":0, 
                "fishing_grounds":0, 
                "fish_farm":0, 
                "algae_farm":0, 
                "seaweed_farm":0, 
                "tree_plantation":0, 
                "sapling_field":0, 
                "sawmill":0, 
                "biomass_pellet_plant":0, 
                "engineered_wood_plant":0, 
                "pulp_mill":0, 
                "quarry":0, 
                "ore_mine":0, 
                "ore_grinding_mill":0, 
                "glass_manufacturing_plant":0, 
                "rotary_kiln_plant":0, 
                "fiberglass_plant":0, 
                "oil_rig":0, 
                "oil_sludge_prolysis_plant":0, 
                "petrochemical_plant":0, 
                "waste_oil_refining_plant":0, 
                "naphtha_cracker_plant":0, 
                "seafood_factory":0, 
                "furniture_factory":0, 
                "bakery":0, 
                "steel_plant":0, 
                "household_plastic_factory":0, 
                "toy_factory":0, 
                "printing_press":0, 
                "lemonade_factory":0, 
                "electronics_factory":0, 
                "textile_mill":0, 
                "petroleum_refinery":0, 
                "soft_paper_factory":0, 
                "car_factory":0, 
                "food_processing_facility":0, 
                "sneaker_factory":0, 
                "modular_house_factory":0, 
                "shipyard":0, 
                "aluminum_factory":0, 
                "ammunition_factory":0, 
                "artillery_factory":0, 
                "concrete_factory":0, 
                "firearms_factory":0,
                "order":[]
            }
            fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
                if (err) throw err;
            });
            interaction.reply(`${interaction.options.getString('name')} has been founded.`)
        }
    } catch (error) {
        console.error(error);
        interaction.reply('An error occurred.');
    }
}

module.exports = { init, description, options };
 