const fetch = require("node-fetch");

async function insertACtivities(object) {
  const listContactsQuery = `mutation MyMutation($object: activities_insert_input = {}) {
  insert_activities_one(object: $object) {
    id
  }
}

`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {object}
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
      return data.data
    });

  return contact_count;
}

exports.index = async function(req, res) {
  const now_time = new Date();
  var object = {}
  const new_data = req.body.event.data.new;
  const table_name = req.body.table.name
  const activity_type = req.body.event.op
  
  object.source = table_name;
  object.source_id = new_data.id;
  object.activity_date = now_time;
  object.team_id = new_data.team_id
  

  
  if(table_name == "data_sync" && activity_type == "INSERT") {
    const data_sync_type_id = req.body.event.data.new.data_sync_type_id
    if(data_sync_type_id == "78487ca2-343a-4401-8633-e7640f06c2fd"){
        object.title = "Datasync Export Created"

    }else{
        object.title = "Datasync Import Created"

    }
    object.touch_id = new_data.touch_id
    object.activity_type_id = "2f338641-842a-4d4e-aaad-df975d66ab49"
    object.related_id = new_data.id;
  }
  
  if(table_name == "audiences" && activity_type == "UPDATE") {
    console.log("update audiences");
    object.touch_id = new_data.touch_id
    object.activity_type_id = "42b48534-ec8b-48f7-958e-5629c64b7b3e"
    object.related_id = new_data.id;
    object.title = "Audience Updated"
  }
  //console.log(new_data);
  if(table_name =="contacts" || table_name == "senders" || table_name == "marketing"){
    
    object.touch_id = new_data.touch_id;
    if(table_name == "senders"){
      object.touch_id = new_data.touch_id
      object.activity_type_id = "3b01f454-c015-4bb7-8f1f-694e7f30ab3a"
      object.related_id = new_data.touch_id;
      object.title = "Sender Created"
    }
    if(table_name == "contacts"){
      object.touch_id = new_data.touch_id
      object.activity_type_id = "8b2ebe3f-6678-4314-a922-4ffc53c647a6"
      object.related_id = new_data.touch_id;
      object.title = "Contact Created"

    }
    
    if(table_name == "marketing"){
      object.touch_id = new_data.touch_id
      object.activity_type_id = "580a50be-6809-4914-ba96-eb0c99703496"
      object.related_id = new_data.touch_id;
      object.title = "Marketing Created"
    }

    console.log("touch aktivite kaydı.");
  }
  if(table_name == "touches"){
    object.touch_id = new_data.id
    object.activity_type_id = "a475752e-e19a-4de3-b359-79279d36a751"
    object.related_id = new_data.team_id;
    object.title = "Touch Created"
    
    console.log("team aktivite kaydı");
  }
  console.log(object)
  const return_Response = await insertACtivities(object).then(e => {return e;});

  console.log(return_Response);
  
  return res.json({
          error_message: "teset"
        });
};
