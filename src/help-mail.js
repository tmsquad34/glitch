const fetch = require("node-fetch");
var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

exports.index = async function(req, res) {
  const { inputs } = req.body.input;
  const body = `<b>${inputs.message}</b> \n \n <hr> \n TEAM_ID: ${inputs.team_id} <br> TOUCH_ID: ${inputs.touch_id} <br> USER_ID: ${inputs.user_id} <br> BROWSER: ${inputs.browser}`
//   const body2 = `<html> orange template
// <head>
// 	<style type="text/css">
// 		.box{background-color: orange;text-align:  center; padding-top: 1%; margin: auto; height: auto;width: 300px;}
// 		.box h {color: black;font-weight: 400; padding-top: 50%;}
// 		.box h1 {color: black; font-size: 20px;}
// 	</style>
// </head>
// <body>
// <div class="box">
//     <b><h1>${inputs.message}</h1></b>
// 	<hr>
//     <h>TEAM_ID: ${inputs.team_id}<h>
// 	<br>
// 	  <h>TOUCH_İD: ${inputs.touch_id}<h>
// 	<br>
//     <h>USER_İD: ${inputs.user_id}<h>
// 	<br>
// 	  <h>BROWSER: ${inputs.browser}<h>
// 	<br>
// </div>
// </body>`
  var params = {
  Destination: {
    ToAddresses: [
      'support@bilpp.com',
    ]
  },
  Message: { 
    Body: { 
      
      Html: {
       Charset: "UTF-8",
       Data: body
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: inputs.subject
     }
    },
  Source: 'Notification@bilpp.com', 
};
  
  console.log(body);

var sendPromise = new AWS.SES({}).sendEmail(params).promise();


  sendPromise
    .then(function(data) {
      console.log(data.MessageId);
      return res.json({
        result: "We will contact you as soon as possible."
      });
    })
    .catch(function(err) {
      console.error(err, err.stack);
      return res.json({
        result: "Error sending email"
      });
    });
};
