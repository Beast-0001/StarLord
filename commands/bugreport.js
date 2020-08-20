const Discord = require('discord.js');
module.exports = {
    name: "bugreport",
    description: "Report issues with the bot",
    aliases: ["br", "bugr", "breport", "problem"],
    usage: "<issue and command name>",
    display: true,
    type: 'general',
    timeout: 5000,
    execute: async function(client, message, args, prefix) {   
        try {
        const lowArgEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription('Please input the error message.')
        .setFooter(client.user.username,client.user.avatarURL());
        if(args.length < 1) return message.channel.send(lowArgEmbed);
        let d = new Date();
        let cd = d.getTime();
        let cd2 = Math.floor(Math.random()*(699337624627839118-1+1)+1);
        let reportid = cd + cd2;
        let bugmessage = args.join(" ");
        const successEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('🛠 Bug report submitted 🛠')
        .setDescription('**Bug report submitted, \n🛠 Report ID:** `' + reportid + "`\n**✉ Message:** " + bugmessage)
        .setFooter(client.user.username,client.user.avatarURL());
        const serverBugEmbed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('🛠 Bug report recieved 🛠')
        .setDescription(`
        **🛠 Report ID:**  ${reportid} 
        **😃 User:**  ${message.author.tag} (${message.author.id}) 
        **📖 Server: ** ${message.guild.name} (${message.guild.id}) 
        **✉ Message:** ${bugmessage}`)
        .setFooter(client.user.username,client.user.avatarURL());
            message.channel.send(successEmbed);
            let rm = await client.channels.cache.get(`745710686700699648`).send(serverBugEmbed)
                    await rm.react('✅')
                    await rm.react('❌')
    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = rm.createReactionCollector(filter);
        collector.on("collect", (reaction, user) => {
        reaction.users.remove(user);
        switch (reaction.emoji.name) {
        case "✅":
            rm.edit(new Discord.MessageEmbed().setTitle('Bug report Fixed 🛠').setDescription(`By: ${user.tag}\n Issue: ${bugmessage}`).setColor('RANDOM'))
            collector.stop()
            rm.reactions.removeAll();
        break;
        case '❌':        
        break;
                  default:
          break;
        }        
        })
        } catch (err) {
            message.channel.send(`Hmm, I ran into a error, try again later`)
            console.log(err)
        }

}
}