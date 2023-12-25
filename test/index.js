const { REST } = require('@discordjs/rest')
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { Routes } = require('discord-api-types/v9')
const { CronJob } = require('cron');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });


const fs = require('fs')
const path = require('path')

let commandTmp = []
let commands = []
const feeding = [["crops", 100000], ["meat", 180000], ["fish", 120000], ["seafood", 700000], ["food", 900000], ["pastries", 400000], ["lemonade", 400000]]
const pp = ["bauxite", "bauxite", "bauxite", "copper", "copper", "copper", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "silver", "silver", "silver", "gold"]
const pp2 = ["bauxite", "bauxite", "bauxite", "bauxite", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "iron", "copper", "copper", "copper", "copper", "silver", "silver", "gold"]

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

const token =
    process.env.NODE_ENV === 'development'
        ? process.env.TOKEN_DEV
        : process.env.TOKEN_PROD

client.once('ready', () => {
    console.log('Bot Ready!')

    let commandsFiles = fs.readdirSync(path.join(__dirname, './commands'))

    commandsFiles.forEach((file, i) => {
        commandTmp[i] = require('./commands/' + file)
        commands = [
            ...commands,
            {
                name: file.split('.')[0],
                description: commandTmp[i].description,
                init: commandTmp[i].init,
                options: commandTmp[i].options,
            },
        ]
    })
    const rest = new REST({ version: '9' }).setToken(token)
    rest.put(Routes.applicationCommands(client.application.id), {
        body: commands,
    })
        .then(() => {
            console.log('Commands registered!')
        })
        .catch(console.error)
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return
    const { commandName } = interaction
    const selectedCommand = commands.find(c => commandName === c.name)
    selectedCommand.init(interaction, client)
})

let update = new CronJob('00 00 */2 * * *', async () => {
    const data = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/database.json', 'utf8');
    let jdata = JSON.parse(data);
    const sdata = await fs.promises.readFile('/home/denizkirbiyik/Documents/GitHub/civil/test/information.json', 'utf8');
    let sjdata = JSON.parse(sdata);

    let a = ``;
    Object.values(jdata).forEach((i, iii) => {
        ii = Object.keys(jdata)[iii]
        let z = [];
        for (j of i["order"]){
            if (j == "rotary_kiln_plant"){
                let p = [choose(pp), choose(pp), choose(pp), choose(pp), choose(pp), choose(pp)]
                let ppp = Math.floor(i["ore"]/27)
                if (ppp > i["rotary_kiln_plant"]){
                    ppp = ppp - i["rotary_kiln_plant"]
                }
                for (p4 of p){
                    jdata[ii][p4] += 5*ppp
                }
            }
            else if (j == "ore_grinding_mill"){
                let p = [choose(pp2), choose(pp2), choose(pp2), choose(pp2), choose(pp2)]
                let ppp = Math.floor(i["ore"]/5)
                if (ppp > i["ore_grinding_mill"]){
                    ppp = ppp - i["ore_grinding_mill"]
                }
                for (p4 of p){
                    jdata[ii][p4] += ppp
                }
            }
            else if (sjdata["building_info"][j]["consumes"].length == 0){
                for (k of sjdata["building_info"][j]["produces"]){
                    jdata[ii][k[0]] += k[1]*i[j]
                }
            }
            else {
                let temp = i[j];
                for (let k = 0; k < sjdata["building_info"][j]["consumes"].length; k++){
                    let tempp = Math.floor(i[sjdata["building_info"][j]["consumes"][k][0]]/sjdata["building_info"][j]["consumes"][k][1]);
                    if (tempp > i[j]){
                        tempp = tempp - i[j];
                    }
                    if (temp > tempp){
                        temp = tempp;
                    }
                    z.push(temp);
                } 
                zz = Math.min.apply(Math, z);
                for (l of sjdata["building_info"][j]["consumes"]){
                    jdata[ii][l[0]] -= zz*l[1]
                }
                for (ll of sjdata["building_info"][j]["produces"]){
                    jdata[ii][ll[0]] += zz*ll[1]
                }
            }
        }
        let m = 0;
        let pop = 0;
        fed = i["crops"] * 100000 + i["meat"] * 180000 + i["fish"] * 120000 + i["seafood"] * 700000 + i["food"] * 900000 + i["pastries"] * 400000 + i["lemonade"] * 400000
        if (fed >= jdata[ii]["population"]){
            let feast = 0;
            while (feast <= jdata[ii]["population"]){
                let newfood = choose(feeding)
                if (i[newfood[0]] > 0){
                    feast += newfood[1]
                    jdata[ii][newfood[0]]--;
                    if (newfood[0] == "seafood"){
                        earning += Math.random()*5001+5000
                    }
                    else if(newfood[0] == "food"){
                        earning += Math.random()*6001+6000
                    }
                    else if(newfood[0] == "pastries"){
                        earning += Math.random()*7501+7500
                    }
                    else if(newfood[0] == "lemonade"){
                        earning += Math.random()*8001+8000
                    }
                }
            }
            jdata[ii]["population"] += Math.floor(Math.random()*(i["population"]/25)+1)
        }
        else {
            let starved = Math.floor(Math.random()*(i["population"] - fed));
            jdata[ii]["population"] -= starved;
            console.log(a)
            a += `\n ${i["name"]}'s population is starving! ${starved} of its citizens have died of starvation.`
        }
        let mar = i["market"]
        m += mar*Math.floor(5577*Math.random()+2500)+Math.floor(51*Math.random()+50)+i["actions"]*Math.floor(11*Math.random()+10)
        let o = mar*Math.floor(6*Math.random()+15)+Math.floor(4*Math.random()+2)
        let n = i["actions"] + o;
        jdata[ii]["treasury"] += m
        jdata[ii]["actions"] += n
        a += `\n ${i["name"]} got ${m} Money and ${o} actions. \n They have ${n} actions, of which 10% are used up by its citizens. \n`;
    });

    sjdata["year"] += 1
    fs.writeFile ("database.json", JSON.stringify(jdata, null, 4), function(err) {
        if (err) throw err;
    });
    fs.writeFile ("information.json", JSON.stringify(sjdata, null, 4), function(err) {
        if (err) throw err;
    });

    const updateEmbed = new EmbedBuilder()
        .setColor("#0000FF")
        .setTitle(`Year ${sjdata["year"]}:`)
        .setDescription(a);
    for (g of client.guilds.cache.map(guild => guild.id)){
        if (Object.keys(sjdata["guilds"]).includes(g)){
            client.channels.cache.get(sjdata["guilds"][g]).send({embeds:[updateEmbed]});
        }
    }
});

update.start();

client.login(token)
