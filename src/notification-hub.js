var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var sqs = new AWS.SQS({});

exports.index = async function(req, res) {

  const { input1 } = req.body.input;
  const random_id = uuidv4();

  var params = {
    MessageDeduplicationId: random_id,
    MessageGroupId: random_id,
    MessageBody: JSON.stringify(input1),
    QueueUrl: process.env.contact_hub_queue_url
  };

  sqs.sendMessage(params, async function(err, data) {
    if (err) {
      return res.json({
        ErrorMessage: err.message
        })
    } 
    else {
      return res.json({
         message_id : data.MessageId,
         sequence_number: data.SequenceNumber,
        });
    }
  });
};
