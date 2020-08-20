const Discord = require("discord.js");
const  owners  = ['709441303351394314','583034033710039217']
module.exports = {
name: "eval",
  description: "Runs Eval Command **ONLY USABLE BY OWNERS**",
  aliases: ["e"],
  display: false,
  type: "owner",
  usage: "",
  execute: async function(client, message, args, guildpre) {  
      if (!args.length) return message.reply(`Please give something to eval`)
      console.log(`User: ${message.author.tag}`)
      console.log(`Text to eval:  ${args.join(' ')}`)
      if(!owners.includes(message.author.id)) return message.reply(`You're not my owner!`)
        try {
          const code = args.join(" ");
          let evaled = eval(code);
    
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

    const embed = new Discord.MessageEmbed()
    .setDescription(`Eval:`)
    .addField(`Input:`, '```js\n'+code+'```')
    .addField(`Output:`, '```js\n'+evaled.slice(0, 1000)+'\n```')
    .addField(`Type:`, typeof evaled)
    
    if (evaled.length > 1000) {
    embed.setFooter(`React below to go to the next page`)
    }
    let h  = await message.channel.send(embed)
    if (evaled.length < 1000) return;
    await h.react("◀️");
    await h.react("▶️");
    let char = 1000;
    let char1 = 2000;
    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = h.createReactionCollector(filter, { time: 1800000});
        collector.on("collect", (reaction, user) => {
        reaction.users.remove(user);
        switch (reaction.emoji.name) {
        case "▶️":
        char = char +1000
        char1 = char1 +1000
    if (evaled.slice(char,char1).includes('js')) {
    char = 1000;
    char1 = 2000;
    h.edit(new Discord.MessageEmbed()
    .setDescription(`Eval:`)
    .addField(`Input:`, '```js\n'+code+'```')
    .addField(`Output:`, '```js\n'+evaled.slice(char,char1)+'```')
    .addField(`Type:`, typeof evaled))
    return;
        }

          h.edit(new Discord.MessageEmbed()
    .setDescription(`Eval:`)
    .addField(`Input:`, '```js\n'+code+'```')
    .addField(`Output:`, '```js\n'+evaled.slice(char,char1)+'```')
    .addField(`Type:`, typeof evaled))
          break;
        case "◀️":
        char = char - 1000
        char1 = char1 - 1000
        if (evaled.slice(char,char1).includes('js')) {
    char = 1000;
    char1 = 2000;
    h.edit(new Discord.MessageEmbed()
    .setDescription(`Eval:`)
    .addField(`Input:`, '```js\n'+code+'```')
    .addField(`Output:`, '```js\n'+evaled.slice(char,char1)+'```')
    .addField(`Type:`, typeof evaled))
    return;
        }
          h.edit(new Discord.MessageEmbed()
    .setDescription(`Eval:`)
    .addField(`Input:`, '```js\n'+code+'```')
    .addField(`Output:`, '```js\n'+evaled.slice(char,char1)+'```')
    .addField(`Type:`, typeof evaled))
          break;
                  default:
          break;
        }
        })
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${client.clean(err)}\n\`\`\``);
        }
}
}