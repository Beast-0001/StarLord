require('dotenv').config()

const path = require('path');
const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const fs = require('fs');

const sql = new SQLite('./starboard.sqlite');
const client = new Discord.Client({
    partials: ["REACTION", "MESSAGE", "USER"]
});

const prefix = 'sr!';

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.staredmsg = new Discord.Collection();
client.msgsent = new Discord.Collection();
client.clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
let staredmsg = client.staredmsg;

const resolveFolder = folderName => path.resolve(__dirname, '.', folderName);

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const commandsFolder = resolveFolder('commands');
fs.readdir(commandsFolder, (err, commandFiles) => {
    const commands = commandFiles.filter(file => file.endsWith(".js"));
    commands.forEach(commandFiles => {
        const command = require(`./commands/${commandFiles}`);
        client.commands.set(command.name, command);
        command.aliases.forEach(alias => {
            client.aliases.set(alias, command);
        });
    });
});

client.on('ready', async () => {
    const Starboard = sql.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'starboard\';').get();

    if (!Starboard['count(*)']) {
        sql.prepare('CREATE TABLE starboard (guild TEXT PRIMARY KEY, sch TEXT);').run();
        sql.prepare('CREATE UNIQUE INDEX starboard_guild ON starboard (guild);').run();
        sql.pragma('synchronous = 1');
        sql.pragma('journal_mode = wal');
    }
    client.getsch = sql.prepare('SELECT * FROM starboard WHERE guild = ? ');
    client.setsch = sql.prepare('INSERT OR REPLACE INTO starboard (guild, sch) VALUES (?, ?)');
    client.deletesch = sql.prepare('DELETE FROM starboard WHERE guild = ?');

    let users = 0
    client.guilds.cache.forEach(g => users += g.memberCount)
    console.log(`Connected as ${client.user.tag} 
    \n Client ID: ${client.user.id}
    \n Servers: ${client.guilds.cache.size}
    \n Users: ${users}`)
    const activity = [{
            type: "PLAYING",
            status: `With ${format(users)} Users`
        },
        {
            type: "WATCHING",
            status: "@StarLord help"
        },
        {
            type: "WATCHING",
            status: "sr!help"
        },
        {
            type: "WATCHING",
            status: `${format(client.guilds.cache.size)} servers!`
        }
    ]
    setInterval(() => {
        let s = activity[Math.floor(Math.random() * activity.length)]
        client.user.setActivity(s.status, {
            type: s.type
        })
    }, 1000 * 8);
});

client.on('message', message => {
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    let cmd = client.commands.get(command) || client.aliases.get(command);
    if (!cmd) return;
    cmd.execute(client, message, args, prefix);
});

client.on('messageReactionAdd', async (reaction, user) => {

    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (user.bot) return;

    const message = await reaction.message;
    if (message.author.bot) return;
    let sch = client.getsch.get(message.guild.id);
    if (!sch) return;
    if (!message.guild.channels.cache.get(sch.sch)) returnl
    if (reaction.emoji.name == '⭐') {
        if (client.msgsent.get(message.id)) {
            let msg = await message.guild.channels.cache.get(sch.sch).messages.fetch({
                id: client.msgsent.get(message.id).id
            });
            msg.first().edit(`**${reaction.count} ⭐| ${message.channel}**`, new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`${message.content} \n\n [**Click Here to Jump!**](${message.url})`)
                .setFooter(`Message ID: ${message.id}`)
                .setTimestamp()
                .setColor(`GOLD`))
            return;
        }
        if (staredmsg.get(message.id)) {
            staredmsg.delete(message.id);
            staredmsg.set(message.id, {
                id: message.id,
                cnt: reaction.count
            })
            let staredEm = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`${message.content} \n\n [**Click Here to Jump!**](${message.url})`)
                .setFooter(`Message ID: ${message.id}`)
                .setTimestamp()
                .setColor(`GOLD`)
            if (staredmsg.get(message.id).cnt >= 3) {
                let m = await message.guild.channels.cache.get(sch.sch).send(`**${reaction.count} ⭐| ${message.channel}**`, staredEm)
                await m.react('⭐')
                client.msgsent.set(message.id, {
                    id: m.id
                })
            }
        }
        staredmsg.set(message.id, {
            id: message.id,
            cnt: reaction.count
        })
    }

});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (user.bot) return;

    const message = await reaction.message;
    if (message.author.bot) return;

    let sch = client.getsch.get(message.guild.id);
    if (!sch) return;
    if (!message.guild.channels.cache.get(sch.sch)) returnl

    if (reaction.emoji.name == '⭐') {
        staredmsg.delete(message.id);
        staredmsg.set(message.id, {
            id: message.id,
            cnt: reaction.count
        })
        if (client.msgsent.get(message.id)) {
            let msg = await message.guild.channels.cache.get(sch.sch).messages.fetch({
                id: client.msgsent.get(message.id).id
            });
            msg.first().edit(`**${reaction.count} ⭐| ${message.channel}**`, new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setDescription(`${message.content} \n\n [**Click Here to Jump!**](${message.url})`)
                .setFooter(`Message ID: ${message.id}`)
                .setTimestamp()
                .setColor(`GOLD`))
        }
    }
});
client.on('disconnect', () => console.warn('Soldier is disconnecting...'))
    .on('reconnecting', () => console.log('Soldier reconnecting...', 'log'))
    .on('error', e => console.error(e))
    .on('warn', info => console.warn(info));

client.login(process.env.DISCORD_TOKEN);

function format(number, decimalPrecision = 2) {
    return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPrecision,
    });
}