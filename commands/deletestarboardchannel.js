const Discord = require('discord.js');

module.exports = {
    name: "deletestarboardchannel",
    description: "Deletes the starboard channel for the server.",
    aliases: ["dsch"],
    usage: "",
    display: true,
    type: "moderation",
    execute: async function(client, message, args, prefix) {
        try {
            let guildsch = client.getsch.get(message.guild.id);

            if (message.member.hasPermission("MANAGE_CHANNELS")) {

                client.deletesch.run(message.guild.id);
                const sucessEm = new Discord.MessageEmbed()
                    .setTitle(`Sucess!`)
                    .setColor('RANDOM')
                    .setDescription(`The starboard has been deleted!`)
                    .setFooter(`Requested by: ${message.author.username} • Run sr!bugreport to submit a bug`, message.author.displayAvatarURL())
                await message.channel.send(sucessEm);

            }
        } catch (err) {
            const clean = text => {
                if (typeof(text) === "string")
                    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
            }

            let errEm = new Discord.MessageEmbed()
                .setTitle(`Oh no! I encountered an error!`)
                .setDescription(`Please try again later.`)
                .addField(`Please run sr!bugreport <error>. replace <error> with the error below. Error:`, clean(err))
                .setColor('RANDOM')

            message.channel.send(errEm)
            client.channels.cache.get(`728216765364043847`).send(errEm)
        }

    }
}