const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_KEY);

exports.index = async function(req, res) {
  const { object } = req.body.input;
  const deleted = await stripe.customers
    .deleteSource(object.customer_id, object.card_id)
    .then(
      async result => {
        return res.json({
          status: "OK"
        });
      },
      err => {
        return res.json({
          error_message: err.message
        });
      }
    );
};
