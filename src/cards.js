const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;

  await stripe.customers
    .listSources(object.customer_id, {
      object: object.object,
      limit: object.limit
    })
    .then(
      async result => {
        return res.json({
          data: result.data
        });
      },
      err => {
        return res.json({
          error_message: err.message
        });
      }
    );
};
