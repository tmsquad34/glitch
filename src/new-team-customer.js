const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);
const fetch = require("node-fetch");

async function TeamAddStripeId(id, stripe_id) {
  const update_query = `
    mutation updateTeam($id: uuid = "", $stripe_id: String = "") {
      update_teams_by_pk(pk_columns: {id: $id}, _set: {stripe_id: $stripe_id}) {
        id
      }
}
`;
  const graphqlReq = {
    query: update_query,
    variables: { id: id, stripe_id: stripe_id }
  };

  const response_query = await fetch(
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
      if (data.errors) {
        return data;
      }
      return data.data;
    });

  return response_query;

  err => {
    return err.message;
  };
}

exports.index = async function(req, res) {
  const id = req.body.event.data.new.id;

  const customer = await stripe.customers.create().then(
    async result => {
      console.log(result);
      const to = await TeamAddStripeId(id, result.id).then(e => {});
    },
    err => {
      return res.json({
        error_message: err.message
      });
    }
  );
  return res.json({
    response: "basarili"
  });
};
