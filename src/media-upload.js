const fetch = require("node-fetch");
const mime = require("mime-types");
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();

exports.index = async function(req, res) {
  const { file, team_id, touch_id, name } = req.body.input.input1;

  const randomID = parseInt(Math.random() * 10000000);

  const base64Data = new Buffer.from(
    file.replace(/^data:.+;base64,/, ""),
    "base64"
  );

  const mimeType = mime.lookup(`${name}`);
  const extType = mime.extension(`${mimeType}`);

  const params = {
    Bucket: "contactcsv",
    Key: `${randomID}.${extType}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64"
  };

  let location = "";
  let key = "";

  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
    const table_response = await fetch(
      process.env.INSERT_MEDIA_FETCH_URL,
      {
        method: "POST",
        body: JSON.stringify({
          team_id: team_id,
          touch_id: touch_id,
          name: key,
          path: location,
          size: base64Data.length,
          type: extType
        }),
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
        }
      }
    ).then(response =>
        response.json())
      .then(data => {
        return res.json(data.insert_media.returning[0]);
        })
      
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};
