const fetch = require("node-fetch");

//coming audiences query

async function getAudiences(team_id, touch_id) {
  const getAudiencesQuery = `query getAudiences($team_id: uuid = "", $touch_id: uuid = "") {
  audiences(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    id
    query
    name
    created_at
  }
}

`;
  const graphqlReq = {
    query: getAudiencesQuery,
    variables: { team_id: team_id, touch_id: touch_id }
  };

  const audiences_response = await fetch(
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
      return data.data.audiences;
    });

  return audiences_response;
}

//coming contacts

async function getContacts(query) {
  const listContactsQuery = `
    query getContact($query: contacts_bool_exp = {}) {
      contacts(where: $query) {
        id
      }
    }`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: { query: query }
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
      return data.data.contacts[0];
    });

  return contact_list;
}

//insert db_cache
async function insertDbCache(objects) {
  const insertDbCachequery = `mutation insertCacheContactAudiences($objects: [cache_contact_audiences_insert_input!] = {}) {
  insert_cache_contact_audiences(objects: $objects, on_conflict: {constraint: contact_audiences_team_id_touch_id_contact_id_key, update_columns: [audiences, last_query]}) {
    affected_rows
    returning {
      id
    }
  }
}
`;
  const graphqlReq = {
    query: insertDbCachequery,
    variables: { objects: objects }
  };

  const insert_response = await fetch(
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
      return data;
    });

  return insert_response;
}

async function getCacheContact(team_id, touch_id, contact_id,_gt,_lt) {
  const getDbCachequery = `query getCachecontact($contact_id: uuid = "", $_gte: timestamp = "", $_lte: timestamp = "", $team_id: uuid = "", $touch_id: uuid = "") {
  cache_contact_audiences(where: {contact_id: {_eq: $contact_id}, last_query: {_gte: $_gte, _lte: $_lte}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    audiences
  }
}

`;
  const graphqlReq = {
    query: getDbCachequery,
    variables: { team_id: team_id,touch_id: touch_id,_gte:_gt,_lte:_lt,contact_id:contact_id }
  };

  const response_cache = await fetch(
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
      return data;
    });

  return response_cache;
}

exports.index = async function(req, res) {
  // get request input
  const { Input } = req.body.input;
  const { team_id, touch_id, contact_id } = Input;
  var now_time = new Date();
  var two_hours = now_time.getMinutes()-5
  now_time.setMinutes(two_hours)
  const global_time = now_time.toUTCString();
  const new_time = new Date();
  var new_hours = now_time.getHours()+1
  new_time.setHours(new_hours)
  const global_time2 = new_time.toUTCString();

  const getCahceContacts = await getCacheContact(team_id, touch_id,contact_id,global_time,global_time2).then(e => {
    return e;
  });
  console.log(getCahceContacts.data.cache_contact_audiences)
  
  if(getCahceContacts.data.cache_contact_audiences[0] != undefined) {
    return res.json(
    getCahceContacts.data.cache_contact_audiences[0]
    );
  }
  
  const queryAudiences = await getAudiences(team_id, touch_id).then(e => {
    return e;
  });

  var audiences_in = [];
  var cache_db_data = {
    team_id: team_id,
    touch_id: touch_id,
    contact_id: contact_id
  };
  for await (let num of queryAudiences) {
    console.log(num);
    num.query.id = { _eq: contact_id };
    const getcontact = await getContacts(num.query).then(e => {
      return e;
    });
    if (getcontact !== undefined){
      audiences_in.push({name:num.name, id:num.id, created_at:num.created_at})

    }
  }
  cache_db_data["audiences"] = audiences_in
  const return_last_response = await insertDbCache(cache_db_data).then(e => {
       return e;
     });
  
  console.log(cache_db_data);
  
  return res.json({
    audiences : audiences_in
  });
};
