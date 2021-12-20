var AWS = require("aws-sdk");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

var sqs = new AWS.SQS({});

async function getDataSyncType(datasync_type_id) {
  const DataSyncType = `
    query DataSyncType($datasync_type_id: uuid = "") {
  data_sync_types(where: {id: {_eq: $datasync_type_id}}) {
    code
  }
}

`;
  const graphqlReq = {
    query: DataSyncType,
    variables: { datasync_type_id: datasync_type_id }
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
      console.log(data);
      if (data.errors) {
        return data;
      }
      return data.data.data_sync_types[0].code;
    });

  return template;

  err => {
    return err.message;
  };
}

async function setExportsType(team_id,datasync_id) {
  const setDataSyncStatus = `
    mutation updateExportDataSync($status_id: uuid = "", $team_id: uuid = "", $id: uuid = "") {
  update_data_sync_by_pk(pk_columns: {id: $id, team_id: $team_id}, _set: {status_id: $status_id}) {
    id
  }
}
`;
  const graphqlReq = {
    query: setDataSyncStatus,
    variables: { id: datasync_id , team_id: team_id, status_id : "5ddaf89b-a906-48a3-a8c4-c6426fc5ea4c"}
  };

  const set_respnose = await fetch(process.env.MARKETING_CHECK_BILPP_HASURA_URL, {
    method: "POST",
    body: JSON.stringify(graphqlReq),
    headers: {
      "content-type": process.env.CONTENT_TYPE,
      "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET_KEY
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.errors) {
        return data;
      }
      return data;
    });

  return set_respnose;

  err => {
    return err.message;
  };
}

async function getMedia(media_id) {
  const getMedia = `
   query getMedia($media_id: uuid = "") {
  media(where: {id: {_eq: $media_id}}) {
    path
    team_id
    touch_id
    name
  }
}


`;
  const graphqlReq = {
    query: getMedia,
    variables: { media_id: media_id }
  };

  const media_items = await fetch(
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
      return data.data.media[0];
    });

  return media_items;
}

exports.index = async function(req, res) {
  const random_id = uuidv4();

  const object = req.body.event.data.new;
  const type = await getDataSyncType(object.data_sync_type_id).then(e => {
    return e;
  });

  console.log(type);
  object.type = type
  if (type == "CONTACT_EXPORT") {
    const response_set_exports_status = await setExportsType(object.team_id, object.id).then(e => {
      return e;
    });
    console.log("export");
    console.log(object);
    console.log(response_set_exports_status);
    var params = {
      MessageDeduplicationId: random_id,
      MessageGroupId: random_id,
      MessageBody: JSON.stringify(object),
      QueueUrl: process.env.DATASYNC_HUB_URL
    };

    sqs.sendMessage(params, async function(err, data) {
      console.log(data);
      if (err) {
        return res.json({
          ErrorMessage: err.message
        });
      } else {
        return res.json({
          message_id: data.MessageId,
          sequence_number: data.SequenceNumber,
          ErrorMessage: "null"
        });
      }
    });
  }

  if (type == "CONTACT_IMPORT") {
    console.log("import");
    // if (!object.media_id) {
    //   console.log("media id yok");
    //   return res.json({
    //     response: "media id girilmedi."
    //   });
    // }
    const media = await getMedia(object.media_id).then(e => {
      return e;
    });

    object.media = media;
    console.log(object)
    var params = {
      MessageDeduplicationId: random_id,
      MessageGroupId: random_id,
      MessageBody: JSON.stringify(object),
      QueueUrl: process.env.DATASYNC_HUB_URL
    };

    sqs.sendMessage(params, async function(err, data) {
      if (err) {
        console.log(err);

        return res.json({
          ErrorMessage: err.message
        });
      } else {
        return res.json({
          message_id: data.MessageId,
          sequence_number: data.SequenceNumber,
          ErrorMessage: "null"
        });
      }
    });
  }
};
