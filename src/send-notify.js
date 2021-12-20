const fetch = require("node-fetch");
var AWS = require("aws-sdk");
const { render } = require("template-file");
const linkify = require('linkifyjs');
const extractUrls = require("extract-urls");

const { v4: uuidv4 } = require("uuid");
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var sqs = new AWS.SQS({});

async function createShortLink(objects) {
  const createShortenerQuery = `mutation insertBulkShortener($objects: [shortener_insert_input!] = {}) {
  insert_shortener(objects: $objects) {
    affected_rows
  }
}
`;
  const graphqlReq = {
    query: createShortenerQuery,
    variables: { objects: objects }
  };

  const response_shortener = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      return data.data;
    });

  return response_shortener;
}
async function getTemplate(template_id) {
  const getTemplate = `
    query getTemplate($template_id: uuid = "") {
    templates(where: {id: {_eq: $template_id}}) {
      content
      attributes
    }
  }`;
  const graphqlReq = {
    query: getTemplate,
    variables: { template_id: template_id }
  };

  const template = await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
    method: "POST",
    body: JSON.stringify(graphqlReq),
    headers: {
      "content-type": process.env.CONTENT_TYPE,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
    }
  })
    .then(response => response.json())
    .then((data) => {
      if(data.errors){
        return data
      }
      return data.data.templates[0].content;
    });

  return template;

  err => {
    return err.message;
  };
}
async function getOutgoingTypeCode(outgoing_type_id) {
  const getTemplate = `
    query getOutgoingTypes($outgoing_type_id: uuid = "") {
      outgoing_types(where: {id: {_eq: $outgoing_type_id}}) {
        id
        code
      }
    }
`;
  const graphqlReq = {
    query: getTemplate,
    variables: { outgoing_type_id: outgoing_type_id }
  };

  const template = await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
    method: "POST",
    body: JSON.stringify(graphqlReq),
    headers: {
      "content-type": process.env.CONTENT_TYPE,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        return data;
      }
      return data.data.outgoing_types[0].code;
    });

  return template;

  err => {
    return err.message;
  };
}

async function getSenderById(sender_id) {
  const getSenderQuery = `
   query SenderQuery($sender_id:uuid) {
  senders(where: {id: {_eq:$sender_id }}) {
    name
    attributes
    integration {
      properties
      provider {
        name
        status_id
      }
    }
    id
  }
}

`;
  const graphqlReq = {
    query: getSenderQuery,
    variables: { sender_id: sender_id }
  };

  const sender_items = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      return data.data.senders[0];
    });

  return sender_items;
}

async function getActivityTypesIdByCode(code_name) {
  const getActivityTypesIdQuery = `
    query getActivityTypesIdByCode($activity_types_code:String) {
    activity_types(where: {code: {_eq: $activity_types_code}}) {
    id
    }
  } `;
  const graphqlReq = {
    query: getActivityTypesIdQuery,
    variables: { activity_types_code: code_name }
  };

  const activity_type_id = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      return data.data.activity_types[0];
    });

  return activity_type_id.id;
}

async function getContact(source_id, outgoing_type) {
  const getContactQuery = `
   query getContact($contact_id: uuid, $outgoing_type: String = "") {
    contacts(where: {id: {_eq: $contact_id},communication_infos: {communication_method: {code: {_eq: $outgoing_type}}}}) {
      id
      touch_id
      team_id
      status_id
      first_name
      middle_name
      last_name
      subscriptions
      communication_infos (where: {communication_method: {code: {_eq: $outgoing_type}}}){
        communication_method {
          code
        }
        is_default
        content
      }
    }
  }
`;
  const graphqlReq = {
    query: getContactQuery,
    variables: { contact_id: source_id, outgoing_type: outgoing_type }
  };

  const contact_items = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data.errors != null) {
        return data.errors[0];
      }
      return data.data.contacts[0];
    });

  return contact_items;
}

async function getUser(source_id, outgoing_type) {
  const getUserQuery = `
 query UserQuery($user_id: String,$outgoing_type: String = "") {
  users(where: {id: {_eq: $user_id}, team: {communication_infos: {communication_method: {code: {_eq: $outgoing_type}}}}}) {
    id
    team_id
    status_id
    middle_name
    last_name
    first_name
    team {
      communication_infos (where: {communication_method: {code: {_eq: $outgoing_type}}}){
        content
        is_default
        communication_method {
          code
        }
      }
    }
  }
 
}`;
  const graphqlReq = {
    query: getUserQuery,
    variables: { user_id: source_id, outgoing_type: outgoing_type }
  };

  const user_items = await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
    method: "POST",
    body: JSON.stringify(graphqlReq),
    headers: {
      "content-type": process.env.CONTENT_TYPE,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.errors != null) {
        return data.errors[0];
      }
      return data.data.users[0];
    });

  return user_items;
}

exports.index = async function(req, res) {
  const { object } = req.body.input;

  const {
    team_id,
    touch_id,
    content,
    subject,
    template_id,
    outgoing_type_id,
    source,
    source_id,
    sender_id,
    email,
    phone,
    preview,
    variables
  } = object;
  var {shorten_links} = object;
  var single = false;
  var email_and_phone;
  
  if (email || phone) {
    single = true;
    if (email) {
      email_and_phone = email;
    }
    if (phone) {
      email_and_phone = phone;
    }
  }
  var outgoing_type = await getOutgoingTypeCode(outgoing_type_id).then(e => {
    return e;
  });
  console.log(outgoing_type);
  if(single){
    if (outgoing_type == "SMS" && phone == null || outgoing_type == "EMAIL" && email ==null) {
      return res.json({
        status: "ERROR",
        message: "outgoing type email/sms uyusmazligi"
      });
    }
  }
  
  if (outgoing_type == "SMS") {
    
    outgoing_type = "PHONE";
  }
  let to;
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  if (source == "CONTACT") {
    to = await getContact(source_id, outgoing_type).then(e => {
      return e;
    });

    if (to == undefined) {
      return res.json({
        status: "ERROR",
        message: "contact id not found"
      });
    }

    if (single) {
      var temp_com_infos = [];
      to.communication_infos.forEach(element => {
        if (email_and_phone.includes(element.content)) {
          temp_com_infos.push({
            content: element.content,
            communication_method: { code: element.communication_method.code },
            is_default: element.is_default
          });
        }
      });
      to.communication_infos = temp_com_infos;
      if (to.communication_infos.length == 0) {
        console.log("BOYUT 0");
        return res.json({
          status: "errror",
          message: "INPUTLAR ESLESMİYOR"
        });
      }
      //bu contactda bu singllar var mı. Varsa mesajı at
    }  
    if (outgoing_type == "EMAIL") {
        object.activites_type_id = await getActivityTypesIdByCode(
          "EMAIL_SENT_TO_CONTACT"
        ).then(e => {
          return e;
        });
        object.activities_title = "contact send email";
        console.log(object.activites_type_id);

      }

    if (outgoing_type == "PHONE") {
        object.activites_type_id = await getActivityTypesIdByCode(
          "SMS_SENT_TO_CONTACT"
        ).then(e => {
          return e;
        });
        object.activities_title = "contact send sms";
      }
    
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  else if (source == "USER") {
    to = await getUser(source_id, outgoing_type).then(e => {
      return e;
    });

    if (to == undefined) {
      return res.json({
        status: "ERROR",
        message: "user id not found"
      });
    }

    to.communication_infos = to.team.communication_infos;
    delete to["team"];

    if (single) {
      var temp_com_infos = [];
      to.communication_infos.forEach(element => {
        if (email_and_phone.includes(element.content)) {
          temp_com_infos.push({
            content: element.content,
            communication_method: { code: element.communication_method.code },
            is_default: element.is_default
          });
        }
      });

      to.communication_infos = temp_com_infos;
      if (to.communication_infos.length == 0) {
        return res.json({
          status: "errror",
          message: "INPUTLAR ESLESMİYOR"
        });
      }
    } 

    if (outgoing_type == "EMAIL") {
        object.activites_type_id = await getActivityTypesIdByCode(
          "EMAIL_SENT_TO_USER"
        ).then(e => {
          return e;
        });
        object.activities_title = "user send email";
      }
    if (outgoing_type == "PHONE") {
        object.activites_type_id = await getActivityTypesIdByCode(
          "SMS_SENT_TO_USER"
        ).then(e => {
          return e;
        });
        object.activities_title = "user send sms";
      }   
    
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  else if (source == null) {
    console.log("single geliyor");
    if (email == null && phone == null) {
      return res.json({
        status: "ERROR",
        message: "either phone or email required"
      });
    }
    if (email != null && phone != null) {
      return res.json({
        status: "ERROR",
        message: "phone and email cannot be entered at the same time"
      });
    }
    if (email != null) {
      delete object["email"];
      var communication_infos = [];
      email.forEach(element => {
        communication_infos.push({
          content: element,
          communication_method: { code: "EMAIL" },
          is_default: true
        });
      });
      to = { communication_infos };
    }
    if (phone != null) {
      delete object["phone"];
      var communication_infos = [];
      
      phone.forEach(element => {
        communication_infos.push({
          content: element,
          communication_method: { code: "PHONE" },
          is_default: true,
        });
      });
      to = { communication_infos };
    }
  } else {
    return res.json({
      status: "ERROR",
      message:
        "CONTACT+EMAİL/SMS , USER+EMAİL/SMS, EMAİL/SMS, CONTACT, USER OLABİLİR. "
    });
  }

  const sender_response = await getSenderById(sender_id).then(e => {
    return e;
  });

  if (sender_response == undefined) {
    return res.json({
      status: "ERROR",
      message: "sender id not found"
    });
  }
  
  
  
  var render_content = ""
  const template = await getTemplate(template_id).then(e => {return e;});
  console.log("*****************")
  var two_wariables = {}

  if(outgoing_type == "EMAIL"){
    if (subject) {
      two_wariables.name = subject
    }else{
      console.log("SUBJECT YOK")
    }
    if (content) {
      two_wariables.content = content

    }else{
      console.log("CONTENT YOK");
    }
    if (preview) {
      two_wariables.preheader = preview

    }else{
      console.log("CONTENT YOK");
    }
    if(source == "CONTACT"){
        var unsubscribe_string = `https://app.bilpp.com/unsubscribe/${to.team_id}/${to.touch_id}/${to.id}`
        two_wariables.unsubscribe = unsubscribe_string
    }
    object.content = template[0].attributes  
    render_content = template[0].content
    
      //url render
    var shorten_object = []

    if(shorten_links == true){
      const links = extractUrls(render_content);

      if (links.length != 0) {

                    for (const link of links) {
                        var short_key = uuidv4();
                        shorten_object.push({
                            long_url: link,
                            short_key: short_key,
                            team_id: team_id,
                            touch_id: touch_id,
                            contact_id: res.id
                        });

                        render_content = render_content.replace(link, 'https://bilpp.link/' + short_key);
                    }
                    const addShortener = await createShortLink(
                        shorten_object
                    ).then(e => {
                        return e;
                    });
                }
                else {
                    shorten_links = false;
                }
      
    }
    
      object.template_content = render_content;
      object.shorten_links = shorten_links;
      object.shortener_id = shortener_id;

  }else{
      render_content = content
      if(shorten_links == true){
        const links = extractUrls(render_content);

        if(shorten_links.length !=0){
          for (const link of links) {
          console.log("LINKLEEEERRRRR")
          console.log(link)
          const addShortener = await createShortLink( 
          team_id,touch_id,link).then(e => {return e;});
          console.log(addShortener);
          var short_key = addShortener["insert_shortener_one"]["short_key"]
          var shortener_id = addShortener["insert_shortener_one"]["id"]
          render_content = render_content.replace(link,'https://bilpp.link/'+short_key)  
          }
        }
        else{
          shorten_links = false
        }

      }
      object.template_content = render_content;
      object.subject = "netgsm"
      object.shorten_links = shorten_links;
      object.shortener_id = shortener_id;
      if(variables){
        object.variables = variables;
      }

  }
  
  object.sender = sender_response;
  object.to = to; 
  object.two_wariables = two_wariables;
  
  console.log(object);
  const random_id = uuidv4();

     var params = {
       MessageDeduplicationId: random_id,
       MessageGroupId: random_id,
       MessageBody: JSON.stringify(object),
       QueueUrl: process.env.NOTIFICATION_HUB_QUEUE_URL
     };

     sqs.sendMessage(params, async function(err, data) {
       if (err) {
         console.log(err);
         return res.json({
           status: "ERROR>",
           message: err
         });
       }
     });

  return res.json({
    status: "OK",
    message: "sent message"
  });
};
