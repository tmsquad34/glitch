const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.NEW_USER_WEBHOOK);
exports.index = async function(req, res) {
  const user_id = req.body.event.data.new.id;
  const team_id = req.body.event.data.new.team_id;

  const embed = new MessageBuilder()
    .setTitle("New User")
    .addField("User ID", user_id)
    .addField("Team ID", team_id)
    .setColor("#000000")
    .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
    .setFooter(
      "Register Time:",
      "https://cdn.discordapp.com/embed/avatars/0.png"
    )
    .setTimestamp();

  hook.send(embed).then(
    async result => {
      return res.json({
        response: "OK"
      });
    },
    err => {
      return res.json({
        response: err.message
      });
    }
  );
};
