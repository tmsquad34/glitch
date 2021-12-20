const fetch = require("node-fetch");
const { render } = require("template-file");
const linkify = require("linkifyjs");
const extractUrls = require("extract-urls");

var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
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
async function getContactcount(query,marketing_id,team_id) {
  const listContactsQuery = `query MyQuery($query: contacts_bool_exp = {}) {
  
  contacts_aggregate(where: $query) {
    aggregate {
      count
    }
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: { query: query }
  };

  const contact_count = await fetch(
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
      return data.data.contacts_aggregate.aggregate.count;
    });

  return contact_count;
}
var sqs = new AWS.SQS({});
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
    .then(data => {
      if (data.errors) {
        return data;
      }
      return data.data.templates[0].content;
    });

  return template;

  err => {
    return err.message;
  };
}

async function getSubscriptionCode(subscription_type_id) {
  const getSubscription = `
    query getSubscriptionCode($subscription_type_id: uuid = "subscription_type_id") {
      subscription_types(where: {id: {_eq: $subscription_type_id}}) {
        code
      }
    }
    `;
  const graphqlReq = {
    query: getSubscription,
    variables: { subscription_type_id: subscription_type_id }
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
      return data.data.subscription_types[0].code;
    });

  return template;

  err => {
    return err.message;
  };
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

async function setOutgoingType(marketing_id, team_id, status_id) {
  const updateOutgoingMutation = `
    mutation UpdateMarketingStatus($status_id: uuid = "", $id: uuid = "", $team_id: uuid = "") {
      update_marketing_by_pk(pk_columns: {id: $id, team_id: $team_id}, _set: {status_id: $status_id}) {
        id
        status_id
      }
    }
    `;
  const graphqlReq = {
    query: updateOutgoingMutation,
    variables: { status_id: status_id, id: marketing_id, team_id: team_id }
  };

  const update_outgoing = await fetch(
    process.env.MARKETING_CHECK_BILPP_HASURA_URL,
    {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    }
  );
  err => {
    return err.message;
  };
}

async function getContacts(
  marketing_id,
  team_id,
  query,
  marketing_outgoing_type,
  limit,
  offset
) {
  const listContactsQuery = `
    query getMarketingContacts($query: contacts_bool_exp = {}, $marketing_outgoing_type: String = "", $offset: Int = "",$limit: Int = "") {
      contacts(limit: $limit, offset: $offset, where: $query) {
        id
        last_name
        first_name
        gender_id
        middle_name
        touch_id
        subscriptions
        team_id
        communication_infos(where: {communication_method: {code: {_eq: $marketing_outgoing_type}}}) {
          communication_method {
            code
          }
          content
          is_default
        }
      }
    }`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      query: query,
      marketing_outgoing_type: marketing_outgoing_type,
      limit: limit,
      offset: offset
    }
  };

  const contact_list = await fetch(
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
      setOutgoingType(
        marketing_id,
        team_id,
        "1de25bec-c6a3-4c75-a054-e2bf935f0cd5"
      ); //inprogress
      return data.data.contacts;
    });

  return contact_list;
}

async function* asyncGenerator(num) {
  let i = 1;
  while (i <= num + 1) {
    yield i++;
  }
}

exports.index = async function(req, res) {
  const body = req.body;
  const { email, sms } = req.body.payload;
  const now_time = new Date();
  const global_time = now_time.toUTCString();
  try {
    if (email)
      SqsSendMain(
        "EMAIL",
        "MARKETING_EMAIL_SENT_TO_CONTACT",
        "Marketing Email Sent",
        "EMAIL"
      );
    if (sms)
      SqsSendMain(
        "SMS",
        "MARKETING_SMS_SENT_TO_CONTACT",
        "Marketing Sms Sent",
        "PHONE"
      );
  } catch (error) {
    console.log(error);
  }

  async function SqsSendMain(
    code_type,
    activities,
    activities_title,
    marketing_outgoing_type
  ) {
    const MarketingCheckQuery = `
     query MarketingCheck($status_type: String="", $_lt: timestamptz = "",$code:String="") {
        marketing(where: {status: {code: {_eq: $status_type}}, schedule: {_lt: $_lt}, outgoing_type: {code: {_eq: $code}}}) {
          id
          team_id
          touch_id
          pagination_limit
          current_page
          audience {
            query
          }
        }
      }
`;

    const graphqlReq = {
      query: MarketingCheckQuery,
      variables: { status_type: "PENDING", _lt: global_time, code: code_type }
    };

    await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
      method: "POST",
      body: JSON.stringify(graphqlReq),
      headers: {
        "content-type": process.env.CONTENT_TYPE,
        "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
      }
    })
      .then(res => res.json())
      .then(async result => {
        const job = {};
        console.log(result, "<0 result");

        if (result.data.marketing.length > 0) {
          const res = result.data.marketing[0];
          const total_contact_number = await getContactcount(
            res.audience.query,res.marketing_id, res.team_id
          ).then(e => {
            return e;
          });

          console.log(job);

          const total_page_number = Math.ceil(
            total_contact_number / result.data.marketing[0].pagination_limit
          );
          console.log(total_page_number, "total page number");
          console.log(total_contact_number, "total contact number");

          for await (let i of asyncGenerator(total_page_number)) {
            const random_id = uuidv4();

            console.log(i);
            job.current_page = i;
            job.marketing_id = result.data.marketing[0].id;
            job.team_id = result.data.marketing[0].team_id;
            job.touch_id = result.data.marketing[0].touch_id;
            job.pagination_limit = result.data.marketing[0].pagination_limit;
            job.marketing_outgoing_type = marketing_outgoing_type;
            job.activities_title = activities_title;
            job.code_type = code_type;
            job.activities = activities;
            job.contact_count = result.data.marketing[0];

            var params = {
              MessageBody: JSON.stringify(job),
              QueueUrl: process.env.STANDART_QUEUE_NOTIF
            };

            console.log(job);
            console.log("*************************");

            try {
              await sqs.sendMessage(params).promise();
            } catch (err) {
              console.log(err);
            }
          }
        } else {
          console.log("marketing yok");
          
        }
      })
      .catch(err => {
        console.log(err);
        
      });
  }
  
  return res.json({
            message: "Marketing checks completed successfully"
          });
};
