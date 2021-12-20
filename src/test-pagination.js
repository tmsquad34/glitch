const fetch = require("node-fetch");

async function getNullContact(team_id, touch_id) {
  const listContactsQuery = `query MyQuery($team_id: uuid = "", $touch_id: uuid = "") {
  contacts(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    communication_infos {
      content
      id
    }
    first_name
    last_name
    id
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
    }
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
      return data.data.contacts;
    });

  return contact_count;
}

async function duplicateContact(team_id, touch_id) {
  const listContactsQuery = `query MyQuery($team_id: uuid = "", $touch_id: uuid = "") {
  stats_duplicate_contact(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}, limit: 30, offset: 0) {
    content
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381"
    }
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
      return data.data.stats_duplicate_contact;
    });

  return contact_count;
}

async function getContactcount(query) {
  const listContactsQuery = `query MyQuery($team_id: uuid = "", $touch_id: uuid = "") {
  communication_infos(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}, distinct_on: content) {
    id
    content
    contact {
      id
      activities {
        id
      }
    }
  }
}

`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381"
    }
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
      return data.data.communication_infos;
    });

  return contact_count;
}

async function getContacts(team_id, touch_id, content) {
  const listContactsQuery = `
  query MyQuery($content: String = "", $team_id: uuid = "", $touch_id: uuid = "") {
  contacts(where: {communication_infos: {content: {_eq: $content}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}}) {
    first_name
    id
    tags{
      id
    }
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      content: content
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
      return data.data.contacts;
    });

  return contact_list;
}

async function updateActivities(team_id, touch_id, source_id, contact_id) {
  const listContactsQuery = `
  mutation MyMutation($contact_id: uuid = "", $team_id: uuid = "", $touch_id: uuid = "", $source_id: uuid = "") {
  update_activities(where: {source: {_eq: "contacts"}, source_id: {_eq: $contact_id}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}, _set: {source_id: $source_id}) {
    affected_rows
  }
}

`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      source_id: source_id,
      contact_id: contact_id
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
      return data;
    });

  return contact_list;
}

async function updateTags(team_id, touch_id, contact_id, tag_id) {
  const listContactsQuery = `
mutation MyMutation($team_id: uuid = "", $touch_id: uuid = "", $contact_id: uuid = "", $tag_id: Int = "") {
  update_contact_tags(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}, id: {_eq: $tag_id}}, _set: {contact_id: $contact_id}) {
    affected_rows
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      tag_id: tag_id,
      contact_id: contact_id
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
      return data;
    });

  return contact_list;
}

async function deleteAloneContact(team_id, touch_id, contact_id) {
  const listContactsQuery = `
mutation MyMutation($contact_id: uuid = "", $team_id: uuid = "", $touch_id: uuid = "") {
  delete_contacts(where: {id: {_eq: $contact_id}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    affected_rows
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      contact_id: contact_id
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
      return data;
    });

  return contact_list;
}

async function deleteContacts(team_id, touch_id, contact_id) {
  const listContactsQuery = `
mutation MyMutation($contact_id: uuid = "", $team_id: uuid = "", $touch_id: uuid = "") {
  delete_contacts(where: {id: {_eq: $contact_id}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    affected_rows
  }
  delete_communication_infos(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}, source_id: {_eq: $contact_id}}) {
    affected_rows
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      contact_id: contact_id
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
      console.log(data);
      return data;
    });

  return contact_list;
}

async function deleteComInfo(team_id, touch_id, content) {
  const listContactsQuery = `
mutation MyMutation($team_id: uuid = "", $touch_id: uuid = "", $content: String = "") {
  delete_communication_infos(where: {team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}, content: {_eq: $content}}) {
    affected_rows
  }
}

`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      content: content
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
      console.log(data);
      return data;
    });

  return contact_list;
}

async function getcominfo(team_id, touch_id, content) {
  const listContactsQuery = `
query MyQuery($content: String = "", $team_id: uuid = "", $touch_id: uuid = "") {
  communication_infos(where: {content: {_eq: $content}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    contact {
      id
    }
    id
  }
}


`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      content: content
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
      return data.data.communication_infos;
    });

  return contact_list;
}

async function deletecominfo(team_id, touch_id, com_info_id) {
  const listContactsQuery = `
mutation MyMutation($com_info_id: uuid = "", $team_id: uuid = "", $touch_id: uuid = "") {
  delete_communication_infos(where: {id: {_eq: $com_info_id}, team_id: {_eq: $team_id}, touch_id: {_eq: $touch_id}}) {
    affected_rows
  }
}
`;
  const graphqlReq = {
    query: listContactsQuery,
    variables: {
      team_id: "7197bf49-25eb-4e50-9870-d1bfaae4ddc3",
      touch_id: "f861b6d2-e3ea-4290-9c24-3a6d613c9381",
      com_info_id: com_info_id
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
      return data;
    });

  return contact_list;
}

exports.index = async function(req, res) {
  //BIRDEN COK MAILI GOSTEREN VIEW DAN EMAILLER ALINDI. 1,2 TEMSILI DEGERLER TEAM VE TOUCH IDLERI STATIK FONKSIYON ICINDE
  const duplicateContactList = await duplicateContact(1, 2).then(e => {
    return e;
  });
  //ALINAN EMAILLER DONNGUYE SOKULDU
  for (var i in duplicateContactList) {
    var current_tags = [];
    var totalContact = [];

    console.log("DUPLICATE EMAIL :", duplicateContactList[i]);

    //EMAILE BAGLI CONTACTLAR CEKILDI

    const oneEmailContacts = await getContacts(
      1,
      2,
      duplicateContactList[i].content
    ).then(e => {
      return e;
    });
    console.log(oneEmailContacts);

    //NOLUR NOLMAZ DIYE CONTACT GELIRSE ISLEM YAPILACAK

    if (oneEmailContacts.length != 0) {
      var current_contact = "";

      //1 EMAILIN TUM CONTACTLARI DONGUYE SOKULDU. BURADAKI ISLEM ISIM VARSA ONU CURRENT_CONTACT YAPIYOR

      for (var m in oneEmailContacts) {
        if (oneEmailContacts[m].first_name != null) {
          current_contact = oneEmailContacts[m].id;
        } else {
        }
      }
      if (current_contact == "") {
        current_contact = oneEmailContacts[0].id;
      }

      console.log("KALICI OLACAK CONTACT:", current_contact);

      //TUM CONTACTLARIN TAGLARI LISTEYE EKLENDI

      for (var j in oneEmailContacts) {
        if (oneEmailContacts[j].tags != []) {
          current_tags.push(oneEmailContacts[j].tags);
        }
      }

      //CURRENT CONTACT HARICINDE DIGER CONTACTLAR LISTEYE EKLENDI

      for (var k in oneEmailContacts) {
        if (oneEmailContacts[k].id != current_contact) {
          totalContact.push(oneEmailContacts[k].id);
        }
      }
      
      console.log("*************", totalContact);
      
      if(totalContact.length == 0){
        const deleteiscominfo = await getcominfo(
          1,
          2,
          duplicateContactList[i].content,
        ).then(e => {
          return e;
        });
        
        for(var q in deleteiscominfo){
          if(deleteiscominfo[q].contact == null){
              console.log("current contact id si haric tum com infoları sil :", deleteiscominfo[q]);
              const deletecom = await deletecominfo(
              1,
              2,
              deleteiscominfo[q].id,
            ).then(e => {
              return e;
            });
            console.log(deletecom);
          }
        }
          
        
      }
      
      console.log("******++++++++++++++", oneEmailContacts);

      //ACTIVITELER CURRENT_CONTACT A EKLENIYOR

      for (var a in totalContact) {
        const duplicateContactList = await updateActivities(
          1,
          2,
          current_contact,
          totalContact[a]
        ).then(e => {
          return e;
        });
        console.log(duplicateContactList);
      }

      //TAGLAR CURRENT_CONTACT A EKLENIYOR

      for (var s in current_tags) {
        if (current_tags[s][0]) {
          const addTagsCurrentContact = await updateTags(
            1,
            2,
            current_contact,
            current_tags[s][[0]].id
          ).then(e => {
            return e;
          });
          console.log(addTagsCurrentContact);
        }
      }

      for (var u in totalContact) {
        const delete_contacts = await deleteContacts(
          1,
          2,
          totalContact[u]
        ).then(e => {
          return e;
        });

        console.log(delete_contacts);
      }
    } else {
      console.log("CONTACT YOK");
      const delete_contacts = await deleteComInfo(
        1,
        2,
        duplicateContactList[i].content
      ).then(e => {
        return e;
      });
      console.log(delete_contacts);
    }

    //ISLEM TAMAMLANDI
  }

  // success
  
  console.log("DUPLICATE VERI YOK");
  
  const nullContact = await getNullContact(
        1,
        2,
      ).then(e => {
        return e;
      });
  
  console.log(nullContact);
  for(var p in nullContact){
    if(nullContact[p].communication_infos.length == 0){
      console.log("COM OLMAYAN ID", nullContact[p].id);
      const delete_alone = await deleteAloneContact(
        1,
        2,
        nullContact[p].id
      ).then(e => {
        return e;
      });
      
      console.log(delete_alone);
    }
  }
  
  
  return res.json({
    content: "<value>"
  });
};
