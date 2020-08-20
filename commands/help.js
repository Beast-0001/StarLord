const Discord = require('discord.js');
const ms = require("ms");

module.exports = {
name: "help",
  display: true,
  type: 'general',
  usage: "[Command]",
  description: "Shows command list.",
  aliases: ["h", "commands", "command"],
  execute: async function(client, message, args, prefix) {   
    const vanillaHelp = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('📖 Help')
    .setDescription(`You can use \`sr!help [command]\` to view specific information about commands.`)
    .setFooter(client.user.username,client.user.avatarURL());
    client.commands.forEach((file, name) => {
      if (file.display === false) {
        return;
      } else {
          vanillaHelp.addField(`${prefix}${name} ${file.usage}`, file.description);
      }
    })
    if(!args.length) return message.channel.send(vanillaHelp) 
    else if(args.length) {
      let menu = args[0].toLowerCase();
      commandDescEmbed(menu);
    }
    function commandDescEmbed(commandName) {
      try {
        const command = client.commands.get(commandName)||client.aliases.get(commandName)
        let aliases = "";
        if(command.aliases.length == 0) {
          aliases = "None";
        } else {
          aliases = command.aliases.join(", ");
        }
        let embed = new Discord.MessageEmbed()
      .setColor('RANDOM')
      .setTitle(`${prefix}${command.name} help`)
      .setDescription(command.description)
      .addField("Usage:", prefix + command.name + " " + command.usage, true)
      .addField("Aliases:", aliases, true)
      .addField("Type:", command.type, true)
      .setFooter(client.user.username,client.user.avatarURL());
      if(command.display) return message.channel.send(embed);
      if(!command.display) errorMsg();
      } catch (error) {
        errorMsg();
      }
    }
    function errorMsg() {
      let embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription("Invalid Command. Please try with a valid one")
        .setFooter(client.user.username,client.user.avatarURL());
        return message.channel.send(embed)
    }
    
 }
}