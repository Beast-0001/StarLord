require('dotenv').config()

const Discord = require("discord.js");
const SQLite = require("better-sqlite3");

const sql = new SQLite('./starboard.sqlite');
const client = new Discord.Client({partials: ["REACTION", "MESSAGE", "USER"]});

let staredmsg = new Discord.Collection();
client.on('ready', async() => {
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
    \n Commands Loaded: ${client.commands.size}
    \n Servers: ${client.guilds.cache.size}
    \n Users: ${users}`)
  const activity = [
    {
      type: "PLAYING",
      status: `With ${format(users)} Users`
    },
    {
    type: "WATCHING",
     status: "@StarLord help"
    },
    {
    type: "WATCHING",
     status: `${format(client.guilds.cache.size) servers!}`
    }
  ]
setInterval(() => {
  let s = activity[Math.floor(Math.random() * activity.length)]
  client.user.setActivity(s.status, {type: s.type})
  }, 1000*8);
});

client.on('messageReactionAdd', async (reaction, user) => {
        if (user.partial) await user.fetch();
        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();
   
        if (user.bot) return;
        
        const message = await reaction.message;
        
        if (reaction.emoji.name == '⭐') {
        if (staredmsg.get(message.id)) { 
        staredmsg.delete(message.id);
        staredmsg.set(message.id, {id: message.id, cnt:message.reactions.filter(s => s.name === '⭐').length})
        if (staredmsg.get(message.id).cnt <= 4) client.
        }
        staredmsg.set(message.id, {id: message.id, cnt:message.reactions.filter(s => s.name === '⭐').length})
        }
});

client.on('disconnect', () => console.warn('Soldier is disconnecting...'))
      .on('reconnecting', () => console.log('Soldier reconnecting...', 'log'))
      .on('error', e => console.error(e))
      .on('warn', info => console.warn(info));
      
client.login(process.env.DISCORD_TOKEN);
