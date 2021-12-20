const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;

  const card = await stripe.customers
    .retrieveSource(object.customer_id, object.card_id)
    .then(
      async result => {
        return res.json({
          id: result.id,
          brand: result.brand,
          country: result.country,
          customer: result.customer,
          exp_month: result.exp_month,
          exp_year: result.exp_year
        });
      },
      err => {
        return res.json({
          error_message: err.message
        });
      }
    );
};
