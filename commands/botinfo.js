const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const {version} = require("../package.json");
var os = require('os'); 

const flags = {
	DISCORD_EMPLOYEE: 'Discord Employee',
	DISCORD_PARTNER: 'Discord Partner',
	BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
	BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
	HYPESQUAD_EVENTS: 'HypeSquad Events',
	HOUSE_BRAVERY: 'House of Bravery',
	HOUSE_BRILLIANCE: 'House of Brilliance',
	HOUSE_BALANCE: 'House of Balance',
	EARLY_SUPPORTER: 'Early Supporter',
	TEAM_USER: 'Team User',
	SYSTEM: 'System',
	VERIFIED_BOT: 'Verified Bot',
	VERIFIED_DEVELOPER: 'Verified Bot Developer'
};

module.exports = {
    name: "botinfo",
    description: "Get information about StarLord",
    aliases: ["bot", "bot-info"],
    usage: "",
    display: true,
    type: 'general',
    execute: async function(client, message, args, prefix) { 
    try {
		const member = message.client 
		  let users = 0
  client.guilds.cache.forEach(g => users += g.memberCount)
		const embed = new MessageEmbed()
			.setTitle(`StarLord V${version}`)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setColor(member.displayHexColor || 'RED')
			.addField('General', [
				`**• Prefix:** ${prefix}`,
				`\u200b`
			])
			.addField('User', [
				`**• Username:** ${member.user.username}`,
				`**• Discriminator:** ${member.user.discriminator}`,
				`**• ID:** ${member.user.id}`,
				`**• Time Created:** ${moment(member.user.createdTimestamp).format('LT')} on ${moment(member.user.createdTimestamp).format('LL')} (${moment(member.user.createdTimestamp).fromNow()})`,
				`\u200b`
            ])
            .addField('Statistics', [
				`**• Uptime:** ${msToTime(client.uptime)}`,
				`**• Users:** ${format(users)}`,
				`**• Guilds:** ${format(member.guilds.cache.size)}`,
				`**• Channels:** ${format(member.channels.cache.size)}`,
				`\u200b`
			])
			.addField('Memory', [
			    "Free memory: " + Math.round(os.freemem()/1024/1024/1000) + ' GB',
			    "Total memory: " + Math.round(os.totalmem()/1024/1024/1000) + ' GB'
			])
			.addField('CPU', [
			"CPU Architecture: " + os.arch(),
			'Operating System Platform: ' + os.platform()
			])
			
		return message.channel.send(embed);
		    function format(number, decimalPrecision = 2) {
  return parseFloat(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPrecision,
  });
}

        function msToTime(ms){
            days = Math.floor(ms / 86400000); // 24*60*60*1000
            daysms = ms % 86400000; // 24*60*60*1000
            hours = Math.floor(daysms / 3600000); // 60*60*1000
            hoursms = ms % 3600000; // 60*60*1000
            minutes = Math.floor(hoursms / 60000); // 60*1000
            minutesms = ms % 60000; // 60*1000
            sec = Math.floor(minutesms / 1000);
          
            let str = "";
            if (days) str = str + days + "d, ";
            if (hours) str = str + hours + "h, ";
            if (minutes) str = str + minutes + "m, ";
            if (sec) str = str + sec + "s";
          
            return str;
          }
} catch (err) {
                const errEm = new MessageEmbed()
                .setTitle(`An Unknown error occured`)
                .setDescription(`Please run sr!bugreport <error message> to report this. Replace <error message> with the error down below`)
                .addField(`Error:`, "```"+client.clean(err)+"```")
                message.channel.send(errEm)
            }
    }
    
}