const { Webhook, MessageBuilder } = require("discord-webhook-node");
const hook = new Webhook(process.env.NEW_TOUCH_WEBHOOK);

exports.index = async function(req, res) {
  const touch_id = req.body.event.data.new.id;
  const team_id = req.body.event.data.new.team_id;
  const touch_name = req.body.event.data.new.name;

  const embed = new MessageBuilder()
    .setTitle("New Touch")
    .addField("Touch ID", touch_id)
    .addField("Team ID", team_id)
    .addField("Touch Name", touch_name)
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
