var Permissions = require("../../permissions.json");

exports.commands = [
	"create",
	"voice",
	"delete",
	"servers",
	//"topic"
]

exports.create = {
	usage: "<channel name>",
	description: "creates a new text channel with the given name.",
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {
			msg.channel.guild.createChannel(suffix,"text").then(function(channel) {
				msg.channel.sendMessage("created " + channel);
			}).catch(function(error){
				msg.channel.sendMessage("failed to create channel: " + error);
			});
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.servers = {
	description: "Tells you what servers the bot is in",
	process: function(bot,msg) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {
			msg.channel.sendMessage(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.voice = {
	usage: "<channel name>",
	description: "creates a new voice channel with the give name.",
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {		
			msg.channel.guild.createChannel(suffix,"voice").then(function(channel) {
				msg.channel.sendMessage("created " + channel.id);
				console.log("created " + channel);
			}).catch(function(error){
				msg.channel.sendMessage("failed to create channel: " + error);
			});
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.delete = {
	usage: "<channel name>",
	description: "deletes the specified channel",
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {		
			var channel = bot.channels.get(suffix);
			if(suffix.startsWith('<#')){
				channel = bot.channels.get(suffix.substr(2,suffix.length-3));
			}
			if(!channel){
				var channels = msg.channel.guild.channels.findAll("name",suffix);
				if(channels.length > 1){
					var response = "Multiple channels match, please use id:";
					for(var i=0;i<channels.length;i++){
						response += channels[i] + ": " + channels[i].id;
					}
					msg.channel.sendMessage(response);
					return;
				}else if(channels.length == 1){
					channel = channels[0];
				} else {
					msg.channel.sendMessage( "Couldn't find channel " + suffix + " to delete!");
					return;
				}
			}
			msg.channel.guild.defaultChannel.sendMessage("deleting channel " + suffix + " at " +msg.author + "'s request");
			if(msg.channel.guild.defaultChannel != msg.channel){
				msg.channel.sendMessage("deleting " + channel);
			}
			channel.delete().then(function(channel){
				console.log("deleted " + suffix + " at " + msg.author + "'s request");
			}).catch(function(error){
				msg.channel.sendMessage("couldn't delete channel: " + error);
			});
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.topic = {
	usage: "[topic]",
	description: 'Sets the topic for the channel. No topic removes the topic.',
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {	
			msg.channel.setTopic(suffix);
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}
