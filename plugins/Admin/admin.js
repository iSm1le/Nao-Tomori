var Permissions = require("../../permissions.json");

exports.commands = [
	//"setUsername",
	"giveAccess",
	"denyAccess",
	//"log",
	"die",
	"uptime"
]

var startTime = Date.now();

exports.setUsername = {
	description: "sets the username of the bot. Note this can only be done twice an hour!",
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(msg.member.roles.has(role.id)) {
			bot.user.setUsername(suffix);
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.giveAccess = {
	usage: "<user>",
	description: "Grants a permission to user on server",
	process: function(bot,msg,suffix){
		try {
			var arole = msg.guild.roles.find("name", Permissions.global.addOtherPermissionRole.slice(0, -1));
			var role = msg.guild.roles.find("name", Permissions.global.addOtherPermissionRole);
			if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
			if(msg.member.roles.has(role.id)) {
				if(!msg.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
					return msg.channel.sendMessage("I dont have permission (MANAGE_ROLES_OR_PERMISSIONS) to do this.");
				}
				if(msg.mentions.users.size === 0) {
					return msg.channel.sendMessage("Please mention a user to grant a server permission.");
				}
				var auser = msg.guild.member(msg.mentions.users.first());
				if(auser && arole)
					{
						if(!auser.roles.has(arole.id))
							{
								auser.addRole(arole);
								msg.channel.sendMessage(`${auser}, you are permitted on server by ${msg.author}.`);
							} else {
								msg.channel.sendMessage(`${auser} already have permission to access server.`);
							}
					}
			} else {
				msg.channel.sendMessage("You dont have permission to do this.");
			}
		} catch(e) {
			console.log(e);
			msg.channel.sendMessage("I cant complete this task.");
		}
	}
}

exports.denyAccess = {
	usage: "<user>",
	description: "Deny a user permission on server",
	process: function(bot,msg,suffix){
		try {
			var drole = msg.guild.roles.find("name", Permissions.global.addOtherPermissionRole.slice(0, -1));
			var role = msg.guild.roles.find("name", Permissions.global.addOtherPermissionRole);
			if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
			if(msg.member.roles.has(role.id)) {
				if(!msg.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")){
					return msg.channel.sendMessage("I dont have permission (MANAGE_ROLES_OR_PERMISSIONS) to do this.");
				}
				if(msg.mentions.users.size === 0) {
					return msg.channel.sendMessage("Please mention a user to deny a server permission.");
				}
				var duser = msg.guild.member(msg.mentions.users.first());
				if(!duser.roles.has(role.id)){
					if(duser && drole)
						{
							if(duser.roles.has(drole.id))
								{
									duser.removeRole(drole);
									msg.channel.sendMessage(`${duser}, you are denied on server by ${msg.author}.`);
								} else {
									msg.channel.sendMessage(`${duser} doesnt have permission at all.`);
								}
						}
					} else {
						return msg.channel.sendMessage(`I cant deauthorize ${duser} because he have a role ${Permissions.global.addOtherPermissionRole}`);
					}
			} else {
				msg.channel.sendMessage("You dont have permission to do this.");
			}
		} catch(e) {
			console.log(e);
			msg.channel.sendMessage("I cant complete this task.");
		}
	}
}

exports.log = {
	usage: "<log message>",
	description: "logs message to bot console",
	process: function(bot,msg,suffix){
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(msg.member.roles.has(role.id)) {
			console.log(msg.content);
		} else {
			msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.die = {
	usage: "",
	description: "Sends command, that closing a bot instance.",
	process: function(bot,msg,suffix) {
		var role = msg.guild.roles.find("name", Permissions.global.permittedRoleName);
		if(!role) { return msg.channel.sendMessage(`You dont have ${Permissions.global.permittedRoleName} group on server`); }
		if(msg.member.roles.has(role.id)) {
			console.log(`Bot has been killed by ${msg.author.username}`);
			msg.channel.sendMessage(`Bot has been killed by ${msg.author}`);
			setTimeout(function(){process.exit(0);},500);
		} else {
			return msg.channel.sendMessage("You dont have permission to do this.");
		}
	}
}

exports.uptime = {
	usage: "",
	description: "returns the amount of time since the bot started",
	process: function(bot,msg,suffix){
		var now = Date.now();
		var msec = now - startTime;
		console.log("Uptime is " + msec + " milliseconds");
		var days = Math.floor(msec / 1000 / 60 / 60 / 24);
		msec -= days * 1000 * 60 * 60 * 24;
		var hours = Math.floor(msec / 1000 / 60 / 60);
		msec -= hours * 1000 * 60 * 60;
		var mins = Math.floor(msec / 1000 / 60);
		msec -= mins * 1000 * 60;
		var secs = Math.floor(msec / 1000);
		var timestr = "";
		if(days > 0) {
			timestr += days + " days ";
		}
		if(hours > 0) {
			timestr += hours + " hours ";
		}
		if(mins > 0) {
			timestr += mins + " minutes ";
		}
		if(secs > 0) {
			timestr += secs + " seconds ";
		}
		msg.channel.sendMessage("**Uptime**: " + timestr);
	}
}
