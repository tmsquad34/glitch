const fetch = require("node-fetch");

async function addDefaultDataMines(object) {
  const addDefaultMines = `mutation insertFormMine($object: data_mines_insert_input = {}) {
  insert_data_mines_one(object: $object) {
    id
  }
}
`;
  const graphqlReq = {
    query: addDefaultMines,
    variables: {object: object}
  };

  const data_mine_response = await fetch(
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
      console.log(data)
      return data.data
    });

  return data_mine_response;
}

exports.index = async function(req, res) {
  const team_id = req.body.event.data.new.team_id;
  const touch_id = req.body.event.data.new.touch_id;
  const form_id = req.body.event.data.new.id;
  const description = req.body.event.data.new.description;
  const name = req.body.event.data.new.name;

//   var default_mines = [
//     {
//         settings: {},
//         is_deletable: false,
//         team_id: team_id,
//         touch_id: touch_id,
//         data_mine_type_id: 'd42776e5-439c-4c07-97b8-3358010ad932',
//         name: `Bilpp Form - ${name}`,
//         description: `${description}` || "",
//         event: `bilpp::form::submit::${form_id}`,
//         parameters: [],
//         touch_source_type_id: '0081e96d-bce2-435a-8f06-be7c50e38be5'
//     }
//   ]

  
//   default_mines.forEach(async element => {
//     element.team_id = team_id;
//     element.touch_id = touch_id;
//     const addDataMines = await addDefaultDataMines( 
//               element
//             ).then(e => {
//               return e;
//             });
//     console.log(addDataMines);
//   });

  
  return res.status(200).json({
    response: "messagetext"
  });
};
