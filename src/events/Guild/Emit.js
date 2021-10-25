const Discord = require("discord.js");
module.exports = client => {
  const invites = {};
  client.on("ready", async () => {
    client.guilds.cache.forEach(g => {
      g.invites.cache.map(guildInvites =>
        guildInvites ? (invites[g.id] = guildInvites) : null
      );
    });
  });
  client.on("guildMemberAdd", member => {
    try {
      member.guild.invites.fetch().then(async guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        if (!ei) return;
        await member.guild.invites.fetch().catch(() => undefined);
        const invite = guildInvites.find(i => {
          const a = ei.get(i.code);
          if (!a) return;
          return a;
        });
        if (!invite) return;
        const inviter = client.users.cache.get(invite.inviter.id);
        client.emit("inviteJoin", member, invite, inviter);
      });
    } catch (e) {}
  });
};
